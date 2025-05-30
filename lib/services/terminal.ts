
import get_address from "../utilities/getAddress.js";
import log from "../utilities/log.js";
import node from "../utilities/node.js";
import send from "../transmit/send.js";
import vars from "../utilities/vars.js";

// import { spawn } from "@lydell/node-pty";

// cspell: words conhost, lydell, pwsh

const terminal = function services_terminal(socket:websocket_client, pty:string, shell:string):void {
    const close = function services_terminal_close():void {
            ptyInstance.kill();
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
        // ptyInstance:pty = (function services_terminal_xterm():pty {
        //     const item:pty = spawn(shell, [], {
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
        ptyInstance:node_childProcess_ChildProcess = (function services_terminal_ptyInstance():node_childProcess_ChildProcess {
            const item:node_childProcess_ChildProcess = node.child_process.spawn(pty, [shell], {
                    env: process.env,
                    windowsHide: true
                }),
                identifiers:terminal_identifiers = {
                    pid: item.pid,
                    port_browser: address.remote.port,
                    port_terminal: address.local.port,
                    server_name: socket.server,
                    socket_id: socket.hash
                },
                handler = function services_terminal_ptyInstance_handler(socket:websocket_client, data:Buffer):void {
                    const str:string = data.toString();
                    if (str === "\r") {
                        item.stdin.write((process.platform === "win32")
                        ? "\r\n"
                        : "\n");
                    } else {
                        item.stdin.write(str);
                    }
                },
                out = function services_terminal_ptyInstance_out(output:Buffer):void {
                    const replace = function services_terminal_ptyInstance_out_replace(input:string):string {
                            return ((/\r\n$/).test(input) === true)
                                ? "\r\n"
                                : "";
                        },
                        str:string = (pty.includes("conhost.exe") === true)
                            ? output.toString().replace(/\r\n>> ?(\x1B\[\??\d*[A-Za-z]?(;\??\d*[A-Za-z]?)*)+(\r\n)?$/, replace)
                            : output.toString();
                    if (str !== "") {
                        send(str, socket, 1);
                    }
                },
                error_child = function services_terminal_ptyInstance_errorChild(err:node_error):void {
                    send(JSON.stringify(err), socket, 1);
                    socket.end();
                    item.kill();
                };
            // process.stdin.setRawMode(true);
            if (shell.includes("cmd.exe") === true) {
                item.stdin.write(`mode con: cols=${vars.terminal.cols} lines=${vars.terminal.rows}\r\n`);
            } else if (shell.includes("powershell.exe") === true || shell.includes("pwsh.exe") === true) {
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
            item.on("error", error_child);
            item.on("close", close);
            return item;
        }());
    socket.on("close", close);
    socket.on("end", close);
    socket.on("error", error);
};

export default terminal;