
import broadcast from "../transmit/broadcast.ts";
import clock from "../services/clock.ts";
import core from "../browser/core.ts";
import dashboard_script from "../dashboard/dashboard_script.ts";
import docker from "../services/docker.ts";
import file from "./file.ts";
import log from "../core/log.ts";
import node from "../core/node.ts";
import os_lists from "./os_lists.ts";
import server from "../transmit/server.ts";
import server_create from "../services/server_create.ts";
import spawn from "../core/spawn.ts";
import statistics from "../services/statistics.ts";
import test_browser from "../dashboard/test_browser.ts";
import test_index from "../test/index.ts";
import universal from "../core/universal.ts";
import vars from "../core/vars.ts";

// cspell: words serv, stcp, sudp

const start_server = function utilities_startServer(process_path:string, testing:boolean):void {
    const prerequisite_tasks:core_start_tasks = {
            // prerequisite tasks will execute serially in the order presented
            admin: {
                label: "Determines if the application is run with administrative privileges.",
                task: function utilities_startServer_admin():void {
                    spawn(vars.commands.admin_check, function utilities_startServer_admin_callback(output:core_spawn_output):void {
                        const std:string = output.stdout.replace(/\s+/g, "");
                        if (std === "0" || std === "true") {
                            vars.os.process.admin = true;
                        }
                        start_prerequisites();
                    }, {
                        shell: (process.platform === "win32")
                            ? "powershell"
                            : "sh"
                    }).execute();
                }
            },
            features: {
                label: "Reading the features.json file and remove parts of the application.",
                task: function utilities_startServer_features():void {
                    const flags:store_string = {
                            feature: null,
                            html: null
                        },
                        ready = function utilities_startServer_features_ready():void {
                            if (typeof flags.feature === "string" && typeof flags.html === "string") {
                                const feature_list:store_flag = JSON.parse(flags.feature),
                                    section = function utilities_startServer_features_ready_section(section_name:type_dashboard_features, label:string):void {
                                        if (feature_list[section_name] !== true) {
                                            const end_html:number = flags.html.indexOf(`<!-- ${section_name} end -->`),
                                                start_html:number = flags.html.indexOf(`<!-- ${section_name} start -->`),
                                                end_script:number = script.indexOf(`// ${section_name} end`),
                                                start_script:number = script.indexOf(`// ${section_name} start`);
                                            if (start_html > 0 && end_html > 0) {
                                                flags.html = flags.html.slice(0, start_html) + flags.html.slice(end_html + section_name.length + 13);
                                            }
                                            if (start_script > 0 && end_script > 0) {
                                                script = script.slice(0, start_script) + script.slice(end_script + section_name.length + 8);
                                            }
                                            flags.html = (section_name === "servers-web")
                                                ? flags.html.replace(`<li><button class="nav-focus" data-section="servers-web">${label}</button></li>`, "")
                                                : flags.html.replace(`<li><button data-section="${section_name}">${label}</button></li>`, "");
                                            vars.environment.features[section_name] = false;
                                        } else {
                                            vars.environment.features[section_name] = true;
                                        }
                                    },
                                    parent = function utilities_startServer_features_ready_parent():void {
                                        const nav_end:number = flags.html.indexOf("</nav>"),
                                            empty:number = flags.html.slice(nav_start, nav_end).indexOf("<ul></ul>");
                                        let start:number = empty + nav_start,
                                            end:number = empty + nav_start;
                                        if (empty > 0) {
                                            do {
                                                end = end + 1;
                                            } while (flags.html.slice(end - 4, end) !== "div>");
                                            do {
                                                start = start - 1;
                                            } while (flags.html.slice(start, start + 4) !== "<div");
                                            flags.html = flags.html.slice(0, start) + flags.html.slice(end);
                                            utilities_startServer_features_ready_parent();
                                        } else {
                                            if (vars.environment.features["servers-web"] === false) {
                                                flags.html = flags.html.replace("<button", "<button class=\"nav-focus\"");
                                            }
                                            if ((/<h2>Navigation<\/h2>\s*<div class="first">/).test(flags.html) === false) {
                                                flags.html = flags.html.replace(/<h2>Navigation<\/h2>\s*<div>/, "<h2>Navigation</h2> <div class=\"first\">");
                                            }
                                            start_prerequisites();
                                        }
                                    },
                                    nav_start:number = flags.html.indexOf("<nav>");
                                section("application-logs", "Application Logs");
                                section("compose-containers", "Docker Compose");
                                section("devices", "Devices");
                                section("disks", "Disks");
                                section("dns-query", "DNS Query");
                                section("file-system", "File System");
                                section("hash", "Hash / Base64");
                                section("interfaces", "Interfaces");
                                section("os-machine", "OS/Machine");
                                section("ports-application", "App Ports");
                                section("processes", "Processes");
                                section("servers-web", "Web Servers");
                                section("services", "Services");
                                section("sockets-application-tcp", "App TCP Sockets");
                                section("sockets-application-udp", "App UDP Sockets");
                                section("sockets-os-tcp", "OS TCP Sockets");
                                section("sockets-os-udp", "OS UDP Sockets");
                                section("statistics", "Statistics");
                                section("terminal", "Terminal");
                                section("test-http", "HTTP Test");
                                section("test-websocket", "WebSocket Test");
                                section("users", "Users");
                                parent();
                                vars.environment.dashboard_page = flags.html;
                            }
                        },
                        callback_html = function utilities_startServer_features_callbackHTML(html_file:Buffer):void {
                            flags.html = html_file.toString();
                            ready();
                        },
                        callback_feature = function utilities_startServer_features_callbackFeature(feature_file:Buffer):void {
                            flags.feature = feature_file.toString();
                            ready();
                        };
                    file.read({
                        callback: callback_html,
                        location: `${process_path}lib${vars.path.sep}dashboard${vars.path.sep}dashboard.html`,
                        no_file: null,
                        section: "startup"
                    });
                    file.read({
                        callback: callback_feature,
                        location: `${vars.path.process}features.json`,
                        no_file: null,
                        section: "startup"
                    });
                }
            },
            os_main: {
                label: "Gathers basic operating system and machine data.",
                task: function utilities_startServer_taskOSMain():void {
                    const osDelay = function utilities_startServer_taskOSMain_osDelay():void {
                            os_lists("all", function utilities_startServer_taskOSMain_osDelay_callback(payload:socket_data):void {
                                broadcast(vars.environment.dashboard_id, "dashboard", payload);
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
                            vars.environment.timeZone_offset = date.getTimezoneOffset() * 60000;
                            return night - 25;
                        }());
                    os_lists("main", start_prerequisites);
                    setTimeout(osDelay, midnight);
                }
            },
            compose: {
                label: "Restores the docker compose containers if docker is available.",
                task: function utilities_startServer_compose():void {
                    if (vars.environment.features["compose-containers"] === true) {
                        docker.list(start_prerequisites);
                    } else {
                        start_prerequisites();
                    }
                }
            }
        },
        tasks:core_start_tasks = {
            cgroup: {
                label: "Find Linux cgroup address for gathering precision docker performance metrics.",
                task: function utilities_startServer_cgroup():void {
                    if (vars.environment.features["compose-containers"] === true && vars.compose.status === "" && vars.os.process.admin === true) {
                        const addresses:string[] = [
                                "/sys/fs/cgroup/system.slice/",
                                "/sys/fs/cgroup/docker/",
                                "/sys/fs/cgroup/memory/system.slice/",
                                "/sys/fs/cgroup/memory/docker/"
                            ],
                            no_file = function utilities_startServer_cgroup_noFile():void {
                                index = index + 1;
                                if (index < 4) {
                                    file.stat({
                                        callback: stat_callback,
                                        location: addresses[index],
                                        no_file: utilities_startServer_cgroup_noFile,
                                        section: "startup"
                                    });
                                } else {
                                    vars.path.cgroup = null;
                                    complete_tasks("cgroup");
                                }
                            },
                            stat_callback = function utilities_startServer_cgroup_statCallback(stats:node_fs_BigIntStats, location:string):void {
                                vars.path.cgroup = location;
                                complete_tasks("cgroup");
                            };
                        let index:number = -1;
                        no_file();
                    } else {
                        vars.path.cgroup = null;
                        complete_tasks("cgroup");
                    }
                }
            },
            file: {
                label: "Unix 'file' command discovered.",
                task: function utilities_startServer_file():void {
                    if (vars.environment.features["file-system"] === true) {
                        if (process.platform === "win32") {
                            vars.commands.file = `${vars.path.process}node_modules${vars.path.sep}file${vars.path.sep}bin${vars.path.sep}file.exe -bi `;
                            complete_tasks("file");
                            return;
                        }
                        spawn("file --help", function utilities_startServer_file_spawn(output:core_spawn_output):void {
                            if (output.stdout.indexOf("Usage: file [OPTION...] [FILE...]") === 0) {
                                vars.commands.file = "file -bi ";
                            }
                            complete_tasks("file");
                        }).execute();
                    } else {
                        complete_tasks("file");
                    }
                }
            },
            git: {
                label: "Get the latest update time and hash.",
                task: function utilities_startServer_tasksGit():void {
                    const gitStat = function utilities_startServer_tasksGit_gitStat(error:node_error, stat:node_fs_Stats):void {
                        if (error === null && stat !== null) {
                            const spawn_item:core_spawn = spawn("git show -s --format=%H,%ct HEAD", function utilities_startServer_tasksGit_gitStat_close(output:core_spawn_output):void {
                                const str:string[] = output.stdout.split(",");
                                vars.environment.date_commit = Number(str[1]) * 1000;
                                vars.environment.hash = str[0];
                                spawn_item.spawn.kill();
                                complete_tasks("git");
                            }, {
                                cwd: process_path.slice(0, process_path.length - 1)
                            });
                            spawn_item.execute();
                        } else {
                            complete_tasks("git");
                        }
                    };
                    node.fs.stat(`${process_path}.git`, gitStat);
                }
            },
            html: {
                label: "Read's the dashboard's HTML file for dynamic modification.",
                task: function utilities_startServer_taskHTML():void {
                    let chart_js:string = null,
                        xterm_js:string = null,
                        xterm_css:string = null;
                    const flags:store_flag = {
                            chart: false,
                            css: false,
                            xterm_css: false,
                            xterm_js: false
                        },
                        complete = function utilities_startServer_taskHTML_complete(key:string):void {
                            flags[key] = true;
                            if (flags.chart === true && flags.css === true && flags.xterm_css === true && flags.xterm_js === true) {
                                const xterm:string = xterm_js.replace(/\s*\/\/# sourceMappingURL=xterm\.js\.map/, ""),
                                    chart:string = chart_js.replace(/\/\/# sourceMappingURL=chart\.umd.min\.js\.map\s*$/, "");
                                let total_script:string = null;
                                if (testing === true) {
                                    const testBrowser:string = test_browser
                                        .toString()
                                        .replace(/\/\/ utility\.message_send\(test, "test-browser"\);\s+return test;/, "utility.message_send(test, \"test-browser\");");
                                    script = script
                                        .replace(/,\s+local\s*=/, `,\ntestBrowser = ${testBrowser},\nlocal =`)
                                        .replace("// \"test-browser\": testBrowser,", "\"test-browser\": testBrowser,");
                                }
                                total_script = `${chart + xterm}const universal={bytes:${universal.bytes.toString()},bytes_big:${universal.bytes_big.toString()},capitalize:${universal.capitalize.toString()},commas:${universal.commas.toString()},dateTime:${universal.dateTime.toString()},time:${universal.time.toString()}};(${script}(${core.toString()}));`;
                                vars.environment.dashboard_page = vars.environment.dashboard_page
                                    .replace(/Server Management Dashboard/g, `${vars.environment.name.capitalize()} Dashboard`)
                                    .replace("replace_javascript", total_script)
                                    .replace("<style type=\"text/css\"></style>", `<style type="text/css">${vars.css.complete + xterm_css}</style>`);
                                complete_tasks("html");
                            }
                        };
                    if (vars.environment.features.terminal === true) {
                        file.read({
                            callback: function utilities_startServer_taskHTML_readXtermCSS(file:Buffer):void {
                                xterm_css = file.toString();
                                complete("xterm_css");
                            },
                            location: `${process_path}node_modules${vars.path.sep}@xterm${vars.path.sep}xterm${vars.path.sep}css${vars.path.sep}xterm.css`,
                            no_file: null,
                            section: "startup"
                        });
                        file.read({
                            callback: function utilities_startServer_taskHTML_readXtermJS(file:Buffer):void {
                                xterm_js = file.toString();
                                complete("xterm_js");
                            },
                            location: `${process_path}node_modules${vars.path.sep}@xterm${vars.path.sep}xterm${vars.path.sep}lib${vars.path.sep}xterm.js`,
                            no_file: null,
                            section: "startup"
                        });
                    } else {
                        flags.xterm_css = true;
                        flags.xterm_js = true;
                        xterm_js = "";
                        xterm_css = "";
                    }
                    if (vars.environment.features.statistics === true) {
                        file.read({
                            callback: function utilities_startServer_taskHTML_readChart(file:Buffer):void {
                                chart_js = file.toString();
                                complete("chart");
                            },
                            location: `${process_path}node_modules${vars.path.sep}chart.js${vars.path.sep}dist${vars.path.sep}chart.umd.min.js`,
                            no_file: null,
                            section: "startup"
                        });
                    } else {
                        flags.chart = true;
                        chart_js = "";
                    }
                    file.read({
                        callback: function utilities_startServer_taskCSS_readCSS(fileContents:Buffer):void {
                            const css:string = fileContents.toString();
                            vars.css.complete = css.slice(css.indexOf(":root"));
                            vars.css.basic = vars.css.complete.slice(0, css.indexOf("/* end basic html */"));
                            complete("css");
                        },
                        location: `${process_path}lib${vars.path.sep}dashboard${vars.path.sep}styles.css`,
                        no_file: null,
                        section: "startup"
                    });
                }
            },
            os_devs: {
                label: "Gathers a list of devices registered with the OS kernel.",
                task: function utilities_startServer_taskOSDevs():void {
                    if (vars.environment.features.devices === true) {
                        const callback = function utilities_startServer_taskOSDevs_callback():void {
                                complete_tasks("os_devs");
                            };
                        os_lists("devs", callback);
                    } else {
                        complete_tasks("os_devs");
                    }
                }
            },
            os_disk: {
                label: "Gathers information about disk hardware and partitions.",
                task: function utilities_startServer_taskOSDisk():void {
                    if (vars.environment.features.disks === true) {
                        const callback = function utilities_startServer_taskOSDisk_callback():void {
                                complete_tasks("os_disk");
                            };
                        os_lists("disk", callback);
                    } else {
                        complete_tasks("os_disk");
                    }
                }
            },
            os_intr: {
                label: "Gathers information about the state of available network interfaces.",
                task: function utilities_startServer_taskOSIntr():void {
                    if (vars.environment.features.interfaces === true) {
                        const callback = function utilities_startServer_taskOSIntr_callback():void {
                            complete_tasks("os_intr");
                        };
                        os_lists("intr", callback);
                    } else {
                        complete_tasks("os_intr");
                    }
                }
            },
            os_proc: {
                label: "Gathers a list of running processes.",
                task: (process.platform === "win32")
                    ? function utilities_startServer_taskOSProcWindows():void {
                        complete_tasks("os_proc");
                    }
                    : function utilities_startServer_taskOSProc():void {
                        if (vars.environment.features.processes === true) {
                            const callback = function utilities_startServer_taskOSProc_callback():void {
                                complete_tasks("os_proc");
                            };
                            os_lists("proc", callback);
                        } else {
                            complete_tasks("os_proc");
                        }
                    }
            },
            os_serv: {
                label: "Gathers a list of known services.",
                task: function utilities_startServer_taskOSServ():void {
                    if (vars.environment.features.services === true) {
                        const callback = function utilities_startServer_taskOSServ_callback():void {
                            complete_tasks("os_serv");
                        };
                        os_lists("serv", callback);
                    } else {
                        complete_tasks("os_serv");
                    }
                }
            },
            os_stcp: {
                label: "Gathers a list of known network TCP sockets.",
                task: function utilities_startServer_taskOSSock():void {
                    if (vars.environment.features["sockets-os-tcp"] === true) {
                        const callback = function utilities_startServer_taskOSSock_callback():void {
                            complete_tasks("os_stcp");
                        };
                        os_lists("stcp", callback);
                    } else {
                        complete_tasks("os_stcp");
                    }
                }
            },
            os_sudp: {
                label: "Gathers a list of known network UDP sockets.",
                task: function utilities_startServer_taskOSSock():void {
                    if (vars.environment.features["sockets-os-udp"] === true) {
                        const callback = function utilities_startServer_taskOSSock_callback():void {
                            complete_tasks("os_sudp");
                        };
                        os_lists("sudp", callback);
                    } else {
                        complete_tasks("os_sudp");
                    }
                }
            },
            os_user: {
                label: "Gathers a list of user accounts.",
                task: function utilities_startServer_taskOSUser():void {
                    if (vars.environment.features.users === true) {
                        const callback = function utilities_startServer_taskOSUser_callback():void {
                            complete_tasks("os_user");
                        };
                        os_lists("user", callback);
                    } else {
                        complete_tasks("os_user");
                    }
                }
            },
            servers: {
                label: "Reads the servers.json file to dynamically standup and populate configured web servers.",
                task: function utilities_startServer_taskServers():void {
                    const callback = function utilities_startServer_taskServers_callback(fileContents:Buffer):void {
                        const configStr:string = (fileContents === null)
                                ? ""
                                : fileContents.toString(),
                            config:core_servers_file = (configStr === "" || (/^\s*\{/).test(configStr) === false || (/\}\s*$/).test(configStr) === false)
                                ? null
                                : JSON.parse(configStr) as core_servers_file,
                            includes = function utilities_startServer_taskServers_callback_includes(input:string):void {
                                if (vars.environment.interfaces.includes(input) === false && input.toLowerCase().indexOf("fe80") !== 0) {
                                    vars.environment.interfaces.push(input);
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
                        if (config !== null) {
                            vars.environment.dashboard_id = config.dashboard_id;
                            if (config.stats !== undefined) {
                                vars.stats.frequency = config.stats.frequency;
                                vars.stats.records = config.stats.records;
                            }
                        }
                        if (index_srv > 0) {
                            vars.compose.variables = config["compose-variables"];
                            do {
                                index_srv = index_srv - 1;
                                if (vars.environment.features["servers-web"] === true || config.servers[keys_srv[index_srv]].id === config.dashboard_id) {
                                    index_int = keys_int.length;
                                    server = {
                                        certs: null,
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
                                }
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
                        complete_tasks("servers");
                    };
                    file.read({
                        callback: callback,
                        location: `${vars.path.project}servers.json`,
                        no_file: null,
                        section: "startup"
                    });
                }
            },
            test_browser: {
                label: "Finds a designed web browser for test automation if supplied as a terminal argument.",
                task: function utilities_startServer_taskTestBrowser():void {
                    test_stat("test_browser");
                }
            },
            test_list: {
                label: null,
                task: function utilities_startServer_taskTestList():void {
                    test_stat("test_list");
                }
            },
            version: {
                label: "Get application version number from package.json file.",
                task: function utilities_startServer_version():void {
                    file.read({
                        callback: function utilities_startServer_version_callback(file_contents:Buffer):void {
                            vars.environment.version = JSON.parse(file_contents.toString()).version;
                            complete_tasks("version");
                        },
                        location: `${vars.path.project}package.json`,
                        no_file: null,
                        section: "startup"
                    });
                }
            }
        },
        test_stat = function utilities_startServer_testStat(property:"test_browser"|"test_list"):void {
            if (testing === false) {
                tasks[property].label = "Ignored unless executing tests.";
                complete_tasks(property);
            } else {
                const get_value = function utilities_startServer_testStat_getValue(arg:"browser"|"list"):void {
                    let address:string = vars.options[arg];
                    const address_length:number = address.length,
                        stat_address:string = (property === "test_list")
                            ? `${process_path}lib${vars.path.sep}test${vars.path.sep + address.replace(/^\.?(\/|\\)/, "")}`
                            : address,
                        stat_browser = function utilities_startServer_testStat_stat(err:node_error, details:node_fs_Stats):void {
                            if (err === null && details !== null && details !== undefined) {
                                if (arg === "browser" && vars.test.browser_args.length > 0) {
                                    tasks.test_browser.label = `Testing file found for ${arg}: ${vars.text.green + address.replace(/\\\\/g, "\\")} ${vars.test.browser_args.join(" ")} ${vars.text.none}`;
                                } else {
                                    tasks[property].label = `Testing file found for ${arg}: ${vars.text.green + address.replace(/\\\\/g, "\\") + vars.text.none}`;
                                }
                            } else {
                                tasks[property].label = `Testing file ${vars.text.angry}not${vars.text.none} found for: ${vars.text.red + address.replace(/\\\\/g, "\\") + vars.text.none}`;
                            }
                            if (property === "test_browser") {
                                vars.test.test_browser = address;
                                complete_tasks("test_browser");
                            } else if (property === "test_list") {
                                import(address).then(function utilities_startServer_testStat_getValue_list(mod:object):void {
                                    // @ts-expect-error - the Module type definition is not aware of the children exported upon a given module object.
                                    vars.test.list = mod.default;
                                    complete_tasks("test_list");
                                });
                            }
                        };
                    if (address === "") {
                        complete_tasks(`test_${arg}`);
                        return;
                    }
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
                };
                get_value("browser");
                get_value("list");
                tasks.browser_stat.label = "No option supplied beginning with 'browser:'";
            }
        },
        log_task = function utilities_startServer_logTask(list:"prerequisite"|"task", flag:type_start_pre_tasks | type_start_primary_tasks):void {
            const label:string = (list === "task")
                ? tasks[flag].label
                : prerequisite_tasks[flag].label;
            log.shell([`${vars.text.angry}*${vars.text.none} ${vars.text.cyan}[${process.hrtime.bigint().time(vars.environment.start_time)}]${vars.text.none} ${vars.text.green + flag + vars.text.none} - ${label}`]);
        },
        complete_tasks = function utilities_startServer_completeTasks(flag:type_start_primary_tasks):void {
            log_task("task", flag);
            // to troubleshoot which tasks do not run, in test mode servers task is not executed
            // delete task_definitions[flag];console.log(Object.keys(task_definitions));
            count_task = count_task + 1;
            if (count_task === len_tasks) {
                // sends a server time update every 950ms
                const default_server:services_server = {
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
                    temporary: false,
                    upgrade: true
                },
                start = function utilities_startServer_readComplete_start():void {
                    const servers:string[] = Object.keys(vars.servers),
                        total:number = (testing === true)
                            ? 1
                            : servers.length,
                        callback = function utilities_startServer_readComplete_start_serverCallback():void {
                            count = count + 1;
                            if (count === total) {
                                const time:number = Number(process.hrtime.bigint() - vars.environment.start_time),
                                    logs:string[] = [
                                        "",
                                        `${vars.text.underline}Application completed ${count_task} startup tasks in ${time / 1e9} seconds.${vars.text.none}`,
                                        "",
                                        `Process ID: ${vars.text.cyan + process.pid + vars.text.none}`,
                                        "",
                                        "Web Server Ports:",
                                    ],
                                    pad = function utilities_startServer_readComplete_start_serverCallback_pad(str:string, num:number, dir:"left"|"right"):string {
                                        let item:number = longest[num] - str.length;
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
                                    logItem = function utilities_startServer_readComplete_start_serverCallback_logItem(name:string, encryption:"open"|"secure"|"tcp"|"udp", value:string):void {
                                        const conflict:boolean = (value.indexOf(vars.text.angry) === 0),
                                            str:string = `${vars.text.angry}*${vars.text.none} ${pad(name, 0, "right")} - ${pad(encryption, 1, "right")} - ${value}`;
                                        if (conflict === true) {
                                            if (Number(value.replace(vars.text.none, "").replace(vars.text.angry, "")) < 1025) {
                                                logs.push(`${str} (Server offline, typically due to insufficient access for reserved port or port conflict.)`);
                                            } else {
                                                logs.push(`${str} (Server offline, typically due to port conflict.)`);
                                            }
                                        } else {
                                            logs.push(str);
                                        }
                                    };
                                let index:number = 0,
                                    name:string = "",
                                    ports:type_docker_ports = null,
                                    longest:number[] = [0, 0, 0],
                                    len:number = servers.length;
                                servers.sort();
                                // get string column width
                                do {
                                    name = vars.servers[servers[index]].config.name;
                                    if (name.length > longest[0]) {
                                        longest[0] = name.length;
                                    }
                                    if (vars.servers[servers[index]].config.encryption === "both") {
                                        if (vars.servers[servers[index]].config.ports["secure"].toString().length > longest[2]) {
                                            longest[2] = vars.servers[servers[index]].config.ports["secure"].toString().length;
                                        }
                                        if (vars.servers[servers[index]].config.ports["open"].toString().length > longest[2]) {
                                            longest[3] = vars.servers[servers[index]].config.ports["secure"].toString().length;
                                        }
                                        longest[1] = 6;
                                    } else if (vars.servers[servers[index]].config.encryption === "secure") {
                                        if (vars.servers[servers[index]].config.ports["secure"].toString().length > longest[2]) {
                                            longest[2] = vars.servers[servers[index]].config.ports["secure"].toString().length;
                                        }
                                        longest[1] = 6;
                                    } else {
                                        if (vars.servers[servers[index]].config.ports["open"].toString().length > longest[2]) {
                                            longest[2] = vars.servers[servers[index]].config.ports["secure"].toString().length;
                                        }
                                    }
                                    index = index + 1;
                                } while (index < servers.length);
                                if (testing === true) {
                                    test_index();
                                } else {
                                    const keys:string[] = Object.keys(vars.compose.containers),
                                        sort = function utilities_startServer_readCompete_start_serverCallback_sort(a:[number, "tcp"|"udp"], b:[number, "tcp"|"udp"]):-1|1 {
                                            if (a[0] < b[0] || (a[0] === b[0] && a[1] < b[1])) {
                                                return -1;
                                            }
                                            return 1;
                                        };
                                    // from servers
                                    index = 0;
                                    do {
                                        if (vars.servers[servers[index]].config.encryption === "both") {
                                            logItem(vars.servers[servers[index]].config.name, "open", (vars.servers[servers[index]].status.open === 0)
                                                ? vars.text.angry + vars.servers[servers[index]].config.ports.open + vars.text.none
                                                : vars.text.green + vars.servers[servers[index]].status.open + vars.text.none
                                            );
                                            logItem(vars.servers[servers[index]].config.name, "secure", (vars.servers[servers[index]].status.secure === 0)
                                                ? vars.text.angry + vars.servers[servers[index]].config.ports.secure + vars.text.none
                                                : vars.text.green + vars.servers[servers[index]].status.secure + vars.text.none
                                            );
                                        } else if (vars.servers[servers[index]].config.encryption === "open") {
                                            logItem(vars.servers[servers[index]].config.name, "open", (vars.servers[servers[index]].status.open === 0)
                                                ? vars.text.angry + vars.servers[servers[index]].config.ports.open + vars.text.none
                                                : vars.text.green + vars.servers[servers[index]].status.open + vars.text.none
                                            );
                                        } else if (vars.servers[servers[index]].config.encryption === "secure") {
                                            logItem(vars.servers[servers[index]].config.name, "secure", (vars.servers[servers[index]].status.secure === 0)
                                                ? vars.text.angry + vars.servers[servers[index]].config.ports.secure + vars.text.none
                                                : vars.text.green + vars.servers[servers[index]].status.secure + vars.text.none
                                            );
                                        }
                                        index = index + 1;
                                    } while (index < len);

                                    // from containers
                                    len = keys.length;
                                    if (len > 0) {
                                        let index_ports:number = 0,
                                            len_ports:number = 0;
                                        index = 0;
                                        longest = [0, 3, 0];
                                        keys.sort();
                                        logs.push("");
                                        logs.push("Container Ports:");
                                        do {
                                            if (vars.compose.containers[keys[index]].name.length > longest[0]) {
                                                longest[0] = vars.compose.containers[keys[index]].name.length;
                                            }
                                            index = index + 1;
                                        } while (index < len);
                                        index = 0;
                                        do {
                                            ports = vars.compose.containers[keys[index]].ports;
                                            len_ports = ports.length;
                                            if (len_ports > 0) {
                                                longest[2] = 0;
                                                ports.sort(sort);
                                                index_ports = 0;
                                                do {
                                                    if (ports[index_ports][0].toString().length > longest[2]) {
                                                        longest[2] = ports[index_ports][0].toString().length;
                                                    }
                                                    index_ports = index_ports + 1;
                                                } while (index_ports < len_ports);
                                                index_ports = 0;
                                                do {
                                                    logItem(vars.compose.containers[keys[index]].name, ports[index_ports][1], vars.text.green + pad(ports[index_ports][0].toString(), 2, "left") + vars.text.none);
                                                    index_ports = index_ports + 1;
                                                } while (index_ports < len_ports);
                                            }
                                            index = index + 1;
                                        } while (index < len);
                                    }
                                    log.shell(logs, true);
                                }
                            }
                        };
                    let count:number = 0,
                        index:number = 0;

                    if (testing === true) {
                        server(vars.servers[vars.environment.dashboard_id].config.id, callback);
                    } else {
                        do {
                            server(vars.servers[servers[index]].config.id, callback);
                            index = index + 1;
                        } while (index < total);
                    }

                };
                clock();
                statistics.data();
                if (testing === true || vars.servers[vars.environment.dashboard_id] === undefined) {
                    server_create({
                        action: "add",
                        server: default_server
                    }, start, true);
                } else {
                    start();
                }
            }
        },
        start_tasks = function utilities_startServer_startTasks():void {
            do {
                index_tasks = index_tasks - 1;
                if (testing === false || (keys_tasks[index_tasks] !== "servers" && testing === true)) {
                    tasks[keys_tasks[index_tasks]].task();
                }
            } while (index_tasks > 0);
        },
        start_prerequisites = function utilities_startServer_startPrerequisites():void {
            index_prerequisites = index_prerequisites + 1;
            if (index_prerequisites > 0) {
                log_task("prerequisite", keys_prerequisites[index_prerequisites - 1]);
            }
            if (index_prerequisites < len_prerequisites) {
                prerequisite_tasks[keys_prerequisites[index_prerequisites]].task();
            } else {
                start_tasks();
            }
        },
        keys_tasks:type_start_primary_tasks[] = Object.keys(tasks) as type_start_primary_tasks[],
        keys_prerequisites:type_start_pre_tasks[] = Object.keys(prerequisite_tasks) as type_start_pre_tasks[],
        len_tasks:number = (testing === true)
            ? keys_tasks.length - 1 // servers task is not run in test mode
            : keys_tasks.length,
        len_prerequisites:number = keys_prerequisites.length;
    let index_tasks:number = keys_tasks.length,
        index_prerequisites:number = -1,
        count_task:number = 0,
        script:string = dashboard_script
            .toString()
            .replace("path: \"\",", `path: "${vars.path.project.replace(/\\/g, "\\\\")
            .replace(/"/g, "\\\"")}",`)
            .replace(/\(\s*\)/, "(core)");

    BigInt.prototype.time = universal.time;
    Number.prototype.commas = universal.commas;
    Number.prototype.dateTime = universal.dateTime;
    Number.prototype.time = universal.time;
    String.prototype.bytes = universal.bytes;
    String.prototype.bytes_big = universal.bytes_big;
    String.prototype.capitalize = universal.capitalize;

    vars.environment.hashes = node.crypto.getHashes();

    log.shell(["", `${vars.text.underline}Executing start up tasks${vars.text.none}`]);

    // update OS list of available shells
    if (vars.environment.features.terminal === true) {
        if (process.platform === "win32") {
            const stats = function utilities_startServer_tasksShell_shellWin(index:number):void {
                node.fs.stat(vars.environment.terminal[index], function utilities_startServer_tasksShell_shellWin_callback(err:node_error) {
                    if (err !== null) {
                        vars.environment.terminal.splice(index, 1);
                    }
                    if (index > 0) {
                        utilities_startServer_tasksShell_shellWin(index - 1);
                    } else {
                        start_prerequisites();
                    }
                });
            };
            stats(vars.environment.terminal.length - 1);
        } else {
            file.stat({
                callback: function utilities_startServer_tasksShell_shellStat(stat:node_fs_BigIntStats):void {
                    if (stat === null) {
                        vars.environment.terminal.push("/bin/sh");
                    } else {
                        file.read({
                            callback: function utilities_startServer_tasksShell_shellStat_shellRead(contents:Buffer):void {
                                const lines:string[] = contents.toString().split("\n"),
                                    len:number = lines.length;
                                let index:number = 1;
                                if (len > 1) {
                                    do {
                                        if (lines[index].indexOf("/bin/") === 0) {
                                            vars.environment.terminal.push(lines[index]);
                                        }
                                        index = index + 1;
                                    } while (index < len);
                                }
                                if (vars.environment.terminal.length < 1) {
                                    vars.environment.terminal.push("/bin/sh");
                                }
                                start_prerequisites();
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
    } else {
        start_prerequisites();
    }
};

export default start_server;