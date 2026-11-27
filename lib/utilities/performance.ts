
import create_socket from "../transmit/create_socket.ts";
import hash from "../core/hash.ts";
import http_client from "../http/http_client.ts";
import node from "../core/node.ts";
import send from "../transmit/send.ts";
import vars from "../core/vars.ts";

const performance = function utilities_performance(input:services_test_performance_input, server_id:string, callback:(output:services_test_performance_output) => void):void {
    let index_test:number = 0,
        index_http:number = 0,
        time_start:bigint = 0n;
    const output:services_test_performance_output = {
            frame_body_size: input.frame_body_size,
            memory: {
                average: 0,
                max: 0,
                min: 0,
                trials: [],
                variance: 0
            },
            message_size: 0,
            roundtrip: {
                average: 0,
                max: 0,
                min: 0,
                trials: [],
                variance: 0
            },
            send: {
                average: 0,
                max: 0,
                min: 0,
                trials: [],
                variance: 0
            },
            summary: "",
            quantity_tests: input.quantity_tests,
            quantity_transmit: input.quantity_transmit,
            time: 0,
            type: input.type
        },
        // 0 - test start time
        // 1 - test send complete
        // 2 - test round trip complete
        test_time:[bigint, bigint, bigint][] = [],
        memory:[number, number][] = [],
        times = function services_testPerformance_times(summary:string, message_size:number, error:boolean):void {
            if (error === false) {
                const setTimes = function services_testPerformance_times_setTimes(type:"memory"|"roundtrip"|"send"):void {
                    const value_index:1|2 = (type === "roundtrip")
                            ? 2
                            : 1;
                    let index:number = 0,
                        value:number = 0,
                        variance:number = 0,
                        variance_step:number = 0,
                        total:number = 0;
                    do {
                        value = (type === "memory")
                            ? memory[index][1] - memory[index][0]
                            : Number(test_time[index][value_index] - test_time[index][0]);
                        output[type].trials.push(value);
                        if (output[type].min === 0 || value < output[type].min) {
                            output[type].min = value;
                        }
                        if (value > output[type].max) {
                            output[type].max = value;
                        }
                        total = total + value;
                        index = index + 1;
                    } while (index < input.quantity_tests);
                    output[type].average = (total / input.quantity_tests);
                    index = 0;
                    do {
                        variance_step = output[type].trials[index] - output[type].average;
                        variance = variance + ((variance_step < 0)
                            ? variance_step * -1
                            : variance_step
                        );
                        index = index + 1;
                    } while (index < input.quantity_tests);
                    output[type].variance = (type === "memory")
                        ? Math.round(variance / input.quantity_tests)
                        : (variance / input.quantity_tests);
                };
                if (input.type === "http" || input.measure === "roundtrip") {
                    setTimes("roundtrip");
                }
                if (input.type === "websocket") {
                    setTimes("send");
                }
                setTimes("memory");
                output.message_size = message_size;
                output.time = Number(process.hrtime.bigint() - time_start);
            }
            output.summary = summary;
            callback(output);
        },
        test_http = function services_testPerformance_testHTTP():void {
            const message:Buffer = (function services_testPerformance_testHTTP_message():Buffer {
                const host:string = (node.net.isIPv6(input.location) === true)
                    ? `[${input.location}]:${input.port}`
                    : `${input.location}:${input.port}`
                return Buffer.from([
                    "GET / HTTP/1.1",
                    `Host: ${host}`,
                    "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:155.0) Gecko/20100101 Firefox/155.0",
                    "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language: en-US,en;q=0.9",
                    "Accept-Encoding: gzip, deflate, br, zstd",
                    "Connection: keep-alive",
                    "Upgrade-Insecure-Requests: 1",
                    "Sec-Fetch-Dest: document",
                    "Sec-Fetch-Mode: navigate",
                    "Sec-Fetch-Site: none",
                    "Sec-Fetch-User: ?1",
                    "Priority: u=0, i",
                    "",
                    ""
                ].join("\r\n") + input.body);
            }());
            http_client({
                callback_error: function services_testPerformance_testHTTP_error(socket:websocket_client, error:node_error):void {
                    times(error.message, message.byteLength, true);
                },
                callback_response: function services_testPerformance_testHTTP_data(socket:websocket_client, response:Buffer):void {
                    index_http = index_http + 1;
                    if (index_http < input.quantity_transmit) {
                        socket.write(message);
                    } else {
                        socket.removeAllListeners("data");
                        socket.removeAllListeners("error");
                        socket.removeAllListeners("ready");
                        socket.destroy();
                        test_time[test_time.length - 1][2] = process.hrtime.bigint();
                        index_http = 0;
                        index_test = index_test + 1;
                        if (index_test < input.quantity_tests) {
                            setTimeout(test_type, 0);
                        } else {
                            output.message_size = response.byteLength + 4;
                            times("Test complete.", message.byteLength, false);
                        }
                    }
                },
                encryption: input.encryption,
                host: input.location,
                message: message,
                port: input.port,
                timeout: 10000,
                type: "test-performance"
            });
        },
        test_websocket = function services_testPerformance_testWebSocket():void {
            hash({
                algorithm: "sha3-512",
                callback: function services_testPerformance_testWebsocket_hash(output:core_hash_output):void {
                    let index_receive:number = 1,
                        flags:store_flag = {
                            roundtrip: false,
                            send: false
                        };
                    const complete = function services_testPerformance_testWebsocket_complete(measure:"roundtrip"|"send", socket_test:websocket_client):void {
                        const index_value:number = (measure === "roundtrip")
                            ? 2
                            : 1;
                        test_time[test_time.length - 1][index_value] = process.hrtime.bigint();
                        flags[measure] = true;
                        if (input.measure === "send" || (input.measure === "roundtrip" && flags.roundtrip === true && flags.send === true)) {
                            socket_test.destroy();
                            const mem:os_node_memoryUsage = process.memoryUsage();
                            memory[memory.length - 1][1] = mem.heapUsed;
                            index_test = index_test + 1;
                            if (index_test < input.quantity_tests) {
                                setTimeout(test_type, 0);
                            } else {
                                times("Test complete.", Buffer.from(input.body).byteLength, false);
                            }
                        }
                    };
                    create_socket({
                        callback: function services_testPerformance_testWebsocket_hash_create(socket_test:websocket_client, error:node_error):void {
                            if (socket_test === null || (error !== null && error !== undefined)) {
                                const message:string = JSON.stringify(error);
                                if (message === "{}") {
                                    times(error.message, Buffer.from(input.body).byteLength, true);
                                } else {
                                    times(message, Buffer.from(input.body).byteLength, true);
                                }
                            } else {
                                let index:number = input.quantity_transmit;
                                socket_test.segmentation = input.frame_body_size;
                                socket_test.proxy = null;
                                socket_test.queue_callback = function services_testPerformance_testWebSocket_hash_create_queueCallback():void {
                                    if (index < 1) {
                                        complete("send", socket_test);
                                    }
                                };
                                if (index > 0) {
                                    do {
                                        index = index - 1;
                                        if (input.call_stack === true) {
                                            setTimeout(function services_testPerformance_testWebSocket_hash_create_send():void {
                                                send(input.body, socket_test, 1);
                                            }, 0);
                                        } else {
                                            send(input.body, socket_test, 1);
                                        }
                                    } while (index > 0);
                                }
                            }
                        },
                        handler: (input.measure === "roundtrip")
                            ? function services_testPerformance_testWebsocket_hash_handler(socket_test:websocket_client):void {
                                index_receive = index_receive + 1;
                                if (index_receive === input.quantity_transmit) {
                                    complete("roundtrip", socket_test);
                                }
                            }
                            : null,
                        hash: output.hash,
                        headers: null,
                        ip: input.location,
                        port: input.port,
                        proxy: null,
                        resource: "/",
                        secure: input.encryption,
                        server: server_id,
                        timeout: 2000,
                        type: "test-performance-socket"
                    });
                },
                digest: "hex",
                hash_input_type: "direct",
                section: "test-performance",
                source: String(Math.random() + Date.now())
            });
        },
        test_type = function services_testPerformance_testType():void {
            const mem:os_node_memoryUsage = process.memoryUsage();
            memory.push([mem.heapUsed, 0]);
            test_time.push([process.hrtime.bigint(), 0n, 0n]);
            if (input.type === "websocket") {
                test_websocket();
            } else {
                test_http();
            }
        };
    if (vars.test.test_browser === null && vars.options.mode === "server") {
        vars.test.test_browser = input.measure;
    }
    if (vars.options.mode === "demo") {
        times("Performance testing is not available in demo mode.", 0, true);
    } else if (typeof input.quantity_tests === "number" && typeof input.quantity_transmit === "number" && input.quantity_tests > 0 && input.quantity_transmit > 0) {
        time_start = process.hrtime.bigint();
        test_type();
    } else {
        times("Test properties 'quantity_transmit' or 'quantity_test' is not a number greater than 0.", 0, true);
    }
};

export default performance;