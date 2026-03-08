
import send from "./send.ts";

const receiver = function transmit_receiver(buf:Buffer):void {
    //    RFC 6455, 5.2.  Base Framing Protocol
    //     0                   1                   2                   3
    //     0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
    //    +-+-+-+-+-------+-+-------------+-------------------------------+
    //    |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
    //    |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
    //    |N|V|V|V|       |S|             |   (if payload len==126/127)   |
    //    | |1|2|3|       |K|             |                               |
    //    +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
    //    |     Extended payload length continued, if payload len == 127  |
    //    + - - - - - - - - - - - - - - - +-------------------------------+
    //    |                               |Masking-key, if MASK set to 1  |
    //    +-------------------------------+-------------------------------+
    //    | Masking-key (continued)       |          Payload Data         |
    //    +-------------------------------- - - - - - - - - - - - - - - - +
    //    :                     Payload Data continued ...                :
    //    + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
    //    |                     Payload Data continued ...                |
    //    +---------------------------------------------------------------+

    // eslint-disable-next-line no-restricted-syntax
    const socket:websocket_client = this as websocket_client,
        frame_reader = function transmit_receiver_frameReader(input:Buffer):websocket_frame {
            const bits0:string = input[0].toString(2).padStart(8, "0"), // bit string - convert byte number (0 - 255) to 8 bits
                mask:boolean = input[1] > 127,
                len:number = (mask === true)
                    ? input[1] - 128
                    : input[1],
                keyOffset:number = (mask === true)
                    ? 4
                    : 0,
                startByte:number = (len < 126)
                    ? 2 + keyOffset
                    : (len === 126)
                        ? 4 + keyOffset
                        : 10 + keyOffset,
                lengthExtended:number = (len < 126)
                    ? len
                    : (len === 126)
                        ? input.subarray(2, 4).readUInt16BE(0)
                        : input.subarray(4, 10).readUIntBE(0, 6);
            return {
                extended: lengthExtended,
                fin: (input[0] > 127),
                len: len,
                mask: mask,
                maskKey: (mask === true)
                    ? input.subarray(startByte - 4, startByte)
                    : null,
                opcode: ((Number(bits0.charAt(4)) * 8) + (Number(bits0.charAt(5)) * 4) + (Number(bits0.charAt(6)) * 2) + Number(bits0.charAt(7))),
                rsv1: (bits0.charAt(1) === "1"),
                rsv2: (bits0.charAt(2) === "1"),
                rsv3: (bits0.charAt(3) === "1"),
                size_buffer: (input.length > startByte)
                    ? input.length - startByte
                    : 0,
                size_fragment: (buf !== null && buf !== undefined)
                    ? buf.length
                    : 0,
                startByte: startByte
            };
        },
        unmask = function transmit_receiver_unmask(input:Buffer, key:Buffer):Buffer {
            if (key !== null) {
                // RFC 6455, 5.3.  Client-to-Server Masking
                // j                   = i MOD 4
                // transformed-octet-i = original-octet-i XOR masking-key-octet-j
                input.forEach(function transmit_receiver_unmask_each(value:number, index:number):void {
                    input[index] = value ^ key[index % 4];
                });
            }
            return input;
        },
        body = function transmit_receiver_body():Buffer {
            // Payload processing must contend with these 4 constraints:
            // 1. Message Fragmentation - RFC6455 allows messages to be fragmented from a single transmission into multiple transmission frames independently sent and received.
            // 2. Header Separation     - Firefox sends frame headers separated from frame bodies.
            // 3. Node Concatenation    - If Node.js receives message frames too quickly the various binary buffers are concatenated into a single deliverable to the processing application.
            // 4. TLS Max Packet Size   - TLS forces a maximum payload size of 65536 bytes.
            let fin:boolean = false;
            if (socket.frame === null) {
                socket.frame = frame_reader(buf);
                if (overflow === false) {
                    socket.buffer = buf;
                }
            } else if (overflow === false) {
                socket.buffer = Buffer.concat([socket.buffer, buf]);
            }
            // store frame on socket for frames further subdivided, but just reference from local frame variable
            frame = socket.frame;
            if (socket.buffer.length < socket.frame.extended + socket.frame.startByte) {
                return null;
            }
            fin = socket.frame.fin;
            socket.fragments.push(unmask(socket.buffer.subarray(socket.frame.startByte, socket.frame.startByte + socket.frame.extended), socket.frame.maskKey));
            socket.buffer = socket.buffer.subarray(socket.frame.startByte + socket.frame.extended);
            socket.frame = (socket.buffer.length < 2)
                ? null
                : frame_reader(socket.buffer);
            overflow = (socket.frame !== null);
            if (fin === true) {
                const output:Buffer = Buffer.concat(socket.fragments);
                socket.fragments = [];
                return output;
            }if(socket.type==="test-websocket"){console.log(socket.buffer.length);console.log(frame);}
            return null;
        },
        evaluation = function transmit_receiver_evaluation():void {
            let payload:Buffer = null;
            if (buf.length < 128) {
                // do not store control frames on the socket, because control frames can be inter-spliced with data frames.
                frame = frame_reader(buf);
                // control frame
                if (frame.fin === true && frame.opcode > 7 && frame.extended < 126) {
                    payload = unmask(buf.subarray(frame.startByte), frame.maskKey);
                } else {
                    payload = body();
                }
            } else {
                payload = body();
            }

            if (payload === null) {
                return;
            }

            if (socket.type === "test-websocket") {
                socket.handler(socket, payload, frame);
            } else {
                if (frame.opcode === 8) {
                    // socket close
                    payload[0] = 136;
                    payload[1] = (frame.mask === true)
                        ? payload[1] - 128
                        : payload[1];
                    socket.write(payload);
                    socket.destroySoon();
                } else if (frame.opcode === 9) {
                    // respond to "ping" as "pong"
                    send(payload, socket, 10);
                } else if (frame.opcode === 10) {
                    // pong
                    const payloadString:string = payload.toString(),
                        pong:websocket_pong = socket.pong[payloadString],
                        time:bigint = process.hrtime.bigint();
                    if (pong !== undefined) {
                        if (time < pong.start + pong.ttl) {
                            clearTimeout(pong.timeOut);
                            pong.callback(null, time - pong.start);
                        }
                        delete socket.pong[payloadString];
                    }
                } else {
                    socket.handler(socket, payload, frame);
                }
            }
        };
    let frame:websocket_frame = null,
        overflow:boolean = false;
    do {
        evaluation();
    // @ts-expect-error the value is assigned from a child function
    } while (overflow === true);
};

export default receiver;