
import log from "../utilities/log.ts";
import node from "../utilities/node.ts";
import vars from "../utilities/vars.ts";

const test_runner = function test_runner(start:bigint, list:test_list, callback:(config:test_config_summary) => void):void {
    const assert:test_evaluations = {
            "begins": function test_runner_execCommand_assertBegins(value:string, comparator:string, nullable:boolean):[boolean, string] {
                if (nullable === true && value === null) {
                    return [true, `value is null, which is accepted`];
                }
                if (value.indexOf(comparator) === 0) {
                    return [true, `begins with ${comparator}`];
                }
                return [false, `begins with ${value.toString().slice(0, 8)}, not ${comparator}`];
            },
            "contains": function test_runner_execCommand_assertContains(value:string, comparator:string, nullable:boolean):[boolean, string] {
                if (nullable === true && value === null) {
                    return [true, `value is null, which is accepted`];
                }
                if (value.includes(comparator) === true) {
                    return [true, `contains ${comparator}`];
                }
                return [false, `does not contain ${value}`];
            },
            "ends": function test_runner_execCommand_assertEnds(value:string, comparator:string, nullable:boolean):[boolean, string] {
                if (nullable === true && value === null) {
                    return [true, `value is null, which is accepted`];
                }
                if (value.indexOf(comparator) === value.length - comparator.length) {
                    return [true, `ends with ${comparator}`];
                }
                return [false, `ends with ${value.slice(value.length - 8)}, not ${comparator}`];
            },
            "greater": function test_runner_execCommand_assertGreater(value:string, comparator:string, nullable:boolean):[boolean, string] {
                if (nullable === true && value === null) {
                    return [true, `value is null, which is accepted`];
                }
                if (Number(value) > Number(comparator)) {
                    return [true, `is greater than ${comparator}`];
                }
                return [false, `is ${value}, which is not greater than ${comparator}`];
            },
            "is": function test_runner_execCommand_assertIs(value:string, comparator:string, nullable:boolean):[boolean, string] {
                if (nullable === true && value === null) {
                    return [true, `value is null, which is accepted`];
                }
                if (value === comparator) {
                    return [true, `is exactly ${value}`];
                }
                return [false, `is ${value}, not ${comparator}`];
            },
            "lesser": function test_runner_execCommand_assertLesser(value:string, comparator:string, nullable:boolean):[boolean, string] {
                if (nullable === true && value === null) {
                    return [true, `value is null, which is accepted`];
                }
                if (Number(value) < Number(comparator)) {
                    return [true, `is lesser than ${comparator}`];
                }
                return [false, `is ${value}, which is not lesser than ${comparator}`];
            },
            "not contains": function test_runner_execCommand_assertNotContains(value:string, comparator:string, nullable:boolean):[boolean, string] {
                if (nullable === true && value === null) {
                    return [true, `value is null, which is accepted`];
                }
                if (value.includes(comparator) === false) {
                    return [true, `does not contain ${comparator}`];
                }
                return [false, `contains ${value}`];
            },
            "not": function test_runner_execCommand_assertBegins(value:string, comparator:string, nullable:boolean):[boolean, string] {
                if (nullable === true && value === null) {
                    return [true, `value is null, which is accepted`];
                }
                if (value !== comparator) {
                    return [true, `is not ${value}`];
                }
                return [false, `is exactly ${value}`];
            }
        },
        utility:store_function = {
            complete: function test_runner_utilityComplete():void {
                index_list = index_list + 1;
                if (index_list < len_list) {
                    utility.next();
                } else {
                    callback({
                        fail_assertions: fail_assert,
                        fail_tests: fail_test,
                        name: list.name,
                        time_end: process.hrtime.bigint(),
                        time_start: start,
                        total_assertions: total_assert,
                        total_tests: len_list,
                    });
                }
            },
            next: function test_runner_utilityNext():void {
                if (list[index_list] === null) {
                    utility.complete();
                } else if (list[index_list].type === "command") {
                    exec.command();
                } else if (list[index_list].type === "dom") {
                    exec.dom();
                }
            },
            time: function test_runner_utilityTime():string {
                return `${vars.text.cyan}${process.hrtime.bigint().time(start)}${vars.text.none}`;
            }
        },
        exec:store_function = {
            command: function test_runner_execCommand():void {
                let fail:boolean = false;
                const item:test_item_command = list[index_list] as test_item_command,
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
                            fail_output:string[] = [],
                            get_value = function test_runner_execCommand_getValue():number|object|string {
                                const len_prop:number = unit.properties.length,
                                    start:string = (unit.type === "stderr")
                                        ? str_stderr
                                        : str_stdout,
                                    props:string[] = [unit.type];
                                let index_prop:number = 0,
                                    prop:number|string = null,
                                    type_of:boolean = false,
                                    format:number|object|string = (unit.format === "lines")
                                        ? start.replace(/\n\s+/, "\n").split("\n")
                                        : (unit.format === "json")
                                            ? (function test_runner_execCommand_getValue_json():object {
                                                // eslint-disable-next-line no-restricted-syntax
                                                try {
                                                    return JSON.parse(start.replace(/\x1B\[33;1mWARNING: Resulting JSON is truncated as serialization has exceeded the set depth of \d.\x1B\[0m\r\n/, ""));
                                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                } catch (e:unknown) {
                                                    parse_fail = true;
                                                    return null;
                                                }
                                            }())
                                            : start;
                                if (len_prop < 1 || format === null) {
                                    return format;
                                }
                                do {
                                    prop = unit.properties[index_prop];
                                    if (prop === "typeof") {
                                        type_of = true;
                                    } else {
                                        props.push(`[${prop}]`);
                                        format = (format as Array<string>)[prop as number];
                                    }
                                    if (format === null || format === undefined) {
                                        break;
                                    }
                                    index_prop = index_prop + 1;
                                } while (index_prop < len_prop);
                                if (type_of === true) {
                                    prop_string = `typeof ${props.join("")}`;
                                    return typeof format;
                                }
                                prop_string = props.join("");
                                return format;
                            },
                            str_stderr:string = stderr.join(""),
                            str_stdout:string = stdout.join("");
                        let index_command:number = 0,
                            value:string = "",
                            prop_string:string = "",
                            parse_fail:boolean = false,
                            unit:test_assertion_command = null,
                            assertion:[boolean, string] = null;
                        if (len_unit > 0) {
                            do {
                                unit = item.unit[index_command];
                                if (unit !== null) {
                                    value = get_value() as string;
                                    assertion = assert[unit.qualifier](value, unit.value as string, (unit.nullable === true));
                                    // @ts-expect-error - ts cannot detect the assignment above
                                    if (parse_fail === true) {
                                        fail_output.push(`    ${vars.text.angry}*${vars.text.none} ${vars.text.angry + unit.type} failed to parse into JSON - ${unit.value + vars.text.none}`);
                                        parse_fail = false;
                                        fail = true;
                                        fail_assert = fail_assert + 1;
                                    } else if (assertion[0] === true) {
                                        fail_output.push(`    ${vars.text.angry}*${vars.text.none} ${vars.text.green + vars.text.bold + prop_string} ${assertion[1] + vars.text.none}`);
                                    } else {
                                        fail_output.push(`    ${vars.text.angry}*${vars.text.none} ${vars.text.angry + prop_string} ${assertion[1] + vars.text.none}`);
                                        fail = true;
                                        fail_assert = fail_assert + 1;
                                    }
                                    total_assert = total_assert + 1;
                                }
                                index_command = index_command + 1;
                            } while (index_command < len_unit);
                            if (fail === true) {
                                fail_output.splice(0, 0, `[${utility.time()}] ${index_list + 1} ${vars.text.angry}Fail${vars.text.none} ${item.name}:  ${item.command}`);
                                log.shell(fail_output);
                                fail = false;
                                fail_test = fail_test + 1;
                            } else {
                                log.shell([`[${utility.time()}] ${index_list + 1} ${vars.text.green}Pass${vars.text.none} ${item.name}:  ${item.command}`]);
                            }
                        }
                        spawn.kill();
                        utility.complete();
                    },
                    spawn_error = function test_runner_execCommand_error(err:node_error):void {
                        log.shell([
                            `[${utility.time()}] ${index_list + 1} ${vars.text.angry}Fail${vars.text.none} ${item.name}`,
                            `    ${vars.text.angry}*${vars.text.none} Test failed with error: ${err.code}, ${err.message}`
                        ]);
                        fail_test = fail_test + 1;
                        fail = false;
                        spawn.kill();
                        utility.complete();
                    };
                spawn.stderr.on("data", stderr_callback);
                spawn.stdout.on("data", stdout_callback);
                spawn.on("close", spawn_close);
                spawn.on("error", spawn_error);
            },
            dom: function test_runner_execDOM():void {
                const item:test_item_dom = list[index_list] as test_item_dom,
                    len_interaction:number = item.interaction.length;
                let index_dom:number = 0;
                if (len_interaction > 0) {
                    do {
                        index_dom = index_dom + 1;
                    } while (index_dom < len_interaction);
                }
            },
        },
        len_list:number = list.length;
    let fail_assert:number = 0,
        fail_test:number = 0,
        index_list:number = 0,
        total_assert:number = 0;
    log.shell([`Test list ${vars.text.cyan + list.name + vars.text.none}`]);
    utility.next();
};

export default test_runner;