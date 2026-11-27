
import performance from "../utilities/performance.ts";
import send from "../transmit/send.ts";
import vars from "../core/vars.ts";

const test_performance = function services_testPerformance(socket_data:socket_data, transmit:transmit_socket):void {
    const input:services_test_performance_input = socket_data.data as services_test_performance_input,
        socket:websocket_client = transmit.socket as websocket_client;
    performance(input, vars.id.dashboard_server, function services_testPerformance_callback(output:services_test_performance_output):void {
        send({
            data: output,
            service: "services_test_performance_output"
        }, socket, 3);
    });
};

export default test_performance;