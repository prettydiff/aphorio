
import log from "../utilities/log.ts";
import test_listLocalBrowser from "./list_local_browser.ts";
import test_listLocalCommands from "./list_local_commands.ts";
import test_runner from "./runner.ts";
import test_summary from "./summary.ts";
import vars from "../utilities/vars.ts";

const test_index = function test_index():void {
    let total_lists:number = 0;
    const list:test_list[] = [
            // test_listLocalBrowser
            test_listLocalCommands()
        ],
        len_list:number = list.length,
        callback = function test_index_callback(name:string):void {
            total_lists = total_lists + 1;
            if (total_lists < len_list) {
                test_runner(list[total_lists], test_index_callback);
                test_summary(name, false);
            } else {
                vars.test.total_time_end = process.hrtime.bigint();
                test_summary(name, true);
            }
        };
    log.shell(["", `Starting test automation for ${len_list} lists.`, ""]);
    vars.test.total_time_start = process.hrtime.bigint();
    test_runner(list[total_lists], callback);
};

export default test_index;