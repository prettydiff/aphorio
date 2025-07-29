
import vars from "../utilities/vars.ts";

const keyword:string = (process.platform === "darwin")
        ? "open"
        : (process.platform === "win32")
            ? "start"
            : "xdg-open",
    browserCommand = function test_listLocalBrowser_browserCommand():string {
        const path:string = `http://localhost:${vars.servers.dashboard.config.ports.open}`;
        if (process.argv.length > 0 && (process.argv[0].indexOf("\\") > -1 || process.argv[0].indexOf("/") > -1)) {
            if (process.platform === "win32") {
                // yes, this is ugly.  Windows old cmd shell doesn't play well with file paths
                process.argv[0] = `${process.argv[0].replace(/\\/g, "\"\\\"").replace("\"\\", "\\") + "\""}`;
            } else {
                process.argv[0] = `"${process.argv[0]}"`;
            }
            if (process.argv.length > 1) {
                return `${keyword} ${process.argv[0]} ${path} "${process.argv.slice(1).join(" ")}"`;
            }
            return `${keyword} ${process.argv[0]} ${path}`;
        }
        return `${keyword} ${path}`;
    },
    test_listLocalBrowser:test_list = [];
export default test_listLocalBrowser;