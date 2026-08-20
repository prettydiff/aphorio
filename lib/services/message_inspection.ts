import send from "../transmit/send.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";


const message_inspection:core_module_messageInspection = {
    // send the intercepted message data
    send: function services_messageInspection_send(data:services_message_inspection):void {
        let index_messages:number = vars.data.message_inspection.length,
            item:core_message_inspection = null,
            len:number = data.message.length;
        const now:number = Date.now();
        data.count = len;
        if (index_messages > 0) {
            do {
                index_messages = index_messages - 1;
                item = vars.data.message_inspection[index_messages];
                if (item.type === data.type && item.service === data.service) {
                    data.message = (item.maximum_size === 0 || len < item.maximum_size)
                        ? data.message
                        : data.message.slice(0, len - item.maximum_size);
                    len = data.message.length;
                    if (item.throttle_size > 0 && item.throttle_time > 0 && item.measure_size === item.throttle_size && item.measure_time + item.throttle_time > now) {
                        return;
                    }
                    if (item.throttle_time > 0 && item.measure_time + item.throttle_time < now) {
                        item.measure_time = now;
                        item.measure_size = len;
                    } else if (item.throttle_size > 0) {
                        if (item.measure_size + len > item.throttle_size) {
                            data.message = data.message.slice(0, item.measure_size + len - item.throttle_size);
                            item.measure_size = item.throttle_size;
                        } else {
                            item.measure_size = item.measure_size + len;
                        }
                    }
                    data.count = len;
                    data.maximum_size = item.maximum_size;
                    data.throttle_size = item.throttle_size;
                    data.throttle_time = item.throttle_time;
                    send({
                        data: data,
                        service: "services_message_inspection"
                    }, item.socket, 3);
                    return;
                }
            } while (index_messages > 0);
        }
    },
    // passing the service to monitor
    set: function services_messageInspection_set(socket_data:socket_data, transmit:transmit_socket):void {
        const data:services_message_inspection = socket_data.data as services_message_inspection,
            socket:websocket_client = transmit.socket as websocket_client,
            payload:core_message_inspection = {
                maximum_size: data.maximum_size,
                measure_size: 0,
                measure_time: Date.now(),
                service: data.service,
                socket: socket,
                spawn: null,
                stdout: null,
                throttle_size: data.throttle_size,
                throttle_time: data.throttle_time,
                type: data.type
            },
            docker_start = function services_messageInspection_set_dockerStart():void {
                if (data.type === "docker-container") {
                    const command:string = `docker logs ${data.service} --follow -n 5000`,
                        child:core_module_spawn = spawn(command, null, {
                            stream_stderr: true,
                            stream_stdout: true,
                            type: "message-inspection"
                        }),
                        output = function services_messageInspection_set_stdout(out:Buffer):void {
                            const str:string = out.toString(),
                                len:number = str.length,
                                message:services_message_inspection = {
                                    count: len,
                                    direction: "in",
                                    maximum_size: data.maximum_size,
                                    message: (len < data.maximum_size)
                                        ? str
                                        : str.slice(len - data.maximum_size),
                                    service: data.service,
                                    throttle_size: data.throttle_size,
                                    throttle_time: data.throttle_time,
                                    type: "docker-container"
                                };
                            send({
                                data: message,
                                service: "services_message_inspection"
                            }, socket, 3);
                        };
                    child.execute();
                    child.spawn.stdout.on("data", output);
                    child.spawn.stderr.on("data", output);
                    payload.spawn = child;
                    payload.stdout = output;
                }
            };
        let index:number = vars.data.message_inspection.length;
        if (index > 0) {
            do {
                index = index - 1;
                if (vars.data.message_inspection[index].socket === socket) {
                    if (data.type === "docker-container") {
                        vars.data.message_inspection[index].spawn.spawn.stdout.off("data", vars.data.message_inspection[index].stdout);
                        vars.data.message_inspection[index].spawn.spawn.stderr.off("data", vars.data.message_inspection[index].stdout);
                    }
                    if (data.service === "" || (data.type === "web-server" && vars.data.server[data.service] === undefined) || (data.type === "docker-container" && vars.data.containers[data.service] === undefined)) {
                        vars.data.message_inspection.splice(index, 1);
                    } else {
                        vars.data.message_inspection[index].service = data.service;
                        vars.data.message_inspection[index].type = data.type;
                        docker_start();
                    }
                    return;
                }
            } while (index > 0);
        }
        if (data.service !== "" && (
            (data.type === "web-server" && vars.data.server[data.service] !== undefined) ||
            (data.type === "docker-container" && vars.data.containers[data.service] !== undefined)
        )) {
            docker_start();
            vars.data.message_inspection.push(payload);
        }
    }
};

export default message_inspection;