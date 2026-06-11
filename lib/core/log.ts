
import broadcast from "../transmit/broadcast.ts";
import vars from "./vars.ts";

const log:core_module_log = {
    application: function core_log_application(config:config_log):void {
        if (vars.environment.features["application-logs"] === true) {
            const payload:services_log = {
                log: config,
                total: vars.environment.logs.total
            };
            if (typeof config.error === "boolean" || config.error === undefined) {
                config.error = null;
            }
            vars.data.logs.push(config);
            vars.environment.logs.total = vars.environment.logs.total + 1;
            broadcast(vars.environment.dashboard_id, "dashboard", {
                data: payload,
                service: "services_log"
            });
        }
    },
    receive: function core_log_receive(socket_data:socket_data):void {
        const data:services_log = socket_data.data as services_log;
        log.application(data.log);
    },
    shell: function core_log_shell(input:string[], summary?:boolean):void {
        const logger = function core_log_shell_logger(item:string):void {
            // eslint-disable-next-line no-console
            console.log(item);
        };
        input.forEach(function core_log_shell_each(value:string):void {
            logger(value);
        });
        if (summary === true && vars.environment.hash !== "") {
            const difference:string = (function core_log_shell_difference():string {
                    const duration:number = Date.now() - vars.environment.date_commit,
                        day:number = (1000 * 60 * 60 * 24),
                        month:number = (day * 30),
                        months:number = Math.floor(duration / month),
                        year:number = (day * 365),
                        years:number = Math.floor(duration / year),
                        days:number = Math.floor(duration / day),
                        plural = function core_log_shell_difference_plural(input:number):""|"s" {
                            if (input === 1) {
                                return "";
                            }
                            return "s";
                        };
                    if (days < 1) {
                        return "within last day";
                    }
                    if (months < 1) {
                        return `${days} day${plural(days)} ago`;
                    }
                    if (years < 1) {
                        return `${months} month${plural(months)} ago`;
                    }
                    return `${years} year${plural(years)} ago`;
                }()),
                updated:string = `${vars.environment.date_commit.dateTime(true, null)} (${difference})`,
                dateString:string = `updated ${vars.text.blue + updated + vars.text.none}`,
                hash:string = `git log ${vars.text.red + vars.environment.hash + vars.text.none}`,
                version:string = `version ${vars.environment.version}`,
                max:number = Math.max(updated.length, vars.environment.hash.length, vars.environment.repository.length, vars.environment.version.length, vars.environment.license.length),
                border = function utilities_logShell_border(character:string):string {
                    let index:number = max + 8;
                    const output:string[] = [];
                    do {
                        index = index - 1;
                        output.push(character);
                    } while (index > 0);
                    return output.join("");
                };
            logger(border("_"));
            logger(`sources ${vars.text.red + vars.environment.repository + vars.text.none}`);
            logger(`license ${vars.environment.license}`);
            logger(dateString);
            logger(version);
            logger(hash);
            logger(border("\u203e"));
        }
    }
};

export default log;