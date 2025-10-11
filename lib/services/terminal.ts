
import get_address from "../core/getAddress.ts";
import log from "../core/log.ts";
import send from "../transmit/send.ts";
import vars from "../core/vars.ts";

import { spawn } from "@lydell/node-pty";

// cspell: words lydell

const terminal:services_terminal = {
    resize: function services_terminalResize(socket_data:socket_data):void {
        const data:services_terminal_resize = socket_data.data as services_terminal_resize,
            socket:websocket_pty = (function services_terminalResize():websocket_pty {
                const sockets:websocket_client[] = vars.server_meta.dashboard.sockets[data.secure];
                let index:number = sockets.length;
                if (index > 0) {
                    do {
                        index = index - 1;
                        if (sockets[index].hash === data.hash) {
                            return sockets[index] as websocket_pty;
                        }
                    } while (index > 0);
                }
                return null;
            }()),
            pty:pty = (socket === null)
                ? null
                : socket.pty;
        if (pty !== null && Number.isNaN(data.cols) === false && Number.isNaN(data.rows) === false && data.cols > 0 && data.rows > 0) {
            pty.resize(Math.floor(data.cols), Math.floor(data.rows));
        }
    },
    shell: function services_terminalShell(socket:websocket_pty, terminal:terminal):void {
        const pty:pty = spawn(terminal.shell, [], {
                cols: terminal.cols,
                cwd: vars.path.project,
                env: process.env,
                name: socket.server,
                rows: terminal.rows
            }),
            close = function services_terminalShell_close():void {
                pty.kill();
            },
            error = function services_terminalShell_error(err:node_error):void {
                const config:config_log = {
                    action: "activate",
                    config: err,
                    message: "Socket for dashboard terminal failed with error.",
                    status: "error",
                    time: Date.now(),
                    type: "terminal"
                };
                log.application(config);
                close();
            },
            handler = function services_terminalShell_handler(socket:websocket_client, data:Buffer):void {
                pty.write(data.toString());
            },
            out = function services_terminalShell_out(output:string):void {
                send(output, socket, 1);
            },
            address:transmit_addresses_socket = get_address({
                socket: socket,
                type: "ws"
            }),
            identifiers:terminal_identifiers = {
                pid: pty.pid,
                port_browser: address.remote.port,
                port_terminal: address.local.port,
                server_name: socket.server,
                socket_hash: socket.hash
            };
        socket.handler = handler;
        socket.pty = pty;
        send(JSON.stringify(identifiers), socket, 1);
        pty.onData(out);
        pty.onExit(close);
        socket.on("close", close);
        socket.on("end", close);
        socket.on("error", error);
    }
};

export default terminal;