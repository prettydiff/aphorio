
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
        color:"angry"|"green" = (config.fail_assertions === 0)
            ? "green"
            : "angry";
    summary.push(`${vars.text.underline}Testing complete for list ${vars.text.cyan + config.name + vars.text.none}`);
    summary.push(`    ${vars.text.angry}*${vars.text.none} Total list time  : ${vars.text.cyan}${config.time_end.time(config.time_start)}${vars.text.none}`);
    summary.push(`    ${vars.text.angry}*${vars.text.none} Total tests      : ${pad_right(18, config.total_tests.commas())}`);
    summary.push(`    ${vars.text.angry}*${vars.text.none} Total assertions : ${pad_right(18, config.total_assertions.commas())}`);
    summary.push(`    ${vars.text.angry}*${vars.text.none} Failed tests     : ${vars.text[color] + pad_right(18, config.fail_tests.commas()) + vars.text.none}`);
    summary.push(`    ${vars.text.angry}*${vars.text.none} Failed assertions: ${vars.text[color] + pad_right(18, config.fail_assertions.commas()) + vars.text.none}`);
    summary.push(`    ${vars.text.angry}*${vars.text.none} Percentage pass  : tests - ${vars.text[color] + (((config.total_tests - config.fail_tests) / config.total_tests) * 100).toFixed(2) + vars.text.none}%, assertions - ${vars.text[color] + (((config.total_assertions - config.fail_assertions) / config.total_assertions) * 100).toFixed(2) + vars.text.none}%`);
    log.shell(summary, true);
};

export default test_summary;