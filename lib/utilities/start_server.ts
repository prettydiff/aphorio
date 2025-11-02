
import broadcast from "../transmit/broadcast.ts";
import core from "../browser/core.ts";
import dashboard_script from "../dashboard/dashboard_script.ts";
import docker_ps from "../services/docker_ps.ts";
import file from "./file.ts";
import log from "../core/log.ts";
import node from "../core/node.ts";
import os_lists from "./os_lists.ts";
import server from "../transmit/server.ts";
import server_create from "../services/server_create.ts";
import spawn from "../core/spawn.ts";
import test_browser from "../dashboard/test_browser.ts";
import test_index from "../test/index.ts";
import universal from "../core/universal.ts";
import vars from "../core/vars.ts";

// cspell: words serv

const start_server = function utilities_startServer(process_path:string, testing:boolean):void {
    const task_definitions:store_string = {
            admin: "Determines if the application is run with administrative privileges.",
            compose: "Reads the compose.json file and restores the docker compose containers if docker is available.",
            git: "Get the latest update time and hash.",
            html: "Read's the dashboard's HTML file for dynamic modification.",
            options: "Modify's application settings according to the use of supported optional command line arguments.",
            os_devs: "Gathers a list of devices registered with the OS kernel.",
            os_disk: "Gathers information about disk hardware and partitions.",
            os_intr: "Gathers information about the state of available network interfaces.",
            os_main: "Gathers basic operating system and machine data.",
            os_proc: "Gathers a list of running processes.",
            os_serv: "Gathers a list of known services.",
            os_sock: "Gathers a list of known network sockets.",
            os_user: "Gathers a list of user accounts.",
            servers: "Reads the servers.json file to dynamically standup and populate configured web servers.",
            test_browser: "Finds a designed web browser for test automation if supplied as a terminal argument.",
            test_list: null
        },
        tasks:store_function = {
            admin: function utilities_startServer_admin():void {
                spawn(vars.commands.admin_check, function utilities_startServer_admin_callback(output:core_spawn_output):void {
                    const std:string = output.stdout.replace(/\s+/g, "");
                    if (std === "0" || std === "true") {
                        vars.os.process.admin = true;
                    }
                    readComplete("admin");
                }, {
                    shell: (process.platform === "win32")
                        ? "powershell"
                        : "sh"
                }).child();
            },
            // compose: function utilities_startServer_taskCompose():void {
            //     const readCompose = function utilities_startServer_taskCompose_readCompose(fileContents:Buffer):void {
            //         const callback = function utilities_startServer_taskCompose_readCompose_dockerCallback():void {
            //             readComplete("compose");
            //         };
            //         if (fileContents === null) {
            //             vars.compose = {
            //                 containers: {},
            //                 variables: {}
            //             };
            //         } else {
            //             vars.compose = JSON.parse(fileContents.toString());
            //         }
            //         docker_ps(callback);
            //     };
            //     file.read({
            //         callback: readCompose,
            //         location: `${vars.path.project}compose.json`,
            //         no_file: null,
            //         section: "startup"
            //     });
            // },
            git: function utilities_startServer_tasksGit():void {
                const gitStat = function utilities_startServer_tasksGit_gitStat(error:node_error, stat:node_fs_Stats):void {
                    if (error === null && stat !== null) {
                        const spawn_item:core_spawn = spawn("git show -s --format=%H,%ct HEAD", function utilities_startServer_tasksGit_gitStat_close(output:core_spawn_output):void {
                            const str:string[] = output.stdout.split(",");
                            vars.environment.date_commit = Number(str[1]) * 1000;
                            vars.environment.hash = str[0];
                            spawn_item.spawn.kill();
                            readComplete("git");
                        }, {
                            cwd: process_path.slice(0, process_path.length - 1)
                        });
                        spawn_item.child();
                    } else {
                        readComplete("git");
                    }
                };
                node.fs.stat(`${process_path}.git`, gitStat);
            },
            html: function utilities_startServer_taskHTML():void {
                let xterm_js:string = null,
                    xterm_css:string = null;
                const flags:store_flag = {
                        css: false,
                        xterm_css: false,
                        xterm_js: false
                    },
                    complete = function utilities_startServer_taskHTML_complete():void {
                        if (flags.css === true && flags.xterm_css === true && flags.xterm_js === true) {
                            file.read({
                                callback: function utilities_startServer_taskHTML_readXterm_readHTML(fileContents:Buffer):void {
                                    const xterm:string = xterm_js.replace(/\s*\/\/# sourceMappingURL=xterm\.js\.map/, "");
                                    let script:string = dashboard_script.toString().replace("path: \"\",", `path: "${vars.path.project.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}",`).replace(/\(\s*\)/, "(core)");
                                    if (testing === true) {
                                        const testBrowser:string = test_browser.toString().replace(/\/\/ utility\.message_send\(test, "test-browser"\);\s+return test;/, "utility.message_send(test, \"test-browser\");");
                                        script = script.replace(/,\s+local\s*=/, `,\ntestBrowser = ${testBrowser},\nlocal =`).replace("// \"test-browser\": testBrowser,", "\"test-browser\": testBrowser,");
                                    }
                                    vars.dashboard_headers = fileContents.toString()
                                        .replace("${payload.intervals.compose}", (vars.intervals.compose / 1000).toString())
                                        .replace("replace_javascript", `${xterm}const universal={commas:${universal.commas.toString()},dateTime:${universal.dateTime.toString()},time:${universal.time.toString()}};(${script}(${core.toString()}));`)
                                        .replace("<style type=\"text/css\"></style>", `<style type="text/css">${vars.css.complete + xterm_css}</style>`);
                                    readComplete("html");
                                },
                                location: `${process_path}lib${vars.path.sep}dashboard${vars.path.sep}dashboard.html`,
                                no_file: null,
                                section: "startup"
                            });
                        }
                    },
                    readXtermCSS = function utilities_startServer_taskHTML_readXtermCSS(file:Buffer):void {
                        xterm_css = file.toString();
                        flags.xterm_css = true;
                        complete();
                    },
                    readXtermJS = function utilities_startServer_taskHTML_readXtermJS(file:Buffer):void {
                        xterm_js = file.toString();
                        flags.xterm_js = true;
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
                    location: `${process_path}lib${vars.path.sep}dashboard${vars.path.sep}styles.css`,
                    no_file: null,
                    section: "startup"
                });
                file.read({
                    callback: readXtermCSS,
                    location: `${process_path}node_modules${vars.path.sep}@xterm${vars.path.sep}xterm${vars.path.sep}css${vars.path.sep}xterm.css`,
                    no_file: null,
                    section: "startup"
                });
                file.read({
                    callback: readXtermJS,
                    location: `${process_path}node_modules${vars.path.sep}@xterm${vars.path.sep}xterm${vars.path.sep}lib${vars.path.sep}xterm.js`,
                    no_file: null,
                    section: "startup"
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
            os_devs: function utilities_startServer_taskOSDevs():void {
                const callback = function utilities_startServer_taskOSDevs_callback():void {
                        readComplete("os_devs");
                    };
                os_lists("devs", callback);
            },
            os_disk: function utilities_startServer_taskOSDisk():void {
                const callback = function utilities_startServer_taskOSDisk_callback():void {
                        readComplete("os_disk");
                    };
                os_lists("disk", callback);
            },
            os_intr: function utilities_startServer_taskOSIntr():void {
                const callback = function utilities_startServer_taskOSIntr_callback():void {
                    readComplete("os_intr");
                };
                os_lists("intr", callback);
            },
            os_main: function utilities_startServer_taskOSMain():void {
                const callback = function utilities_startServer_taskOSMain_callback():void {
                        readComplete("os_main");
                        task_start();
                    },
                    osDelay = function utilities_startServer_taskOSMain_osDelay():void {
                        os_lists("all", function utilities_startServer_taskOSMain_osDelay_callback(payload:socket_data):void {
                            broadcast(vars.dashboard_id, "dashboard", payload);
                        });
                        osDaily();
                    },
                    osDaily = function utilities_startServer_taskOSMain_osDaily():void {
                        setTimeout(osDelay, 86399975);
                    },
                    midnight:number = (function utilities_startServer_taskOSMain_midnight():number {
                        const date:Date = new Date(),
                            hours:number = date.getHours(),
                            minutes:number = date.getMinutes(),
                            seconds:number = date.getSeconds(),
                            mill:number = date.getMilliseconds(),
                            night:number = ((23 - hours) * 3600 * 1000) + ((59 - minutes) * 60 * 1000) + ((59 - seconds) * 1000) + (1000 - mill);
                        vars.timeZone_offset = date.getTimezoneOffset() * 60000;
                        return night - 25;
                    }());
                os_lists("main", callback);
                setTimeout(osDelay, midnight);
            },
            os_proc: (process.platform === "win32")
                ? function utilities_startServer_taskOSProcWindows():void {
                    readComplete("os_proc");
                }
                : function utilities_startServer_taskOSProc():void {
                    const callback = function utilities_startServer_taskOSProc_callback():void {
                        readComplete("os_proc");
                    };
                    os_lists("proc", callback);
                },
            os_serv: function utilities_startServer_taskOSServ():void {
                const callback = function utilities_startServer_taskOSServ_callback():void {
                    readComplete("os_serv");
                };
                os_lists("serv", callback);
            },
            os_sock: function utilities_startServer_taskOSSock():void {
                const callback = function utilities_startServer_taskOSSock_callback():void {
                    readComplete("os_sock");
                };
                os_lists("sock", callback);
            },
            os_user: function utilities_startServer_taskOSUser():void {
                const callback = function utilities_startServer_taskOSUser_callback():void {
                    readComplete("os_user");
                };
                os_lists("user", callback);
            },
            servers: function utilities_startServer_taskServers():void {
                const callback = function utilities_startServer_taskServers_callback(fileContents:Buffer):void {
                    const configStr:string = (fileContents === null)
                            ? ""
                            : fileContents.toString(),
                        config:config_servers_file = (configStr === "" || (/^\s*\{/).test(configStr) === false || (/\}\s*$/).test(configStr) === false)
                            ? null
                            : JSON.parse(configStr) as config_servers_file,
                        includes = function utilities_startServer_taskServers_callback_includes(input:string):void {
                            if (vars.interfaces.includes(input) === false && input.toLowerCase().indexOf("fe80") !== 0) {
                                vars.interfaces.push(input);
                            }
                        },
                        interfaces:{ [index: string]: node_os_NetworkInterfaceInfo[]; } = node.os.networkInterfaces(),
                        keys_int:string[] = Object.keys(interfaces),
                        keys_srv:string[] = (config === null)
                            ? null
                            : Object.keys(config.servers);
                    let index_int:number = keys_int.length,
                        index_srv:number = (config === null)
                            ? 0
                            : keys_srv.length,
                        server:server = null,
                        sub:number = 0;
                    if (index_srv > 0) {
                        vars.dashboard_id = config.dashboard_id;
                        do {
                            index_srv = index_srv - 1;
                            index_int = keys_int.length;
                            server = {
                                config: config.servers[keys_srv[index_srv]],
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
                            vars.servers[server.config.id] = server;
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
                    location: `${vars.path.project}servers.json`,
                    no_file: null,
                    section: "startup"
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
                                ? `${process_path}lib${vars.path.sep}test${vars.path.sep + address.replace(/^\.?(\/|\\)/, "")}`
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
        readComplete = function utilities_startServer_readComplete(flag:"admin"|"compose"|"git"|"html"|"options"|"os_devs"|"os_disk"|"os_intr"|"os_main"|"os_proc"|"os_serv"|"os_sock"|"os_user"|"servers"|"test_browser"|"test_list"):void {
            // sends a server time update every 950ms
            const clock = function utilities_startServer_readComplete_clock():void {
                    const now:number = Date.now(),
                        payload:services_clock = {
                            time_local: now,
                            time_zulu: (now + (new Date().getTimezoneOffset() * 60000))
                        };
                    broadcast(vars.dashboard_id, "dashboard", {
                        data: payload,
                        service: "dashboard-clock"
                    });
                    setTimeout(utilities_startServer_readComplete_clock, 950);
                },
                // a minimal configuration for a new dashboard server
                default_server:services_server = {
                    activate: true,
                    domain_local: [
                        "localhost",
                        "127.0.0.1",
                        "::1"
                    ],
                    encryption: "both",
                    id: "",
                    name: "dashboard",
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
                                    logItem = function utilities_startServer_readComplete_start_serverCallback_logItem(id:string, encryption:"open"|"secure"):void {
                                        const conflict:boolean = (vars.servers[id].status[encryption] === 0),
                                            portNumber:number = (conflict === true)
                                                ? vars.servers[id].config.ports[encryption]
                                                : vars.servers[id].status[encryption],
                                            portDisplay:string = (conflict === true)
                                                ? vars.text.angry + portNumber + vars.text.none
                                                : portNumber.toString(),
                                            name_server:string = vars.servers[id].config.name,
                                            str:string = `${vars.text.angry}*${vars.text.none} ${pad(name_server, longest.name, "right")} - ${pad(encryption, longest.encryption, "right")} - ${vars.text.green + pad(portDisplay, longest.port, "left") + vars.text.none}`;
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
                                let index:number = 0,
                                    name:string = "";
                                servers.sort();
                                // get string column width
                                do {
                                    name = vars.servers[servers[index]].config.name;
                                    if (name.length > longest.name) {
                                        longest.name = name.length;
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
            log.shell([`${vars.text.angry}*${vars.text.none} ${vars.text.cyan}[${process.hrtime.bigint().time(vars.start_time)}]${vars.text.none} ${vars.text.green + flag + vars.text.none} - ${task_definitions[flag]}`]);
            // to troubleshoot which tasks do not run, in test mode servers task is not executed
            // delete task_definitions[flag];console.log(Object.keys(task_definitions));
            if (count_task === len_flags) {
                clock();
                if (testing === true || vars.servers[vars.dashboard_id] === undefined) {
                    server_create({
                        action: "add",
                        server: default_server
                    }, start, true);
                } else {
                    start();
                }
            }
        },
        task_start = function utilities_startServer_taskStart():void {
            do {
                index_tasks = index_tasks - 1;
                if (keys_tasks[index_tasks] !== "os_main") {
                    if (testing === false || (keys_tasks[index_tasks] !== "servers" && testing === true)) {
                        tasks[keys_tasks[index_tasks]]();
                    }
                }
            } while (index_tasks > 0);
        },
        keys_tasks:string[] = Object.keys(tasks),
        len_flags:number = (testing === true)
            ? keys_tasks.length - 1 // servers task is not run in test mode
            : keys_tasks.length;
    let index_tasks:number = keys_tasks.length,
        count_task:number = 0;

    BigInt.prototype.time = universal.time;
    Number.prototype.commas = universal.commas;
    Number.prototype.dateTime = universal.dateTime;
    Number.prototype.time = universal.time;
    String.prototype.capitalize = function utilities_startServer_capitalize():string {
        // eslint-disable-next-line no-restricted-syntax
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    vars.hashes = node.crypto.getHashes();

    log.shell(["", `${vars.text.underline}Executing start up tasks${vars.text.none}`]);

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
                    tasks.os_main();
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
                            tasks.os_main();
                        },
                        location: "/etc/shells",
                        no_file: null,
                        section: "startup"
                    });
                }
            },
            location: "/etc/shells",
            no_file: null,
            section: "startup"
        });
    }
};

export default start_server;