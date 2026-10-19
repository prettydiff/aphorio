
import file from "../utilities/file.ts";
import vars from "../core/vars.ts";

const proxy = function transmit_proxy(config:config_http, server:supplemental_server_config):void {
    // legacy asset redirection
    if (server.proxy !== null && server.proxy !== undefined) {
        const matches:[number, number, string, boolean][] = [],
            resource_match = function transmit_proxy_resourceMatch(resource:string, index:number):void {
                resource = resource.trim();
                const wildcard:boolean = (/\/\*$/).test(resource) === true;
                if (config.resource === resource) {
                    count = count + 1;
                    matches.push([index, count, resource, wildcard]);
                } else if (wildcard === true && config.resource.indexOf(resource.replace(/\/\*$/, "")) === 0) {
                    count = count + 1;
                    matches.push([index, count, resource, wildcard]);
                } else {
                    matches.push([index, count, "", false]);
                }
            },
            len:number = server.proxy.length;
        let index:number = 0,
            count:number = 0;
        // grade matching rule sets to determine the best rule set to apply
        if (len > 0) {
            do {
                count = 0;
                if (server.proxy[index].incoming.port === config.port) {
                    count = count + 1;
                }
                if (server.proxy[index].incoming.domain === config.domain) {
                    count = count + 1;
                }
                if (server.proxy[index].incoming.encryption === "both" || (server.proxy[index].incoming.encryption === config.encryption)) {
                    count = count + 1;
                }
                resource_match(server.proxy[index].incoming.resource, index);
                index = index + 1;
            } while (index < len);
        }

        if (matches.length > 0) {
            // use sorting to filter the best rule
            // 1. sort first by most matching rules
            // 2. preference exact resource matches over wildcard matches
            const index:number = matches.sort(function transmit_proxy_sort(a:[number, number, string, boolean], b:[number, number, string, boolean]):-1|0|1 {
                    // greatest matches
                    if (a[1] > b[1]) {
                        return -1;
                    }
                    // preference the rule without a wildcard resource match if both rule sets have the a resource rule
                    if (a[1] === b[1]) {
                        if (a[2] !== "" && b[2] !== "") {
                            if ((/\/\*$/).test(a[2]) === false && (/\/\*$/).test(b[2]) === true) {
                                return -1;
                            }
                            if ((/\/\*$/).test(a[2]) === false && (/\/\*$/).test(b[2]) === false && a[2].length > b[2].length) {
                                return -1;
                            }
                        }
                        return 0;
                    }
                    return 1;
                })[0][0],
                incoming:supplemental_server_proxy_identity = server.proxy[index].incoming,
                outgoing:supplemental_server_proxy_identity = server.proxy[index].outgoing,
                domain:string = (typeof outgoing.domain === "string" && outgoing.domain !== "")
                    ? outgoing.domain
                    : null,
                port:number = (typeof outgoing.port === "number" && outgoing.port > 0 && outgoing.port < 65536)
                    ? outgoing.port
                    : null,
                resource:string = (typeof outgoing.resource === "string" && outgoing.resource !== "")
                    ? outgoing.resource
                    : null;
            if (typeof incoming.resource === "string" && incoming.resource !== "") {
                // scenario 1 - resource path change
                if (domain === null && port === null && resource !== null) {
                    const wild:boolean = matches[0][3],
                        incoming_path:string = (wild === true)
                            ? incoming.resource.replace(/\/\*$/g, "")
                            : incoming.resource,
                        resource_path:string = (wild === true)
                            ? resource.replace(/(\/|\\)$/, "") + vars.path.sep + config.resource.replace(incoming_path, "").replace(/(\/|\\)/g, vars.path.sep)
                            : resource.replace(/(\/|\\)$/, "") + vars.path.sep;
                    // 1. specific, fs absolute          - outgoing
                    // 2. specific, relative to web root - project_path/servers/server/assets/outgoing
                    // 3. wildcard, fs absolute          - (outgoing + config.resource without match)
                    // 4. wildcard, relative to web root - project_path/servers/server/assets/(outgoing + config.resource without match)
                    file.stat({
                        // fs absolute
                        callback: null,
                        location: resource_path,
                        no_file: function () {
                            // fs relative to web root
                            file.stat({
                                callback: null,
                                location: `${vars.path.process}servers${vars.path.sep + server.id + vars.path.sep}assets${vars.path.sep + resource_path}`,
                                no_file: null,
                                section: "servers-web"
                            });
                        },
                        section: "servers-web"
                    });
                }
            }
        }
    }
 };

 export default proxy;

 // scenarios
 // 0. no matches - do nothing
 // 1. resource path change - match only on resource and output is only a specified resource path
 // 2. redirect specified resource to a proxy - match only on resource and output is a different server
 // 4. proxy encryption only - move tracking to peer server if there is a peer server
 // 3. proxy only - match only on domain and/or port
 // 5. proxy server and resource