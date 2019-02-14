import i18n from '@/utils/locale'
import pfFieldTypeValue from '@/components/pfFieldTypeValue'
import pfFieldAttributeOperatorValue from '@/components/pfFieldAttributeOperatorValue'
import pfFieldRule from '@/components/pfFieldRule'
import pfFormChosen from '@/components/pfFormChosen'
import pfFormFields from '@/components/pfFormFields'
import pfFormInput from '@/components/pfFormInput'
import pfFormPassword from '@/components/pfFormPassword'
import pfFormRangeToggle from '@/components/pfFormRangeToggle'
import pfFormSelect from '@/components/pfFormSelect'
import pfFormTextarea from '@/components/pfFormTextarea'
import {
  pfConfigurationActions,
  pfConfigurationConditions,
  pfConfigurationListColumns,
  pfConfigurationListFields,
  pfConfigurationValidatorsFromMeta
} from '@/globals/configuration/pfConfiguration'
import {
  alphaNum,
  and,
  not,
  conditional,
  hasSources,
  sourceExists,
  limitSiblingFields
} from '@/globals/pfValidators'

const {
  maxLength,
  required
} = require('vuelidate/lib/validators')

export const pfConfigurationAuthenticationSourcesListColumns = [
  { ...pfConfigurationListColumns.id, ...{ label: i18n.t('Name') } }, // re-label
  pfConfigurationListColumns.description,
  pfConfigurationListColumns.class,
  pfConfigurationListColumns.type,
  pfConfigurationListColumns.buttons
]

export const pfConfigurationAuthenticationSourcesListFields = [
  { ...pfConfigurationListFields.id, ...{ text: i18n.t('Name') } }, // re-text
  pfConfigurationListFields.description,
  pfConfigurationListFields.class,
  pfConfigurationListFields.type
]

export const pfConfigurationAuthenticationSourceListConfig = (context = {}) => {
  return {
    columns: pfConfigurationAuthenticationSourcesListColumns,
    fields: pfConfigurationAuthenticationSourcesListFields,
    rowClickRoute (item, index) {
      return { name: 'source', params: { id: item.id } }
    },
    searchPlaceholder: i18n.t('Search by name or description'),
    searchableOptions: {
      searchApiEndpoint: 'config/sources',
      defaultSortKeys: ['id'],
      defaultSearchCondition: {
        op: 'and',
        values: [{
          op: 'or',
          values: [
            { field: 'id', op: 'contains', value: null },
            { field: 'description', op: 'contains', value: null },
            { field: 'class', op: 'contains', value: null },
            { field: 'type', op: 'contains', value: null }
          ]
        }]
      },
      defaultRoute: { name: 'sources' },
      resultsFilter: (results) => results.filter(item => item.id !== 'local') // ignore 'local' source
    },
    searchableQuickCondition: (quickCondition) => {
      return {
        op: 'and',
        values: [{
          op: 'or',
          values: [
            { field: 'id', op: 'contains', value: quickCondition },
            { field: 'description', op: 'contains', value: quickCondition },
            { field: 'class', op: 'contains', value: quickCondition },
            { field: 'type', op: 'contains', value: quickCondition }
          ]
        }]
      }
    }
  }
}

export const pfConfigurationAuthenticationSourceFields = {
  id: ({ isNew = false, isClone = false, options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Name'),
      fields: [
        {
          key: 'id',
          component: pfFormInput,
          attrs: {
            disabled: (!isNew && !isClone),
            placeholder: placeholders.id
          },
          validators: {
            ...pfConfigurationValidatorsFromMeta(meta.id, 'Name'),
            ...{ // TODO: remove once meta is available for `id`
              [i18n.t('Name required.')]: required,
              [i18n.t('Source exists.')]: not(and(required, conditional(isNew || isClone), hasSources, sourceExists))
            }
          }
        }
      ]
    }
  },
  access_scope: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Scope'),
      text: i18n.t('The permissions the application requests.'),
      fields: [
        {
          key: 'scope',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.id
          },
          validators: pfConfigurationValidatorsFromMeta(meta.scope, 'Scope')
        }
      ]
    }
  },
  access_token_param: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Access Token Parameter'),
      fields: [
        {
          key: 'access_token_param',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.access_token_param
          },
          validators: pfConfigurationValidatorsFromMeta(meta.access_token_param, 'Parameter')
        }
      ]
    }
  },
  access_token_path: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: null, // multiple occurances w/ different strings, nullify for overload
      fields: [
        {
          key: 'access_token_path',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.access_token_path
          },
          validators: pfConfigurationValidatorsFromMeta(meta.access_token_path)
        }
      ]
    }
  },
  account_sid: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Account SID'),
      text: i18n.t('Twilio Account SID'),
      fields: [
        {
          key: 'account_sid',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.account_sid
          },
          validators: pfConfigurationValidatorsFromMeta(meta.account_sid, 'SID')
        }
      ]
    }
  },
  activation_domain: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Host in activation link'),
      text: i18n.t('Set this value if you want to change the hostname in the validation link. Changing this requires to restart haproxy to be fully effective.'),
      fields: [
        {
          key: 'activation_domain',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.activation_domain
          },
          validators: pfConfigurationValidatorsFromMeta(meta.activation_domain, 'Host')
        }
      ]
    }
  },
  administration_rules: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: 'Administration Rules',
      fields: [
        {
          key: 'administration_rules',
          component: pfFormFields,
          attrs: {
            buttonLabel: 'Add Rule - New ( )',
            sortable: true,
            field: {
              component: pfFieldRule,
              attrs: {
                matchLabel: i18n.t('Select rule match'),
                actions: {
                  component: pfFieldTypeValue,
                  attrs: {
                    typeLabel: i18n.t('Select action type'),
                    valueLabel: i18n.t('Select action value'),
                    fields: [
                      pfConfigurationActions.set_access_level,
                      pfConfigurationActions.mark_as_sponsor,
                      pfConfigurationActions.set_tenant_id
                    ]
                  },
                  invalidFeedback: [
                    { [i18n.t('Action(s) contain one or more errors.')]: true }
                  ]
                },
                conditions: {
                  component: pfFieldAttributeOperatorValue,
                  attrs: {
                    attributeLabel: i18n.t('Select attribute'),
                    operatorLabel: i18n.t('Select operator'),
                    valueLabel: i18n.t('Select value'),
                    fields: [
                      pfConfigurationConditions.ssid,
                      pfConfigurationConditions.current_time,
                      pfConfigurationConditions.current_time_period,
                      pfConfigurationConditions.connection_type,
                      pfConfigurationConditions.computer_name,
                      pfConfigurationConditions.mac,
                      pfConfigurationConditions.realm,
                      pfConfigurationConditions.cn,
                      pfConfigurationConditions.department,
                      pfConfigurationConditions.description,
                      pfConfigurationConditions.displayName,
                      pfConfigurationConditions.distinguishedName,
                      pfConfigurationConditions.eduPersonPrimaryAffiliation,
                      pfConfigurationConditions.givenName,
                      pfConfigurationConditions.groupMembership,
                      pfConfigurationConditions.mail,
                      pfConfigurationConditions.memberOf,
                      pfConfigurationConditions.nested_group,
                      pfConfigurationConditions.postOfficeBox,
                      pfConfigurationConditions.sAMAccountName,
                      pfConfigurationConditions.sAMAccountType,
                      pfConfigurationConditions.sn,
                      pfConfigurationConditions.uid,
                      pfConfigurationConditions.userAccountControl
                    ]
                  },
                  invalidFeedback: [
                    { [i18n.t('Condition(s) contain one or more errors.')]: true }
                  ]
                }
              },
              validators: {
                id: {
                  [i18n.t('Name required.')]: required,
                  [i18n.t('Alphanumeric characters only.')]: alphaNum,
                  [i18n.t('Maximum 255 characters.')]: maxLength(255),
                  [i18n.t('Duplicate name.')]: limitSiblingFields('id', 0)
                },
                description: {
                  [i18n.t('Maximum 255 characters.')]: maxLength(255)
                },
                match: {
                  [i18n.t('Match required.')]: required
                }
              }
            },
            invalidFeedback: [
              { [i18n.t('Rule(s) contain one or more errors.')]: true }
            ]
          }
        }
      ]
    }
  },
  allow_localdomain: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Allow Local Domain'),
      text: i18n.t('Accept self-registration with email address from the local domain'),
      fields: [
        {
          key: 'allow_localdomain',
          component: pfFormRangeToggle,
          attrs: {
            values: { checked: 'yes', unchecked: 'no' }
          }
        }
      ]
    }
  },
  api_key: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('API Key'),
      text: i18n.t('Kickbox.io API key.'),
      fields: [
        {
          key: 'api_key',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.api_key
          },
          validators: pfConfigurationValidatorsFromMeta(meta.api_key, 'Key')
        }
      ]
    }
  },
  api_login_id: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('API login ID'),
      fields: [
        {
          key: 'api_login_id',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.api_login_id
          },
          validators: pfConfigurationValidatorsFromMeta(meta.api_login_id, 'ID')
        }
      ]
    }
  },
  api_username: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('API username (basic auth)'),
      fields: [
        {
          key: 'username',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.username
          },
          validators: pfConfigurationValidatorsFromMeta(meta.username, 'Username')
        }
      ]
    }
  },
  api_password: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('API password (basic auth)'),
      fields: [
        {
          key: 'password',
          component: pfFormPassword,
          attrs: {
            placeholder: placeholders.password
          },
          validators: pfConfigurationValidatorsFromMeta(meta.password, 'Password')
        }
      ]
    }
  },
  auth_listening_port: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Authentication listening port'),
      text: i18n.t('PacketFence Eduroam RADIUS virtual server authentication listening port'),
      fields: [
        {
          key: 'auth_listening_port',
          component: pfFormInput,
          attrs: {
            type: 'number',
            placeholder: placeholders.auth_listening_port
          },
          validators: pfConfigurationValidatorsFromMeta(meta.auth_listening_port, 'Port')
        }
      ]
    }
  },
  auth_token: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Auth Token'),
      text: i18n.t('Twilio Auth Token'),
      fields: [
        {
          key: 'auth_token',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.auth_token
          },
          validators: pfConfigurationValidatorsFromMeta(meta.auth_token, 'Token')
        }
      ]
    }
  },
  authenticate_realm: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Realm to use to authenticate'),
      fields: [
        {
          key: 'authenticate_realm',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.authenticate_realm
          },
          validators: pfConfigurationValidatorsFromMeta(meta.authenticate_realm, 'Realm')
        }
      ]
    }
  },
  authentication_rules: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: 'Authentication Rules',
      fields: [
        {
          key: 'authentication_rules',
          component: pfFormFields,
          attrs: {
            buttonLabel: 'Add Rule - New ( )',
            sortable: true,
            field: {
              component: pfFieldRule,
              attrs: {
                matchLabel: i18n.t('Select rule match'),
                actions: {
                  component: pfFieldTypeValue,
                  attrs: {
                    typeLabel: i18n.t('Select action type'),
                    valueLabel: i18n.t('Select action value'),
                    fields: [
                      pfConfigurationActions.set_role_by_name,
                      pfConfigurationActions.set_access_duration,
                      pfConfigurationActions.set_unreg_date,
                      pfConfigurationActions.set_time_balance,
                      pfConfigurationActions.set_bandwidth_balance
                    ]
                  },
                  invalidFeedback: [
                    { [i18n.t('Action(s) contain one or more errors.')]: true }
                  ]
                },
                conditions: {
                  component: pfFieldAttributeOperatorValue,
                  attrs: {
                    attributeLabel: i18n.t('Select attribute'),
                    operatorLabel: i18n.t('Select operator'),
                    valueLabel: i18n.t('Select value'),
                    fields: [
                      pfConfigurationConditions.ssid,
                      pfConfigurationConditions.current_time,
                      pfConfigurationConditions.current_time_period,
                      pfConfigurationConditions.connection_type,
                      pfConfigurationConditions.computer_name,
                      pfConfigurationConditions.mac,
                      pfConfigurationConditions.realm,
                      pfConfigurationConditions.cn,
                      pfConfigurationConditions.department,
                      pfConfigurationConditions.description,
                      pfConfigurationConditions.displayName,
                      pfConfigurationConditions.distinguishedName,
                      pfConfigurationConditions.eduPersonPrimaryAffiliation,
                      pfConfigurationConditions.givenName,
                      pfConfigurationConditions.groupMembership,
                      pfConfigurationConditions.mail,
                      pfConfigurationConditions.memberOf,
                      pfConfigurationConditions.nested_group,
                      pfConfigurationConditions.postOfficeBox,
                      pfConfigurationConditions.sAMAccountName,
                      pfConfigurationConditions.sAMAccountType,
                      pfConfigurationConditions.sn,
                      pfConfigurationConditions.uid,
                      pfConfigurationConditions.userAccountControl
                    ]
                  },
                  invalidFeedback: [
                    { [i18n.t('Condition(s) contain one or more errors.')]: true }
                  ]
                }
              },
              validators: {
                id: {
                  [i18n.t('Name required.')]: required,
                  [i18n.t('Alphanumeric characters only.')]: alphaNum,
                  [i18n.t('Maximum 255 characters.')]: maxLength(255),
                  [i18n.t('Duplicate name.')]: limitSiblingFields('id', 0)
                },
                description: {
                  [i18n.t('Maximum 255 characters.')]: maxLength(255)
                },
                match: {
                  [i18n.t('Match required.')]: required
                }
              }
            },
            invalidFeedback: [
              { [i18n.t('Rule(s) contain one or more errors.')]: true }
            ]
          }
        }
      ]
    }
  },
  authentication_url: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Authentication URL'),
      text: i18n.t('Note : The URL is always prefixed by a slash (/)'),
      fields: [
        {
          key: 'authentication_url',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.authentication_url
          },
          validators: pfConfigurationValidatorsFromMeta(meta.authentication_url, 'URL')
        }
      ]
    }
  },
  authorization_source_id: ({ options: { allowed = {}, meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Authorization source'),
      text: i18n.t('The source to use for authorization (rule matching)'),
      fields: [
        {
          key: 'authorization_source_id',
          component: pfFormChosen,
          attrs: {
            placeholder: placeholders.authorization_source_id,
            collapseObject: true,
            trackBy: 'value',
            label: 'text',
            options: allowed.authorization_source_id
          },
          validators: pfConfigurationValidatorsFromMeta(meta.authorization_source_id, 'Source')
        }
      ]
    }
  },
  authorize_path: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('API Authorize Path'),
      fields: [
        {
          key: 'authorize_path',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.authorize_path
          },
          validators: pfConfigurationValidatorsFromMeta(meta.authorize_path, 'Path')
        }
      ]
    }
  },
  authorization_url: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Authorization URL'),
      text: i18n.t('Note : The URL is always prefixed by a slash (/)'),
      fields: [
        {
          key: 'authorization_url',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.authorization_url
          },
          validators: pfConfigurationValidatorsFromMeta(meta.authorization_url, 'URL')
        }
      ]
    }
  },
  base_url: ({ options: { allowed = {}, meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Iframe Base URL'),
      fields: [
        {
          key: 'base_url',
          component: pfFormChosen,
          attrs: {
            collapseObject: true,
            placeholder: placeholders.base_url,
            trackBy: 'value',
            label: 'label',
            options: allowed.base_url
          },
          validators: pfConfigurationValidatorsFromMeta(meta.base_url, 'URL')
        }
      ]
    }
  },
  basedn: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Base DN'),
      fields: [
        {
          key: 'basedn',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.basedn
          },
          validators: pfConfigurationValidatorsFromMeta(meta.basedn, 'Base DN')
        }
      ]
    }
  },
  binddn: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Bind DN'),
      text: i18n.t('Leave this field empty if you want to perform an anonymous bind.'),
      fields: [
        {
          key: 'binddn',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.binddn
          },
          validators: pfConfigurationValidatorsFromMeta(meta.bindnd, 'Bind DN')
        }
      ]
    }
  },
  cache_match: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Cache match'),
      text: i18n.t('Will cache results of matching a rule'),
      fields: [
        {
          key: 'cache_match',
          component: pfFormRangeToggle,
          attrs: {
            values: { checked: '1', unchecked: '0' }
          }
        }
      ]
    }
  },
  cert_file: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Cert file'),
      text: i18n.t('The path to the certificate you submitted to Paypal.'),
      fields: [
        {
          key: 'cert_file',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.cert_file
          },
          validators: pfConfigurationValidatorsFromMeta(meta.cert_file, 'File')
        }
      ]
    }
  },
  cert_id: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Cert ID'),
      fields: [
        {
          key: 'cert_id',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.cert_id
          },
          validators: pfConfigurationValidatorsFromMeta(meta.cert_id, 'ID')
        }
      ]
    }
  },
  client_id: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('App ID'),
      fields: [
        {
          key: 'client_id',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.client_id
          },
          validators: pfConfigurationValidatorsFromMeta(meta.client_id, 'ID')
        }
      ]
    }
  },
  client_secret: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('App Secret'),
      fields: [
        {
          key: 'client_secret',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.client_secret
          },
          validators: pfConfigurationValidatorsFromMeta(meta.client_secret, 'Secret')
        }
      ]
    }
  },
  connection_timeout: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Connection timeout'),
      text: i18n.t('LDAP connection Timeout'),
      fields: [
        {
          key: 'connection_timeout',
          component: pfFormInput,
          attrs: {
            type: 'number',
            placeholder: placeholders.connection_timeout
          },
          validators: pfConfigurationValidatorsFromMeta(meta.connection_timeout, 'Timeout')
        }
      ]
    }
  },
  create_local_account: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Create Local Account'),
      text: i18n.t('Create a local account on the PacketFence system based on the username provided.'),
      fields: [
        {
          key: 'create_local_account',
          component: pfFormRangeToggle,
          attrs: {
            values: { checked: 'yes', unchecked: 'no' }
          }
        }
      ]
    }
  },
  currency: ({ options: { allowed = {}, meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Currency'),
      fields: [
        {
          key: 'currency',
          component: pfFormChosen,
          attrs: {
            collapseObject: true,
            placeholder: placeholders.currency,
            trackBy: 'value',
            label: 'label',
            options: allowed.currency
          },
          validators: pfConfigurationValidatorsFromMeta(meta.currency, 'Currency')
        }
      ]
    }
  },
  description: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Description'),
      fields: [
        {
          key: 'description',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.description
          },
          validators: pfConfigurationValidatorsFromMeta(meta.description, 'Description')
        }
      ]
    }
  },
  direct_base_url: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Direct Base url'),
      fields: [
        {
          key: 'direct_base_url',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.direct_base_url
          },
          validators: pfConfigurationValidatorsFromMeta(meta.direct_base_url, 'URL')
        }
      ]
    }
  },
  domains: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Authorized domains'),
      text: i18n.t('Comma separated list of domains that will be resolve with the correct IP addresses.'),
      fields: [
        {
          key: 'domains',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.domain
          },
          validators: pfConfigurationValidatorsFromMeta(meta.domains, 'Domains')
        }
      ]
    }
  },
  email_activation_timeout: ({ options: { allowed = {}, meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Email Activation Timeout'),
      text: null, // multiple occurances w/ different strings, nullify for overload
      fields: [
        {
          key: 'email_activation_timeout.interval',
          component: pfFormInput,
          attrs: {
            type: 'number',
            placeholder: ('email_activation_timeout' in placeholders)
              ? placeholders.email_activation_timeout.interval
              : ''
          },
          validators: ('email_activation_timeout' in meta)
            ? pfConfigurationValidatorsFromMeta(meta.email_activation_timeout.interval, 'Interval')
            : {}
        },
        {
          key: 'email_activation_timeout.unit',
          component: pfFormChosen,
          attrs: {
            collapseObject: true,
            placeholder: ('email_activation_timeout' in placeholders)
              ? placeholders.email_activation_timeout.unit
              : '',
            trackBy: 'value',
            label: 'label',
            options: ('email_activation_timeout' in allowed)
              ? allowed.email_activation_timeout.unit
              : []
          },
          validators: ('email_activation_timeout' in meta)
            ? pfConfigurationValidatorsFromMeta(meta.email_activation_timeout.unit, 'Unit')
            : {}
        }
      ]
    }
  },
  email_address: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Email address'),
      text: i18n.t('The email address associated to your paypal account.'),
      fields: [
        {
          key: 'email_address',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.email_address
          },
          validators: pfConfigurationValidatorsFromMeta(meta.email_address, 'Email')
        }
      ]
    }
  },
  email_attribute: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Email Attribute'),
      text: i18n.t('LDAP attribute name that stores the email address against which the filter will match.'),
      fields: [
        {
          key: 'email_attribute',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.email_attribute
          },
          validators: pfConfigurationValidatorsFromMeta(meta.email_attribute, 'Attribute')
        }
      ]
    }
  },
  email_required: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Email required'),
      fields: [
        {
          key: 'email_required',
          component: pfFormRangeToggle,
          attrs: {
            values: { checked: 'yes', unchecked: 'no' }
          }
        }
      ]
    }
  },
  group_header: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Group header '),
      fields: [
        {
          key: 'group_header',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.group_header
          },
          validators: pfConfigurationValidatorsFromMeta(meta.group_header, 'Header')
        }
      ]
    }
  },
  host: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Host'),
      fields: [
        {
          key: 'host',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.host
          },
          validators: pfConfigurationValidatorsFromMeta(meta.host, 'Host')
        }
      ]
    }
  },
  host_port_encryption: ({ options: { allowed = {}, meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Host'),
      fields: [
        {
          key: 'host',
          component: pfFormInput,
          attrs: {
            class: 'col-sm-4',
            placeholder: placeholders.host
          },
          validators: pfConfigurationValidatorsFromMeta(meta.host, 'Host')
        },
        {
          text: ':',
          class: 'mx-1 font-weight-bold'
        },
        {
          key: 'port',
          component: pfFormInput,
          attrs: {
            class: 'col-sm-1',
            type: 'number',
            placeholder: placeholders.port
          },
          validators: pfConfigurationValidatorsFromMeta(meta.port, 'Port')
        },
        {
          key: 'encryption',
          component: pfFormChosen,
          attrs: {
            collapseObject: true,
            placeholder: placeholders.encryption,
            trackBy: 'value',
            label: 'label',
            options: allowed.encryption
          },
          validators: pfConfigurationValidatorsFromMeta(meta.encryption, 'Encryption')
        }
      ]
    }
  },
  identity_token: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Identity token'),
      fields: [
        {
          key: 'identity_token',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.identity_token
          },
          validators: pfConfigurationValidatorsFromMeta(meta.identity_token, 'Token')
        }
      ]
    }
  },
  idp_ca_cert_path: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Path to Identity Provider CA cert (x509)'),
      text: i18n.t('If your Identity Provider uses a self-signed certificate, put the path to its certificate here instead.'),
      fields: [
        {
          key: 'idp_ca_cert_path',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.idp_ca_cert_path
          },
          validators: pfConfigurationValidatorsFromMeta(meta.idp_ca_cert_path, 'Path')
        }
      ]
    }
  },
  idp_cert_path: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Path to Identity Provider cert (x509)'),
      fields: [
        {
          key: 'idp_cert_path',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.idp_cert_path
          },
          validators: pfConfigurationValidatorsFromMeta(meta.idp_cert_path, 'Path')
        }
      ]
    }
  },
  idp_entity_id: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Identity Provider entity ID'),
      fields: [
        {
          key: 'idp_entity_id',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.idp_entity_id
          },
          validators: pfConfigurationValidatorsFromMeta(meta.idp_entity_id, 'ID')
        }
      ]
    }
  },
  idp_metadata_path: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Path to Identity Provider metadata'),
      fields: [
        {
          key: 'idp_metadata_path',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.idp_metadata_path
          },
          validators: pfConfigurationValidatorsFromMeta(meta.idp_metadata_path, 'Path')
        }
      ]
    }
  },
  key_file: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Key file'),
      text: i18n.t('The path to the associated key of the certificate you submitted to Paypal.'),
      fields: [
        {
          key: 'key_file',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.key_file
          },
          validators: pfConfigurationValidatorsFromMeta(meta.key_file, 'File')
        }
      ]
    }
  },
  local_account_logins: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Amount of logins for the local account'),
      text: i18n.t('The amount of times, the local account can be used after its created. 0 means infinite.'),
      fields: [
        {
          key: 'local_account_logins',
          component: pfFormInput,
          attrs: {
            type: 'number',
            placeholder: placeholders.local_account_logins
          },
          validators: pfConfigurationValidatorsFromMeta(meta.local_account_logins, 'Logins')
        }
      ]
    }
  },
  local_realm: ({ options: { allowed = {}, meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Local Realms'),
      text: i18n.t('Realms that will be authenticate locally'),
      fields: [
        {
          key: 'local_realm',
          component: pfFormChosen,
          attrs: {
            collapseObject: true,
            placeholder: placeholders.local_realm,
            trackBy: 'value',
            label: 'label',
            multiple: true,
            clearOnSelect: false,
            closeOnSelect: false,
            options: allowed.local_realm
          },
          validators: pfConfigurationValidatorsFromMeta(meta.local_realm, 'Realms')
        }
      ]
    }
  },
  merchant_id: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Merchant ID'),
      fields: [
        {
          key: 'merchant_id',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.merchant_id
          },
          validators: pfConfigurationValidatorsFromMeta(meta.merchant_id, 'ID')
        }
      ]
    }
  },
  message: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('SMS text message ($pin will be replaced by the PIN number)'),
      fields: [
        {
          key: 'message',
          component: pfFormTextarea,
          attrs: {
            rows: 5,
            placeholder: placeholders.message
          },
          validators: pfConfigurationValidatorsFromMeta(meta.message, 'Message')
        }
      ]
    }
  },
  monitor: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Monitor'),
      text: i18n.t('Do you want to monitor this source?'),
      fields: [
        {
          key: 'monitor',
          component: pfFormRangeToggle,
          attrs: {
            values: { checked: '1', unchecked: '0' }
          }
        }
      ]
    }
  },
  password: ({ $store = {}, form = {}, options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Password'),
      fields: [
        {
          key: 'password',
          component: pfFormPassword,
          attrs: {
            test: () => {
              return $store.dispatch('$_sources/testAuthenticationSource', form).then(response => {
                return response
              }).catch(err => {
                throw err
              })
            },
            placeholder: placeholders.password
          },
          validators: pfConfigurationValidatorsFromMeta(meta.password, 'Password')
        }
      ]
    }
  },
  password_email_update: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Email'),
      text: i18n.t('Email addresses to send the new generated password.'),
      fields: [
        {
          key: 'password_email_update',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.password_email_update
          },
          validators: pfConfigurationValidatorsFromMeta(meta.password_email_update, 'Email')
        }
      ]
    }
  },
  password_length: ({ options: { allowed = {}, meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Password length '),
      text: i18n.t('The length of the password to generate.'),
      fields: [
        {
          key: 'password_length',
          component: pfFormSelect,
          attrs: {
            options: Array(15).fill().map((_, i) => { return { value: i + 1, text: i + 1 } })
          },
          validators: pfConfigurationValidatorsFromMeta(meta.password_length, 'Length')
        }
      ]
    }
  },
  password_rotation: ({ options: { allowed = {}, meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Password Rotation Period'),
      text: i18n.t('Period of time after the password must be rotated.'),
      fields: [
        {
          key: 'password_rotation.interval',
          component: pfFormInput,
          attrs: {
            type: 'number',
            placeholder: ('password_rotation' in placeholders)
              ? placeholders.password_rotation.interval
              : ''
          },
          validators: ('password_rotation' in meta)
            ? pfConfigurationValidatorsFromMeta(meta.password_rotation.interval, 'Interval')
            : {}
        },
        {
          key: 'password_rotation.unit',
          component: pfFormChosen,
          attrs: {
            collapseObject: true,
            placeholder: ('password_rotation' in placeholders)
              ? placeholders.password_rotation.unit
              : '',
            trackBy: 'value',
            label: 'label',
            options: ('password_rotation' in allowed)
              ? allowed.password_rotation.unit
              : []
          },
          validators: ('password_rotation' in meta)
            ? pfConfigurationValidatorsFromMeta(meta.password_rotation.unit, 'Unit')
            : {}
        }
      ]
    }
  },
  path: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('File Path'),
      fields: [
        {
          key: 'path',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.path
          },
          validators: pfConfigurationValidatorsFromMeta(meta.path, 'Path')
        }
      ]
    }
  },
  payment_type: ({ options: { allowed = {}, meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Payment type'),
      fields: [
        {
          key: 'payment_type',
          component: pfFormChosen,
          attrs: {
            collapseObject: true,
            placeholder: placeholders.payment_type,
            trackBy: 'value',
            label: 'label',
            options: allowed.payment_type
          },
          validators: pfConfigurationValidatorsFromMeta(meta.payment_type, 'Type')
        }
      ]
    }
  },
  paypal_cert_file: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Paypal cert file'),
      text: i18n.t('The path to the Paypal certificate you downloaded.'),
      fields: [
        {
          key: 'paypal_cert_file',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.paypal_cert_file
          },
          validators: pfConfigurationValidatorsFromMeta(meta.paypal_cert_file, 'File')
        }
      ]
    }
  },
  pin_code_length: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('PIN length'),
      text: i18n.t('The amount of digits of the PIN number.'),
      fields: [
        {
          key: 'pin_code_length',
          component: pfFormInput,
          attrs: {
            type: 'number',
            placeholder: placeholders.pin_code_length
          },
          validators: pfConfigurationValidatorsFromMeta(meta.pin_code_length, 'Length')
        }
      ]
    }
  },
  protected_resource_url: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: null, // multiple occurances w/ different strings, nullify for overload
      fields: [
        {
          key: 'protected_resource_url',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.protected_resource_url
          },
          validators: pfConfigurationValidatorsFromMeta(meta.protected_resource_url, 'URL')
        }
      ]
    }
  },
  protocol_ip_port: ({ options: { allowed = {}, meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Host'),
      fields: [
        {
          key: 'protocol',
          component: pfFormChosen,
          attrs: {
            collapseObject: true,
            placeholder: placeholders.protocol,
            trackBy: 'value',
            label: 'label',
            options: allowed.protocol
          },
          validators: pfConfigurationValidatorsFromMeta(meta.protocol, 'Protocol')
        },
        {
          key: 'ip',
          component: pfFormInput,
          attrs: {
            class: 'col-sm-4',
            placeholder: placeholders.ip
          },
          validators: pfConfigurationValidatorsFromMeta(meta.ip, 'IP')
        },
        {
          text: ':',
          class: 'mx-1 font-weight-bold'
        },
        {
          key: 'port',
          component: pfFormInput,
          attrs: {
            class: 'col-sm-1',
            type: 'number',
            placeholder: placeholders.port
          },
          validators: pfConfigurationValidatorsFromMeta(meta.port, 'Port')
        }
      ]
    }
  },
  proxy_addresses: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Proxy addresses'),
      text: i18n.t('A comma seperated list of IP Address'),
      fields: [
        {
          key: 'proxy_addresses',
          component: pfFormTextarea,
          attrs: {
            rows: 5,
            placeholder: placeholders.proxy_addresses
          },
          validators: pfConfigurationValidatorsFromMeta(meta.proxy_addresses, 'Addresses')
        }
      ]
    }
  },
  public_client_key: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Public Client Key'),
      fields: [
        {
          key: 'public_client_key',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.public_client_key
          },
          validators: pfConfigurationValidatorsFromMeta(meta.public_client_key, 'Key')
        }
      ]
    }
  },
  publishable_key: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Publishable key'),
      fields: [
        {
          key: 'publishable_key',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.publishable_key
          },
          validators: pfConfigurationValidatorsFromMeta(meta.publishable_key, 'Key')
        }
      ]
    }
  },
  radius_secret: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('RADIUS secret'),
      text: i18n.t('Eduroam RADIUS secret'),
      fields: [
        {
          key: 'radius_secret',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.radius_secret
          },
          validators: pfConfigurationValidatorsFromMeta(meta.radius_secret, 'Secret')
        }
      ]
    }
  },
  read_timeout: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Response timeout'),
      text: i18n.t('LDAP response timeout'),
      fields: [
        {
          key: 'read_timeout',
          component: pfFormInput,
          attrs: {
            type: 'number',
            placeholder: placeholders.read_timeout
          },
          validators: pfConfigurationValidatorsFromMeta(meta.read_timeout, 'Timeout')
        }
      ]
    }
  },
  realms: ({ options: { allowed = {}, meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Associated Realms'),
      text: i18n.t('Realms that will be associated with this source'),
      fields: [
        {
          key: 'realms',
          component: pfFormChosen,
          attrs: {
            collapseObject: true,
            placeholder: placeholders.realms,
            trackBy: 'value',
            label: 'label',
            multiple: true,
            clearOnSelect: false,
            closeOnSelect: false,
            options: allowed.realms
          },
          validators: pfConfigurationValidatorsFromMeta(meta.realms, 'Realms')
        }
      ]
    }
  },
  redirect_url: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Portal URL'),
      text: i18n.t('The hostname must be the one of your captive portal.'),
      fields: [
        {
          key: 'redirect_url',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.redirect_url
          },
          validators: pfConfigurationValidatorsFromMeta(meta.redirect_url, 'URL')
        }
      ]
    }
  },
  reject_realm: ({ options: { allowed = {}, meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Reject Realms'),
      text: i18n.t('Realms that will be rejected'),
      fields: [
        {
          key: 'reject_realm',
          component: pfFormChosen,
          attrs: {
            collapseObject: true,
            placeholder: placeholders.reject_realm,
            trackBy: 'value',
            label: 'label',
            multiple: true,
            clearOnSelect: false,
            closeOnSelect: false,
            options: allowed.reject_realm
          },
          validators: pfConfigurationValidatorsFromMeta(meta.reject_realm, 'Realms')
        }
      ]
    }
  },
  scope: ({ options: { allowed = {}, meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Scope'),
      fields: [
        {
          key: 'scope',
          component: pfFormChosen,
          attrs: {
            collapseObject: true,
            placeholder: placeholders.scope,
            trackBy: 'value',
            label: 'label',
            options: allowed.scope
          },
          validators: pfConfigurationValidatorsFromMeta(meta.scope, 'Scope')
        }
      ]
    }
  },
  secret: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Secret'),
      fields: [
        {
          key: 'secret',
          component: pfFormPassword,
          attrs: {
            placeholder: placeholders.secret
          },
          validators: pfConfigurationValidatorsFromMeta(meta.secret, 'Secret')
        }
      ]
    }
  },
  secret_key: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Secret key'),
      fields: [
        {
          key: 'secret_key',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.secret_key
          },
          validators: pfConfigurationValidatorsFromMeta(meta.secret_key, 'Key')
        }
      ]
    }
  },
  send_email_confirmation: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Send billing confirmation'),
      fields: [
        {
          key: 'send_email_confirmation',
          component: pfFormRangeToggle,
          attrs: {
            values: { checked: 'enabled', unchecked: 'disabled' }
          }
        }
      ]
    }
  },
  server1_address: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Server 1 address'),
      text: i18n.t('Eduroam server 1 address'),
      fields: [
        {
          key: 'server1_address',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.server1_address
          },
          validators: pfConfigurationValidatorsFromMeta(meta.server1_address, 'Address')
        }
      ]
    }
  },
  server1_port: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Eduroam server 1 port'),
      fields: [
        {
          key: 'server1_port',
          component: pfFormInput,
          attrs: {
            type: 'number',
            placeholder: placeholders.server1_port
          },
          validators: pfConfigurationValidatorsFromMeta(meta.server1_port, 'Port')
        }
      ]
    }
  },
  server2_address: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Server 2 address'),
      text: i18n.t('Eduroam server 1 address'),
      fields: [
        {
          key: 'server2_address',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.server2_address
          },
          validators: pfConfigurationValidatorsFromMeta(meta.server2_address, 'Address')
        }
      ]
    }
  },
  server2_port: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Eduroam server 2 port'),
      fields: [
        {
          key: 'server2_port',
          component: pfFormInput,
          attrs: {
            type: 'number',
            placeholder: placeholders.server2_port
          },
          validators: pfConfigurationValidatorsFromMeta(meta.server2_port, 'Port')
        }
      ]
    }
  },
  service_fqdn: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Service FQDN'),
      fields: [
        {
          key: 'service_fqdn',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.service_fqdn
          },
          validators: pfConfigurationValidatorsFromMeta(meta.service_fqdn, 'FQDN')
        }
      ]
    }
  },
  shared_secret: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Shared Secret'),
      text: i18n.t('MKEY for the iframe'),
      fields: [
        {
          key: 'shared_secret',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.shared_secret
          },
          validators: pfConfigurationValidatorsFromMeta(meta.shared_secret, 'Secret')
        }
      ]
    }
  },
  shared_secret_direct: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Shared Secret Direct'),
      text: i18n.t('MKEY for Mirapay Direct'),
      fields: [
        {
          key: 'shared_secret_direct',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.shared_secret_direct
          },
          validators: pfConfigurationValidatorsFromMeta(meta.shared_secret_direct, 'Secret')
        }
      ]
    }
  },
  shuffle: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Shuffle'),
      text: i18n.t('Randomly choose LDAP server to query'),
      fields: [
        {
          key: 'shuffle',
          component: pfFormRangeToggle,
          attrs: {
            values: { checked: '1', unchecked: '0' }
          }
        }
      ]
    }
  },
  site: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: null, // multiple occurances w/ different strings, nullify for overload
      fields: [
        {
          key: 'site',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.site
          },
          validators: pfConfigurationValidatorsFromMeta(meta.site, 'URL')
        }
      ]
    }
  },
  sms_activation_timeout: ({ options: { allowed = {}, meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('SMS Activation Timeout '),
      text: i18n.t('This is the delay given to a guest who registered by SMS confirmation to fill the PIN code.'),
      fields: [
        {
          key: 'sms_activation_timeout.interval',
          component: pfFormInput,
          attrs: {
            type: 'number',
            placeholder: ('sms_activation_timeout' in placeholders)
              ? placeholders.sms_activation_timeout.interval
              : ''
          },
          validators: ('sms_activation_timeout' in meta)
            ? pfConfigurationValidatorsFromMeta(meta.sms_activation_timeout.interval, 'Interval')
            : {}
        },
        {
          key: 'sms_activation_timeout.unit',
          component: pfFormChosen,
          attrs: {
            collapseObject: true,
            placeholder: ('sms_activation_timeout' in placeholders)
              ? placeholders.sms_activation_timeout.unit
              : '',
            trackBy: 'value',
            label: 'label',
            options: ('sms_activation_timeout' in allowed)
              ? allowed.sms_activation_timeout.unit
              : []
          },
          validators: ('sms_activation_timeout' in meta)
            ? pfConfigurationValidatorsFromMeta(meta.sms_activation_timeout.unit, 'Unit')
            : {}
        }
      ]
    }
  },
  sms_carriers: ({ options: { allowed = {}, meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('SMS Carriers'),
      text: i18n.t('List of phone carriers available to the user'),
      fields: [
        {
          key: 'sms_carriers',
          component: pfFormChosen,
          attrs: {
            collapseObject: true,
            placeholder: placeholders.sms_carriers,
            trackBy: 'value',
            label: 'label',
            multiple: true,
            clearOnSelect: false,
            closeOnSelect: false,
            options: allowed.sms_carriers
          },
          validators: pfConfigurationValidatorsFromMeta(meta.sms_carriers, 'Carriers')
        }
      ]
    }
  },
  sp_entity_id: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Service Provider entity ID'),
      fields: [
        {
          key: 'sp_entity_id',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.sp_entity_id
          },
          validators: pfConfigurationValidatorsFromMeta(meta.sp_entity_id, 'ID')
        }
      ]
    }
  },
  sp_key_path: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Path to Service Provider key (x509)'),
      fields: [
        {
          key: 'sp_key_path',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.sp_key_path
          },
          validators: pfConfigurationValidatorsFromMeta(meta.sp_key_path, 'Path')
        }
      ]
    }
  },
  sponsorship_bcc: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Sponsorship BCC'),
      text: i18n.t('Sponsors requesting access and access confirmation emails are BCC\'ed to this address. Multiple destinations can be comma separated.'),
      fields: [
        {
          key: 'sponsorship_bcc',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.sponsorship_bcc
          },
          validators: pfConfigurationValidatorsFromMeta(meta.sponsorship_bcc, 'BCC')
        }
      ]
    }
  },
  style: ({ options: { allowed = {}, meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Style'),
      fields: [
        {
          key: 'style',
          component: pfFormChosen,
          attrs: {
            collapseObject: true,
            placeholder: placeholders.style,
            trackBy: 'value',
            label: 'label',
            options: allowed.style
          },
          validators: pfConfigurationValidatorsFromMeta(meta.style, 'Style')
        }
      ]
    }
  },
  terminal_group_id: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Terminal Group ID'),
      text: i18n.t('Terminal Group ID for Mirapay Direct'),
      fields: [
        {
          key: 'terminal_group_id',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.terminal_group_id
          },
          validators: pfConfigurationValidatorsFromMeta(meta.terminal_group_id, 'ID')
        }
      ]
    }
  },
  terminal_id: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Terminal ID'),
      text: i18n.t('Terminal ID for Mirapay Direct'),
      fields: [
        {
          key: 'terminal_id',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.terminal_id
          },
          validators: pfConfigurationValidatorsFromMeta(meta.terminal_id, 'ID')
        }
      ]
    }
  },
  test_mode: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Test mode'),
      fields: [
        {
          key: 'test_mode',
          component: pfFormRangeToggle,
          attrs: {
            values: { checked: '1', unchecked: '0' }
          }
        }
      ]
    }
  },
  timeout: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Timeout'),
      fields: [
        {
          key: 'timeout',
          component: pfFormInput,
          attrs: {
            type: 'number',
            placeholder: placeholders.timeout
          },
          validators: pfConfigurationValidatorsFromMeta(meta.timeout, 'Timeout')
        }
      ]
    }
  },
  transaction_key: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Transaction key'),
      fields: [
        {
          key: 'transaction_key',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.transaction_key
          },
          validators: pfConfigurationValidatorsFromMeta(meta.transaction_key, 'Key')
        }
      ]
    }
  },
  twilio_phone_number: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Phone Number (From)'),
      text: i18n.t('Twilio provided phone number which will show as the sender'),
      fields: [
        {
          key: 'twilio_phone_number',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.twilio_phone_number
          },
          validators: pfConfigurationValidatorsFromMeta(meta.twilio_phone_number, 'Phone')
        }
      ]
    }
  },
  user_header: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('User header '),
      fields: [
        {
          key: 'user_header',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.user_header
          },
          validators: pfConfigurationValidatorsFromMeta(meta.user_header, 'Header')
        }
      ]
    }
  },
  username_attribute: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Attribute of the username in the SAML response'),
      fields: [
        {
          key: 'username_attribute',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.username_attribute
          },
          validators: pfConfigurationValidatorsFromMeta(meta.username_attribute, 'Attribute')
        }
      ]
    }
  },
  usernameattribute: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Username Attribute'),
      fields: [
        {
          key: 'usernameattribute',
          component: pfFormInput,
          attrs: {
            placeholder: placeholders.usernameattribute
          },
          validators: pfConfigurationValidatorsFromMeta(meta.usernameattribute, 'Attribute')
        }
      ]
    }
  },
  validate_sponsor: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Sponsor Validation'),
      text: i18n.t('Force sponsor to authenticate when validating a guest request.'),
      fields: [
        {
          key: 'validate_sponsor',
          component: pfFormRangeToggle,
          attrs: {
            values: { checked: 'yes', unchecked: 'no' }
          }
        }
      ]
    }
  },
  write_timeout: ({ options: { meta = {}, placeholders = {} } } = {}) => {
    return {
      label: i18n.t('Request timeout'),
      text: i18n.t('LDAP request timeout'),
      fields: [
        {
          key: 'write_timeout',
          component: pfFormInput,
          attrs: {
            type: 'number',
            placeholder: placeholders.write_timeout
          },
          validators: pfConfigurationValidatorsFromMeta(meta.write_timeout, 'Timeout')
        }
      ]
    }
  }
}

export const pfConfigurationAuthenticationSourceViewFields = (context) => {
  const { sourceType = null } = context
  switch (sourceType) {
    case 'AD':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.host_port_encryption(context),
            pfConfigurationAuthenticationSourceFields.connection_timeout(context),
            pfConfigurationAuthenticationSourceFields.write_timeout(context),
            pfConfigurationAuthenticationSourceFields.read_timeout(context),
            pfConfigurationAuthenticationSourceFields.basedn(context),
            pfConfigurationAuthenticationSourceFields.scope(context),
            pfConfigurationAuthenticationSourceFields.usernameattribute(context),
            pfConfigurationAuthenticationSourceFields.email_attribute(context),
            pfConfigurationAuthenticationSourceFields.binddn(context),
            pfConfigurationAuthenticationSourceFields.password(context),
            pfConfigurationAuthenticationSourceFields.cache_match(context),
            pfConfigurationAuthenticationSourceFields.monitor(context),
            pfConfigurationAuthenticationSourceFields.shuffle(context),
            pfConfigurationAuthenticationSourceFields.realms(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context),
            pfConfigurationAuthenticationSourceFields.administration_rules(context)
          ]
        }
      ]
    case 'EAPTLS':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.realms(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context),
            pfConfigurationAuthenticationSourceFields.administration_rules(context)
          ]
        }
      ]
    case 'Htpasswd':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.path(context),
            pfConfigurationAuthenticationSourceFields.realms(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context),
            pfConfigurationAuthenticationSourceFields.administration_rules(context)
          ]
        }
      ]
    case 'HTTP':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.protocol_ip_port(context),
            pfConfigurationAuthenticationSourceFields.api_username(context),
            pfConfigurationAuthenticationSourceFields.api_password(context),
            pfConfigurationAuthenticationSourceFields.authentication_url(context),
            pfConfigurationAuthenticationSourceFields.authorization_url(context),
            pfConfigurationAuthenticationSourceFields.realms(context)
          ]
        }
      ]
    case 'Kerberos':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.host(context),
            pfConfigurationAuthenticationSourceFields.authenticate_realm(context),
            pfConfigurationAuthenticationSourceFields.realms(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context),
            pfConfigurationAuthenticationSourceFields.administration_rules(context)
          ]
        }
      ]
    case 'LDAP':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.host_port_encryption(context),
            pfConfigurationAuthenticationSourceFields.connection_timeout(context),
            pfConfigurationAuthenticationSourceFields.write_timeout(context),
            pfConfigurationAuthenticationSourceFields.read_timeout(context),
            pfConfigurationAuthenticationSourceFields.basedn(context),
            pfConfigurationAuthenticationSourceFields.scope(context),
            pfConfigurationAuthenticationSourceFields.usernameattribute(context),
            pfConfigurationAuthenticationSourceFields.email_attribute(context),
            pfConfigurationAuthenticationSourceFields.binddn(context),
            pfConfigurationAuthenticationSourceFields.password(context),
            pfConfigurationAuthenticationSourceFields.cache_match(context),
            pfConfigurationAuthenticationSourceFields.monitor(context),
            pfConfigurationAuthenticationSourceFields.shuffle(context),
            pfConfigurationAuthenticationSourceFields.realms(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context),
            pfConfigurationAuthenticationSourceFields.administration_rules(context)
          ]
        }
      ]
    case 'POTD':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.password_rotation(context),
            pfConfigurationAuthenticationSourceFields.password_email_update(context),
            pfConfigurationAuthenticationSourceFields.password_length(context),
            pfConfigurationAuthenticationSourceFields.realms(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context),
            pfConfigurationAuthenticationSourceFields.administration_rules(context)
          ]
        }
      ]
    case 'RADIUS':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.host(context),
            pfConfigurationAuthenticationSourceFields.secret(context),
            pfConfigurationAuthenticationSourceFields.timeout(context),
            pfConfigurationAuthenticationSourceFields.monitor(context),
            pfConfigurationAuthenticationSourceFields.realms(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context),
            pfConfigurationAuthenticationSourceFields.administration_rules(context)
          ]
        }
      ]
    case 'SAML':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.sp_entity_id(context),
            pfConfigurationAuthenticationSourceFields.sp_key_path(context),
            pfConfigurationAuthenticationSourceFields.idp_entity_id(context),
            pfConfigurationAuthenticationSourceFields.idp_metadata_path(context),
            pfConfigurationAuthenticationSourceFields.idp_cert_path(context),
            pfConfigurationAuthenticationSourceFields.idp_ca_cert_path(context),
            pfConfigurationAuthenticationSourceFields.username_attribute(context),
            pfConfigurationAuthenticationSourceFields.authorization_source_id(context)
          ]
        }
      ]
    case 'Email':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            {
              ...pfConfigurationAuthenticationSourceFields.email_activation_timeout(context),
              ...{ text: i18n.t('This is the delay given to a guest who registered by email confirmation to log into his email and click the activation link.') }
            }, // re-text
            pfConfigurationAuthenticationSourceFields.allow_localdomain(context),
            pfConfigurationAuthenticationSourceFields.activation_domain(context),
            pfConfigurationAuthenticationSourceFields.create_local_account(context),
            pfConfigurationAuthenticationSourceFields.local_account_logins(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context)
          ]
        }
      ]
    case 'Facebook':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.client_id(context),
            pfConfigurationAuthenticationSourceFields.client_secret(context),
            { ...pfConfigurationAuthenticationSourceFields.site(context), ...{ label: i18n.t('Graph API URL') } }, // re-label
            { ...pfConfigurationAuthenticationSourceFields.access_token_path(context), ...{ label: i18n.t('Graph API Token Path') } }, // re-label
            pfConfigurationAuthenticationSourceFields.access_token_param(context),
            pfConfigurationAuthenticationSourceFields.access_scope(context),
            { ...pfConfigurationAuthenticationSourceFields.protected_resource_url(context), ...{ label: i18n.t('Graph API URL of logged user') } }, // re-label
            pfConfigurationAuthenticationSourceFields.redirect_url(context),
            pfConfigurationAuthenticationSourceFields.domains(context),
            pfConfigurationAuthenticationSourceFields.create_local_account(context),
            pfConfigurationAuthenticationSourceFields.local_account_logins(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context)
          ]
        }
      ]
    case 'Github':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.client_id(context),
            pfConfigurationAuthenticationSourceFields.client_secret(context),
            { ...pfConfigurationAuthenticationSourceFields.site(context), ...{ label: i18n.t('API URL') } }, // re-label
            pfConfigurationAuthenticationSourceFields.authorize_path(context),
            { ...pfConfigurationAuthenticationSourceFields.access_token_path(context), ...{ label: i18n.t('API Token Path') } }, // re-label
            pfConfigurationAuthenticationSourceFields.access_token_param(context),
            pfConfigurationAuthenticationSourceFields.access_scope(context),
            { ...pfConfigurationAuthenticationSourceFields.protected_resource_url(context), ...{ label: i18n.t('API URL of logged user') } }, // re-label
            pfConfigurationAuthenticationSourceFields.redirect_url(context),
            pfConfigurationAuthenticationSourceFields.domains(context),
            pfConfigurationAuthenticationSourceFields.create_local_account(context),
            pfConfigurationAuthenticationSourceFields.local_account_logins(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context)
          ]
        }
      ]
    case 'Google':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.client_id(context),
            pfConfigurationAuthenticationSourceFields.client_secret(context),
            { ...pfConfigurationAuthenticationSourceFields.site(context), ...{ label: i18n.t('API URL') } }, // re-label
            pfConfigurationAuthenticationSourceFields.authorize_path(context),
            { ...pfConfigurationAuthenticationSourceFields.access_token_path(context), ...{ label: i18n.t('API Token Path') } }, // re-label
            pfConfigurationAuthenticationSourceFields.access_token_param(context),
            pfConfigurationAuthenticationSourceFields.access_scope(context),
            { ...pfConfigurationAuthenticationSourceFields.protected_resource_url(context), ...{ label: i18n.t('API URL of logged user') } }, // re-label
            pfConfigurationAuthenticationSourceFields.redirect_url(context),
            pfConfigurationAuthenticationSourceFields.domains(context),
            pfConfigurationAuthenticationSourceFields.create_local_account(context),
            pfConfigurationAuthenticationSourceFields.local_account_logins(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context)
          ]
        }
      ]
    case 'Instagram':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.client_id(context),
            pfConfigurationAuthenticationSourceFields.client_secret(context),
            { ...pfConfigurationAuthenticationSourceFields.site(context), ...{ label: i18n.t('Graph API URL') } }, // re-label
            { ...pfConfigurationAuthenticationSourceFields.access_token_path(context), ...{ label: i18n.t('Graph API Token Path') } }, // re-label
            pfConfigurationAuthenticationSourceFields.access_token_param(context),
            pfConfigurationAuthenticationSourceFields.access_scope(context),
            { ...pfConfigurationAuthenticationSourceFields.protected_resource_url(context), ...{ label: i18n.t('Graph API URL of logged user') } }, // re-label
            pfConfigurationAuthenticationSourceFields.redirect_url(context),
            pfConfigurationAuthenticationSourceFields.domains(context),
            pfConfigurationAuthenticationSourceFields.create_local_account(context),
            pfConfigurationAuthenticationSourceFields.local_account_logins(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context)
          ]
        }
      ]
    case 'Kickbox':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.api_key(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context)
          ]
        }
      ]
    case 'LinkedIn':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.client_id(context),
            pfConfigurationAuthenticationSourceFields.client_secret(context),
            { ...pfConfigurationAuthenticationSourceFields.site(context), ...{ label: i18n.t('API URL') } }, // re-label
            pfConfigurationAuthenticationSourceFields.authorize_path(context),
            { ...pfConfigurationAuthenticationSourceFields.access_token_path(context), ...{ label: i18n.t('API Token Path') } }, // re-label
            pfConfigurationAuthenticationSourceFields.access_token_param(context),
            { ...pfConfigurationAuthenticationSourceFields.protected_resource_url(context), ...{ label: i18n.t('API URL of logged user') } }, // re-label
            pfConfigurationAuthenticationSourceFields.redirect_url(context),
            pfConfigurationAuthenticationSourceFields.domains(context),
            pfConfigurationAuthenticationSourceFields.create_local_account(context),
            pfConfigurationAuthenticationSourceFields.local_account_logins(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context)
          ]
        }
      ]
    case 'Null':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.email_required(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context)
          ]
        }
      ]
    case 'OpenID':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.client_id(context),
            pfConfigurationAuthenticationSourceFields.client_secret(context),
            { ...pfConfigurationAuthenticationSourceFields.site(context), ...{ label: i18n.t('API URL') } }, // re-label
            pfConfigurationAuthenticationSourceFields.authorize_path(context),
            { ...pfConfigurationAuthenticationSourceFields.access_token_path(context), ...{ label: i18n.t('API Token Path') } }, // re-label
            pfConfigurationAuthenticationSourceFields.access_scope(context),
            { ...pfConfigurationAuthenticationSourceFields.protected_resource_url(context), ...{ label: i18n.t('API URL of logged user') } }, // re-label
            pfConfigurationAuthenticationSourceFields.redirect_url(context),
            pfConfigurationAuthenticationSourceFields.domains(context),
            pfConfigurationAuthenticationSourceFields.create_local_account(context),
            pfConfigurationAuthenticationSourceFields.local_account_logins(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context)
          ]
        }
      ]
    case 'Pinterest':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.client_id(context),
            pfConfigurationAuthenticationSourceFields.client_secret(context),
            { ...pfConfigurationAuthenticationSourceFields.site(context), ...{ label: i18n.t('Graph API URL') } }, // re-label
            pfConfigurationAuthenticationSourceFields.authorize_path(context),
            { ...pfConfigurationAuthenticationSourceFields.access_token_path(context), ...{ label: i18n.t('Graph API Token Path') } }, // re-label
            pfConfigurationAuthenticationSourceFields.access_token_param(context),
            pfConfigurationAuthenticationSourceFields.access_scope(context),
            { ...pfConfigurationAuthenticationSourceFields.protected_resource_url(context), ...{ label: i18n.t('API URL of logged user') } }, // re-label
            pfConfigurationAuthenticationSourceFields.redirect_url(context),
            pfConfigurationAuthenticationSourceFields.domains(context),
            pfConfigurationAuthenticationSourceFields.create_local_account(context),
            pfConfigurationAuthenticationSourceFields.local_account_logins(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context)
          ]
        }
      ]
    case 'SMS':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.sms_carriers(context),
            pfConfigurationAuthenticationSourceFields.sms_activation_timeout(context),
            pfConfigurationAuthenticationSourceFields.message(context),
            pfConfigurationAuthenticationSourceFields.pin_code_length(context),
            pfConfigurationAuthenticationSourceFields.create_local_account(context),
            pfConfigurationAuthenticationSourceFields.local_account_logins(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context)
          ]
        }
      ]
    case 'SponsorEmail':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.allow_localdomain(context),
            { ...pfConfigurationAuthenticationSourceFields.email_activation_timeout(context), ...{ text: i18n.t('Delay given to a sponsor to click the activation link.') } }, // re-text
            pfConfigurationAuthenticationSourceFields.activation_domain(context),
            pfConfigurationAuthenticationSourceFields.sponsorship_bcc(context),
            pfConfigurationAuthenticationSourceFields.validate_sponsor(context),
            pfConfigurationAuthenticationSourceFields.create_local_account(context),
            pfConfigurationAuthenticationSourceFields.local_account_logins(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context)
          ]
        }
      ]
    case 'Twilio':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.account_sid(context),
            pfConfigurationAuthenticationSourceFields.auth_token(context),
            pfConfigurationAuthenticationSourceFields.twilio_phone_number(context),
            pfConfigurationAuthenticationSourceFields.message(context),
            pfConfigurationAuthenticationSourceFields.pin_code_length(context),
            pfConfigurationAuthenticationSourceFields.create_local_account(context),
            pfConfigurationAuthenticationSourceFields.local_account_logins(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context)
          ]
        }
      ]
    case 'Twitter':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.client_id(context),
            pfConfigurationAuthenticationSourceFields.client_secret(context),
            { ...pfConfigurationAuthenticationSourceFields.site(context), ...{ label: i18n.t('API URL') } }, // re-label
            pfConfigurationAuthenticationSourceFields.authorize_path(context),
            { ...pfConfigurationAuthenticationSourceFields.access_token_path(context), ...{ label: i18n.t('API Token Path') } }, // re-label
            { ...pfConfigurationAuthenticationSourceFields.protected_resource_url(context), ...{ label: i18n.t('API URL of logged user') } }, // re-label
            pfConfigurationAuthenticationSourceFields.redirect_url(context),
            pfConfigurationAuthenticationSourceFields.domains(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context)
          ]
        }
      ]
    case 'WindowsLive':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.client_id(context),
            pfConfigurationAuthenticationSourceFields.client_secret(context),
            { ...pfConfigurationAuthenticationSourceFields.site(context), ...{ label: i18n.t('API URL') } }, // re-label
            pfConfigurationAuthenticationSourceFields.authorize_path(context),
            { ...pfConfigurationAuthenticationSourceFields.access_token_path(context), ...{ label: i18n.t('API Token Path') } }, // re-label
            pfConfigurationAuthenticationSourceFields.access_token_param(context),
            pfConfigurationAuthenticationSourceFields.access_scope(context),
            { ...pfConfigurationAuthenticationSourceFields.protected_resource_url(context), ...{ label: i18n.t('API URL of logged user') } }, // re-label
            pfConfigurationAuthenticationSourceFields.redirect_url(context),
            pfConfigurationAuthenticationSourceFields.domains(context),
            pfConfigurationAuthenticationSourceFields.create_local_account(context),
            pfConfigurationAuthenticationSourceFields.local_account_logins(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context)
          ]
        }
      ]
    case 'AdminProxy':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.proxy_addresses(context),
            pfConfigurationAuthenticationSourceFields.user_header(context),
            pfConfigurationAuthenticationSourceFields.group_header(context),
            pfConfigurationAuthenticationSourceFields.administration_rules(context)
          ]
        }
      ]
    case 'Blackhole':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context)
          ]
        }
      ]
    case 'Eduroam':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.server1_address(context),
            pfConfigurationAuthenticationSourceFields.server1_port(context),
            pfConfigurationAuthenticationSourceFields.server2_address(context),
            pfConfigurationAuthenticationSourceFields.server2_port(context),
            pfConfigurationAuthenticationSourceFields.radius_secret(context),
            pfConfigurationAuthenticationSourceFields.auth_listening_port(context),
            pfConfigurationAuthenticationSourceFields.reject_realm(context),
            pfConfigurationAuthenticationSourceFields.local_realm(context),
            pfConfigurationAuthenticationSourceFields.monitor(context),
            pfConfigurationAuthenticationSourceFields.authentication_rules(context)
          ]
        }
      ]
    case 'AuthorizeNet':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.api_login_id(context),
            pfConfigurationAuthenticationSourceFields.transaction_key(context),
            pfConfigurationAuthenticationSourceFields.public_client_key(context),
            pfConfigurationAuthenticationSourceFields.domains(context),
            pfConfigurationAuthenticationSourceFields.currency(context),
            pfConfigurationAuthenticationSourceFields.test_mode(context),
            pfConfigurationAuthenticationSourceFields.send_email_confirmation(context),
            pfConfigurationAuthenticationSourceFields.create_local_account(context),
            pfConfigurationAuthenticationSourceFields.local_account_logins(context)
          ]
        }
      ]
    case 'Mirapay':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            { label: i18n.t('MiraPay iframe settings'), labelSize: 'lg' },
            pfConfigurationAuthenticationSourceFields.base_url(context),
            pfConfigurationAuthenticationSourceFields.merchant_id(context),
            pfConfigurationAuthenticationSourceFields.shared_secret(context),
            { label: i18n.t('MiraPay direct settings'), labelSize: 'lg' },
            pfConfigurationAuthenticationSourceFields.direct_base_url(context),
            pfConfigurationAuthenticationSourceFields.terminal_id(context),
            pfConfigurationAuthenticationSourceFields.shared_secret_direct(context),
            pfConfigurationAuthenticationSourceFields.terminal_group_id(context),
            { label: i18n.t('Additional settings'), labelSize: 'lg' },
            pfConfigurationAuthenticationSourceFields.service_fqdn(context),
            pfConfigurationAuthenticationSourceFields.currency(context),
            pfConfigurationAuthenticationSourceFields.test_mode(context),
            pfConfigurationAuthenticationSourceFields.send_email_confirmation(context),
            pfConfigurationAuthenticationSourceFields.create_local_account(context),
            pfConfigurationAuthenticationSourceFields.local_account_logins(context)
          ]
        }
      ]
    case 'Paypal':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.currency(context),
            pfConfigurationAuthenticationSourceFields.send_email_confirmation(context),
            pfConfigurationAuthenticationSourceFields.test_mode(context),
            pfConfigurationAuthenticationSourceFields.identity_token(context),
            pfConfigurationAuthenticationSourceFields.cert_id(context),
            pfConfigurationAuthenticationSourceFields.cert_file(context),
            pfConfigurationAuthenticationSourceFields.key_file(context),
            pfConfigurationAuthenticationSourceFields.paypal_cert_file(context),
            pfConfigurationAuthenticationSourceFields.email_address(context),
            pfConfigurationAuthenticationSourceFields.payment_type(context),
            pfConfigurationAuthenticationSourceFields.domains(context),
            pfConfigurationAuthenticationSourceFields.create_local_account(context),
            pfConfigurationAuthenticationSourceFields.local_account_logins(context)
          ]
        }
      ]
    case 'Stripe':
      return [
        {
          tab: null, // ignore tabs
          fields: [
            pfConfigurationAuthenticationSourceFields.id(context),
            pfConfigurationAuthenticationSourceFields.description(context),
            pfConfigurationAuthenticationSourceFields.currency(context),
            pfConfigurationAuthenticationSourceFields.send_email_confirmation(context),
            pfConfigurationAuthenticationSourceFields.test_mode(context),
            pfConfigurationAuthenticationSourceFields.secret_key(context),
            pfConfigurationAuthenticationSourceFields.publishable_key(context),
            pfConfigurationAuthenticationSourceFields.style(context),
            pfConfigurationAuthenticationSourceFields.domains(context),
            pfConfigurationAuthenticationSourceFields.create_local_account(context),
            pfConfigurationAuthenticationSourceFields.local_account_logins(context)
          ]
        }
      ]
    default:
      return [
        {
          tab: null, // ignore tabs
          fields: []
        }
      ]
  }
}
