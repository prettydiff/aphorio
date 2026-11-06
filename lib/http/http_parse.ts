
import message_inspection from "../services/message_inspection.ts";
import vars from "../core/vars.ts";

const http_parse = function http_parse(server_id:string, port:number, data:Buffer):config_http {
    const dataString:string = data.toString("utf-8"),
        server:supplemental_server = (server_id === null || server_id === undefined || vars.data.server[server_id] === undefined)
            ? null
            : vars.data.server[server_id],
        headerIndex:number = dataString.replace(/^\s+/, "").indexOf("\r\n\r\n"),
        headerString:string = (headerIndex > 0)
            ? dataString.replace(/^\s+/, "").slice(0, headerIndex)
            : dataString.replace(/^\s+/, ""),
        list:string[] = headerString.split("\r\n"),
        list0:string[] = list[0].split(" "),
        query:number = (list0.length > 1)
            ? list0[1].indexOf("?")
            :-1,
        fragment:number = (list0.length > 1)
            ? list0[1].indexOf("#")
            : -1,
        encrypted:boolean = (server === null)
            ? true
            : (server.ports.secure === port),
        config:config_http = {
            accept: "",
            body: null,
            domain: "",
            encryption: (encrypted === true)
                ? "secure"
                : "open",
            fragment: "",
            headers: list,
            host_index: 0,
            http_test: false,
            http_upgrade: false,
            method: list[0].slice(0, list[0].indexOf(" ")).toLowerCase() as type_http_method,
            origin: "",
            port: 0,
            proxy_type: "none",
            query: "",
            range: "",
            referrer: "",
            resource: list[0].slice(list[0].replace(/ +/, " ").indexOf(" ") + 1).replace(/\s+HTTP\/\d(\.\d)?/, ""),
            resource_absolute: "",
            resource_size: 0,
            resource_type: "other",
            response_type: 0,
            timeout: 10000,
            user_agent: "",
            websocket_key: "",
            websocket_nonce: "",
            websocket_type: ""
        },
        get_domain = function http_parse_getDomain(header:string):void {
            const sIndex:number = header.indexOf("]"),
                index:number = header.indexOf(":"),
                host:string = (index > 0)
                    ? header.slice(0, index)
                    : header;
            if (header.indexOf("[") === 0 && sIndex > 0) {
                config.domain = header.slice(1, sIndex);
            } else if ((/:\d+$/).test(header) === true) {
                config.domain = host;
            } else {
                config.domain = host;
            }
            config.origin = header.replace(/:80$/, "").replace(/:443$/, ".secure");
        },
        pair = function http_parse_pair(input:string):[string, string] {
            return [input.slice(0, input.indexOf(":")).trim().toLowerCase(), input.slice(input.indexOf(":") + 1).trim()];
        };
    list.forEach(function http_parse_each(header:string, index:number):void {
        const values:[string, string] = pair(header);
        if (values[0] === "sec-websocket-key") {
            config.websocket_key = values[1] + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
        } else if (values[0] === "accept") {
            config.accept = values[1];
        } else if (values[0] === "host") {
            get_domain(values[1]);
            config.host_index = index;
        } else if (values[0] === "range") {
            config.range = values[1];
        } else if (values[0] === "referer:") {
            config.referrer = values[1];
        } else if (values[0] === "sec-websocket-protocol") {
            config.websocket_nonce = header;
            config.websocket_type = values[1];
        } else if (values[0] === "connection" && values[1] === "close") {
            config.timeout = 0;
        } else if (values[0] === "transfer-encoding" && values[1] === "chunked") {
            config.response_type = -1;
        } else if (values[0] === "content-length" && (/^\d+$/).test(values[1]) === true) {
            config.response_type = Number(values[1]);
        } else if (values[0] === "keep-alive" && typeof values[1] === "string" && (/timeout=\d+/).test(values[1]) === true) {
            let times:string = values[1].split("timeout=")[1].replace(/\s+/g, "");
            if (times.includes(",") === true) {
                times = times.split(",")[0];
            }
            if (config.timeout > 0) {
                config.timeout = Number(times);
            }
        } else if (values[0] === "user-agent") {
            let ua:string[] = [];
            ua[0] = values[1].slice(values[1].indexOf("(") + 1, values[1].indexOf(")"));
            ua = ua[0].split(";");
            config.user_agent = `${ua[0]}, ${ua[1]}, ${config.user_agent.slice(config.user_agent.lastIndexOf(")") + 2)}`;
        } else if (values[0] === "upgrade-insecure-requests" && encrypted !== true && server !== null && server.config.upgrade === true && server.ports.secure > 0) {
            config.http_upgrade = true;
        } else if (values[0] === "services_http_test") {
            config.http_test = true;
        }
    });
    if (fragment > 0) {
        config.fragment = config.resource.slice(fragment + 1);
        config.resource = config.resource.slice(0, fragment);
    }
    if (query > 0) {
        config.query = config.resource.slice(query + 1);
        config.resource = config.resource.slice(0, query);
    }
    config.resource = (config.resource === "/")
        ? "/"
        : config.resource.replace(/\/$/, "");
    if (config.method === "get" && server_id === vars.id.dashboard_server && config.resource === "/") {
        if (config.websocket_key === "") {
            vars.environment.request_http = headerString;
        } else {
            vars.environment.request_ws = headerString;
        }
    }
    if (headerIndex > 1) {
        config.body = data.subarray(Buffer.byteLength(headerString) + 4);
    }
    if (server_id === vars.id.dashboard_server) {
        vars.environment.dashboard_page.replace("request: \"\"", `request: \`${headerString}\``);
    }
    if (config.http_upgrade === true && config.http_test === true) {
        config.http_upgrade = false;
    }
    config.port = port;
    message_inspection.send({
        count: 0,
        direction: "in",
        maximum_size: 0,
        message: dataString,
        service: server_id,
        throttle_size: 0,
        throttle_time: 0,
        type: "web-server"
    });
    return config;
};

export default http_parse;