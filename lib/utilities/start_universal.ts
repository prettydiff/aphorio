
import commas from "./commas.ts";
import dateTime from "./dateTime.ts";
import file from "./file.ts";
import node from "./node.ts";
import time from "./time.ts";
import vars from "./vars.ts";

const start_universal = function utilities_startUniversal(callback:() => void):void {
    const capitalize = function index_capitalize():string {
            // eslint-disable-next-line no-restricted-syntax
            return this.charAt(0).toUpperCase() + this.slice(1);
        },
        gitStat = function index_gitStat(error:node_error, stat:node_fs_Stats):void {
            if (error === null && stat !== null) {
                const stdout:Buffer[] = [],
                    spawn:node_childProcess_ChildProcess = node.child_process.spawn("git show -s --format=%H,%ct HEAD", {
                        shell: true,
                        windowsHide: true
                    });
                spawn.stdout.on("data", function index_gitStat_stdout(buf:Buffer):void {
                    stdout.push(buf);
                });
                spawn.on("close", function index_gitStat_close():void {
                    const str:string[] = stdout.join("").toString().split(",");
                    vars.environment.date_commit = Number(str[1]) * 1000;
                    vars.environment.hash = str[0];
                    spawn.kill();
                    callback();
                });
            } else {
                callback();
            }
        };
    BigInt.prototype.time = time;
    Number.prototype.commas = commas;
    Number.prototype.dateTime = dateTime;
    Number.prototype.time = time;
    String.prototype.capitalize = capitalize;

    // build shell list
    if (process.platform === "win32") {
        const stats = function utilities_os_shellWin(index:number):void {
            node.fs.stat(vars.terminal[index], function utilities_os_shellWin_callback(err:node_error) {
                if (err !== null) {
                    vars.terminal.splice(index, 1);
                }
                if (index > 0) {
                    utilities_os_shellWin(index - 1);
                } else {
                    node.fs.stat(`${vars.path.project}.git`, gitStat);
                }
            });
        };
        stats(vars.terminal.length - 1);
    } else {
        file.stat({
            callback: function utilities_os_shellStat(stat:node_fs_BigIntStats):void {
                if (stat === null) {
                    vars.terminal.push("/bin/sh");
                } else {
                    file.read({
                        callback: function utilities_os_shellStat_shellRead(contents:Buffer):void {
                            const lines:string[] = contents.toString().split("\n"),
                                len:number = lines.length;
                            let index:number = 1;
                            if (len > 1) {
                                do {
                                    if (lines[index].indexOf("/bin/") === 0) {
                                        vars.terminal.push(lines[index]);
                                    }
                                    index = index + 1;
                                } while (index < len);
                            }
                            if (vars.terminal.length < 1) {
                                vars.terminal.push("/bin/sh");
                            }
                            node.fs.stat(`${vars.path.project}.git`, gitStat);
                        },
                        error_terminate: null,
                        location: "/etc/shells",
                        no_file: null
                    });
                }
            },
            error_terminate: null,
            location: "/etc/shells",
            no_file: null
        });
    }
};

export default start_universal;