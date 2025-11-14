
import hash from "../core/hash.ts";
import send from "../transmit/send.ts";

const hashService = function services_hash(socket_data:socket_data, transmit:transmit_socket):void {
    const data:services_hash = socket_data.data as services_hash,
        callback = function hashService_callback(output:hash_output):void {
            data.size = output.size;
            data.value = output.hash;
            send({
                data: data,
                service: "dashboard-hash"
            }, transmit.socket as websocket_client, 3);
        };
    hash({
        algorithm: data.algorithm,
        callback: callback,
        digest: (data.base64 === true)
            ? "base64-output"
            : data.digest,
        hash_input_type: data.type,
        section: "hash",
        source: data.value
    });
};

export default hashService;