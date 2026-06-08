import send from "../transmit/send.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";


const message_inspection:core_module_messageInspection = {
    max_size: 500000,
    send: function services_messageInspection_send(data:services_message_inspection):void {
        let index_messages:number = vars.data_store.message_inspection.length;
        const len:number = data.message.length;
        data.count = len;
        data.max_size = message_inspection.max_size;
        data.message = (len < message_inspection.max_size)
            ? data.message
            : data.message.slice(len - message_inspection.max_size);
        if (index_messages > 0) {
            do {
                index_messages = index_messages - 1;
                if (
                    vars.data_store.message_inspection[index_messages].type === data.type &&
                    vars.data_store.message_inspection[index_messages].service === data.service
                ) {
                    send({
                        data: data,
                        service: "dashboard-message-inspection"
                    }, vars.data_store.message_inspection[index_messages].socket, 3);
                }
            } while (index_messages > 0);
        }
    },
    set: function services_messageInspection_set(socket_data:socket_data, transmit:transmit_socket):void {
        const data:services_message_inspection = socket_data.data as services_message_inspection,
            socket:websocket_client = transmit.socket as websocket_client,
            payload:core_message_inspection = {
                service: data.service,
                socket: socket,
                spawn: null,
                stdout: null,
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
                        output = function services_mesageInspection_set_stdout(out:Buffer):void {
                            const str:string = out.toString(),
                                len:number = str.length,
                                message:services_message_inspection = {
                                    count: len,
                                    direction: "in",
                                    max_size: message_inspection.max_size,
                                    message: (len < message_inspection.max_size)
                                        ? str
                                        : str.slice(len - message_inspection.max_size),
                                    service: data.service,
                                    type: "docker-container"
                                };
                            send({
                                data: message,
                                service: "dashboard-message-inspection"
                            }, socket, 3);
                        };
                    child.execute();
                    child.spawn.stdout.on("data", output);
                    child.spawn.stderr.on("data", output);
                    payload.spawn = child;
                    payload.stdout = output;
                }
            };
        let index:number = vars.data_store.message_inspection.length;
        if (index > 0) {
            do {
                index = index - 1;
                if (vars.data_store.message_inspection[index].socket === socket) {
                    if (data.type === "docker-container") {
                        vars.data_store.message_inspection[index].spawn.spawn.stdout.off("data", vars.data_store.message_inspection[index].stdout);
                        vars.data_store.message_inspection[index].spawn.spawn.stderr.off("data", vars.data_store.message_inspection[index].stdout);
                    }
                    if (data.service === "" || (data.type === "web-server" && vars.data.servers[data.service] === undefined) || (data.type === "docker-container" && vars.data.containers[data.service] === undefined)) {
                        vars.data_store.message_inspection.splice(index, 1);
                    } else {
                        vars.data_store.message_inspection[index].service = data.service;
                        vars.data_store.message_inspection[index].type = data.type;
                        docker_start();
                    }
                    return;
                }
            } while (index > 0);
        }
        if (data.service !== "" && (
            (data.type === "web-server" && vars.data.servers[data.service] !== undefined) ||
            (data.type === "docker-container" && vars.data.containers[data.service] !== undefined)
        )) {
            docker_start();
            vars.data_store.message_inspection.push(payload);
        }
    }
};

export default message_inspection;