
import log from "../utilities/log.ts";
import test_listLocalCommands from "./list_local_commands.ts";
import test_runner from "./runner.ts";

const test_index = function test_index():void {
    const start:bigint = process.hrtime.bigint();
    log.shell(["Starting test automation", ""]);
    test_runner(start, test_listLocalCommands);
};

export default test_index;