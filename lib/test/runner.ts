
import log from "../utilities/log.ts";
import node from "../utilities/node.ts";
import vars from "../utilities/vars.ts";

const test_runner = function test_runner(start:bigint, list:test_list, callback:(config:test_config_summary) => void):void {
    const assert:test_evaluations = {
            "begins": function test_runner_execCommand_assertBegins(value:string, comparator:string, nullable:boolean):[boolean, string] {
                if (nullable === true && value === null) {
                    return [true, "value is null, which is accepted"];
                }
                if (value.indexOf(comparator) === 0) {
                    return [true, `begins with ${comparator}`];
                }
                return [false, `begins with ${value.toString().slice(0, 8)}, not ${comparator}`];
            },
            "contains": function test_runner_execCommand_assertContains(value:string, comparator:string, nullable:boolean):[boolean, string] {
                if (nullable === true && value === null) {
                    return [true, "value is null, which is accepted"];
                }
                if (value.includes(comparator) === true) {
                    return [true, `contains ${comparator}`];
                }
                return [false, `does not contain ${value}`];
            },
            "ends": function test_runner_execCommand_assertEnds(value:string, comparator:string, nullable:boolean):[boolean, string] {
                if (nullable === true && value === null) {
                    return [true, "value is null, which is accepted"];
                }
                if (value.indexOf(comparator) === value.length - comparator.length) {
                    return [true, `ends with ${comparator}`];
                }
                return [false, `ends with ${value.slice(value.length - 8)}, not ${comparator}`];
            },
            "greater": function test_runner_execCommand_assertGreater(value:string, comparator:string, nullable:boolean):[boolean, string] {
                if (nullable === true && value === null) {
                    return [true, "value is null, which is accepted"];
                }
                if (Number(value) > Number(comparator)) {
                    return [true, `is greater than ${comparator}`];
                }
                return [false, `is ${value}, which is not greater than ${comparator}`];
            },
            "is": function test_runner_execCommand_assertIs(value:string, comparator:string, nullable:boolean):[boolean, string] {
                if (nullable === true && value === null) {
                    return [true, "value is null, which is accepted"];
                }
                if (value === comparator) {
                    return [true, `is exactly ${value}`];
                }
                return [false, `is ${value}, not ${comparator}`];
            },
            "lesser": function test_runner_execCommand_assertLesser(value:string, comparator:string, nullable:boolean):[boolean, string] {
                if (nullable === true && value === null) {
                    return [true, "value is null, which is accepted"];
                }
                if (Number(value) < Number(comparator)) {
                    return [true, `is lesser than ${comparator}`];
                }
                return [false, `is ${value}, which is not lesser than ${comparator}`];
            },
            "not contains": function test_runner_execCommand_assertNotContains(value:string, comparator:string, nullable:boolean):[boolean, string] {
                if (nullable === true && value === null) {
                    return [true, "value is null, which is accepted"];
                }
                if (value.includes(comparator) === false) {
                    return [true, `does not contain ${comparator}`];
                }
                return [false, `contains ${value}`];
            },
            "not": function test_runner_execCommand_assertBegins(value:string, comparator:string, nullable:boolean):[boolean, string] {
                if (nullable === true && value === null) {
                    return [true, "value is null, which is accepted"];
                }
                if (value !== comparator) {
                    return [true, `is ${value}, not ${comparator}`];
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
                        final: false,
                        list_assertions: total_assert,
                        list_fail_assertions: fail_assert,
                        list_fail_tests: fail_test,
                        list_tests: count_test,
                        name: list.name,
                        time_list_end: process.hrtime.bigint(),
                        time_list_start: start,
                        time_total_end: null,
                        time_total_start: null,
                        total_assertions: null,
                        total_fail_assertions: null,
                        total_fail_tests: null,
                        total_lists: null,
                        total_tests: null
                    });
                }
            },
            next: function test_runner_utilityNext():void {
                if (list[index_list] === null) {
                    utility.complete();
                } else {
                    count_test = count_test + 1;
                    if (list[index_list].type === "command") {
                        exec.command();
                    } else if (list[index_list].type === "dom") {
                        exec.dom();
                    }
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
                            get_value = function test_runner_execCommand_getValue():boolean|number|object|string {
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
                                    return format;
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
                                    prop_string = `typeof ${props.join("")}`;
                                    return typeof format;
                                }
                                prop_string = props.join("");
                                return format;
                            },
                            str_stderr:string = stderr.join(""),
                            str_stdout:string = stdout.join("");
                        let index_units:number = 0,
                            value:string = "",
                            prop_string:string = "",
                            parse_fail:boolean = false,
                            unit:test_assertion_command = null,
                            assertion:[boolean, string] = null;
                        if (len_unit > 0) {
                            do {
                                unit = item.unit[index_units];
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
                                index_units = index_units + 1;
                            } while (index_units < len_unit);
                            if (fail === true) {
                                fail_output.splice(0, 0, `[${utility.time()}] ${count_test} ${vars.text.angry}Fail${vars.text.none} ${item.name}:  ${item.command}`);
                                log.shell(fail_output);
                                fail = false;
                                fail_test = fail_test + 1;
                            } else {
                                log.shell([`[${utility.time()}] ${count_test} ${vars.text.green}Pass${vars.text.none} ${item.name}:  ${item.command}`]);
                            }
                        } else {
                            log.shell([`[${utility.time()}] ${count_test} No assertions ${item.name}:  ${item.command}`]);
                        }
                        spawn.kill();
                        utility.complete();
                    },
                    spawn_error = function test_runner_execCommand_error(err:node_error):void {
                        log.shell([
                            `[${utility.time()}] ${count_test} ${vars.text.angry}Fail${vars.text.none} ${item.name}`,
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
        count_test:number = 0,
        total_assert:number = 0;
    log.shell([`Test list ${vars.text.cyan + list.name + vars.text.none}`]);
    utility.next();
};

export default test_runner;