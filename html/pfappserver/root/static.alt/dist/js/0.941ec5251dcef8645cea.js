webpackJsonp([0],{"9gwj":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=n("woOf"),o=n.n(s),i=n("F08C"),a=n("zp2a"),r={name:"pf-form-row",props:{id:{type:String},label:{type:String}},mounted:function(){this.id&&this.$slots.default.length&&(this.$slots.default[0].elm.id=this.id)}},l={render:function(){var e=this.$createElement,t=this._self._c||e;return t("b-row",{staticClass:"my-1",attrs:{"align-v":"center"}},[t("b-col",{attrs:{sm:"3"}},[t("label",{directives:[{name:"t",rawName:"v-t",value:this.label,expression:"label"}],staticClass:"mb-0",attrs:{for:this.id}})]),this._v(" "),t("b-col",{attrs:{sm:"9"}},[this._t("default")],2)],1)},staticRenderFns:[]},c=n("VU/8")(r,l,!1,null,null,null).exports,d={33:"MS-Authentication-TLV",32:"SecurID-EAP",21:"EAP-TTLS",26:"Microsoft-MS-CHAPv2",2:"Notification",17:"Cisco-LEAP",1:"Identity",18:"SIM",30:"DynamID",16:"Arcot-Systems-EAP",44:"Zonelabs",25:"PEAP",27:"MAKE",28:"CRYPTOCard",40:"DeviceConnect-EAP",14:"Defender-Token",49:"EAP-IKEv2",24:"EAP-3Com-Wireless",10:"DSS-Unilateral",31:"Rob-EAP",35:"EAP-Actiontec-Wireless",11:"KEA",53:"EAP-EVEv1",48:"EAP-SAKE",42:"EAP-MOBAC",22:"Remote-Access-Service",46:"EAP-PAX",13:"EAP-TLS",23:"AKA",29:"Cisco-MS-CHAPv2",6:"Generic-Token-Card",50:"EAP-AKA2",39:"SecuriSuite-EAP",3:"NAK",36:"Cogent-Biomentric-EAP",51:"EAP-GPSK",9:"RSA-Public-Key",12:"KEA-Validate",41:"EAP-SPEKE",15:"RSA-SecurID-EAP",47:"EAP-PSK",38:"EAP-HTTP-Digest",52:"EAP-PWD",4:"MD5-Challenge",34:"SentriNET",37:"AirFortress-EAP",45:"EAP-Link",43:"EAP-FAST",19:"SRP-SHA1",5:"One-Time-Password"},u=n("kL7M"),v=n("ESwS").validationMixin,b=n("+cKO").required,m={name:"NodeView",components:{"toggle-button":i.a,"pf-form-row":c,"pf-form-input":a.a},mixins:[v],props:{mac:String},data:function(){return{nodeContent:{pid:""},iplogFields:[{key:"ip",label:this.$i18n.t("IP Address")},{key:"start_time",label:this.$i18n.t("Start Time"),class:"text-nowrap"},{key:"end_time",label:this.$i18n.t("End Time"),formatter:this.$options.filters.pfDate,class:"text-nowrap"}],locationFields:[{key:"switch",label:this.$i18n.t("Switch/AP")},{key:"connection_type",label:this.$i18n.t("Connection Type")},{key:"dot1x_username",label:this.$i18n.t("Username")},{key:"start_time",label:this.$i18n.t("Start Time"),class:"text-nowrap"},{key:"end_time",label:this.$i18n.t("End Time"),formatter:this.$options.filters.pfDate,class:"text-nowrap"}],violationFields:[{key:"description",label:this.$i18n.t("Violation")},{key:"start_date",label:this.$i18n.t("Start Time"),class:"text-nowrap"},{key:"release_date",label:this.$i18n.t("Release Date"),class:"text-nowrap"}]}},computed:{node:function(){return this.$store.state.$_nodes.nodes[this.mac]},roles:function(){return this.$store.getters["config/rolesList"]},statuses:function(){return u.d[u.b.NODE_STATUS]},fbScoreLevel:function(){return this.node.fingerbank.score<33?"danger":this.node.fingerbank.score<66?"warning":"success"},isLoading:function(){return this.$store.getters["$_nodes/isLoading"]},invalidForm:function(){return this.$v.nodeContent.$invalid||this.$store.getters["$_nodes/isLoading"]}},validations:{nodeContent:{pid:{required:b}}},methods:{close:function(){this.$router.push({name:"nodes"})},connectionSubType:function(e){if(e&&d[e])return d[e]},violationDescription:function(e){return this.$store.state.config.violations[e].desc},save:function(){var e=this;this.$store.dispatch("$_nodes/updateNode",this.nodeContent).then(function(t){e.close()})},deleteNode:function(){var e=this;this.$store.dispatch("$_nodes/deleteNode",this.mac).then(function(t){e.close()})},onKeyup:function(e){switch(e.keyCode){case 27:this.close()}}},mounted:function(){var e=this;this.$store.dispatch("$_nodes/getNode",this.mac).then(function(t){e.nodeContent=o()({},t)}),this.$store.dispatch("config/getRoles"),this.$store.dispatch("config/getViolations"),document.addEventListener("keyup",this.onKeyup)},beforeDestroy:function(){document.removeEventListener("keyup",this.onKeyup)}},f={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("b-form",{on:{submit:function(t){t.preventDefault(),e.save()}}},[n("b-card",{attrs:{"no-body":""}},[n("b-card-header",[n("b-button-close",{on:{click:e.close}},[n("icon",{attrs:{name:"times"}})],1),e._v(" "),n("h4",{staticClass:"mb-0"},[e._v("MAC "),n("strong",{domProps:{textContent:e._s(e.mac)}})])],1),e._v(" "),n("b-tabs",{attrs:{card:""}},[n("b-tab",{attrs:{title:"Info",active:""}},[n("b-row",[n("b-col",[n("pf-form-input",{attrs:{label:"Owner",validation:e.$v.nodeContent.pid},model:{value:e.nodeContent.pid,callback:function(t){e.$set(e.nodeContent,"pid",t)},expression:"nodeContent.pid"}}),e._v(" "),n("b-form-group",{attrs:{horizontal:"","label-cols":"3",label:e.$t("Status")}},[n("b-form-select",{attrs:{options:e.statuses},model:{value:e.nodeContent.status,callback:function(t){e.$set(e.nodeContent,"status",t)},expression:"nodeContent.status"}})],1),e._v(" "),n("b-form-group",{attrs:{horizontal:"","label-cols":"3",label:e.$t("Role")}},[n("b-form-select",{attrs:{options:e.roles},model:{value:e.nodeContent.category,callback:function(t){e.$set(e.nodeContent,"category",t)},expression:"nodeContent.category"}})],1),e._v(" "),n("b-form-group",{attrs:{horizontal:"","label-cols":"3",label:e.$t("Notes")}},[n("b-form-textarea",{attrs:{rows:"4","max-rows":"6"},model:{value:e.nodeContent.notes,callback:function(t){e.$set(e.nodeContent,"notes",t)},expression:"nodeContent.notes"}})],1)],1),e._v(" "),n("b-col",[n("pf-form-row",{attrs:{label:e.$t("Name")}},[e._v("\n              "+e._s(e.node.computername)+"\n            ")]),e._v(" "),n("pf-form-row",{attrs:{label:e.$t("Last Seen")}},[e._v("\n              "+e._s(e.node.last_seen)+"\n            ")]),e._v(" "),e.node.ip4?n("pf-form-row",{attrs:{label:e.$t("IPv4 Address")}},[e._v("\n              "+e._s(e.node.ip4.ip)+"\n                "),e.node.ip4.active?n("b-badge",{attrs:{variant:"success"}},[e._v(e._s(e.$t("Since"))+" "+e._s(e.node.ip4.start_time))]):e.node.ip4.end_time?n("b-badge",{attrs:{variant:"warning"}},[e._v(e._s(e.$t("Inactive since"))+" "+e._s(e.node.ip4.end_time))]):n("b-badge",{attrs:{variant:"danger"}},[e._v(e._s(e.$t("Inactive")))])],1):e._e(),e._v(" "),e.node.ip6?n("pf-form-row",{attrs:{label:e.$t("IPv6 Address")}},[e._v("\n              "+e._s(e.node.ip6.ip)+"\n                "),e.node.ip6.active?n("b-badge",{attrs:{variant:"success"}},[e._v(e._s(e.$t("Since"))+" "+e._s(e.node.ip6.start_time))]):e.node.ip6.end_time?n("b-badge",{attrs:{variant:"warning"}},[e._v(e._s(e.$t("Inactive since"))+" "+e._s(e.node.ip6.end_time))]):n("b-badge",{attrs:{variant:"danger"}},[e._v(e._s(e.$t("Inactive")))])],1):e._e()],1)],1)],1),e._v(" "),n("b-tab",{attrs:{title:"Fingerbank"}},[n("b-row",[n("b-col",[n("pf-form-row",{attrs:{label:e.$t("Device Class")}},[e._v("\n              "+e._s(e.node.device_class)+"\n            ")]),e._v(" "),n("pf-form-row",{attrs:{label:e.$t("Device Type")}},[e._v("\n              "+e._s(e.node.device_type)+"\n            ")]),e._v(" "),n("pf-form-row",{attrs:{label:e.$t("Fully Qualified Device Name")}},[e._v("\n              "+e._s(e.node.fingerbank.device_fq)+"\n            ")]),e._v(" "),n("pf-form-row",{attrs:{label:e.$t("Version")}},[e._v("\n              "+e._s(e.node.fingerbank.version)+"\n            ")]),e._v(" "),n("pf-form-row",{attrs:{label:e.$t("Score")}},[n("b-progress",{staticClass:"mt-1",attrs:{max:100}},[n("b-progress-bar",{attrs:{value:parseFloat(e.node.fingerbank.score),precision:2,variant:e.fbScoreLevel,"show-value":""}})],1)],1),e._v(" "),n("pf-form-row",{attrs:{label:e.$t("Mobile")}},[1===e.node.fingerbank.mobile?n("b-badge",{attrs:{variant:"success"}},[e._v(e._s(e.$t("Yes")))]):0===e.node.fingerbank.mobile?n("b-badge",{attrs:{variant:"danger"}},[e._v(e._s(e.$t("No")))]):n("b-badge",{attrs:{variant:"light"}},[e._v(e._s(e.$t("Unknown")))])],1),e._v(" "),n("pf-form-row",{attrs:{label:e.$t("DHCP Fingerprint")}},[e._v("\n              "+e._s(e.node.dhcp_fingerprint)+"\n            ")]),e._v(" "),n("pf-form-row",{attrs:{label:e.$t("DHCP Vendor")}},[e._v("\n              "+e._s(e.node.device_vendor)+"\n            ")]),e._v(" "),n("pf-form-row",{attrs:{label:e.$t("DHCPv6 Fingerprint")}},[e._v("\n              "+e._s(e.node.dhcp6_fingerprint)+"\n            ")]),e._v(" "),n("pf-form-row",{attrs:{label:e.$t("DHCPv6 Enterprise")}},[e._v("\n              "+e._s(e.node.dhcp6_enterprise)+"\n            ")])],1)],1)],1),e._v(" "),n("b-tab",{attrs:{title:"IPv4 Addresses"}},[e.node.ip4?n("b-table",{attrs:{stacked:"sm",items:e.node.ip4.history,fields:e.iplogFields}}):e._e()],1),e._v(" "),n("b-tab",{attrs:{title:"IPv6 Addresses"}},[e.node.ip6?n("b-table",{attrs:{stacked:"sm",items:e.node.ip6.history,fields:e.iplogFields}}):e._e()],1),e._v(" "),n("b-tab",{attrs:{title:"Location"}},[n("b-table",{attrs:{stacked:"sm",items:e.node.locations,fields:e.locationFields},scopedSlots:e._u([{key:"switch",fn:function(t){return[e._v("\n                  "+e._s(t.item.switch_ip)+" / "+e._s(t.item.switch_mac)),n("br"),e._v(" "),n("b-badge",[n("icon",{attrs:{name:"wifi",size:"sm"}}),e._v(" "+e._s(t.item.ssid))],1),e._v(" "),n("b-badge",[e._v(e._s(e.$t("Role"))+": "+e._s(t.item.role))]),e._v(" "),n("b-badge",[e._v(e._s(e.$t("VLAN"))+": "+e._s(t.item.vlan))])]}},{key:"connection_type",fn:function(t){return[e._v("\n                  "+e._s(t.item.connection_type)+" "+e._s(e.connectionSubType(t.item.connection_sub_type))+"\n              ")]}}])})],1),e._v(" "),n("b-tab",{attrs:{title:"Violations"}},[n("b-table",{attrs:{stacked:"sm",items:e.node.violations,fields:e.violationFields},scopedSlots:e._u([{key:"description",fn:function(t){return[e._v("\n                  "+e._s(e.violationDescription(t.item.vid))+"\n              ")]}}])})],1),e._v(" "),n("b-tab",{attrs:{title:"WMI Rules"}}),e._v(" "),n("b-tab",{attrs:{title:"Option82"}})],1),e._v(" "),n("b-card-footer",{attrs:{align:"right"},on:{mouseenter:function(t){e.$v.nodeContent.$touch()}}},[n("b-button",{directives:[{name:"t",rawName:"v-t",value:"Delete",expression:"'Delete'"}],staticClass:"mr-1",attrs:{variant:"outline-danger",disabled:e.isLoading},on:{click:function(t){e.deleteNode()}}}),e._v(" "),n("b-button",{directives:[{name:"t",rawName:"v-t",value:"Save",expression:"'Save'"}],attrs:{variant:"outline-primary",type:"submit",disabled:e.invalidForm}})],1)],1)],1)},staticRenderFns:[]},p=n("VU/8")(m,f,!1,null,null,null);t.default=p.exports},o2U4:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=n("zp2a"),o=n("DAYN"),i=n.n(o),a=n("kL7M"),r=n("ESwS").validationMixin,l=n("+cKO"),c=l.macAddress,d=l.required,u={name:"NodesCreate",components:{draggable:i.a,"pf-form-input":s.a},mixins:[r],data:function(){return{modeIndex:0,single:{mac:"",status:"reg",unreg_time:"00:00:00"},csv:{file:null,delimiter:"comma",delimiters:[{value:"comma",text:"Comma"},{value:"semicolon",text:"Semicolon"},{value:"tab",text:"Tab"}],voip:null,columns:[{value:"1",name:"mac",text:"MAC Address"},{value:"0",name:"owner",text:"Owner"},{value:"0",name:"role",text:"Role"},{value:"0",name:"unregdate",text:"Unregistration Date"}]}}},validations:{single:{mac:{macAddress:c(),required:d}},csv:{file:{required:d}}},computed:{statuses:function(){return a.d[a.b.NODE_STATUS]},roles:function(){return this.$store.getters["config/rolesList"]},isLoading:function(){return this.$store.getters["$_nodes/isLoading"]},invalidForm:function(){return 0===this.modeIndex&&(this.$v.single.$invalid||this.isLoading)}},methods:{create:function(){var e=this;0===this.modeIndex&&this.$store.dispatch("$_nodes/createNode",this.single).then(function(e){console.debug("node created")}).catch(function(t){console.debug(t),console.debug(e.$store.state.$_nodes.message)})}},created:function(){this.$store.dispatch("config/getRoles")}},v={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("b-card",{attrs:{"no-body":""}},[n("b-card-header",[n("h4",{directives:[{name:"t",rawName:"v-t",value:"Create Nodes",expression:"'Create Nodes'"}],staticClass:"mb-0"})]),e._v(" "),n("b-tabs",{attrs:{card:""},model:{value:e.modeIndex,callback:function(t){e.modeIndex=t},expression:"modeIndex"}},[n("b-tab",{attrs:{title:e.$t("Single")}},[n("b-form",{on:{submit:function(t){t.preventDefault(),e.create()}}},[n("b-form-row",{attrs:{"align-v":"center"}},[n("b-col",{attrs:{sm:"8"}},[n("pf-form-input",{attrs:{label:"MAC",validation:e.$v.single.mac,"invalid-feedback":"Enter a valid MAC address"},model:{value:e.single.mac,callback:function(t){e.$set(e.single,"mac",t)},expression:"single.mac"}}),e._v(" "),n("pf-form-input",{attrs:{label:"Owner",placeholder:"default",validation:"$v.single.pid"},model:{value:e.single.pid,callback:function(t){e.$set(e.single,"pid",t)},expression:"single.pid"}}),e._v(" "),n("b-form-group",{attrs:{horizontal:"","label-cols":"3",label:e.$t("Status")}},[n("b-form-select",{attrs:{options:e.statuses},model:{value:e.single.status,callback:function(t){e.$set(e.single,"status",t)},expression:"single.status"}})],1),e._v(" "),n("b-form-group",{attrs:{horizontal:"","label-cols":"3",label:e.$t("Role")}},[n("b-form-select",{attrs:{options:e.roles},model:{value:e.single.category,callback:function(t){e.$set(e.single,"category",t)},expression:"single.category"}})],1),e._v(" "),n("b-form-group",{attrs:{horizontal:"","label-cols":"3",label:e.$t("Unregistration")}},[n("b-form-row",[n("b-col",[n("b-form-input",{attrs:{type:"date"},model:{value:e.single.unreg_date,callback:function(t){e.$set(e.single,"unreg_date",t)},expression:"single.unreg_date"}})],1),e._v(" "),n("b-col",[n("b-form-input",{attrs:{type:"time"},model:{value:e.single.unreg_time,callback:function(t){e.$set(e.single,"unreg_time",t)},expression:"single.unreg_time"}})],1)],1)],1)],1),e._v(" "),n("b-col",{attrs:{sm:"4"}},[n("b-form-textarea",{attrs:{placeholder:e.$t("Notes"),rows:"8","max-rows":"12"},model:{value:e.single.notes,callback:function(t){e.$set(e.single,"notes",t)},expression:"single.notes"}})],1)],1)],1)],1),e._v(" "),n("b-tab",{attrs:{title:e.$t("Import")}},[n("b-form",[n("b-form-group",{attrs:{horizontal:"","label-cols":"3",label:"CSV File"}},[n("b-form-file",{attrs:{accept:"text/*","choose-label":"Choose a file"},model:{value:e.csv.file,callback:function(t){e.$set(e.csv,"file",t)},expression:"csv.file"}})],1),e._v(" "),n("b-form-group",{attrs:{horizontal:"","label-cols":"3",label:"Column Delimiter"}},[n("b-form-select",{attrs:{options:e.csv.delimiters},model:{value:e.csv.delimiter,callback:function(t){e.$set(e.csv,"delimiter",t)},expression:"csv.delimiter"}})],1),e._v(" "),n("b-form-group",{attrs:{horizontal:"","label-cols":"3",label:"Default Voice Over IP"}},[n("b-form-checkbox",{attrs:{value:"yes"},model:{value:e.csv.voip,callback:function(t){e.$set(e.csv,"voip",t)},expression:"csv.voip"}})],1),e._v(" "),n("b-row",[n("b-col",{attrs:{sm:"3"}},[e._v(e._s(e.$t("Columns Order")))]),e._v(" "),n("b-col",[n("draggable",{attrs:{options:{handle:".draggable-handle"}},model:{value:e.csv.olumns,callback:function(t){e.$set(e.csv,"olumns",t)},expression:"csv.olumns"}},e._l(e.csv.columns,function(t,s){return n("div",{key:t.name,staticClass:"draggable-item"},[n("span",{staticClass:"draggable-handle"},[e._v(e._s(s))]),e._v(" "),n("b-form-checkbox",{attrs:{value:"1"},model:{value:t.value,callback:function(n){e.$set(t,"value",n)},expression:"column.value"}},[e._v(e._s(t.text))])],1)}))],1)],1)],1)],1)],1),e._v(" "),n("b-card-footer",{attrs:{align:"right"},on:{mouseenter:function(t){e.$v.$touch()}}},[n("b-button",{attrs:{variant:"outline-primary",disabled:e.invalidForm},on:{click:function(t){e.create()}}},[n("icon",{directives:[{name:"show",rawName:"v-show",value:e.isLoading,expression:"isLoading"}],attrs:{name:"circle-notch",spin:""}}),e._v(" "+e._s(e.$t("Create"))+"\n    ")],1)],1)],1)},staticRenderFns:[]},b=n("VU/8")(u,v,!1,null,null,null);t.default=b.exports}});
//# sourceMappingURL=0.941ec5251dcef8645cea.js.map