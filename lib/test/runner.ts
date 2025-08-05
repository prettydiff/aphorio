
import log from "../utilities/log.ts";
import node from "../utilities/node.ts";
import send from "../transmit/send.ts";
import vars from "../utilities/vars.ts";

const test_runner:test_runner = {
    execution: {
        command: function test_runner_executeCommand():void {
            const item:test_item_command = vars.test.list[vars.test.index] as test_item_command,
                opts:node_childProcess_SpawnOptions = (typeof item.shell === "string" && item.shell !== "")
                    ? {
                        shell: item.shell,
                        windowsHide: true
                    }
                    : {windowsHide: true},
                spawn:node_childProcess_ChildProcess = node.child_process.spawn(item.command, [], opts),
                stderr:string[] = [],
                stdout:string[] = [],
                stderr_callback = function test_runner_execCommand_stderr(buf:Buffer):void {
                    stderr.push(buf.toString());
                },
                stdout_callback = function test_runner_execCommand_stdout(buf:Buffer):void {
                    stdout.push(buf.toString());
                },
                spawn_close = function test_runner_execCommand_close():void {
                    const len_unit:number = item.unit.length,
                        get_value = function test_runner_execCommand_getValue():test_assertionItem {
                            const len_prop:number = unit.properties.length,
                                start:string = (unit.type === "stderr")
                                    ? str_stderr
                                    : str_stdout,
                                props:string[] = [unit.type],
                                formats:test_command_format = {
                                    "csv": function test_runner_execCommand_close_csv():string[][] {
                                        const output:string[][] = [],
                                            len_csv:number = start.length;
                                        let index_csv:number = 0,
                                            line:string[] = [],
                                            field:string[] = [],
                                            quote:boolean = false;
                                        if (len_csv > 0) {
                                            do {
                                                if (start.charAt(index_csv) === "\"") {
                                                    if (quote === true) {
                                                        if (start.charAt(index_csv - 1) === "\"") {
                                                            field.push("\"");
                                                        } else {
                                                            quote = false;
                                                        }
                                                    } else {
                                                        quote = true;
                                                    }
                                                } else if (quote === false) {
                                                    if (start.charAt(index_csv) === "\r" && start.charAt(index_csv + 1) === "\n") {
                                                        index_csv = index_csv + 1;
                                                        output.push(line);
                                                        line = [];
                                                    } else if (start.charAt(index_csv) === "\n") {
                                                        line.push(field.join(""));
                                                        field = [];
                                                        output.push(line);
                                                        line = [];
                                                    } else if (start.charAt(index_csv) === ",") {
                                                        line.push(field.join(""));
                                                        field = [];
                                                    } else {
                                                        field.push(start.charAt(index_csv));
                                                    }
                                                }
                                                index_csv = index_csv + 1;
                                            } while (index_csv < len_csv);
                                            if (line.length > 0) {
                                                output.push(line);
                                            }
                                        }
                                        return output;
                                    },
                                    "json": function test_runner_execCommand_close_json():object {
                                        // eslint-disable-next-line no-restricted-syntax
                                        try {
                                            return JSON.parse(start.replace(/\x1B\[33;1mWARNING: Resulting JSON is truncated as serialization has exceeded the set depth of \d.\x1B\[0m\r\n/, ""));
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                        } catch (e:unknown) {
                                            parse_fail = true;
                                            return null;
                                        }
                                    },
                                    "lines": function tests_runner_execCommand_close_lines():string[] {
                                        return start.replace(/\n\s+/, "\n").split("\n");
                                    },
                                    "string": function tests_runner_execCommand_close_lines():string {
                                        return start;
                                    }
                                };
                            let index_prop:number = 0,
                                prop:number|string = null,
                                type_of:boolean = false,
                                format:boolean|object|string = formats[unit.format]();
                            if (len_prop < 1 || format === null) {
                                return test_runner.tools.assert[unit.qualifier](format as string, unit, null);
                            }
                            do {
                                prop = unit.properties[index_prop];
                                if (prop === "typeof") {
                                    type_of = true;
                                } else if (prop === "isNaN") {
                                    format = isNaN(Number(format));
                                } else if (prop !== "" && prop !== null && prop !== undefined) {
                                    props.push(`[${prop}]`);
                                    // @ts-expect-error - dynamically infers a property on a static object
                                    if (typeof prop === "string" && prop.includes("(") === true && prop.includes(")") === true && (format as object)[prop.slice(0, prop.indexOf("("))] !== undefined) {
                                        // @ts-expect-error - dynamically infers a property on a static object
                                        format = format[prop.slice(0, prop.indexOf("("))](prop.slice(prop.indexOf("(") + 1, prop.lastIndexOf(")")));
                                    } else {
                                        format = (format as Array<string>)[prop as number];
                                    }
                                }
                                if (format === null || format === undefined) {
                                    break;
                                }
                                index_prop = index_prop + 1;
                            } while (index_prop < len_prop);
                            if (type_of === true) {
                                return test_runner.tools.assert[unit.qualifier](format as string, unit, `typeof ${props.join("")}`);
                            }
                            return test_runner.tools.assert[unit.qualifier](format as string, unit, props.join(""));
                        },
                        str_stderr:string = stderr.join(""),
                        str_stdout:string = stdout.join("");
                    let index_units:number = 0,
                        fail:boolean = false,
                        parse_fail:boolean = false,
                        unit:test_assertion_command = null,
                        assertion:test_assertionItem = null;
                    if (len_unit > 0) {
                        do {
                            unit = item.unit[index_units];
                            if (unit !== null) {
                                assertion = get_value();
                                // @ts-expect-error - ts cannot detect the assignment above
                                if (parse_fail === true) {
                                    assertion[0] = false;
                                    assertion[3] = "failed to parse into JSON";
                                    parse_fail = false;
                                    fail = true;
                                    vars.test.total_assertions_fail = vars.test.total_assertions_fail + 1;
                                    vars.test.counts[vars.test.list.name].assertions_fail = vars.test.counts[vars.test.list.name].assertions_fail + 1;
                                } else if (assertion[0] === false) {
                                    fail = true;
                                    vars.test.total_assertions_fail = vars.test.total_assertions_fail + 1;
                                    vars.test.counts[vars.test.list.name].assertions_fail = vars.test.counts[vars.test.list.name].assertions_fail + 1;
                                }
                                vars.test.total_assertions = vars.test.total_assertions + 1;
                                vars.test.counts[vars.test.list.name].assertions = vars.test.counts[vars.test.list.name].assertions + 1;
                            }
                            index_units = index_units + 1;
                        } while (index_units < len_unit);
                        if (fail === true) {
                            vars.test.total_tests_fail = vars.test.total_tests_fail + 1;
                            vars.test.counts[vars.test.list.name].tests_failed = vars.test.counts[vars.test.list.name].tests_failed + 1;
                        }
                    }
                    spawn.kill();
                    test_runner.tools.complete();
                },
                spawn_error = function test_runner_execCommand_error(err:node_error):void {
                    log.shell([
                        `[${test_runner.tools.time()}] ${count_test} ${vars.text.angry}Fail${vars.text.none} ${item.name}`,
                        `    ${vars.text.angry}*${vars.text.none} Test failed with error: ${err.code}, ${err.message}`
                    ]);
                    vars.test.total_tests_fail = vars.test.total_tests_fail + 1;
                    vars.test.counts[vars.test.list.name].tests_failed = vars.test.counts[vars.test.list.name].tests_failed + 1;
                    spawn.kill();
                    test_runner.tools.complete();
                };
            spawn.stderr.on("data", stderr_callback);
            spawn.stdout.on("data", stdout_callback);
            spawn.on("close", spawn_close);
            spawn.on("error", spawn_error);
        },
        dom: function test_runner_executeDOM():void {
            if (vars.test.browser_start === false) {
                test_runner.tools.browser_open();
                return;
            }
            const item_test:test_item_dom = vars.test.list[vars.test.index] as test_item_dom,
                item_service:services_testBrowser = {
                    action: "result",
                    exit: null,
                    index: vars.test.index,
                    result: null,
                    test: item_test
                },
                socket:websocket_client = vars.server_meta.dashboard.sockets.open[0],
                payload:socket_data = {
                    data: item_service,
                    service: "test-browser"
                };
            send(payload, socket, 3);
        }
    },
    list: function test_runner_list(list:test_list, callback:(name:string) => void):void {
        const len_list:number = list.length;
        log.shell([`Test list ${vars.text.cyan + list.name + vars.text.none}`]);
        vars.test.list = list;
        vars.test.total_lists = vars.test.total_lists + 1;
        vars.test.total_tests = vars.test.total_tests + len_list;
        vars.test.counts[list.name] = {
            assertions: 0,
            assertions_fail: 0,
            tests_attempted: 0,
            tests_failed: 0,
            tests_skipped: 0,
            tests_total: len_list,
            time_end: 0n,
            time_start: process.hrtime.bigint()
        };
        test_runner.tools.callback = callback;
        test_runner.tools.next();
    },
    tools: {
        assert: {
            "begins": function test_runner_execCommand_assertBegins(value:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assertionItem {
                if (unit.nullable === true && value === null) {
                    return [true, value, location, "value is null, which is accepted"];
                }
                if (typeof value !== "string") {
                    return [false, value, location, "values is not of type string"];
                }
                if (value.indexOf(String(unit.value)) === 0) {
                    return [true, value, location, `begins with ${unit.value}`];
                }
                return [false, value, location, `begins with ${value.toString().slice(0, 8)}, not ${unit.value}`];
            },
            "contains": function test_runner_execCommand_assertContains(value:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assertionItem {
                if (unit.nullable === true && value === null) {
                    return [true, value, location, "value is null, which is accepted"];
                }
                if (typeof value !== "string") {
                    return [false, value, location, "values is not of type string"];
                }
                if (value.includes(String(unit.value)) === true) {
                    return [true, value, location, `contains ${unit.value}`];
                }
                return [false, value, location, `does not contain ${unit.value}`];
            },
            "ends": function test_runner_execCommand_assertEnds(value:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assertionItem {
                if (unit.nullable === true && value === null) {
                    return [true, value, location, "value is null, which is accepted"];
                }
                if (typeof value !== "string") {
                    return [false, value, location, "values is not of type string"];
                }
                if (value.indexOf(String(unit.value)) === value.length - String(unit.value).length) {
                    return [true, value, location, `ends with ${unit.value}`];
                }
                return [false, value, location, `ends with ${value.slice(value.length - 8)}, not ${unit.value}`];
            },
            "greater": function test_runner_execCommand_assertGreater(value:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assertionItem {
                if (unit.nullable === true && value === null) {
                    return [true, value, location, "value is null, which is accepted"];
                }
                if (typeof value === "number" || typeof value === "bigint") {
                    if (typeof value !== typeof unit.value) {
                        return [false, String(value), location, "value is not of same numeric type as comparator"];
                    }
                    if ((typeof value === "number" && value > Number(unit.value)) || (typeof value === "bigint" && value > BigInt(unit.value))) {
                        return [true, String(value), location, `is greater than ${unit.value}`];
                    }
                    return [false, String(value), location, `is ${value}, which is not greater than ${unit.value}`];
                }
                return [false, value, location, `is ${value}, which is not greater than ${unit.value}`];
            },
            "is": function test_runner_execCommand_assertIs(value:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assertionItem {
                const s_value:string = (typeof value === "string")
                        ? `"${value}"`
                        : String(value),
                    s_unit:string = (typeof unit.value === "string")
                        ? `"${unit.value}"`
                        : String(unit.value);
                if (unit.nullable === true && value === null) {
                    return [true, value, location, "value is null, which is accepted"];
                }
                if (value === unit.value) {
                    return [true, value, location, `is exactly ${s_unit}`];
                }
                return [false, value, location, `${s_value} is not ${s_unit}`];
            },
            "lesser": function test_runner_execCommand_assertLesser(value:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assertionItem {
                if (unit.nullable === true && value === null) {
                    return [true, value, location, "value is null, which is accepted"];
                }
                if (typeof value === "number" || typeof value === "bigint") {
                    if (typeof value !== typeof unit.value) {
                        return [false, String(value), location, "value is not of same numeric type as comparator"];
                    }
                    if ((typeof value === "number" && value < Number(unit.value)) || (typeof value === "bigint" && value < BigInt(unit.value))) {
                        return [true, String(value), location, `is lesser than ${unit.value}`];
                    }
                    return [false, String(value), location, `is ${value}, which is not lesser than ${unit.value}`];
                }
                return [false, value, location, `is ${value}, which is not lesser than ${unit.value}`];
            },
            "not": function test_runner_execCommand_assertBegins(value:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assertionItem {
                const s_value:string = (typeof value === "string")
                        ? `"${value}"`
                        : String(value),
                    s_unit:string = (typeof unit.value === "string")
                        ? `"${unit.value}"`
                        : String(unit.value);
                if (unit.nullable === true && value === null) {
                    return [true, value, location, "value is null, which is accepted"];
                }
                if (value !== unit.value) {
                    return [true, value, location, `is ${s_value}, not ${s_unit}`];
                }
                return [false, value, location, `is exactly ${s_value}`];
            },
            "not contains": function test_runner_execCommand_assertNotContains(value:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assertionItem {
                if (unit.nullable === true && value === null) {
                    return [true, value, location, "value is null, which is accepted"];
                }
                if (typeof value !== "string") {
                    return [false, value, location, "values is not of type string"];
                }
                if (value.includes(String(unit.value)) === false) {
                    return [true, value, location, `does not contain ${unit.value}`];
                }
                return [false, value, location, `contains ${value}`];
            }
        },
        browser_open: function test_runner_utilityBrowser():void {
            const keyword:string = (process.platform === "darwin")
                    ? "open"
                    : (process.platform === "win32")
                        ? "start"
                        : "xdg-open",
                browserCommand = function test_runner_utilityBrowser_browserCommand():string {
                    const path:string = `http://localhost:${vars.servers.dashboard.status.open}/?test_browser`;
                    if (vars.test.browser !== "" && vars.test.browser !== null) {
                        if (vars.test.browser_args.length > 0) {
                            return `${keyword} ${vars.test.browser} ${path} ${vars.test.browser_args.join(" ")}`;
                        }
                        return `${keyword} ${vars.test.browser} ${path}`;
                    }
                    return `${keyword} ${path}`;
                },
                call_dom = function test_runner_utilityBrowser_callDom():void {
                    if (vars.server_meta.dashboard.sockets.open[0] === undefined || vars.server_meta.dashboard.sockets.open[0].queue === undefined) {
                        setTimeout(test_runner_utilityBrowser_callDom, 50);
                    } else {
                        test_runner.execution.dom();
                    }
                };
            vars.test.browser_child = node.child_process.exec(browserCommand(), function test_runner_utilityBrowser_child():void {
                vars.test.browser_start = true;
                call_dom();
            });
        },
        callback: null,
        complete: function test_runner_utilityComplete():void {
            vars.test.index = vars.test.index + 1;
            if (vars.test.index < vars.test.list.length) {
                test_runner.tools.next();
            } else {
                vars.test.counts[vars.test.list.name].time_end = process.hrtime.bigint();
                test_runner.tools.callback(vars.test.list.name);
            }
        },
        logs: [],
        next: function test_runner_utilityNext():void {
            if (vars.test.list[vars.test.index] === null) {
                vars.test.counts[vars.test.list.name].tests_skipped = vars.test.counts[vars.test.list.name].tests_skipped + 1;
                test_runner.tools.complete();
            } else if (vars.test.list[vars.test.index] === undefined) {
                test_runner.tools.complete();
            } else {
                count_test = count_test + 1;
                vars.test.counts[vars.test.list.name].tests_attempted = vars.test.counts[vars.test.list.name].tests_attempted + 1;
                if (test_runner.execution[vars.test.list[vars.test.index].type] !== undefined) {
                    test_runner.execution[vars.test.list[vars.test.index].type]();
                }
            }
        },
        time: function test_runner_utilityTime():string {
            return `${vars.text.cyan}${process.hrtime.bigint().time(vars.test.counts[vars.test.list.name].time_start)}${vars.text.none}`;
        }
    }
};

export default test_runner;