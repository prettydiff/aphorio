

import dashboard from "../dashboard.ts";
// cspell: words TLSA

const ui_dns_query = function ui_dns_query():void {
    const dns_query:section_dns_query = {
        events: {
            directionEvent: function dashboard_sections_dnsQuery_directionEvent(event:MouseEvent):void {
                dashboard.sections["dns-query"].tools.direction(event.target === dashboard.sections["dns-query"].nodes.reverse);
            },
            query: function dashboard_sections_dnsQuery_query(event:KeyboardEvent|MouseEvent):void {
                const target:HTMLElement = event.target,
                    key:KeyboardEvent = event as KeyboardEvent;
                if (target === dashboard.sections["dns-query"].nodes.query || (target !== dashboard.sections["dns-query"].nodes.query && key.key === "Enter")) {
                    const hosts_values:string[] = dashboard.sections["dns-query"].nodes.hosts.value.replace(/,\s+/g, ",").split(","),
                        types_value:string = dashboard.sections["dns-query"].nodes.types.value,
                        payload:services_dns_input = {
                            names: hosts_values,
                            reverse: dashboard.sections["dns-query"].nodes.reverse.checked,
                            types: types_value
                        };
                    dashboard.utility.setState();
                    dashboard.message.send({data: payload, service: "services_dns_input"});
                    dashboard.sections["dns-query"].nodes.output.value = "";
                }
            }
        },
        init: function dashboard_sections_dnsQuery_init():void {
            dashboard.sections["dns-query"].nodes.query.onclick = dashboard.sections["dns-query"].events.query;
            dashboard.sections["dns-query"].nodes.output.value = "";
            dashboard.sections["dns-query"].nodes.lookup.checked = true;
            if (dashboard.global.state.dns !== undefined && dashboard.global.state.dns !== null) {
                dashboard.sections["dns-query"].nodes.reverse.checked = dashboard.global.state.dns.reverse;
                dashboard.sections["dns-query"].nodes.hosts.value = dashboard.global.state.dns.hosts;
                dashboard.sections["dns-query"].nodes.types.value = dashboard.global.state.dns.types;
            }
            dashboard.sections["dns-query"].nodes.hosts.onkeyup = dashboard.sections["dns-query"].events.query;
            dashboard.sections["dns-query"].nodes.types.onkeyup = dashboard.sections["dns-query"].events.query;
            dashboard.sections["dns-query"].nodes.lookup.onclick = dashboard.sections["dns-query"].events.directionEvent;
            dashboard.sections["dns-query"].nodes.reverse.onclick = dashboard.sections["dns-query"].events.directionEvent;
            dashboard.sections["dns-query"].tools.direction(dashboard.global.state.dns.reverse);
        },
        nodes: {
            hosts: document.getElementById("dns-query").getElementsByTagName("input")[2],
            lookup: document.getElementById("dns-query").getElementsByTagName("input")[0],
            output: document.getElementById("dns-query").getElementsByTagName("textarea")[0],
            query: document.getElementById("dns-query").getElementsByTagName("button")[1],
            reverse: document.getElementById("dns-query").getElementsByTagName("input")[1],
            types: document.getElementById("dns-query").getElementsByTagName("input")[3]
        },
        receive: function dashboard_sections_dnsQuery_receive(data_item:socket_data):void {
            const reverse:services_dns_reverse = data_item.data as services_dns_reverse;
            if (reverse.reverse === true) {
                const keys:string[] = Object.keys(reverse.hostnames),
                    len:number = keys.length;
                if (len > 0) {
                    const output_value:string[] = ["{"];
                    let index_host:number = 0,
                        index_address:number = 0,
                        len_address:number = 0,
                        comma_address:string = "",
                        comma_host:string = "";
                    do {
                        len_address = reverse.hostnames[keys[index_host]].length;
                        comma_host = (index_host < len - 1)
                            ? ","
                            : "";
                        if (len_address === 0) {
                            output_value.push(`    "${keys[index_host]}": []${comma_host}`);
                        } else if (len_address === 1) {
                            output_value.push(`    "${keys[index_host]}": ["${reverse.hostnames[keys[index_host]][0]}"]${comma_host}`);
                        } else {
                            index_address = 0;
                            output_value.push(`    "${keys[index_host]}": [`);
                            do {
                                comma_address = (index_address < len_address - 1)
                                    ? ","
                                    : "";
                                output_value.push(`        "${reverse.hostnames[keys[index_host]][index_address]}"${comma_address}`);
                                index_address = index_address + 1;
                            } while (index_address < len_address);
                            output_value.push(`    ]${comma_host}`);
                        }
                        index_host = index_host + 1;
                    } while (index_host < len);
                    output_value.push("}");
                    dashboard.sections["dns-query"].nodes.output.value = output_value.join("\n");
                } else {
                    dashboard.sections["dns-query"].nodes.output.value = "{}";
                }
            } else {
                const result:services_dns_output = data_item.data as services_dns_output,
                    hosts:string[] = Object.keys(result),
                    len_hosts:number = hosts.length;
                if (len_hosts > 0) {
                    const output_value:string[] = ["{"],
                        sort = function dashboard_sections_dnsQuery_receive_sort(a:string, b:string):-1|1 {
                            if (a < b) {
                                return -1;
                            }
                            return 1;
                        },
                        types:type_dns_types[] = Object.keys(result[hosts[0]]) as type_dns_types[],
                        len_types:number = types.length,
                        get_max = function dashboard_sections_dnsQuery_receive_getMax(input:string[]):number {
                            let index_input:number = input.length,
                                max:number = 0;
                            do {
                                index_input = index_input - 1;
                                if (input[index_input].length > max) {
                                    max = input[index_input].length;
                                }
                            } while (index_input > 0);
                            return max;
                        },
                        max_type:number = get_max(types),
                        pad = function dashboard_sections_dnsQuery_receive_pad(input:string, max:number):string {
                            input = `"${input}"`;
                            max = max + 2;
                            if (input.length === max) {
                                return input;
                            }
                            do {
                                input = `${input} `;
                            } while (input.length < max);
                            return input;
                        },
                        object = function dashboard_sections_dnsQuery_receive_object(object:node_dns_soaRecord, soa:boolean):void {
                            const indent:string = (soa === true)
                                    ? ""
                                    : "    ",
                                obj:string[] = Object.keys(object),
                                len_obj:number = obj.length,
                                max_obj:number = get_max(obj);
                            let index_obj:number = 0;
                            obj.sort();
                            if (soa === true) {
                                output_value.push(`        ${pad("SOA", max_type)}: {`);
                            } else {
                                output_value.push("            {");
                            }
                            do {
                                if (isNaN(Number(object[obj[index_obj] as "hostmaster"])) === true) {
                                    output_value.push(`            ${indent + pad(obj[index_obj], max_obj)}: "${object[obj[index_obj] as "hostmaster"]}",`);
                                } else {
                                    output_value.push(`            ${indent + pad(obj[index_obj], max_obj)}: ${object[obj[index_obj] as "hostmaster"]},`);
                                }
                                index_obj = index_obj + 1;
                            } while (index_obj < len_obj);
                            output_value[output_value.length - 1] = output_value[output_value.length - 1].slice(0, output_value[output_value.length - 1].length - 1);
                            output_value.push(`${indent}        },`);
                        };
                    let index_hosts:number = 0,
                        index_types:number = 0,
                        index_object:number = 0,
                        len_object:number = 0,
                        record_string:string[] = null,
                        record_strings:string[][] = null,
                        record_object:node_dns_soaRecord[] = null;
                    types.sort(sort);
                    // beautification, loop through hostnames
                    do {
                        output_value.push(`    "${hosts[index_hosts]}": {`);
                        index_types = 0;
                        // loop through type names on each hostname
                        do {
                            // SOA object
                            if (types[index_types] === "SOA" && Array.isArray(result[hosts[index_hosts]].SOA) === false) {
                                object(result[hosts[index_hosts]].SOA as node_dns_soaRecord, true);
                            // array of objects
                            } else if ((types[index_types] === "CAA" || types[index_types] === "MX" || types[index_types] === "NAPTR" || types[index_types] === "SRV" || types[index_types] === "TLSA")) {
                                record_object = result[hosts[index_hosts]][types[index_types]] as node_dns_soaRecord[];
                                len_object = record_object.length;
                                if (len_object < 1) {
                                    output_value.push(`        ${pad(types[index_types], max_type)}: [],`);
                                } else if (typeof record_object[0] === "string") {
                                    output_value.push(`        ${pad(types[index_types], max_type)}: ["${record_object[0]}"],`);
                                } else {
                                    output_value.push(`        ${pad(types[index_types], max_type)}: [`);
                                    index_object = 0;
                                    if (len_object > 0) {
                                        // loop through keys of each child object of an array
                                        do {
                                            object(record_object[index_object] as node_dns_soaRecord, false);
                                            index_object = index_object + 1;
                                        } while (index_object < len_object);
                                        output_value[output_value.length - 1] = output_value[output_value.length - 1].slice(0, output_value[output_value.length - 1].length - 1);
                                    }
                                    output_value.push("        ],");
                                }
                            // string[][]
                            } else if (types[index_types] === "TXT") {
                                record_strings = result[hosts[index_hosts]].TXT as string[][];
                                len_object = record_strings.length;
                                if (len_object < 1) {
                                    output_value.push(`        ${pad(types[index_types], max_type)}: [],`);
                                } else if (Array.isArray(record_strings[0]) === false) {
                                    output_value.push(`        ${pad(types[index_types], max_type)}: ["${record_strings.join("")}"],`);
                                } else {
                                    output_value.push(`        ${pad(types[index_types], max_type)}: [`);
                                    index_object = 0;
                                    // loop through string array of a parent array
                                    do {
                                        output_value.push(`            ["${record_strings[index_object].join("\", \"")}"],`);
                                        index_object = index_object + 1;
                                    } while (index_object < len_object);
                                    output_value[output_value.length - 1] = output_value[output_value.length - 1].slice(0, output_value[output_value.length - 1].length - 1);
                                    output_value.push("        ],");
                                }
                            // string[]
                            } else {
                                record_string = (result[hosts[index_hosts]][types[index_types]] as string[]);
                                if (record_string.length < 1) {
                                    output_value.push(`        ${pad(types[index_types], max_type)}: [],`);
                                } else {
                                    output_value.push(`        ${pad(types[index_types], max_type)}: ["${record_string.join("\", \"")}"],`);
                                }
                            }
                            index_types = index_types + 1;
                        } while (index_types < len_types);
                        output_value[output_value.length - 1] = output_value[output_value.length - 1].slice(0, output_value[output_value.length - 1].length - 1);
                        output_value.push("    },");
                        index_hosts = index_hosts + 1;
                    } while (index_hosts < len_hosts);
                    output_value[output_value.length - 1] = output_value[output_value.length - 1].slice(0, output_value[output_value.length - 1].length - 1);
                    output_value.push("}");
                    dashboard.sections["dns-query"].nodes.output.value = output_value.join("\n");
                } else {
                    dashboard.sections["dns-query"].nodes.output.value = "{}";
                }
            }
        },
        tools: {
            direction: function dashboard_sections_dnsQuery_direction(reverse:boolean|string):void {
                const label:Node = dashboard.sections["dns-query"].nodes.hosts.parentNode.firstChild;
                if (reverse === true) {
                    label.textContent = "Comma separated list of IP addresses ";
                    dashboard.sections["dns-query"].nodes.types.disabled = true;
                } else {
                    label.textContent = "Comma separated list of domains and/or hostname entries ";
                    dashboard.sections["dns-query"].nodes.types.disabled = false;
                }
            }
        }
    };
    dashboard.sections["dns-query"] = dns_query;
};

export default ui_dns_query;