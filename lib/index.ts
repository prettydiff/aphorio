
import start_server from "./utilities/start_server.ts";
import start_universal from "./utilities/start_universal.ts";
import test_index from "./test/index.ts";

start_universal(function index_gitStat_ready():void {
    if (process.argv.includes("test") === true) {
        test_index();
    } else {
        start_server();
    }
});