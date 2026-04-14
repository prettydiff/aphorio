
import log from "../core/log.ts";
import send from "../transmit/send.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

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
                socket:websocket_client = vars.server_meta[vars.environment.dashboard_id].sockets.open[0],
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
            logs[0] = `${test_runner.tools.time()} ${count()} ${fail + vars.test.list[vars.test.index].name}`;
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
    tools: {
        browser_open: function test_runner_toolsBrowser():void {
            const browserCommand = function test_runner_toolsBrowser_browserCommand():string {
                    const path:string = `http://localhost:${vars.data_meta.server_ports[vars.environment.dashboard_id].open}/?test_browser`;
                    if (vars.test.test_browser !== "" && vars.test.test_browser !== null) {
                        if (vars.test.browser_args.length > 0) {
                            return `${vars.commands.open} ${vars.test.test_browser} ${path} ${vars.test.browser_args.join(" ")}`;
                        }
                        return `${vars.commands.open} ${vars.test.test_browser} ${path}`;
                    }
                    return `${vars.commands.open} ${path}`;
                },
                call_dom = function test_runner_toolsBrowser_callDom():void {
                    if (vars.server_meta[vars.environment.dashboard_id].sockets.open[0] === undefined || vars.server_meta[vars.environment.dashboard_id].sockets.open[0].queue === undefined) {
                        setTimeout(test_runner_toolsBrowser_callDom, 50);
                    } else {
                        test_runner.execution.dom();
                    }
                };
            vars.test.browser_start = true;
            vars.test.browser_child = spawn(browserCommand(), call_dom);
            vars.test.browser_child.execute();
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
            return `${vars.text.cyan}${process.hrtime.bigint().time_elapsed(vars.test.counts[vars.test.list.name].time_start)}${vars.text.none}`;
        }
    }
};

export default test_runner;