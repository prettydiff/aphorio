// tasks
import admin from "./admin.ts";
import certificates from "./certificates.ts";
import cgroup from "./cgroup.ts";
import compose from "./compose.ts";
import compose_variables from "./compose_variables.ts";
import features from "./features.ts";
import file_start from "./file_start.ts";
import git from "./git.ts";
import global_name from "./global_name.ts";
import html from "./html.ts";
import os_devs from "./os_devs.ts";
import os_disk from "./os_disk.ts";
import os_intr from "./os_intr.ts";
import os_main from "./os_main.ts";
import os_proc from "./os_proc.ts";
import os_serv from "./os_serv.ts";
import os_stcp from "./os_stcp.ts";
import os_sudp from "./os_sudp.ts";
import os_user from "./os_user.ts";
import server_audit from "./server_audit.ts";
import servers from "./servers.ts";
import services_app from "./services_app.ts";
import version from "./version.ts";

import file from "../utilities/file.ts";
import log from "../core/log.ts";
import ready_services from "./ready_services.ts";
import server_create from "../server/server_create.ts";
import server_start from "../server/server_start.ts";
import universal from "../core/universal.ts";
import vars from "../core/vars.ts";

// cspell: words serv, stcp, sudp

let index_tasks:number = 0,
    index_prerequisites:number = 0,
    count_task:number = 0;
const start = function start(process_path:string):void {
    // prerequisite tasks will execute first in the order presented
    const start_tasks = function start_startTasks():void {
            do {
                index_tasks = index_tasks - 1;
                tasks[keys_tasks[index_tasks]].task();
            } while (index_tasks > 0);
        },
        start_prerequisites = function start_startPrerequisites():void {
            if (keys_prerequisites[index_prerequisites] === undefined) {
                start_tasks();
            } else {
                index_prerequisites = index_prerequisites + 1;
                log_task("prerequisite", keys_prerequisites[index_prerequisites - 1]);
                prerequisite_tasks[keys_prerequisites[index_prerequisites - 1]].task();
            }
        },
        complete_tasks = function start_completeTasks(flag:type_start_primary_tasks):void {
            log_task("task", flag);
            // to troubleshoot which tasks do not run, in test mode servers task is not executed
            // delete task_definitions[flag];console.log(Object.keys(task_definitions));
            count_task = count_task + 1;
            if (count_task === len_tasks) {
                // sends a server time update every 950ms
                const default_server:supplemental_server_config = {
                    activate: true,
                    certificate_path: {
                        ca: "",
                        cert: "",
                        key: ""
                    },
                    domain_local: [
                        "localhost",
                        "127.0.0.1",
                        "::1"
                    ],
                    encryption: (vars.options.mode === "demo")
                        ? "open"
                        : "both",
                    id: "",
                    message_segmentation: 1e6,
                    mutual_tls: false,
                    name: "dashboard",
                    ports: {
                        open: vars.options["port-open"],
                        secure: vars.options["port-secure"]
                    },
                    redirect_asset: {
                        "localhost": {
                            "/lib/assets/*": "/lib/dashboard/*"
                        }
                    },
                    single_socket: false,
                    temporary: false,
                    upgrade: false
                },
                start = function start_completeTasks_start():void {
                    const servers:string[] = Object.keys(vars.data.server),
                        total:number = (vars.test.testing === true)
                            ? 1
                            : servers.length,
                        callback = function start_completeTasks_start_serverCallback():void {
                            count = count + 1;
                            if (count === total) {
                                ready_services(count_task);
                            }
                        };
                    let count:number = 0,
                        index:number = 0;

                    if (vars.test.testing === true) {
                        server_start(vars.data.server[vars.id.dashboard_server].config.id, callback);
                    } else {
                        do {
                            server_start(vars.data.server[servers[index]].config.id, callback);
                            index = index + 1;
                        } while (index < total);
                    }

                };
                if (vars.test.testing === true || vars.data.server[vars.id.dashboard_server] === undefined) {
                    server_create({
                        action: "add",
                        server: default_server
                    }, start, true);
                } else {
                    start();
                }
            }
        },
        prerequisite_tasks:core_start_tasks = {
            admin: admin(start_prerequisites),
            features: features(start_prerequisites, process_path),
            os_main: os_main(start_prerequisites),
            compose: compose(start_prerequisites),
            servers: servers(start_prerequisites, process_path)
        },
        tasks:core_start_tasks = {
            certificates: certificates(complete_tasks, process_path),
            cgroup: cgroup(complete_tasks),
            compose_variables: compose_variables(complete_tasks, process_path),
            file: file_start(complete_tasks),
            git: git(complete_tasks, process_path),
            global_name: global_name(complete_tasks, process_path),
            html: html(complete_tasks, process_path),
            os_devs: os_devs(complete_tasks),
            os_disk: os_disk(complete_tasks),
            os_intr: os_intr(complete_tasks),
            os_proc: os_proc(complete_tasks),
            os_serv: os_serv(complete_tasks),
            os_stcp: os_stcp(complete_tasks),
            os_sudp: os_sudp(complete_tasks),
            os_user: os_user(complete_tasks),
            server_audit: server_audit(complete_tasks),
            services_app: services_app(complete_tasks, process_path),
            test_browser: {
                label: "Finds a designated web browser for test automation if supplied as a terminal argument.",
                task: function start_taskTestBrowser():void {
                    test_stat("test_browser");
                }
            },
            test_list: {
                label: "Runs test automation only against a specified list.",
                task: function start_taskTestList():void {
                    test_stat("test_list");
                }
            },
            version: version(complete_tasks, process_path)
        },
        test_stat = function start_testStat(property:"test_browser"|"test_list"):void {
            if (vars.test.testing === true) {
                const get_value = function start_testStat_getValue():void {
                    const arg:"browser"|"list" = property.replace("test_", "") as "browser"|"list",
                        address:string = (function start_testStat_getValue_address():string {
                            let start_address:string = (vars.options[arg] === null)
                                ? ""
                                : vars.options[arg];
                            const address_length:number = start_address.length;
                            if (vars.options[arg] === null || vars.options[arg] === undefined) {
                                return "";
                            }
                            if ((start_address.charAt(0) === "\"" && start_address.charAt(address_length - 1) === "\"") || (start_address.charAt(0) === "'" && start_address.charAt(address_length - 1) === "'")) {
                                start_address = `"${start_address.slice(1, address_length - 1)}"`;
                                if (process.platform === "win32" || process.platform === "cygwin") {
                                    start_address = start_address.replace(/\\/g, "\"\\\"").replace("\"\\", "\\");
                                }
                            }
                            if (property === "test_list") {
                                return `${process_path}lib${vars.path.sep}test${vars.path.sep + start_address.replace(/^\.?(\/|\\)/, "")}`;
                            }
                            return start_address;
                        }()),
                        stat_browser = function start_testStat_stat(details:node_fs_BigIntStats):void {
                            if (details === null) {
                                tasks[property].label = `Testing file ${vars.text.angry}not${vars.text.none} found for: ${vars.text.red + address.replace(/\\\\/g, "\\") + vars.text.none}`;
                            } else {
                                if (arg === "browser" && vars.test.browser_args.length > 0) {
                                    tasks.test_browser.label = `Testing file found for ${arg}: ${vars.text.green + address.replace(/\\\\/g, "\\")} ${vars.test.browser_args.join(" ")} ${vars.text.none}`;
                                } else {
                                    tasks[property].label = `Testing file found for ${arg}: ${vars.text.green + address.replace(/\\\\/g, "\\") + vars.text.none}`;
                                }
                            }
                            if (property === "test_browser") {
                                vars.test.test_browser = address;
                                complete_tasks("test_browser");
                            } else if (property === "test_list") {
                                import(`file://${address.replace(/\\/g, "/")}`).then(function start_testStat_getValue_list(mod:object):void {
                                    // @ts-expect-error - the Module type definition is not aware of the children exported upon a given module object.
                                    vars.test.list = mod.default;
                                    complete_tasks(property);
                                });
                            }
                        };
                    if (address === "") {
                        complete_tasks(property);
                        return;
                    }
                    file.stat({
                        callback: stat_browser,
                        location: address,
                        no_file: null,
                        section: "startup"
                    });
                };
                tasks.test_browser.label = "No option supplied beginning with 'browser:'";
                tasks.test_list.label = "No option supplied beginning with 'list:'";
                get_value();
            } else {
                tasks[property].label = "Ignored unless executing tests.";
                complete_tasks(property);
            }
        },
        log_task = function start_logTask(list:"prerequisite"|"task", flag:type_start_pre_tasks | type_start_primary_tasks):void {
            const label:string = (list === "task")
                    ? tasks[flag].label
                    : prerequisite_tasks[flag].label,
                asterisk:string = `${vars.text.angry}*${vars.text.none}`;
            log.shell([`${asterisk} ${vars.text.cyan}[${process.hrtime.bigint().time_elapsed(vars.environment.start_time)}]${vars.text.none} ${vars.text.green + flag + vars.text.none} - ${label}`]);
        },
        keys_tasks:type_start_primary_tasks[] = Object.keys(tasks) as type_start_primary_tasks[],
        keys_prerequisites:type_start_pre_tasks[] = Object.keys(prerequisite_tasks) as type_start_pre_tasks[],
        len_tasks:number = (vars.test.testing === true)
            ? keys_tasks.length - 1 // servers task is not run in test mode
            : keys_tasks.length;

    BigInt.prototype.time_elapsed = universal.time_elapsed;
    Number.prototype.bytes = universal.bytes;
    Number.prototype.bytes_long = universal.bytes_long;
    Number.prototype.commas = universal.commas;
    Number.prototype.dateTime = universal.dateTime;
    Number.prototype.time_elapsed = universal.time_elapsed;
    String.prototype.bytes_numb = universal.bytes_numb;
    String.prototype.capitalize = universal.capitalize;
    String.prototype.file_sanitize = universal.file_sanitize;

    index_tasks = keys_tasks.length;
    if (vars.options.mode === "certificate") {
        prerequisite_tasks.servers.task();
    } else {
        log.shell([`${vars.text.underline}Executing start up tasks${vars.text.none}`]);

        // update OS list of available shells
        if (vars.environment.features["terminal"] === true) {
            if (process.platform === "win32" || process.platform === "cygwin") {
                const stats = function start_tasksShell_shellWin(index:number):void {
                    file.stat({
                        callback: function start_tasksShell_shellWin_callback(stat:node_fs_BigIntStats):void {
                            if (stat === null) {
                                vars.environment.terminal.splice(index, 1);
                            }
                            if (index > 0) {
                                start_tasksShell_shellWin(index - 1);
                            } else {
                                start_prerequisites();
                            }
                        },
                        location: vars.environment.terminal[index],
                        no_file: null,
                        section: "startup"
                    });
                };
                stats(vars.environment.terminal.length - 1);
            } else {
                file.stat({
                    callback: function start_tasksShell_shellStat(stat:node_fs_BigIntStats):void {
                        if (stat === null) {
                            vars.environment.terminal.push("/bin/sh");
                        } else {
                            file.read({
                                callback: function start_tasksShell_shellStat_shellRead(contents:Buffer):void {
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
    }
};

export default start;