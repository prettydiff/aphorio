
import dashboard from "../dashboard.ts";

const ui_test_performance = function ui_test_performance():void {
    const test_performance:section_test_performance = {
        events: {
            submit: function dashboard_sections_testPerformance_submit():void {
                    const numeric = function dashboard_sections_testPerformance_numeric(value:number, baseline:number, port:boolean):number {
                        if (isNaN(value) === true || (port === true && (value < 1 || value > 65535))) {
                            value = baseline;
                        } else {
                            value = Math.floor(value);
                        }
                        return value;
                    },
                    service:services_test_performance_input = {
                        body: dashboard.sections["test-performance"].nodes.body.value,
                        encryption: (dashboard.sections["test-performance"].nodes.encrypt_true.checked === true),
                        location: dashboard.sections["test-performance"].nodes.connect_address.value,
                        port: Number(dashboard.sections["test-performance"].nodes.connect_port.value),
                        quantity_tests: Number(dashboard.sections["test-performance"].nodes.quantity_tests.value),
                        quantity_transmit: Number(dashboard.sections["test-performance"].nodes.quantity_transmit.value),
                        type: (dashboard.sections["test-performance"].nodes.type_http.checked === true)
                            ? "http"
                            : "websocket"
                    };
                service.port = numeric(service.port, (service.encryption === true) ? 443 : 80, true);
                service.quantity_tests = numeric(service.quantity_tests, 10, false);
                service.quantity_transmit = numeric(service.quantity_transmit, 1000, false);
                dashboard.message.send({
                    data: service,
                    service: "services_test_performance_input"
                });
            }
        },
        init: function dashboard_sections_testPerformance_init():void {
            dashboard.sections["test-performance"].nodes.button_execute.onclick = dashboard.sections["test-performance"].events.submit;
            if (dashboard.global.state.test_performance !== undefined) {
                dashboard.sections["test-performance"].nodes.body.onblur = dashboard.utility.setState;
                dashboard.sections["test-performance"].nodes.connect_address.onblur = dashboard.utility.setState;
                dashboard.sections["test-performance"].nodes.connect_port.onblur = dashboard.utility.setState;
                dashboard.sections["test-performance"].nodes.encrypt_false.onclick = dashboard.utility.setState;
                dashboard.sections["test-performance"].nodes.encrypt_true.onclick = dashboard.utility.setState;
                dashboard.sections["test-performance"].nodes.quantity_tests.onblur = dashboard.utility.setState;
                dashboard.sections["test-performance"].nodes.quantity_transmit.onblur = dashboard.utility.setState;
                dashboard.sections["test-performance"].nodes.type_http.onclick = dashboard.utility.setState;
                dashboard.sections["test-performance"].nodes.type_websocket.onclick = dashboard.utility.setState;
                dashboard.sections["test-performance"].nodes.body.value = dashboard.global.state.test_performance.body;
                dashboard.sections["test-performance"].nodes.connect_address.value = dashboard.global.state.test_performance.connect_address;
                dashboard.sections["test-performance"].nodes.connect_port.value = String(dashboard.global.state.test_performance.connect_port);
                if (dashboard.global.state.test_performance.encryption === true) {
                    dashboard.sections["test-performance"].nodes.encrypt_true.checked = true;
                } else {
                    dashboard.sections["test-performance"].nodes.encrypt_false.checked = true;
                }
                dashboard.sections["test-performance"].nodes.quantity_tests.value = String(dashboard.global.state.test_performance.quantity_tests);
                dashboard.sections["test-performance"].nodes.quantity_transmit.value = String(dashboard.global.state.test_performance.quantity_transmit);
                if (dashboard.global.state.test_performance.type === "http") {
                    dashboard.sections["test-performance"].nodes.type_http.checked = true;
                } else {
                    dashboard.sections["test-performance"].nodes.type_websocket.checked = true;
                }
            }
        },
        nodes: {
            body: document.getElementById("test-performance").getElementsByClassName("table-filters")[0].getElementsByTagName("textarea")[0] as HTMLTextAreaElement,
            button_execute: document.getElementById("test-performance").getElementsByClassName("table-filters")[0].getElementsByTagName("button")[0],
            connect_address: document.getElementById("test-performance").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[4],
            connect_port: document.getElementById("test-performance").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[5],
            encrypt_false: document.getElementById("test-performance").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[3],
            encrypt_true: document.getElementById("test-performance").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[2],
            quantity_tests: document.getElementById("test-performance").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[7],
            quantity_transmit: document.getElementById("test-performance").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[6],
            type_http: document.getElementById("test-performance").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[0],
            type_websocket: document.getElementById("test-performance").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[1]
        },
        receive: function dashboard_sections_testPerformance_receive(socket_data:socket_data):void {
            const data:services_test_performance_output = socket_data.data as services_test_performance_output,
                list:HTMLCollectionOf<HTMLElement> = document.getElementById("test-performance").getElementsByClassName("summary-stats")[0].getElementsByTagName("strong");
            list[0].textContent = data.quantity_transmit.commas();
            list[1].textContent = data.quantity_tests.commas();
            list[2].textContent = `${data.message_size.commas()} bytes`;
            list[3].textContent = `${(data.time / 1e9).commas()} seconds`;
            list[4].textContent = data.type;
            list[5].textContent = `${(data.min / 1e9).commas()} seconds`;
            list[6].textContent = `${(data.average / 1e9).commas()} seconds`;
            list[7].textContent = `${(data.max / 1e9).commas()} seconds`;
            list[8].textContent = `\u00b1${(data.variance / 1e9).toFixed(9).replace(/0+$/, "")} seconds`;
        },
        tools: {}
    };
    dashboard.sections["test-performance"] = test_performance;
};

export default ui_test_performance;