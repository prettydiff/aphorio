
import file from "../utilities/file.ts";
import vars from "../core/vars.ts";

// cspell: words tskey

const compose_variables = function start_composeVariables(complete_tasks:(task:type_start_primary_tasks) => void, process_path:string):core_start_task {
    return {
        label: "Gathering stored docker compose variables.",
        task: function start_composeVariables():void {
            if (vars.options.mode === "demo") {
                vars.data.compose_variables = {
                    APP_DISK: "/path_to_apps",
                    DATA_DISK: "/path_to_disk",
                    PASSWORD: "1234",
                    TAILSCALE_KEY: "tskey-auth-asdf-1234",
                    TAILSCALE_OAUTH_CLIENT: "asdf_1234",
                    TAILSCALE_OAUTH_SECRET: "tskey-client-asdf-1234",
                    TZ: "America/Chicago"
                };
                complete_tasks("compose_variables");
            } else {
                file.read({
                    callback: function start_composeVariables_read(raw:Buffer):void {
                        if (raw !== null) {
                            const lines:string[] = raw.toString().split("\n"),
                                store:[string, string][] = [],
                                len:number = lines.length;
                            let index:number = len,
                                store_len:number = 0;
                            do {
                                index = index - 1;
                                if ((/^\s*$/).test(lines[index]) === false) {
                                    lines[index] = lines[index].replace(/\s*=\s*/, "=");
                                    store.push([lines[index].slice(0, lines[index].indexOf("=")), lines[index].slice(lines[index].indexOf("=") + 1)]);
                                }
                            } while (index > 0);
                            store.sort(function start_composeVariables_read_sort(a:[string, string], b:[string, string]):-1|1 {
                                if (a[0] < b[0]) {
                                    return -1;
                                }
                                return 1;
                            });
                            index = 0;
                            store_len = store.length;
                            if (store_len > 0) {
                                do {
                                    vars.data.compose_variables[store[index][0]] = store[index][1];
                                    index = index + 1;
                                } while (index < store_len);
                            }
                        }
                        complete_tasks("compose_variables");
                    },
                    location: `${process_path}compose${vars.path.sep}.env`,
                    no_file: null,
                    section: "startup"
                });
            }
        }
    };
};

export default compose_variables;