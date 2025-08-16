
import log from "../utilities/log.ts";
import node from "../utilities/node.ts";
import send from "../transmit/send.ts";
import vars from "../utilities/vars.ts";

const test_runner:test_runner = {
    assert: {
        "begins": function test_runner_execCommand_assertBegins(value:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assert {
            const nullable:boolean = (unit.nullable === true && value === null),
                test:boolean = (String(value).indexOf(String(unit.value)) === 0);
            return {
                assessment: (nullable === true)
                    ? " is null, which is accepted"
                    : (test === true)
                        ? ` begins with "${unit.value}"`
                        : ` begins with "${value.toString().slice(0, String(unit.value).length)}", not "${unit.value}"`,
                location: location,
                pass: (test === true || nullable === true),
                store: unit.store,
                value: value
            };
        },
        "contains": function test_runner_execCommand_assertContains(value:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assert {
            const s_value:string = (typeof value === "string")
                    ? `"${value}"`
                    : String(value),
                s_unit:string = (typeof unit.value === "string")
                    ? `"${unit.value}"`
                    : String(unit.value),
                nullable:boolean = (unit.nullable === true && value === null),
                test:boolean = (String(value).includes(String(unit.value)) === true);
            return {
                assessment: (nullable === true)
                    ? " is null, which is accepted"
                    : (test === true)
                        ? ` is ${s_value}, which contains ${s_unit}`
                        : ` is ${s_value}, which does not contain ${s_unit}`,
                location: location,
                pass: (test === true || nullable === true),
                store: unit.store,
                value: value
            };
        },
        "ends": function test_runner_execCommand_assertEnds(value:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assert {
            const str_value:string = String(value),
                str_unit:string = String(unit.value),
                nullable:boolean = (unit.nullable === true && value === null),
                test:boolean = (str_value.indexOf(str_unit) === str_value.length - str_unit.length);
            return {
                assessment: (nullable === true)
                    ? " is null, which is accepted"
                    : (test === true)
                        ? ` is "${str_value}", which ends with "${str_unit}"`
                        :  ` ends with "${str_value.slice(str_value.length - str_unit.length)}", not "${str_unit}"`,
                location: location,
                pass: (test === true || nullable === true),
                store: unit.store,
                value: value
            };
        },
        "greater": function test_runner_execCommand_assertGreater(value:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assert {
            const nullable:boolean = (unit.nullable === true && value === null),
                test:boolean = (((typeof value === "bigint" || (typeof value === "string" && (/^\d+n$/).test(String(value)) === true)) && BigInt(value as string) > BigInt(unit.value)) || Number(value) > Number(unit.value));
            return {
                assessment: (nullable === true)
                    ? " is null, which is accepted"
                    : (test === true)
                        ? ` is ${value}, which is greater than ${unit.value}`
                        : ` is ${value}, which is not greater than ${unit.value}`,
                location: location,
                pass: (test === true || nullable === true),
                store: unit.store,
                value: value
            };
        },
        "is": function test_runner_execCommand_assertIs(value:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assert {
            const s_value:string = (typeof value === "string")
                    ? `"${value}"`
                    : String(value),
                s_unit:string = (typeof unit.value === "string")
                    ? `"${unit.value}"`
                    : String(unit.value),
                nullable:boolean = (unit.nullable === true && value === null),
                test:boolean = (value === unit.value);
            return {
                assessment: (nullable === true)
                    ? " is null, which is accepted"
                    : (test === true)
                        ? ` is exactly ${s_unit}`
                        : ` is ${s_value}, which is not ${s_unit}`,
                location: location,
                pass: (test === true || nullable === true),
                store: unit.store,
                value: value
            };
        },
        "lesser": function test_runner_execCommand_assertLesser(value:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assert {
            const nullable:boolean = (unit.nullable === true && value === null),
                test:boolean = (((typeof value === "bigint" || (typeof value === "string" && (/^\d+n$/).test(String(value)) === true)) && BigInt(value as string) < BigInt(unit.value)) || Number(value) < Number(unit.value));
            return {
                assessment: (nullable === true)
                    ? " is null, which is accepted"
                    : (test === true)
                        ? ` is ${value}, which is lesser than ${unit.value}`
                        : ` is ${value}, which is not lesser than ${unit.value}`,
                location: location,
                pass: (test === true || nullable === true),
                store: unit.store,
                value: value
            };
        },
        "not": function test_runner_execCommand_assertBegins(value:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assert {
            const s_value:string = (typeof value === "string")
                    ? `"${value}"`
                    : String(value),
                s_unit:string = (typeof unit.value === "string")
                    ? `"${unit.value}"`
                    : String(unit.value),
                nullable:boolean = (unit.nullable === true && value === null),
                test:boolean = (value !== unit.value);
            return {
                assessment: (nullable === true)
                    ? " is null, which is accepted"
                    : (test === true)
                        ? ` is ${s_value}, not ${s_unit}`
                        : ` is exactly ${s_value}`,
                location: location,
                pass: (test === true || nullable === true),
                store: unit.store,
                value: value
            };
        },
        "not contains": function test_runner_execCommand_assertNotContains(value:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assert {
            const s_value:string = (typeof value === "string")
                    ? `"${value}"`
                    : String(value),
                s_unit:string = (typeof unit.value === "string")
                    ? `"${unit.value}"`
                    : String(unit.value),
                nullable:boolean = (unit.nullable === true && value === null),
                test:boolean = (String(value).includes(String(unit.value)) === false);
            return {
                assessment: (nullable === true)
                    ? " is null, which is accepted"
                    : (test === true)
                        ? ` is ${s_value}, which does not contain ${s_unit}`
                        : ` is ${s_value}", which contains "${s_unit}"`,
                location: location,
                pass: (test === true || nullable === true),
                store: unit.store,
                value: value
            };
        }
    },
    count: 0,
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
                    const len_unit:number = (item.unit === null || item.unit === undefined)
                            ? 0
                            : item.unit.length,
                        get_value = function test_runner_execCommand_getValue():test_assert {
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
                                            return JSON.parse(start.trim().replace(/\x1B\[33;1mWARNING: Resulting JSON is truncated as serialization has exceeded the set depth of \d.\x1B\[0m\s+/, ""));
                                        } catch (e:unknown) {
                                            parse_fail = true;
                                            return e as object;
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
                                parse_fail:boolean = null,
                                format:boolean|object|string = formats[unit.format](),
                                method:string = "";
                            do {
                                prop = unit.properties[index_prop];
                                method = (typeof prop === "string" && prop.includes("(") === true && prop.includes(")") === true)
                                    ? prop.slice(0, prop.indexOf("("))
                                    : "";
                                if (prop === "typeof") {
                                    type_of = true;
                                } else if (prop === "isNaN") {
                                    format = isNaN(Number(format));
                                } else if (prop !== "" && prop !== null && prop !== undefined) {
                                    props.push(`[${prop}]`);
                                    // @ts-expect-error - dynamically infers a property on a static object
                                    if (method !== "" && (format as object)[method] !== undefined) {
                                        // @ts-expect-error - dynamically infers a property on a static object
                                        format = format[method](prop.slice(prop.indexOf("(") + 1, prop.lastIndexOf(")")));
                                    } else if (format !== null) {
                                        format = (format as Array<string>)[prop as number];
                                    }
                                }
                                if (format === null || format === undefined) {
                                    break;
                                }
                                index_prop = index_prop + 1;
                            } while (index_prop < len_prop);
                            if (unit.value === vars.test.magicString) {
                                unit.value = vars.test.store;
                            }
                            if (unit.format === "json" && parse_fail === true) {
                                return {
                                    assessment: "failed to parse output into JSON",
                                    location: JSON.stringify(format),
                                    pass: false,
                                    store: unit.store,
                                    value: null
                                };
                            }
                            if (len_prop < 1 || format === null) {
                                return test_runner.assert[unit.qualifier](format as string, unit, null);
                            }
                            if (type_of === true) {
                                return test_runner.assert[unit.qualifier](typeof format as string, unit, `typeof ${props.join("")}`);
                            }
                            return test_runner.assert[unit.qualifier](format as string, unit, props.join(""));
                        },
                        str_stderr:string = stderr.join(""),
                        str_stdout:string = stdout.join(""),
                        assertion_list:test_assert[] = [];
                    let index_units:number = 0,
                        unit:test_assertion_command = null;
                    if (len_unit > 0) {
                        do {
                            unit = item.unit[index_units];
                            if (unit !== null) {
                                assertion_list.push(get_value());
                            }
                            index_units = index_units + 1;
                        } while (index_units < len_unit);
                        test_runner.logger(assertion_list);
                    }
                    spawn.kill();
                    test_runner.tools.next();
                },
                spawn_error = function test_runner_execCommand_error(err:node_error):void {
                    log.shell([
                        `[${test_runner.tools.time()}] ${test_runner.count} ${vars.text.angry}Fail${vars.text.none} ${item.name}`,
                        `    ${vars.text.angry}*${vars.text.none} Test failed with error: ${err.code}, ${err.message}`
                    ]);
                    vars.test.total_tests_fail = vars.test.total_tests_fail + 1;
                    vars.test.counts[vars.test.list.name].tests_failed = vars.test.counts[vars.test.list.name].tests_failed + 1;
                    spawn.kill();
                    test_runner.tools.next();
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
            const item_service:services_testBrowser = {
                    index: vars.test.index,
                    magicString: vars.test.magicString,
                    result: null,
                    store: vars.test.store,
                    test: vars.test.list[vars.test.index] as test_item_dom
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
        log.shell(["", "", `Test list ${vars.text.cyan + list.name + vars.text.none}`]);
        vars.test.index = 0;
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
        test_runner.count = 0;
        test_runner.tools.callback = callback;
        if (test_runner.execution[vars.test.list[vars.test.index].type] === undefined) {
            test_runner.tools.next();
        } else {
            test_runner.execution[vars.test.list[vars.test.index].type]();
        }
    },
    logs: [],
    logger: function test_runner_toolsLogger(assertions:test_assert[]):void {
        const logs:string[] = [""],
            len:number = assertions.length,
            star:string = `    ${vars.text.angry}*${vars.text.none} `,
            pass:string = `${vars.text.green}Pass${vars.text.none}: `,
            fail:string = `${vars.text.angry}Fail${vars.text.none}: `;
        let index:number = 0,
            fail_test:boolean = false;

        // assertions
        if (len > 0) {
            do {
                // add assertion value to store
                if (assertions[index].store === true) {
                    vars.test.store = assertions[index].value;
                }

                // pass or fail report text
                if (assertions[index].pass === true) {
                    logs.push(star + vars.text.green + assertions[index].location + assertions[index].assessment + vars.text.none);
                } else {
                    fail_test = true;
                    if (assertions[index].assessment === "failed to parse output into JSON") {
                        logs.push(`${star + vars.text.red + assertions[index].assessment + vars.text.none}\n${assertions[index].location}`);
                    } else {
                        logs.push(star + vars.text.red + assertions[index].location + assertions[index].assessment + vars.text.none);
                    }
                    vars.test.total_assertions_fail = vars.test.total_assertions_fail + 1;
                    vars.test.counts[vars.test.list.name].assertions_fail = vars.test.counts[vars.test.list.name].assertions_fail + 1;
                }

                // assertion counts
                vars.test.total_assertions = vars.test.total_assertions + 1;
                vars.test.counts[vars.test.list.name].assertions = vars.test.counts[vars.test.list.name].assertions + 1;
                index = index + 1;
            } while (index < len);
        }
        test_runner.count = test_runner.count + 1;

        // test pass/fail line
        if (fail_test === true) {
            logs[0] = `${test_runner.tools.time()} ${test_runner.count} ${fail + vars.test.list[vars.test.index].name}`;
            log.shell(logs);
            vars.test.total_tests_fail = vars.test.total_tests_fail + 1;
            vars.test.counts[vars.test.list.name].tests_failed = vars.test.counts[vars.test.list.name].tests_failed + 1;
        } else {
            log.shell([`${test_runner.tools.time()} ${test_runner.count} ${pass + vars.test.list[vars.test.index].name}`]);
        }
    },
    receive: function test_runner_receive(socket_data:socket_data):void {
        const data:services_testBrowser = socket_data.data as services_testBrowser,
            results:test_assert[] = data.result;
        test_runner.logger(results);
        test_runner.tools.next();
    },
    tools: {
        browser_open: function test_runner_toolsBrowser():void {
            const keyword:string = (process.platform === "darwin")
                    ? "open"
                    : (process.platform === "win32")
                        ? "start"
                        : "xdg-open",
                browserCommand = function test_runner_toolsBrowser_browserCommand():string {
                    const path:string = `http://localhost:${vars.servers.dashboard.status.open}/?test_browser`;
                    if (vars.test.browser !== "" && vars.test.browser !== null) {
                        if (vars.test.browser_args.length > 0) {
                            return `${keyword} ${vars.test.browser} ${path} ${vars.test.browser_args.join(" ")}`;
                        }
                        return `${keyword} ${vars.test.browser} ${path}`;
                    }
                    return `${keyword} ${path}`;
                },
                call_dom = function test_runner_toolsBrowser_callDom():void {
                    if (vars.server_meta.dashboard.sockets.open[0] === undefined || vars.server_meta.dashboard.sockets.open[0].queue === undefined) {
                        setTimeout(test_runner_toolsBrowser_callDom, 50);
                    } else {
                        test_runner.execution.dom();
                    }
                };
            vars.test.browser_child = node.child_process.exec(browserCommand(), function test_runner_toolsBrowser_child():void {
                vars.test.browser_start = true;
                call_dom();
            });
        },
        callback: null,
        next: function test_runner_toolsNext():void {
            vars.test.index = vars.test.index + 1;
            if (vars.test.index < vars.test.list.length) {
                if (vars.test.list[vars.test.index] === null) {
                    vars.test.counts[vars.test.list.name].tests_skipped = vars.test.counts[vars.test.list.name].tests_skipped + 1;
                    vars.test.total_tests_skipped = vars.test.total_tests_skipped + 1;
                    test_runner_toolsNext();
                } else if (vars.test.list[vars.test.index] === undefined) {
                    test_runner_toolsNext();
                } else {
                    vars.test.counts[vars.test.list.name].tests_attempted = vars.test.counts[vars.test.list.name].tests_attempted + 1;
                    if (test_runner.execution[vars.test.list[vars.test.index].type] !== undefined) {
                        test_runner.execution[vars.test.list[vars.test.index].type]();
                    }
                }
            } else {
                vars.test.counts[vars.test.list.name].time_end = process.hrtime.bigint();
                test_runner.tools.callback(vars.test.list.name);
            }
        },
        time: function test_runner_toolsTime():string {
            return `${vars.text.cyan}${process.hrtime.bigint().time(vars.test.counts[vars.test.list.name].time_start)}${vars.text.none}`;
        }
    }
};

export default test_runner;