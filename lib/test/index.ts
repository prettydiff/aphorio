
import log from "../utilities/log.ts";
import test_listLocalBrowserApplicationLogs from "./list_local_browser_applicationLogs.ts";
import test_listLocalBrowserCompose from "./list_local_browser_compose.ts";
import test_listLocalBrowserDNS from "./list_local_browser_dns.ts";
import test_listLocalBrowserFAQ from "./list_local_browser_faq.ts";
import test_listLocalBrowserFileSystem from "./list_local_browser_fileSystem.ts";
import test_listLocalBrowserHash from "./list_local_browser_hash.ts";
import test_listLocalBrowserHelp from "./list_local_browser_help.ts";
import test_listLocalBrowserHTTP from "./list_local_browser_http.ts";
import test_listLocalBrowserInterfaces from "./list_local_browser_interfaces.ts";
import test_listLocalBrowserOS from "./list_local_browser_os.ts";
import test_listLocalBrowserProcesses from "./list_local_browser_processes.ts";
import test_listLocalBrowserServices from "./list_local_browser_services.ts";
import test_listLocalBrowserSockets from "./list_local_browser_sockets.ts";
import test_listLocalBrowserStart from "./list_local_browser_start.ts";
import test_listLocalBrowserStorage from "./list_local_browser_storage.ts";
import test_listLocalBrowserTerminal from "./list_local_browser_terminal.ts";
import test_listLocalBrowserUsers from "./list_local_browser_users.ts";
import test_listLocalBrowserWebSocket from "./list_local_browser_WebSocket.ts";
import test_listLocalCommands from "./list_local_commands.ts";
import test_runner from "./runner.ts";
import test_summary from "./summary.ts";
import vars from "../utilities/vars.ts";

const test_index = function test_index():void {
    let total_lists:number = 0;
    const list:test_list[] = [
            test_listLocalCommands(),
            test_listLocalBrowserStart,
            test_listLocalBrowserCompose,
            test_listLocalBrowserSockets,
            test_listLocalBrowserInterfaces,
            test_listLocalBrowserOS,
            test_listLocalBrowserProcesses,
            test_listLocalBrowserServices,
            test_listLocalBrowserStorage,
            test_listLocalBrowserUsers,
            test_listLocalBrowserTerminal,
            test_listLocalBrowserFileSystem,
            test_listLocalBrowserHTTP,
            test_listLocalBrowserWebSocket,
            test_listLocalBrowserDNS,
            test_listLocalBrowserHash,
            test_listLocalBrowserApplicationLogs,
            test_listLocalBrowserHelp,
            test_listLocalBrowserFAQ
        ],
        len_list:number = list.length,
        callback = function test_index_callback(name:string):void {
            total_lists = total_lists + 1;
            if (total_lists < len_list) {
                test_summary(name, false);
                test_runner.list(list[total_lists], test_index_callback);
            } else {
                vars.test.total_time_end = process.hrtime.bigint();
                test_summary(name, true);
            }
        };
    log.shell(["", `Starting test automation for ${len_list} lists.`, ""]);
    vars.test.total_time_start = process.hrtime.bigint();
    test_runner.list(list[total_lists], callback);
};

export default test_index;