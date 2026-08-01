
import create_socket from "../transmit/create_socket.ts";
import hash from "../core/hash.ts";
import message_handler from "../transmit/messageHandler.ts";
import send from "../transmit/send.ts";
import vars from "../core/vars.ts";

const test_performance = function services_testPerformance(socket_data:socket_data, transmit:transmit_socket):void {
    let index_test:number = 0,
        time_start:bigint = 0n;
    const data:services_test_performance_input = socket_data.data as services_test_performance_input,
        output:services_test_performance_output = {
            average: 0,
            max: 0,
            message_size: Buffer.from(data.body).byteLength,
            min: 0,
            summary: "",
            quantity_tests: data.quantity_tests,
            quantity_transmit: data.quantity_transmit,
            time: 0,
            type: data.type,
            variance: 0
        },
        socket_service:websocket_client = transmit.socket as websocket_client,
        test_time:[bigint, bigint][] = [],
        times = function services_testPerformance_times(summary:string, error:boolean):void {
            if (error === false) {
                const values:number[] = [];
                let index:number = 1,
                    value:number = 0,
                    variance:number = 0,
                    total:number = 0;
                do {
                    value = Number(test_time[index][1] - test_time[index][0]);
                    values.push(value);
                    if (output.min === 0 || value < output.min) {
                        output.min = value;
                    }
                    if (value > output.max) {
                        output.max = value;
                    }
                    total = total + value;
                    index = index + 1;
                } while (index < data.quantity_tests + 1);
                output.average = (total / data.quantity_tests);
                index = 1;
                do {
                    variance = variance + ((values[0] - output.average) * (values[0] - output.average));
                    index = index + 1;
                } while (index < data.quantity_tests + 1);
                output.variance = Math.sqrt(variance / data.quantity_tests);
                output.time = Number(process.hrtime.bigint() - time_start);
            }
            output.summary = summary;
            send({
                data: output,
                service: "services_test_performance_output"
            }, socket_service, 3);
        },
        // test_http = function services_testPerformance_testHTTP():void {},
        test_websocket = function services_testPerformance_testWebSocket():void {
            test_time.push([process.hrtime.bigint(), 0n]);
            hash({
                algorithm: "sha3-512",
                callback: function services_testPerformance_testWebSocket_hash(output:core_hash_output):void {
                    create_socket({
                        callback: function services_testPerformance_testWebSocket_socket(socket_test:websocket_client, timeout:bigint, error:node_error):void {
                            if (error === null || error === undefined) {
                                let index:number = data.quantity_transmit;
                                socket_test.queue_callback = function services_testPerformance_testWebSocket_socket_last():void {
                                    socket_test.destroy();
                                    test_time[test_time.length - 1][1] = process.hrtime.bigint();
                                    index_test = index_test + 1;
                                    if (index_test < data.quantity_tests + 1) {
                                        // services_testPerformance_testWebSocket();
                                        setTimeout(services_testPerformance_testWebSocket, 250);
                                    } else {
                                        times("Test complete.", false);
                                    }
                                };
                                if (index > 1) {
                                    do {
                                        index = index - 1;
                                        send(data.body, socket_test, 1);
                                    } while (index > 0);
                                }
                            } else {
                                times(JSON.stringify(error), true);
                            }
                        },
                        handler: message_handler.test_performance,
                        hash: output.hash,
                        headers: null,
                        ip: data.location,
                        port: data.port,
                        proxy: null,
                        resource: "/",
                        secure: data.encryption,
                        server: vars.id.dashboard_server,
                        timeout: 2000,
                        type: "test-performance-socket"
                    });
                },
                digest: "hex",
                hash_input_type: "direct",
                section: "test-performance",
                source: String(Math.random() + Date.now())
            });
        };
    if (typeof data.quantity_tests === "number" && typeof data.quantity_transmit === "number" && data.quantity_tests > 0 && data.quantity_transmit > 0) {
        if (data.type === "websocket") {
            time_start = process.hrtime.bigint();
            test_websocket();
        }
    } else {
        times("Test properties 'quantity_transmit' or 'quantity_test' is not a number greater than 0.", true);
    }
};

export default test_performance;