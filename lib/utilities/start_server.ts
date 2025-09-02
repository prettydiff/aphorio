
import broadcast from "../transmit/broadcast.ts";
import commas from "./commas.ts";
import core from "../browser/core.ts";
import dashboard_script from "../dashboard/dashboard_script.ts";
import dateTime from "./dateTime.ts";
import docker_ps from "../services/docker_ps.ts";
import file from "./file.ts";
import log from "./log.ts";
import node from "./node.ts";
import os from "./os.ts";
import server from "../transmit/server.ts";
import server_create from "../services/server_create.ts";
import test_browser from "../dashboard/test_browser.ts";
import test_index from "../test/index.ts";
import time from "./time.ts";
import vars from "./vars.ts";

const start_server = function utilities_startServer():void {
    const testing:boolean = process.argv.includes("test"),
        flags:store_flag = {
            compose: false,
            css: false,
            git: false,
            html: false,
            options: false,
            os: false,
            servers: testing,
            test_browser: false,
            test_list: false
        },
        task_definitions:store_string = {
            compose: "Reads the compose.json file and restores the docker compose containers if docker is available.",
            git: "Read's the project's git file to determine the current commit hash, which is helpful when performing maintenance across multiple machines simultaneously.",
            html: "Read's the dashboard's HTML file for dynamic modification.",
            options: "Modify's application settings according to the use of supported optional command line arguments.",
            os: "Reads a variety of data from the operating system for populating into the dashboard.",
            servers: "Reads the servers.json file to dynamically standup and populate configured web servers.",
            test_browser: "Finds a designed web browser for test automation if supplied as a terminal argument.",
            test_list: null
        },
        tasks:store_function = {
            compose: function utilities_startServer_taskCompose():void {
                const readCompose = function utilities_startServer_taskCompose_readCompose(fileContents:Buffer):void {
                    const callback = function utilities_startServer_taskCompose_readCompose_dockerCallback():void {
                        readComplete("compose");
                    };
                    if (fileContents === null) {
                        vars.compose = {
                            containers: {},
                            variables: {}
                        };
                    } else {
                        vars.compose = JSON.parse(fileContents.toString());
                    }
                    docker_ps(callback);
                };
                file.read({
                    callback: readCompose,
                    error_terminate: null,
                    location: `${vars.path.project}compose.json`,
                    no_file: null
                });
            },
            git: function utilities_startServer_tasksGit():void {
                const gitStat = function utilities_startServer_tasksGit_gitStat(error:node_error, stat:node_fs_Stats):void {
                    if (error === null && stat !== null) {
                        const stdout:Buffer[] = [],
                            spawn:node_childProcess_ChildProcess = node.child_process.spawn("git show -s --format=%H,%ct HEAD", {
                                shell: true,
                                windowsHide: true
                            });
                        spawn.stdout.on("data", function utilities_startServer_tasksGit_gitStat_stdout(buf:Buffer):void {
                            stdout.push(buf);
                        });
                        spawn.on("close", function utilities_startServer_tasksGit_gitStat_close():void {
                            const str:string[] = stdout.join("").toString().split(",");
                            vars.environment.date_commit = Number(str[1]) * 1000;
                            vars.environment.hash = str[0];
                            spawn.kill();
                            readComplete("git");
                        });
                    } else {
                        readComplete("git");
                    }
                };
                node.fs.stat(`${process_path}.git`, gitStat);
            },
            html: function utilities_startServer_taskHTML():void {
                let xterm_file:string = null;
                const flags:store_flag = {
                        css: false,
                        xterm: false
                    },
                    complete = function utilities_startServer_taskHTML_complete():void {
                        if (flags.css === true && flags.xterm === true) {
                            file.read({
                                callback: function utilities_startServer_taskHTML_readXterm_readHTML(fileContents:Buffer):void {
                                    const xterm:string = xterm_file.replace(/\s*\/\/# sourceMappingURL=xterm\.js\.map/, "");
                                    let script:string = dashboard_script.toString().replace("path: \"\",", `path: "${vars.path.project.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}",`).replace(/\(\s*\)/, "(core)");
                                    if (testing === true) {
                                        const testBrowser:string = test_browser.toString().replace(/\/\/ utility\.message_send\(test, "test-browser"\);\s+return test;/, "utility.message_send(test, \"test-browser\");");
                                        script = script.replace(/,\s+local\s*=/, `,\ntestBrowser = ${testBrowser},\nlocal =`).replace("// \"test-browser\": testBrowser,", "\"test-browser\": testBrowser,");
                                    }
                                    vars.dashboard = fileContents.toString()
                                        .replace("${payload.intervals.compose}", (vars.intervals.compose / 1000).toString())
                                        .replace("replace_javascript", `${xterm}const commas=${commas.toString()},dateTime=${dateTime.toString()},time=${time.toString()};(${script}(${core.toString()}));`)
                                        .replace("<style type=\"text/css\"></style>", `<style type="text/css">${vars.css.complete}</style>`);
                                    readComplete("html");
                                },
                                error_terminate: null,
                                location: `${process_path}lib${vars.sep}dashboard${vars.sep}dashboard.html`,
                                no_file: null
                            });
                        }
                    },
                    readXterm = function utilities_startServer_taskHTML_readXterm(file:Buffer):void {
                        xterm_file = file.toString();
                        flags.xterm = true;
                        complete();
                    },
                    readCSS = function utilities_startServer_taskCSS_readCSS(fileContents:Buffer):void {
                        const css:string = fileContents.toString();
                        vars.css.complete = css.slice(css.indexOf(":root"));
                        vars.css.basic = vars.css.complete.slice(0, css.indexOf("/* end basic html */"));
                        flags.css = true;
                        complete();
                    };
                file.read({
                    callback: readCSS,
                    error_terminate: null,
                    location: `${process_path}lib${vars.sep}dashboard${vars.sep}styles.css`,
                    no_file: null
                });
                file.read({
                    callback: readXterm,
                    error_terminate: null,
                    location: `${process_path}node_modules${vars.sep}@xterm${vars.sep}xterm${vars.sep}lib${vars.sep}xterm.js`,
                    no_file: null
                });
            },
            options: function utilities_startServer_taskOptions():void {
                const callback = function utilities_startServer_taskOptions_callback(key:"no_color", iterate:string):void {
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
                            readComplete("options");
                        } else {
                            readComplete("options");
                        }
                    } else {
                        readComplete("options");
                    }
                };
                callback("no_color", "text");
            },
            os: function utilities_startServer_taskOS():void {
                const osCallback = function utilities_startServer_taskOS_osCallback():void {
                        readComplete("os");
                    },
                    osDelay = function utilities_startServer_osDelay():void {
                        os("all", function utilities_startServer_osDelay(payload:socket_data):void {
                            broadcast("dashboard", "dashboard", payload);
                        });
                        osDaily();
                    },
                    osDaily = function utilities_startServer_osDaily():void {
                        setTimeout(osDelay, 86399975);
                    },
                    midnight:number = (function utilities_startServer_midnight():number {
                        const date:Date = new Date(),
                            hours:number = date.getHours(),
                            minutes:number = date.getMinutes(),
                            seconds:number = date.getSeconds(),
                            mill:number = date.getMilliseconds(),
                            night:number = ((23 - hours) * 3600 * 1000) + ((59 - minutes) * 60 * 1000) + ((59 - seconds) * 1000) + (1000 - mill);
                        vars.timeZone_offset = date.getTimezoneOffset() * 60000;
                        return night - 25;
                    }());
                os("all", osCallback);
                setTimeout(osDelay, midnight);
            },
            servers: function utilities_startServer_taskServers():void {
                const callback = function utilities_startServer_taskServers_callback(fileContents:Buffer):void {
                    const configStr:string = (fileContents === null)
                            ? ""
                            : fileContents.toString(),
                        config:store_server_config = (configStr === "" || (/^\s*\{/).test(configStr) === false || (/\}\s*$/).test(configStr) === false)
                            ? null
                            : JSON.parse(configStr) as store_server_config,
                        includes = function utilities_startServer_taskServers_callback_includes(input:string):void {
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
                    readComplete("servers");
                };
                file.read({
                    callback: callback,
                    error_terminate: null,
                    location: `${vars.path.project}servers.json`,
                    no_file: null
                });
            },
            test_browser: function utilities_startServer_taskTestBrowser():void {
                test_stat("test_browser");
            },
            test_list: function utilities_startServer_taskTestList():void {
                test_stat("test_list");
            }
        },
        test_stat = function utilities_startServer_testStat(property:"test_browser"|"test_list"):void {
            if (testing === false) {
                task_definitions[property] = "Ignored unless executing tests.";
                readComplete(property);
            } else {
                const get_value = function utilities_startServer_testStat_getValue(arg:"browser"|"list"):void {
                        let address:string = process.argv[index_browser].replace(`${arg}:`, "");
                        const address_length:number = address.length,
                            stat_address:string = (property === "test_list")
                                ? `${process_path}lib${vars.sep}test${vars.sep + address.replace(/^\.?(\/|\\)/, "")}`
                                : address,
                            stat_browser = function utilities_startServer_testStat_stat(err:node_error, details:node_fs_Stats):void {
                                if (err === null && details !== null && details !== undefined) {
                                    if (arg === "browser" && vars.test.browser_args.length > 0) {
                                        task_definitions.test_browser = `Testing file found for ${arg}: ${vars.text.green + address.replace(/\\\\/g, "\\")} ${vars.test.browser_args.join(" ")} ${vars.text.none}`;
                                    } else {
                                        task_definitions[property] = `Testing file found for ${arg}: ${vars.text.green + address.replace(/\\\\/g, "\\") + vars.text.none}`;
                                    }
                                } else {
                                    task_definitions[property] = `Testing file ${vars.text.angry}not${vars.text.none} found for: ${vars.text.red + address.replace(/\\\\/g, "\\") + vars.text.none}`;
                                }
                                if (property === "test_browser") {
                                    vars.test.test_browser = address;
                                    readComplete("test_browser");
                                } else if (property === "test_list") {
                                    import(address).then(function utilities_startServer_testStat_getValue_list(mod:object):void {
                                        // @ts-expect-error - the Module type definition is not aware of the children exported upon a given module object.
                                        vars.test.list = mod.default;
                                        readComplete("test_list");
                                    });
                                }
                            };
                        if ((address.charAt(0) === "\"" && address.charAt(address_length - 1) === "\"") || (address.charAt(0) === "'" && address.charAt(address_length - 1) === "'")) {
                            address = `"${address.slice(1, address_length - 1)}"`;
                            if (process.platform === "win32") {
                                address = address.replace(/\\/g, "\"\\\"").replace("\"\\", "\\");
                            }
                        }
                        if (property === "test_list") {
                            address = `../test/${address.replace(/\\/g, "/").replace(/^\.?\//, "")}`;
                        }
                        node.fs.stat(stat_address, stat_browser);
                    },
                    len_browser:number = process.argv.length,
                    arg_item:"browser"|"list" = property.replace("test_", "") as "browser"|"list";
                let index_browser:number = len_browser,
                    getting:boolean = false;
                if (index_browser > 0) {
                    do {
                        index_browser = index_browser - 1;
                        if (process.argv[index_browser].indexOf(`${arg_item}:`) === 0) {
                            getting = true;
                            if (index_browser < len_browser - 1) {
                                vars.test.browser_args = process.argv.slice(index_browser + 1);
                            }
                            get_value(arg_item);
                        }
                    } while (index_browser > 0);
                }
                task_definitions.browser_stat = "No option supplied beginning with 'browser:'";
                if (getting === false) {
                    readComplete(property);
                }
            }
        },
        readComplete = function utilities_startServer_readComplete(flag:"compose"|"css"|"git"|"html"|"options"|"os"|"servers"|"test_browser"|"test_list"):void {
            flags[flag] = true;
            // sends a server time update every 950ms
            const clock = function utilities_startServer_readComplete_clock():void {
                    const now:number = Date.now(),
                        payload:services_clock = {
                            time_local: now,
                            time_zulu: (now + (new Date().getTimezoneOffset() * 60000))
                        };
                    broadcast("dashboard", "dashboard", {
                        data: payload,
                        service: "dashboard-clock"
                    });
                    setTimeout(utilities_startServer_readComplete_clock, 950);
                },
                // a minimal configuration for a new dashboard server
                default_server = function utilities_startServer_readComplete_defaultServer(name:string):services_server {
                    return {
                        activate: true,
                        domain_local: [
                            "localhost",
                            "127.0.0.1",
                            "::1"
                        ],
                        encryption: "both",
                        name: name,
                        ports: {
                            open: 0,
                            secure: 0
                        },
                        redirect_asset: {
                            "localhost": {
                                "/lib/assets/*": "/lib/dashboard/*"
                            }
                        },
                        single_socket: false,
                        temporary: false
                    };
                },
                start = function utilities_startServer_readComplete_start():void {
                    const servers:string[] = Object.keys(vars.servers),
                        total:number = (testing === true)
                            ? 1
                            : servers.length,
                        callback = function utilities_startServer_readComplete_start_serverCallback():void {
                            count = count + 1;
                            if (count === total) {
                                const time:number = Number(process.hrtime.bigint() - vars.start_time),
                                    logs:string[] = [
                                        "",
                                        `${vars.text.underline}Application completed ${count_task} startup tasks in ${time / 1e9} seconds.${vars.text.none}`,
                                        "",
                                        `Process ID: ${vars.text.cyan + process.pid + vars.text.none}`,
                                        "",
                                        "Ports:",
                                    ],
                                    pad = function utilities_startServer_readComplete_start_serverCallback_pad(str:string, num:number, dir:"left"|"right"):string {
                                        let item:number = num - str.length;
                                        if (item > 0) {
                                            do {
                                                if (dir === "left") {
                                                    str = ` ${str}`;
                                                } else {
                                                    str = `${str} `;
                                                }
                                                item = item - 1;
                                            } while (item > 0);
                                        }
                                        return str;
                                    },
                                    logItem = function utilities_startServer_readComplete_start_serverCallback_logItem(name:string, encryption:"open"|"secure"):void {
                                        const conflict:boolean = (vars.servers[name].status[encryption] === 0),
                                            portNumber:number = (conflict === true)
                                                ? vars.servers[name].config.ports[encryption]
                                                : vars.servers[name].status[encryption],
                                            portDisplay:string = (conflict === true)
                                                ? vars.text.angry + portNumber + vars.text.none
                                                : portNumber.toString(),
                                            str:string = `${vars.text.angry}*${vars.text.none} ${pad(name, longest.name, "right")} - ${pad(encryption, longest.encryption, "right")} - ${vars.text.green + pad(portDisplay, longest.port, "left") + vars.text.none}`;
                                        if (conflict === true) {
                                            if (portNumber < 1025) {
                                                logs.push(`${str} (Server offline, typically due to insufficient access for reserved port or port conflict.)`);
                                            } else {
                                                logs.push(`${str} (Server offline, typically due to port conflict.)`);
                                            }
                                        } else {
                                            logs.push(str);
                                        }
                                    },
                                    longest:store_number = {
                                        encryption: 4,
                                        name: 0,
                                        port: 0
                                    };
                                servers.sort();
                                let index:number = 0;
                                // get string column width
                                do {
                                    if (servers[index].length > longest.name) {
                                        longest.name = servers[index].length;
                                    }
                                    if (vars.servers[servers[index]].config.encryption === "both") {
                                        if (vars.servers[servers[index]].config.ports["secure"].toString().length > longest.port) {
                                            longest.port = vars.servers[servers[index]].config.ports["secure"].toString().length;
                                        }
                                        if (vars.servers[servers[index]].config.ports["open"].toString().length > longest.port) {
                                            longest.port = vars.servers[servers[index]].config.ports["secure"].toString().length;
                                        }
                                        longest.encryption = 6;
                                    } else if (vars.servers[servers[index]].config.encryption === "secure") {
                                        if (vars.servers[servers[index]].config.ports["secure"].toString().length > longest.port) {
                                            longest.port = vars.servers[servers[index]].config.ports["secure"].toString().length;
                                        }
                                        longest.encryption = 6;
                                    } else {
                                        if (vars.servers[servers[index]].config.ports["open"].toString().length > longest.port) {
                                            longest.port = vars.servers[servers[index]].config.ports["secure"].toString().length;
                                        }
                                    }
                                    index = index + 1;
                                } while (index < servers.length);
                                if (testing === true) {
                                    test_index();
                                } else {
                                    index = 0;
                                    do {
                                        if (vars.servers[servers[index]].config.encryption === "both") {
                                            logItem(servers[index], "open");
                                            logItem(servers[index], "secure");
                                        } else if (vars.servers[servers[index]].config.encryption === "open") {
                                            logItem(servers[index], "open");
                                        } else if (vars.servers[servers[index]].config.encryption === "secure") {
                                            logItem(servers[index], "secure");
                                        }
                                        index = index + 1;
                                    } while (index < servers.length);
                                    log.shell(logs, true);
                                }
                            }
                        };
                    let count:number = 0,
                        index:number = 0;
                    
                    if (testing === true) {
                        server({
                            action: "activate",
                            server: vars.servers.dashboard.config
                        }, callback);
                    } else {
                        do {
                            server({
                                action: "activate",
                                server: vars.servers[servers[index]].config
                            }, callback);
                            index = index + 1;
                        } while (index < total);
                    }
                };
            count_task = count_task + 1;
            log.shell([`${vars.text.angry}*${vars.text.none} ${vars.text.cyan}[${process.hrtime.bigint().time(vars.start_time)}]${vars.text.none} ${flag} - ${task_definitions[flag]}`]);
            if (count_task === len_flags) {
                clock();
                if (testing === true || vars.servers.dashboard === undefined) {
                    server_create({
                        action: "add",
                        server: default_server("dashboard")
                    }, start);
                } else {
                    start();
                }
            }
        },
        task_start = function utilities_startServer_taskStart():void {
            do {
                index_tasks = index_tasks - 1;
                if (testing === false || (testing === true && keys_tasks[index_tasks] !== "servers")) {
                    tasks[keys_tasks[index_tasks]]();
                } else {
                    len_flags = len_flags - 1;
                }
            } while (index_tasks > 0);
        },
        process_path:string = process.argv[1].slice(0, process.argv[1].indexOf(`${vars.sep}lib${vars.sep}`)) + vars.sep,
        keys_tasks:string[] = Object.keys(tasks);
    let len_flags:number = keys_tasks.length,
        index_tasks:number = keys_tasks.length,
        count_task:number = 0;

    BigInt.prototype.time = time;
    Number.prototype.commas = commas;
    Number.prototype.dateTime = dateTime;
    Number.prototype.time = time;
    String.prototype.capitalize = function utilities_startServer_capitalize():string {
        // eslint-disable-next-line no-restricted-syntax
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
    vars.test.testing = testing;
    vars.path.project = (vars.test.testing === true)
        ? `${process_path}test${vars.sep}`
        : process_path;
    vars.path.compose_empty = `${process_path}compose${vars.sep}empty.yml`;
    vars.path.compose = `${vars.path.project}compose${vars.sep}`;
    vars.path.servers = `${vars.path.project}servers${vars.sep}`;

    log.shell([`${vars.text.underline}Executing start up tasks${vars.text.none}`]);

    // update OS list of available shells
    if (process.platform === "win32") {
        const stats = function utilities_startServer_tasksShell_shellWin(index:number):void {
            node.fs.stat(vars.terminal[index], function utilities_startServer_tasksShell_shellWin_callback(err:node_error) {
                if (err !== null) {
                    vars.terminal.splice(index, 1);
                }
                if (index > 0) {
                    utilities_startServer_tasksShell_shellWin(index - 1);
                } else {
                    task_start();
                }
            });
        };
        stats(vars.terminal.length - 1);
    } else {
        file.stat({
            callback: function utilities_startServer_tasksShell_shellStat(stat:node_fs_BigIntStats):void {
                if (stat === null) {
                    vars.terminal.push("/bin/sh");
                } else {
                    file.read({
                        callback: function utilities_startServer_tasksShell_shellStat_shellRead(contents:Buffer):void {
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
                            task_start();
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
};

export default start_server;