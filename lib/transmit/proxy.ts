
 //
 // matching - precedence: (expand to all parts of uri - 3986)
 // 0. number of matching criteria
 // 1. domain
 // 2. port
 // 3. origin
 // 4. resource
 //
 // to:
 // domain
 // resource
 // encryption

 const proxy = function transmit_proxy(config:config_http, server:supplemental_server_config):void {
    // legacy asset redirection
    if (server.proxy !== null && server.proxy !== undefined) {
        const matches:[number, number, string][] = [],
            resource_match = function transmit_proxy_resourceMatch(rule:string, index:number):void {
                rule = rule.trim();
                const wildcard:boolean = (/\/\*$/).test(rule) === true;
                if (rule === "" || config.resource === rule) {
                    count = count + 1;
                    matches.push([index, count, rule]);
                } else if (wildcard === true && config.resource.indexOf(rule.replace(/\/\*$/, "")) === 0) {
                    count = count + 1;
                    matches.push([index, count, rule]);
                } else {
                    matches.push([index, count, ""]);
                }
            },
            len:number = server.proxy.length;
        let index:number = 0,
            count:number = 0;
        // grade matching rule sets to determine the best rule set to apply
        if (len > 0) {
            do {
                count = 0;
                if (server.proxy[index].incoming.port === 0 || server.proxy[index].incoming.port === config.port) {
                    count = count + 1;
                }
                if (server.proxy[index].incoming.domain === "" || server.proxy[index].incoming.domain === config.domain) {
                    count = count + 1;
                }
                if (server.proxy[index].incoming.encryption === "both" || (server.proxy[index].incoming.encryption === config.encryption)) {
                    count = count + 1;
                }
                if (server.proxy[index].incoming.port === config.port) {
                    count = count + 1;
                }
                resource_match(server.proxy[index].incoming.resource, index);
                index = index + 1;
            } while (index < len);
        }

        // use sorting to filter the best rule
        if (matches.length > 0) {
            matches.sort(function transmit_proxy_sort(a:[number, number, string], b:[number, number, string]):-1|0|1 {
                // greatest matches
                if (a[1] > b[1]) {
                    return -1;
                }
                // preference the rule without a wildcard resource match if both rule sets have the a 
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
            });
        }
    }
 };

 export default proxy;