
import commas from "./commas.js";
import core from "../browser/core.js";
import dashboard_script from "../dashboard/dashboard_script.js";
import dateTime from "./dateTime.js";
import docker_ps from "../services/docker_ps.js";
import file from "./file.js";
import node from "./node.js";
import os from "./os.js";
import time from "./time.js";
import vars from "./vars.js";

const startup = function utilities_startup(callback:() => void):void {
    const flags:store_flag = {
            compose: false,
            config: false,
            css: false,
            docker: false,
            html: false,
            os: false,
            terminal: false
        },
        readComplete = function utilities_startup_readComplete(flag:"config"|"css"|"docker"|"html"|"os"|"terminal"):void {
            flags[flag] = true;
            if (flags.config === true && flags.css === true && flags.docker === true && flags.html === true && flags.os === true && flags.terminal === true) {
                callback();
            }
        },
        readCompose = function utilities_startup_readCompose(fileContents:Buffer):void {
            if (fileContents === null) {
                vars.compose = {
                    containers: {},
                    variables: {}
                };
            } else {
                vars.compose = JSON.parse(fileContents.toString());
            }
            flags.compose = true;
            commandsCallback();
        },
        readCSS = function utilities_startup_readCSS(fileContents:Buffer):void {
            const css:string = fileContents.toString();
            vars.css = css.slice(css.indexOf(":root"), css.indexOf("/* end basic html */"));
            readComplete("css");
        },
        readConfig = function utilities_startup_readConfig(fileContents:Buffer):void {
            const configStr:string = (fileContents === null)
                    ? ""
                    : fileContents.toString(),
                config:store_server_config = (configStr === "" || (/^\s*\{/).test(configStr) === false || (/\}\s*$/).test(configStr) === false)
                    ? null
                    : JSON.parse(configStr) as store_server_config,
                includes = function utilities_startup_read_instructions_includes(input:string):void {
                    if (vars.interfaces.includes(input) === false && input.toLowerCase().indexOf("fe80") !== 0) {
                        vars.interfaces.push(input);
                    }
                },
                interfaces:{ [index: string]: node_os_NetworkInterfaceInfo[]; } = node.os.networkInterfaces(),
                keys_int:string[] = Object.keys(interfaces),
                keys_srv:string[] = (config === null)
                    ? null
                    : Object.keys(config);
            let index_int:number = keys_int.length,
                index_srv:number = (config === null)
                    ? 0
                    : keys_srv.length,
                server:server = null,
                sub:number = 0;
            if (index_srv > 0) {
                do {
                    index_srv = index_srv - 1;
                    index_int = keys_int.length;
                    server = {
                        config: config[keys_srv[index_srv]],
                        sockets: [],
                        status: {
                            open: 0,
                            secure: 0
                        }
                    };
                    if (server.config.ports === null || server.config.ports === undefined) {
                        server.config.ports = {
                            open: 0,
                            secure: 0
                        };
                    } else {
                        if (typeof server.config.ports.open !== "number") {
                            server.config.ports.open = 0;
                        }
                        if (typeof server.config.ports.secure !== "number") {
                            server.config.ports.secure = 0;
                        }
                    }
                    if (server.config.block_list === undefined || server.config.block_list === null) {
                        server.config.block_list = {
                            host: [],
                            ip: [],
                            referrer: []
                        };
                    }
                    if (Array.isArray(server.config.domain_local) === false) {
                        server.config.domain_local = [];
                    }
                    vars.servers[server.config.name] = server;
                } while (index_srv > 0);
            }
            do {
                index_int = index_int - 1;
                sub = interfaces[keys_int[index_int]].length;
                do {
                    sub = sub - 1;
                    includes(interfaces[keys_int[index_int]][sub].address);
                } while (sub > 0);
            } while (index_int > 0);
            readComplete("config");
        },
        readXterm = function utilities_startup_readXterm(xtermFile:Buffer):void {
            file.read({
                callback: function utilities_startup_readHTML(fileContents:Buffer):void {
                    const xterm:string = xtermFile.toString().replace(/\s*\/\/# sourceMappingURL=xterm\.js\.map/, ""),
                        script:string = dashboard_script.toString().replace("path: \"\",", `path: "${vars.path.project.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}",`).replace(/\(\s*\)/, "(core)");
                    vars.dashboard = fileContents.toString()
                        .replace("${payload.intervals.compose}", (vars.intervals.compose / 1000).toString())
                        .replace("replace_javascript", `${xterm}const commas=${commas.toString()},dateTime=${dateTime.toString()},time=${time.toString()};(${script}(${core.toString()}));`);
                    readComplete("html");
                },
                error_terminate: null,
                location: `${vars.path.project}lib${vars.sep}dashboard${vars.sep}dashboard.html`,
                no_file: null
            });
        },
        options = function utilities_startup_options(key:"no_color"|"verbose", iterate:string):void {
            const argv:number = process.argv.indexOf(key);
            if (argv > -1) {
                process.argv.splice(argv, 1);
                if (iterate !== null) {
                    const store:store_string = vars[iterate as "text"],
                        keys:string[] = Object.keys(store);
                    let index:number = keys.length;
                    do {
                        index = index - 1;
                        if (iterate === "text") {
                            store[keys[index]] = "";
                        }
                    } while (index > 0);
                }
            }
        },
        capitalize = function utilities_startup_capitalize():string {
            // eslint-disable-next-line no-restricted-syntax
            return this.charAt(0).toUpperCase() + this.slice(1);
        },
        commandsCallback = function utilities_startup_commandsCallback():void {
            docker_ps(dockerCallback);
            file.read({
                callback: readConfig,
                error_terminate: null,
                location: `${vars.path.project}servers.json`,
                no_file: null
            });
            file.read({
                callback: readXterm,
                error_terminate: null,
                location: `${vars.path.project}node_modules${vars.sep}@xterm${vars.sep}xterm${vars.sep}lib${vars.sep}xterm.js`,
                no_file: null
            });
            file.read({
                callback: readCSS,
                error_terminate: null,
                location: `${vars.path.project}lib${vars.sep}dashboard${vars.sep}styles.css`,
                no_file: null
            });
        },
        dockerCallback = function utilities_startup_dockerCallback():void {
            readComplete("docker");
        },
        osCallback = function utilities_startup_osCallback():void {
            readComplete("os");
        };

    String.prototype.capitalize = capitalize;
    Number.prototype.commas = commas;
    Number.prototype.dateTime = dateTime;
    Number.prototype.time = time;

    options("no_color", "text");
    vars.path.project = process.argv[1].slice(0, process.argv[1].indexOf(`${vars.sep}js${vars.sep}`)) + vars.sep;
    vars.path.compose = `${vars.path.project}compose${vars.sep}`;
    vars.path.servers = `${vars.path.project}servers${vars.sep}`;
    file.read({
        callback: readCompose,
        error_terminate: null,
        location: `${vars.path.project}compose.json`,
        no_file: null
    });

    // build shell list
    if (process.platform === "win32") {
        const stats = function utilities_os_shellWin(index:number):void {
            node.fs.stat(vars.terminal[index], function utilities_os_shellWin_callback(err:node_error) {
                if (err !== null) {
                    vars.terminal.splice(index, 1);
                }
                if (index > 0) {
                    utilities_os_shellWin(index - 1);
                } else {
                    readComplete("terminal");
                }
            });
        };
        stats(vars.terminal.length - 1);
    } else {
        file.stat({
            callback: function utilities_os_shellStat(stat:node_fs_BigIntStats):void {
                if (stat === null) {
                    vars.terminal.push("/bin/sh");
                } else {
                    file.read({
                        callback: function utilities_os_shellStat_shellRead(contents:Buffer):void {
                            const lines:string[] = contents.toString().split("\n"),
                                len:number = lines.length;
                            let index:number = 1;
                            if (len > 1) {
                                do {
                                    if (lines[index].indexOf("/bin/") === 0) {
                                        vars.terminal.push(lines[index]);
                                    }
                                    index = index + 1;
                                } while (index < len);
                            }
                            if (vars.terminal.length < 1) {
                                vars.terminal.push("/bin/sh");
                            }
                            readComplete("terminal");
                        },
                        error_terminate: null,
                        location: "/etc/shells",
                        no_file: null
                    });
                }
            },
            error_terminate: null,
            location: "/etc/shells",
            no_file: null
        });
    }
    os("all", osCallback);
};

export default startup;