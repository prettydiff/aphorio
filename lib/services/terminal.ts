
import get_address from "../utilities/getAddress.js";
import log from "../utilities/log.js";
import node from "../utilities/node.js";
import send from "../transmit/send.js";
import vars from "../utilities/vars.js";

// import { spawn } from "@lydell/node-pty";

// cspell: words lydell

const terminal = function services_terminal(socket:websocket_client):void {
    const close = function services_terminal_close():void {
            //pty.kill();
        },
        error = function services_terminal_error(err:node_error):void {
            const config:config_log = {
                action: "activate",
                config: err,
                message: "Socket for dashboard terminal failed with error.",
                status: "error",
                type: "terminal"
            };
            log(config);
            close();
        },
        address:transmit_addresses_socket = get_address({
            socket: socket,
            type: "ws"
        }),
        // pty:pty = (function services_terminal_xterm():pty {
        //     const item:pty = spawn(vars.shell, [], {
        //             cols: vars.terminal.cols,
        //             cwd: vars.path.project,
        //             env: process.env,
        //             name: socket.server,
        //             rows: vars.terminal.rows
        //         }),
        //         handler = function services_terminal_xterm_handler(socket:websocket_client, data:Buffer):void {
        //             item.write(data.toString());
        //         },
        //         out = function services_terminal_xterm_out(output:string):void {
        //             send(output, socket, 1);
        //         };
        //     socket.handler = handler;
        //     item.onData(out);
        //     item.onExit(close);
        //     return item;
        // }()),
        pty = function services_terminal_child(buf:Buffer):node_childProcess_ChildProcess {
            const data:services_terminal_request = JSON.parse(buf.toString()),
                item:node_childProcess_ChildProcess = node.child_process.spawn(data.pty, [data.shell], {
                    env: process.env,
                    windowsHide: true
                }),
                identifiers:terminal_identifiers = {
                    pid: pty.pid,
                    port_browser: address.remote.port,
                    port_terminal: address.local.port,
                    server_name: socket.server,
                    socket_id: socket.hash
                },
                handler = function services_terminal_child_handler(socket:websocket_client, data:Buffer):void {
                    const str:string = data.toString();
                    if (str === "\r") {
                        item.stdin.write((process.platform === "win32")
                        ? "\r\n"
                        : "\n");
                    } else {
                        item.stdin.write(str);
                    }
                },
                out = function services_terminal_child_out(output:Buffer):void {
                    send(output.toString(), socket, 1);
                };
            // process.stdin.setRawMode(true);
            if (data.shell.includes("cmd.exe") === true) {
                item.stdin.write(`mode con: cols=${vars.terminal.cols} lines=${vars.terminal.rows}\r\n`);
            } else if (data.shell.includes("powershell.exe") === true || data.shell.includes("pwsh.exe") === true) {
                const inst:string[] = [
                    "$PSStyle.OutputRendering='ANSI'",
                    "$psGet=Get-Host",
                    "$psHost=$psGet.UI.RawUI",
                    "$psBuffer=psHost.BufferSize",
                    `$psBuffer.width=${vars.terminal.cols}`,
                    `$psBuffer.height=${vars.terminal.cols}`,
                    "$psHost.BufferSize=$psBuffer",
                    "$psWindow=psHost.WindowSize",
                    `$psWindow.width=${vars.terminal.cols}`,
                    `$psWindow.height=${vars.terminal.cols}`,
                    "$psHost.WindowSize=$psWindow",
                    "$psVersionTable",
                    ""
                ];
                item.stdin.write(inst.join("\r\n"));
            }
            send(JSON.stringify(identifiers), socket, 1);
            socket.handler = handler;
            item.stdout.on("data", out);
            return item;
        };
    socket.once("data", pty);
    socket.on("close", close);
    socket.on("end", close);
    socket.on("error", error);
};

export default terminal;