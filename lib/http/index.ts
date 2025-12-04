
import http_connect from "./http_connect.ts";
import http_get from "./http_get.ts";
import http_options from "./http_options.ts";
import http_trace from "./http_trace.ts";

const http:services_http = {
    connect: http_connect,
    get: http_get,
    head: http_get,
    options: http_options,
    trace: http_trace
};

export default http;