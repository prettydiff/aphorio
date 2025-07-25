
import log from "../utilities/log.ts";
import node from "../utilities/node.ts";
import vars from "../utilities/vars.ts";

const test = function test_runner(start:bigint, list:test_list):void {
    const assert:test_evaluations = {
            "begins": function test_runner_execCommand_assertBegins(value:string, comparator:string):boolean {
                if (value.indexOf(comparator) === 0) {
                    return true;
                }
                return false;
            },
            "contains": function test_runner_execCommand_assertContains(value:string, comparator:string):boolean {
                return value.includes(comparator);
            },
            "ends": function test_runner_execCommand_assertEnds(value:string, comparator:string):boolean {
                if (value.indexOf(comparator) === value.length - comparator.length) {
                    return true;
                }
                return false;
            },
            "greater": function test_runner_execCommand_assertGreater(value:string, comparator:string):boolean {
                if (Number(value) > Number(comparator)) {
                    return true;
                }
                return false;
            },
            "is": function test_runner_execCommand_assertIs(value:string, comparator:string):boolean {
                if (value === comparator) {
                    return true;
                }
                return false;
            },
            "lesser": function test_runner_execCommand_assertLesser(value:string, comparator:string):boolean {
                if (Number(value) < Number(comparator)) {
                    return true;
                }
                return false;
            },
            "not contains": function test_runner_execCommand_assertNotContains(value:string, comparator:string):boolean {
                if (value.includes(comparator) === false) {
                    return true;
                }
                return false;
            },
            "not": function test_runner_execCommand_assertBegins(value:string, comparator:string):boolean {
                if (value !== comparator) {
                    return true;
                }
                return false;
            }
        },
        assert_text_negative:store_string = {
            "begins": "does not begin with",
            "contains": "does not contain",
            "ends": "does not end with",
            "greater": "is not greater than",
            "is": "is not",
            "lesser": "is not lesser than",
            "not contains": "does contain",
            "not": "is"
        },
        assert_text_positive:store_string = {
            "begins": "begins with",
            "contains": "contains",
            "ends": "ends with",
            "greater": "is greater than",
            "is": "is exactly",
            "lesser": "is lesser than",
            "not contains": "does not contain",
            "not": "is not"
        },
        pad_right = function test_runner_padRight(len:number, input:string):string {
            let count:number = input.length;
            if (count < len) {
                do {
                    input = " " + input;
                    count = count + 1;
                } while (count < len);
            }
            return input;
        },
        utility:store_function = {
            complete: function test_runner_utilityComplete():void {
                index_list = index_list + 1;
                if (index_list < len_list) {
                    utility.next();
                } else {
                    const summary:string[] = [""],
                        color:"angry"|"green" = (fail_assert === 0)
                            ? "green"
                            : "angry";
                    summary.push(`${vars.text.underline}Testing complete for list ${vars.text.cyan + list.name + vars.text.none}`);
                    summary.push(`    ${vars.text.angry}*${vars.text.none} Total list time  : ${utility.time()}`);
                    summary.push(`    ${vars.text.angry}*${vars.text.none} Total tests      : ${pad_right(18, len_list.commas())}`);
                    summary.push(`    ${vars.text.angry}*${vars.text.none} Total assertions : ${pad_right(18, total_assert.commas())}`);
                    summary.push(`    ${vars.text.angry}*${vars.text.none} Failed tests     : ${vars.text[color] + pad_right(18, fail_test.commas()) + vars.text.none}`);
                    summary.push(`    ${vars.text.angry}*${vars.text.none} Failed assertions: ${vars.text[color] + pad_right(18, fail_assert.commas()) + vars.text.none}`);
                    summary.push(`    ${vars.text.angry}*${vars.text.none} Percentage pass  : tests - ${vars.text[color] + (((len_list - fail_test) / len_list) * 100).toFixed(2) + vars.text.none}%, assertions - ${vars.text[color] + (((total_assert - fail_assert) / total_assert) * 100).toFixed(2) + vars.text.none}%`);
                    log.shell(summary, true);
                }
            },
            next: function test_runner_utilityNext():void {
                if (list[index_list].type === "command") {
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
                                        : str_stdout;
                                let index_prop:number = 0,
                                    prop:number|string = null,
                                    format:number|object|string = (unit.format === "lines")
                                        ? start.replace(/\n\s+/, "\n").split("\n")
                                        : (unit.format === "json")
                                            ? (function test_runner_execCommand_getValue_json():object {
                                                // eslint-disable-next-line no-restricted-syntax
                                                try {
                                                    return JSON.parse(start);
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
                                    format = (format as Array<string>)[prop as number];
                                    if (format === null || format === undefined) {
                                        break;
                                    }
                                    index_prop = index_prop + 1;
                                } while (index_prop < len_prop);
                                return format;
                            },
                            str_stderr:string = stderr.join(""),
                            str_stdout:string = stdout.join("");
                        let index_command:number = 0,
                            value:string = "",
                            parse_fail:boolean = false,
                            unit:test_assertion_command = null;
                        if (len_unit > 0) {
                            do {
                                unit = item.unit[index_command];
                                value = get_value() as string;
                                // @ts-expect-error - ts cannot detect the assignment above
                                if (parse_fail === true) {
                                    fail_output.push(`    ${vars.text.angry}*${vars.text.none} ${vars.text.angry + unit.type} failed to parse into JSON ${unit.value + vars.text.none}`);
                                    parse_fail = false;
                                    fail = true;
                                    fail_assert = fail_assert + 1;
                                } else if (assert[unit.qualifier](value, unit.value as string) === true) {
                                    fail_output.push(`    ${vars.text.angry}*${vars.text.none} ${vars.text.green + vars.text.bold + unit.type} ${assert_text_positive[unit.qualifier]} ${unit.value + vars.text.none}`);
                                } else {
                                    fail_output.push(`    ${vars.text.angry}*${vars.text.none} ${vars.text.angry + unit.type} ${assert_text_negative[unit.qualifier]} ${unit.value + vars.text.none}`);
                                    fail = true;
                                    fail_assert = fail_assert + 1;
                                }
                                total_assert = total_assert + 1;
                                index_command = index_command + 1;
                            } while (index_command < len_unit);
                            if (fail === true) {
                                fail_output.splice(0, 0, `[${utility.time()}] ${index_list + 1} ${vars.text.angry}Fail${vars.text.none} ${item.name}`);
                                log.shell(fail_output);
                                fail = false;
                                fail_test = fail_test + 1;
                            } else {
                                log.shell([`[${utility.time()}] ${index_list + 1} ${vars.text.green}Pass${vars.text.none} ${item.name}`]);
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

export default test;