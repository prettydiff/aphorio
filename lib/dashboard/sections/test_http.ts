

import dashboard from "../dashboard.ts";

const ui_test_http = function ui_test_http():void {
    const test_http:section_test_http = {
        events: {
            request: function dashboard_sections_http_request():void {
                const encryption:boolean = dashboard.sections["test-http"].nodes.encryption.checked,
                    timeout:number = Number(dashboard.sections["test-http"].nodes.timeout.value),
                    data:services_http_test = {
                        body: "",
                        encryption: encryption,
                        headers: dashboard.sections["test-http"].nodes.request.value,
                        stats: null,
                        timeout: (isNaN(timeout) === true || timeout < 0)
                            ? 0
                            : Math.floor(timeout),
                        uri: ""
                    },
                    strong:HTMLCollectionOf<HTMLElement> = dashboard.sections["test-http"].nodes.stats.getElementsByTagName("strong");
                dashboard.utility.setState();
                dashboard.message.send({data: data, service: "services_http_test"});
                dashboard.sections["test-http"].nodes.responseBody.value = "";
                dashboard.sections["test-http"].nodes.responseHeaders.value = "";
                dashboard.sections["test-http"].nodes.responseURI.value = "";
                strong[0].textContent = "";
                strong[1].textContent = "";
                strong[2].textContent = "";
                strong[3].textContent = "";
                strong[4].textContent = "";
                strong[5].textContent = "";
                strong[6].textContent = "";
                strong[7].textContent = "";
            }
        },
        init: function dashboard_sections_http_init():void {
            // populate a default HTTP test value
            dashboard.sections["test-http"].nodes.request.value = (dashboard.global.state.http === null || dashboard.global.state.http === undefined || typeof dashboard.global.state.http.request !== "string" || dashboard.global.state.http.request === "")
                ? dashboard.global.payload.http_request
                : dashboard.global.state.http.request;
            dashboard.sections["test-http"].nodes.http_request.onclick = dashboard.sections["test-http"].events.request;
            dashboard.sections["test-http"].nodes.responseBody.value = "";
            dashboard.sections["test-http"].nodes.responseHeaders.value = "";
            dashboard.sections["test-http"].nodes.responseURI.value = "";
            if (dashboard.global.state.http !== null && dashboard.global.state.http !== undefined && dashboard.global.state.http.encryption === true) {
                document.getElementById("test-http").getElementsByTagName("input")[1].checked =  true;
            } else {
                document.getElementById("test-http").getElementsByTagName("input")[0].checked =  true;
            }
        },
        nodes: {
            encryption: document.getElementById("test-http").getElementsByTagName("input")[1],
            http_request: document.getElementById("test-http").getElementsByClassName("send_request")[0] as HTMLButtonElement,
            request: document.getElementById("test-http").getElementsByTagName("textarea")[0],
            responseBody: document.getElementById("test-http").getElementsByTagName("textarea")[3],
            responseHeaders: document.getElementById("test-http").getElementsByTagName("textarea")[2],
            responseURI: document.getElementById("test-http").getElementsByTagName("textarea")[1],
            stats: document.getElementById("test-http").getElementsByClassName("summary-stats")[0] as HTMLElement,
            timeout: document.getElementById("test-http").getElementsByTagName("input")[2]
        },
        receive: function dashboard_sections_http_receive(data_item:socket_data):void {
            const data:services_http_test = data_item.data as services_http_test,
                strong:HTMLCollectionOf<HTMLElement> = dashboard.sections["test-http"].nodes.stats.getElementsByTagName("strong");
            dashboard.sections["test-http"].nodes.responseBody.value = data.body;
            dashboard.sections["test-http"].nodes.responseHeaders.value = data.headers;
            dashboard.sections["test-http"].nodes.responseURI.value = data.uri;
            // round trip time
            strong[0].textContent = `${data.stats.time} seconds`;
            // response header size
            strong[1].textContent = data.stats.response.size_header.bytesLong();
            // response body size
            strong[2].textContent = data.stats.response.size_body.bytesLong();
            // chunked?
            strong[3].textContent = String(data.stats.chunks.chunked);
            // chunk count
            strong[4].textContent = data.stats.chunks.count.commas();
            // request header size
            strong[5].textContent = data.stats.request.size_header.bytesLong();
            // request body size
            strong[6].textContent = data.stats.request.size_body.bytesLong();
            // URI length
            strong[7].textContent = `${JSON.parse(data.uri.replace(/\s+"/g, "\"")).absolute.length.commas()} characters`;
        },
        tools: null
    };
    dashboard.sections["test-http"] = test_http;
};

export default ui_test_http;