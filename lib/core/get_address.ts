
const get_address = function core_getAddress(socket_input:websocket_client):transmit_addresses_socket {
    const parse = function core_getAddress_parse(input:string):string {
            if (input === undefined) {
                return "undefined, possibly due to socket closing";
            }
            if (input.indexOf("::ffff:") === 0) {
                return input.replace("::ffff:", "");
            }
            if (input.indexOf(":") > 0 && input.indexOf(".") > 0) {
                return input.slice(0, input.lastIndexOf(":"));
            }
            return input;
        };
    return {
        local: {
            address: parse(socket_input.localAddress),
            port: socket_input.localPort
        },
        remote: {
            address: parse(socket_input.remoteAddress),
            port: socket_input.remotePort
        }
    };
};

export default get_address;