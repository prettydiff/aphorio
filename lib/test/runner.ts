
import log from "../core/log.ts";
import send from "../transmit/send.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

const test_runner:test_runner = {
    assert: {
        "begins": function test_runner_execCommand_assertBegins(value_actual:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assert {
            const nullable:boolean = (unit.nullable === true && value_actual === null),
                value_test:test_primitive = test_runner.tools.get_value(value_actual, unit.value),
                test:boolean = (String(value_actual).indexOf(String(value_test)) === 0);
            return {
                assessment: (nullable === true)
                    ? " is null, which is accepted"
                    : (test === true)
                        ? ` begins with\n"${value_test}"`
                        : ` begins with\n"${value_actual.toString().slice(0, String(value_test).length)}"\nnot\n"${value_test}"`,
                location: location,
                pass: (test === true || nullable === true),
                store: unit.store,
                value: value_actual
            };
        },
        "contains": function test_runner_execCommand_assertContains(value_actual:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assert {
            const s_value:string = (typeof value_actual === "string")
                    ? `"${value_actual}"`
                    : String(value_actual),
                value_test:test_primitive = test_runner.tools.get_value(value_actual, unit.value),
                s_unit:string = (typeof unit.value === "string")
                    ? `"${value_test}"`
                    : String(value_test),
                nullable:boolean = (unit.nullable === true && value_actual === null),
                test:boolean = (String(value_actual).includes(String(value_test)) === true);
            return {
                assessment: (nullable === true)
                    ? " is null, which is accepted"
                    : (test === true)
                        ? ` is\n${s_value}\nwhich contains\n${s_unit}`
                        : ` is\n${s_value}\nwhich does not contain\n${s_unit}`,
                location: location,
                pass: (test === true || nullable === true),
                store: unit.store,
                value: value_actual
            };
        },
        "ends": function test_runner_execCommand_assertEnds(value_actual:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assert {
            const str_value:string = String(value_actual),
                value_test:test_primitive = test_runner.tools.get_value(value_actual, unit.value),
                str_unit:string = String(value_test),
                nullable:boolean = (unit.nullable === true && value_actual === null),
                test:boolean = (str_value.indexOf(str_unit) === str_value.length - str_unit.length);
            return {
                assessment: (nullable === true)
                    ? " is null, which is accepted"
                    : (test === true)
                        ? ` is\n"${str_value}"\nwhich ends with\n"${str_unit}"`
                        :  ` ends with\n"${str_value.slice(str_value.length - str_unit.length)}"\nnot\n"${str_unit}"`,
                location: location,
                pass: (test === true || nullable === true),
                store: unit.store,
                value: value_actual
            };
        },
        "greater": function test_runner_execCommand_assertGreater(value_actual:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assert {
            const nullable:boolean = (unit.nullable === true && value_actual === null),
                value_test:test_primitive = test_runner.tools.get_value(value_actual, unit.value),
                test:boolean = (((typeof value_actual === "bigint" || (typeof value_actual === "string" && (/^\d+n$/).test(String(value_actual)) === true)) && BigInt(value_actual as string) > BigInt(value_test)) || Number(value_actual) > Number(value_test));
            return {
                assessment: (nullable === true)
                    ? " is null, which is accepted"
                    : (test === true)
                        ? ` is\n${value_actual}\nwhich is greater than\n${value_test}`
                        : ` is\n${value_actual}\nwhich is not greater than\n${value_test}`,
                location: location,
                pass: (test === true || nullable === true),
                store: unit.store,
                value: value_actual
            };
        },
        "is": function test_runner_execCommand_assertIs(value_actual:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assert {
            const s_value:string = (typeof value_actual === "string")
                    ? `"${value_actual}"`
                    : String(value_actual),
                value_test:test_primitive = test_runner.tools.get_value(value_actual, unit.value),
                s_unit:string = (typeof unit.value === "string")
                    ? `"${value_test}"`
                    : String(value_test),
                nullable:boolean = (unit.nullable === true && value_actual === null),
                test:boolean = (value_actual === value_test);
            return {
                assessment: (nullable === true)
                    ? " is null, which is accepted"
                    : (test === true)
                        ? ` is exactly\n${s_unit}`
                        : ` is\n${s_value}\nwhich is not\n${s_unit}`,
                location: location,
                pass: (test === true || nullable === true),
                store: unit.store,
                value: value_actual
            };
        },
        "lesser": function test_runner_execCommand_assertLesser(value_actual:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assert {
            const nullable:boolean = (unit.nullable === true && value_actual === null),
                value_test:test_primitive = test_runner.tools.get_value(value_actual, unit.value),
                test:boolean = (((typeof value_actual === "bigint" || (typeof value_actual === "string" && (/^\d+n$/).test(String(value_actual)) === true)) && BigInt(value_actual as string) < BigInt(value_test)) || Number(value_actual) < Number(value_test));
            return {
                assessment: (nullable === true)
                    ? " is null, which is accepted"
                    : (test === true)
                        ? ` is\n${value_actual}\nwhich is lesser than\n${value_test}`
                        : ` is\n${value_actual}\nwhich is not lesser than\n${value_test}`,
                location: location,
                pass: (test === true || nullable === true),
                store: unit.store,
                value: value_actual
            };
        },
        "not": function test_runner_execCommand_assertBegins(value_actual:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assert {
            const s_value:string = (typeof value_actual === "string")
                    ? `"${value_actual}"`
                    : String(value_actual),
                value_test:test_primitive = test_runner.tools.get_value(value_actual, unit.value),
                s_unit:string = (typeof unit.value === "string")
                    ? `"${value_test}"`
                    : String(value_test),
                nullable:boolean = (unit.nullable === true && value_actual === null),
                test:boolean = (value_actual !== value_test);
            return {
                assessment: (nullable === true)
                    ? " is null, which is accepted"
                    : (test === true)
                        ? ` is\n${s_value}\nnot\n${s_unit}`
                        : ` is exactly\n${s_value}`,
                location: location,
                pass: (test === true || nullable === true),
                store: unit.store,
                value: value_actual
            };
        },
        "not contains": function test_runner_execCommand_assertNotContains(value_actual:string, unit:test_assertion_command|test_assertion_dom, location:string):test_assert {
            const s_value:string = (typeof value_actual === "string")
                    ? `"${value_actual}"`
                    : String(value_actual),
                value_test:test_primitive = test_runner.tools.get_value(value_actual, unit.value),
                s_unit:string = (typeof unit.value === "string")
                    ? `"${value_test}"`
                    : String(value_test),
                nullable:boolean = (unit.nullable === true && value_actual === null),
                test:boolean = (String(value_actual).includes(String(value_test)) === false);
            return {
                assessment: (nullable === true)
                    ? " is null, which is accepted"
                    : (test === true)
                        ? ` is\n${s_value}\nwhich does not contain\n${s_unit}`
                        : ` is\n${s_value}\nwhich contains\n${s_unit}`,
                location: location,
                pass: (test === true || nullable === true),
                store: unit.store,
                value: value_actual
            };
        }
    },
    count: 0,
    execution: {
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
                    suite_name: vars.test.list[vars.test.index].name,
                    test: vars.test.list[vars.test.index] as test_item_dom
                },
                payload:socket_data = {
                    data: item_service,
                    service: "test-browser"
                };
            send(payload, test_runner.socket, 3);
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
        const logs:string[] = [],
            len:number = assertions.length,
            star:string = `    ${vars.text.angry}*${vars.text.none} `,
            pass:string = `${vars.text.green}Pass${vars.text.none}: `,
            fail:string = `${vars.text.angry}Fail${vars.text.none}: `,
            count = function test_runner_toolsLogger_count():string {
                const padLen:number = vars.test.list.length.toString().length;
                let str:string = String(test_runner.count),
                    strLen:number = str.length;
                if (strLen < padLen) {
                    do {
                        str = ` ${str}`;
                        strLen = strLen + 1;
                    } while (strLen < padLen);
                }
                return str;
            };
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
            logs.splice(0, 0, `${test_runner.tools.time()} ${count()} ${fail + vars.test.list[vars.test.index].name}`);
            log.shell(logs);
            vars.test.total_tests_fail = vars.test.total_tests_fail + 1;
            vars.test.counts[vars.test.list.name].tests_failed = vars.test.counts[vars.test.list.name].tests_failed + 1;
        } else {
            log.shell([`${test_runner.tools.time()} ${count()} ${pass + vars.test.list[vars.test.index].name}`]);
        }
    },
    receive: function test_runner_receive(socket_data:socket_data):void {
        const data:services_testBrowser = socket_data.data as services_testBrowser,
            results:test_assert[] = data.result;
        test_runner.logger(results);
        test_runner.tools.next();
    },
    socket: null,
    tools: {
        browser_open: function test_runner_toolsBrowser():void {
            const browserCommand = function test_runner_toolsBrowser_browserCommand():string {
                    const path:string = `http://localhost:${vars.data_store.server_ports[vars.environment.dashboard_id].open}/?test_browser`;
                    if (vars.test.test_browser !== "" && vars.test.test_browser !== null) {
                        if (vars.test.browser_args.length > 0) {
                            return `${vars.commands.open} "${vars.test.test_browser}" "${path}" ${vars.test.browser_args.join(" ")}`;
                        }
                        return `${vars.commands.open} "${vars.test.test_browser}" "${path}"`;
                    }
                    return `${vars.commands.open} "${path}"`;
                },
                call_dom = function test_runner_toolsBrowser_callDom():void {
                    if (vars.data_store.sockets_tcp[vars.environment.dashboard_id].open[0] === undefined || vars.data_store.sockets_tcp[vars.environment.dashboard_id].open[0].queue === undefined) {
                        setTimeout(test_runner_toolsBrowser_callDom, 50);
                    } else {
                        test_runner.socket = vars.data_store.sockets_tcp[vars.environment.dashboard_id].open[0];
                        test_runner.execution.dom();
                    }
                };
            vars.test.browser_start = true;
            vars.test.browser_child = spawn(browserCommand(), null, {
                shell: (process.platform === "win32")
                    ? "powershell"
                    : "bash"
            });
            vars.test.browser_child.execute();
            call_dom();
        },
        callback: null,
        get_value: function test_runner_getValue(value_actual:test_primitive, value_test:test_primitive|test_primitive[]):test_primitive {
            if (Array.isArray(value_test) === true) {
                const index:number = (value_test as test_primitive[]).indexOf(value_actual);
                if (index > -1) {
                    return value_test[index];
                }
                return JSON.stringify(value_test);
            }
            return value_test as test_primitive;
        },
        next: function test_runner_toolsNext():void {
            vars.test.index = vars.test.index + 1;
            vars.test.counts[vars.test.list.name].tests_attempted = vars.test.counts[vars.test.list.name].tests_attempted + 1;
            if ((vars.options["stop-on-fail"] === true && vars.test.counts[vars.test.list.name].assertions_fail > 0) || vars.test.index === vars.test.list.length) {
                const skipped:number = vars.test.list.length - vars.test.index;
                vars.test.counts[vars.test.list.name].tests_skipped = vars.test.counts[vars.test.list.name].tests_skipped + skipped;
                vars.test.total_tests_skipped = vars.test.total_tests_skipped + skipped;
                vars.test.counts[vars.test.list.name].time_end = process.hrtime.bigint();
                test_runner.tools.callback(vars.test.list.name);
            } else {
                if (vars.test.list[vars.test.index] === null) {
                    vars.test.counts[vars.test.list.name].tests_skipped = vars.test.counts[vars.test.list.name].tests_skipped + 1;
                    vars.test.total_tests_skipped = vars.test.total_tests_skipped + 1;
                    test_runner_toolsNext();
                } else if (vars.test.list[vars.test.index] === undefined) {
                    test_runner_toolsNext();
                } else {
                    if (test_runner.execution[vars.test.list[vars.test.index].type] !== undefined) {
                        test_runner.execution[vars.test.list[vars.test.index].type]();
                    }
                }
            }
        },
        time: function test_runner_toolsTime():string {
            return `${vars.text.cyan}${process.hrtime.bigint().time_elapsed(vars.test.counts[vars.test.list.name].time_start)}${vars.text.none}`;
        }
    }
};

export default test_runner;