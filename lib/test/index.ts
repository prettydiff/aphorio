
import log from "../utilities/log.ts";
import test_listLocalCommands from "./list_local_commands.ts";
import test_runner from "./runner.ts";
import test_summary from "./summary.ts";

const test_index = function test_index():void {
    const start:bigint = process.hrtime.bigint();
    log.shell(["Starting test automation", ""]);
    test_runner(start, test_listLocalCommands, function test_index_commands(config:test_config_summary):void {
        test_summary(config);
    });
};

export default test_index;