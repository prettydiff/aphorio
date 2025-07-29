
import log from "../utilities/log.ts";
import test_listLocalBrowser from "./list_local_browser.ts";
import test_listLocalCommands from "./list_local_commands.ts";
import test_runner from "./runner.ts";
import test_summary from "./summary.ts";

const test_index = function test_index():void {
    let total_assertions:number = 0,
        total_fail_assertions:number = 0,
        total_fail_tests:number = 0,
        total_lists:number = 0,
        total_tests:number = 0;
    const start:bigint = process.hrtime.bigint(),
        list:test_list[] = [
            test_listLocalBrowser
            // test_listLocalCommands
        ],
        len_list:number = list.length,
        complete = function test_index_complete(config:test_config_summary):void {
            total_lists = total_lists + 1;
            total_assertions = total_assertions + config.list_assertions;
            total_fail_assertions = total_fail_assertions + config.list_fail_assertions;
            total_fail_tests = total_fail_tests + config.list_fail_tests;
            total_tests = total_tests + config.list_tests;
            if (total_lists < len_list) {
                runner();
            } else {
                config.final = true;
                config.time_total_end = process.hrtime.bigint();
                config.time_total_start = start;
                config.total_assertions = total_assertions;
                config.total_fail_assertions = total_fail_assertions;
                config.total_fail_tests = total_fail_tests;
                config.total_lists = total_lists;
                config.total_tests = total_tests;
            }
            test_summary(config);
        },
        runner = function test_index_runner():void {
            test_runner(process.hrtime.bigint(), list[total_lists], function test_index_commands(config:test_config_summary):void {
                complete(config);
            });
        };
    log.shell(["", `Starting test automation for ${len_list} lists.`, ""]);
    runner();
};

export default test_index;