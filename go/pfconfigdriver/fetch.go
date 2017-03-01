package pfconfigdriver

import (
	"bytes"
	"context"
	"encoding/binary"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/fingerbank/processor/log"
	"github.com/fingerbank/processor/sharedutils"
	"io"
	"net"
	"os"
	"reflect"
	"time"
	//"github.com/davecgh/go-spew/spew"
)

const pfconfigSocketPath string = "/usr/local/pf/var/run/pfconfig.sock"

const pfconfigTestSocketPath string = "/usr/local/pf/var/run/pfconfig-test.sock"

var pfconfigSocketPathCache string

var SocketTimeout time.Duration = 60 * time.Second

// Get the pfconfig socket path depending on whether or not we're in testing
// Since the environment is not bound to change at runtime, the socket path is computed once and cached in pfconfigSocketPathCache
// If the socket should be re-computed, empty out pfconfigSocketPathCache and run this function
func getPfconfigSocketPath() string {
	if pfconfigSocketPathCache != "" {
		// Do nothing, cache is populated, will be returned below
	} else if sharedutils.EnvOrDefault("PFCONFIG_TESTING", "") == "" {
		pfconfigSocketPathCache = pfconfigSocketPath
	} else {
		fmt.Println("Test flag is on. Using pfconfig test socket path.")
		pfconfigSocketPathCache = pfconfigTestSocketPath
	}
	return pfconfigSocketPathCache
}

// Struct that encapsulates the necessary information to do a query to pfconfig
type Query struct {
	encoding string
	method   string
	ns       string
}

// Get the payload to send to pfconfig based on the Query attributes
// Also sets the payload attribute at the same time
func (q *Query) GetPayload() string {
	return fmt.Sprintf(`{"method":"%s", "key":"%s","encoding":"%s"}`+"\n", q.method, q.ns, q.encoding)
}

// Get a string identifier of the query
func (q *Query) GetIdentifier() string {
	return fmt.Sprintf("%s|%s", q.method, q.ns)
}

// Connect to the pfconfig socket
// If it fails to connect, it will try it every second up to the time defined in SocketTimeout
// After SocketTimeout is reached, this will panic
func connectSocket(ctx context.Context) net.Conn {

	timeoutChan := time.After(SocketTimeout)

	var c net.Conn
	err := errors.New("Not yet connected")
	for err != nil {
		select {
		case <-timeoutChan:
			panic("Can't connect to pfconfig socket")
		default:
			// We try to connect to the pfconfig socket
			// If we fail, we will wait a second before leaving this scope
			// Otherwise, we continue and the for loop will detect the connection is valid since err will be nil
			c, err = net.Dial("unix", getPfconfigSocketPath())
			if err != nil {
				log.LoggerWContext(ctx).Error("Cannot connect to pfconfig socket...")
				time.Sleep(1 * time.Second)
			}
		}
	}

	return c
}

// Fetch data from the pfconfig socket for a string payload
// Returns the bytes received from the socket
func FetchSocket(ctx context.Context, payload string) []byte {
	c := connectSocket(ctx)

	// Send our query in the socket
	fmt.Fprintf(c, payload)

	var buf bytes.Buffer
	buf.ReadFrom(c)

	// First 4 bytes are a little-endian representing the length of the payload
	var length uint32
	binary.Read(&buf, binary.LittleEndian, &length)

	// Read the response given the length provided by pfconfig
	response := make([]byte, length)
	buf.Read(response)

	// Validate the response has the length that was declared by pfconfig
	if uint32(len(response)) != length {
		panic(fmt.Sprintf("Got invalid length response from pfconfig %d expected, received %d", length, len(response)))
	}
	c.Close()
	return response
}

// Lookup the pfconfig metadata for a specific field
// If there is a non-zero value in the field, it will be taken
// Otherwise it will take the value in the val tag of the field
func metadataFromField(ctx context.Context, param interface{}, fieldName string) string {
	var ov reflect.Value

	ov = reflect.ValueOf(param)
	for ov.Kind() == reflect.Ptr || ov.Kind() == reflect.Interface {
		ov = ov.Elem()
	}

	// We check if the field was set to a value as this will overide the value in the tag
	// At the same time, we check if the field exists and early exit with the empty string if it doesn't
	field := reflect.Value(ov.FieldByName(fieldName))
	if !field.IsValid() {
		return ""
	}

	userVal := field.Interface()
	if userVal != "" {
		return userVal.(string)
	}

	ot := ov.Type()
	if field, ok := ot.FieldByName(fieldName); ok {
		// The val tag defines the «default» value the metadata field should have
		// If the val tag has a value of "-", then a user value was expected and this will panic
		val := field.Tag.Get("val")
		if val != "-" {
			return val
		} else {
			panic(fmt.Sprintf("No default value defined for %s on %s. User specified value is required.", fieldName, ot.String()))
		}
	} else {
		panic(fmt.Sprintf("Missing %s for %s", fieldName, ot.String()))
	}
}

// Decode the struct from bytes given an encoding
// For now only JSON is supported
func decodeInterface(ctx context.Context, encoding string, b []byte, o interface{}) {
	switch encoding {
	case "json":
		decodeJsonInterface(ctx, b, o)
	default:
		panic(fmt.Sprintf("Unknown encoding %s", encoding))
	}
}

// Decode an array of bytes representing a json string into interface
// Panics if there is an error decoding the JSON data
func decodeJsonInterface(ctx context.Context, b []byte, o interface{}) {
	decoder := json.NewDecoder(bytes.NewReader(b))
	for {
		if err := decoder.Decode(&o); err == io.EOF {
			break
		} else if err != nil {
			panic(err)
		}
	}
}

// Create a pfconfig query given a PfconfigObject
// Will extract the query information from the struct and will create the payload accordingly
// The struct should declare the following fields to be compatible
//		PfconfigNS - the pfconfig namespace to use (ex: resource::fqdn)
//		PfconfigMethod - the method to use while calling pfconfig (hash_element is a special case, see below)
//		PfconfigHashNS - the hash element key when using the hash_element method, this attribute has no effect when using any other method
func createQuery(ctx context.Context, o PfconfigObject) Query {
	query := Query{}
	query.ns = metadataFromField(ctx, o, "PfconfigNS")
	query.method = metadataFromField(ctx, o, "PfconfigMethod")
	if query.method == "hash_element" {
		query.ns = query.ns + ";" + metadataFromField(ctx, o, "PfconfigHashNS")
	}
	query.encoding = "json"
	return query
}

// Checks wheter the LoadedAt field of the PfconfigObject (set by FetchDecodeSocket) is before or after the timestamp of the namespace control file.
// If the LoadedAt field was set before the namespace control file, then the resource isn't valid anymore
// If the namespace control file doesn't exist, the resource is considered invalid
func IsValid(ctx context.Context, o PfconfigObject) bool {
	ns := metadataFromField(ctx, o, "PfconfigNS")
	controlFile := "/usr/local/pf/var/control/" + ns + "-control"

	stat, err := os.Stat(controlFile)

	if err != nil {
		log.LoggerWContext(ctx).Error(fmt.Sprintf("Cannot stat %s. Will consider resource as invalid"))
		return false
	} else {
		controlTime := stat.ModTime()
		if o.GetLoadedAt().Before(controlTime) {
			log.LoggerWContext(ctx).Debug(fmt.Sprintf("Resource is not valid anymore. Was loaded at %s", o.GetLoadedAt()))
			return false
		} else {
			return true
		}
	}
}

// Fetch and decode from the socket but only if the PfconfigObject is not valid anymore
func FetchDecodeSocketCache(ctx context.Context, o PfconfigObject) (bool, error) {
	query := createQuery(ctx, o)
	ctx = log.AddToLogContext(ctx, "PfconfigObject", query.GetIdentifier())

	// If the resource is still valid and is already loaded
	if IsValid(ctx, o) {
		return false, nil
	}

	err := FetchDecodeSocket(ctx, o)
	return true, err
}

// Fetch and decode a namespace from pfconfig given a pfconfig compatible struct
// This will fetch the json representation from pfconfig and decode it into o
// o must be a pointer to the struct as this should be used by reference
func FetchDecodeSocket(ctx context.Context, o PfconfigObject) error {
	query := createQuery(ctx, o)

	jsonResponse := FetchSocket(ctx, query.GetPayload())
	if query.method == "keys" {
		if cs, ok := o.(*PfconfigKeys); ok {
			decodeInterface(ctx, query.encoding, jsonResponse, &cs.Keys)
		} else {
			panic("Wrong struct type for keys. Required PfconfigKeys")
		}
	} else if metadataFromField(ctx, o, "PfconfigArray") == "yes" {
		decodeInterface(ctx, query.encoding, jsonResponse, &o)
	} else {
		receiver := &PfconfigElementResponse{}
		decodeInterface(ctx, query.encoding, jsonResponse, receiver)
		if receiver.Element != nil {
			b, _ := receiver.Element.MarshalJSON()
			decodeInterface(ctx, query.encoding, b, &o)
		} else {
			return errors.New(fmt.Sprintf("Element in response was invalid. Response was: %s", jsonResponse))
		}
	}

	o.SetLoadedAt(time.Now())

	return nil
}
