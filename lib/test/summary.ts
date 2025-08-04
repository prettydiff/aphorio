
import log from "../utilities/log.ts";
import vars from "../utilities/vars.ts";


const test_summary = function test_summary(name:string, complete:boolean):void {
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
        color:"angry"|"green" = (vars.test.counts[name].assertions_fail === 0)
            ? "green"
            : "angry",
        list = vars.test.counts[name];
    summary.push(`${vars.text.underline}Testing complete for list ${vars.text.cyan + name + vars.text.none}`);
    summary.push(`    ${vars.text.angry}*${vars.text.none} List time             : ${vars.text.cyan + list.time_end.time(list.time_start) + vars.text.none}`);
    summary.push(`    ${vars.text.angry}*${vars.text.none} List tests            : ${pad_right(18, list.tests_total.commas())}`);
    summary.push(`    ${vars.text.angry}*${vars.text.none} List assertions       : ${pad_right(18, list.assertions.commas())}`);
    summary.push(`    ${vars.text.angry}*${vars.text.none} List skipped tests    : ${pad_right(18, list.tests_skipped.commas())}`);
    summary.push(`    ${vars.text.angry}*${vars.text.none} List failed tests     : ${vars.text[color] + pad_right(18, list.tests_failed.commas()) + vars.text.none}`);
    summary.push(`    ${vars.text.angry}*${vars.text.none} List failed assertions: ${vars.text[color] + pad_right(18, list.assertions_fail.commas()) + vars.text.none}`);
    summary.push(`    ${vars.text.angry}*${vars.text.none} Percentage pass       : tests - ${vars.text[color] + (((list.tests_total - list.tests_failed) / list.tests_total) * 100).toFixed(2) + vars.text.none}%, assertions - ${vars.text[color] + (((list.assertions - list.assertions_fail) / list.assertions) * 100).toFixed(2) + vars.text.none}%`);
    if (complete === true && vars.test.total_lists > 1) {
        summary.push("");
        summary.push("---");
        summary.push("");
        summary.push(`${vars.text.underline}Totals from all test lists`);
        summary.push(`    ${vars.text.angry}*${vars.text.none} Total time             : ${vars.text.cyan + vars.test.total_time_end.time(vars.test.total_time_start) + vars.text.none}`);
        summary.push(`    ${vars.text.angry}*${vars.text.none} Total lists            : ${pad_right(18, vars.test.total_lists.commas())}`);
        summary.push(`    ${vars.text.angry}*${vars.text.none} Total tests            : ${pad_right(18, vars.test.total_tests.commas())}`);
        summary.push(`    ${vars.text.angry}*${vars.text.none} Total assertions       : ${pad_right(18, vars.test.total_assertions.commas())}`);
        summary.push(`    ${vars.text.angry}*${vars.text.none} Total failed tests     : ${vars.text[color] + pad_right(18, vars.test.total_tests_fail.commas()) + vars.text.none}`);
        summary.push(`    ${vars.text.angry}*${vars.text.none} Total failed assertions: ${vars.text[color] + pad_right(18, vars.test.total_assertions_fail.commas()) + vars.text.none}`);
        summary.push(`    ${vars.text.angry}*${vars.text.none} Percentage pass        : tests - ${vars.text[color] + (((vars.test.total_tests - vars.test.total_tests_fail) / vars.test.total_tests) * 100).toFixed(2) + vars.text.none}%, assertions - ${vars.text[color] + (((vars.test.total_assertions - vars.test.total_assertions_fail) / vars.test.total_assertions) * 100).toFixed(2) + vars.text.none}%`);
    }
    log.shell(summary, complete);
    if (vars.test.total_assertions_fail > 1) {
        process.exit(1);
    } else {
        process.exit(0);
    }
};

export default test_summary;