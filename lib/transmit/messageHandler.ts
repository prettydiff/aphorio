
import node from "../core/node.ts";
import router from "./router.ts";

const message_handler:transmit_socket_messageHandler = {
    default: function transmit_messageHandler(socket:websocket_client, bufferData:Buffer):void {
        const decoder:node_stringDecoder_StringDecoder = new node.stringDecoder.StringDecoder("utf8"),
            result:string = decoder.end(bufferData);

        // prevent parsing errors in the case of malformed or empty payloads
        if (result.charAt(0) === "{" && result.charAt(result.length - 1) === "}" && result.indexOf("\"data\":") > 0 && result.indexOf("\"service\":") > 0) {
            router(JSON.parse(result) as socket_data, {
                // eslint-disable-next-line no-restricted-syntax
                socket: this,
                type: "ws"
            });
        }
    }
};

export default message_handler;