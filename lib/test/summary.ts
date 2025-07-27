
import log from "../utilities/log.ts";
import vars from "../utilities/vars.ts";


const test_summary = function test_summary(config:test_config_summary):void {
    const pad_right = function test_runner_padRight(len:number, input:string):string {
            let count:number = input.length;
            if (count < len) {
                do {
                    input = " " + input;
                    count = count + 1;
                } while (count < len);
            }
            return input;
        },
        summary:string[] = [""],
        color:"angry"|"green" = (config.list_fail_assertions === 0)
            ? "green"
            : "angry";
    summary.push(`${vars.text.underline}Testing complete for list ${vars.text.cyan + config.name + vars.text.none}`);
    summary.push(`    ${vars.text.angry}*${vars.text.none} List time             : ${vars.text.cyan + config.time_list_end.time(config.time_list_start) + vars.text.none}`);
    summary.push(`    ${vars.text.angry}*${vars.text.none} List tests            : ${pad_right(18, config.list_tests.commas())}`);
    summary.push(`    ${vars.text.angry}*${vars.text.none} List assertions       : ${pad_right(18, config.list_assertions.commas())}`);
    summary.push(`    ${vars.text.angry}*${vars.text.none} List failed tests     : ${vars.text[color] + pad_right(18, config.list_fail_tests.commas()) + vars.text.none}`);
    summary.push(`    ${vars.text.angry}*${vars.text.none} List failed assertions: ${vars.text[color] + pad_right(18, config.list_fail_assertions.commas()) + vars.text.none}`);
    summary.push(`    ${vars.text.angry}*${vars.text.none} Percentage pass       : tests - ${vars.text[color] + (((config.list_tests - config.list_fail_tests) / config.list_tests) * 100).toFixed(2) + vars.text.none}%, assertions - ${vars.text[color] + (((config.list_assertions - config.list_fail_assertions) / config.list_assertions) * 100).toFixed(2) + vars.text.none}%`);
    if (config.final === true) {
        summary.push("");
        summary.push("---");
        summary.push("");
        summary.push(`${vars.text.underline}Totals from all test lists`);
        summary.push(`    ${vars.text.angry}*${vars.text.none} Total time             : ${vars.text.cyan + config.time_total_end.time(config.time_total_start) + vars.text.none}`);
        summary.push(`    ${vars.text.angry}*${vars.text.none} Total lists            : ${pad_right(18, config.total_lists.commas())}`);
        summary.push(`    ${vars.text.angry}*${vars.text.none} Total tests            : ${pad_right(18, config.total_tests.commas())}`);
        summary.push(`    ${vars.text.angry}*${vars.text.none} Total assertions       : ${pad_right(18, config.total_assertions.commas())}`);
        summary.push(`    ${vars.text.angry}*${vars.text.none} Total failed tests     : ${vars.text[color] + pad_right(18, config.total_fail_tests.commas()) + vars.text.none}`);
        summary.push(`    ${vars.text.angry}*${vars.text.none} Total failed assertions: ${vars.text[color] + pad_right(18, config.total_fail_assertions.commas()) + vars.text.none}`);
        summary.push(`    ${vars.text.angry}*${vars.text.none} Percentage pass        : tests - ${vars.text[color] + (((config.total_tests - config.total_fail_tests) / config.total_tests) * 100).toFixed(2) + vars.text.none}%, assertions - ${vars.text[color] + (((config.total_assertions - config.total_fail_assertions) / config.total_assertions) * 100).toFixed(2) + vars.text.none}%`);
    }
    log.shell(summary, config.final);
};

export default test_summary;