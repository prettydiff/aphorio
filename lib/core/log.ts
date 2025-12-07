
import broadcast from "../transmit/broadcast.ts";
import vars from "./vars.ts";

const log:log = {
    application: function utilities_logApplication(config:config_log):void {
        vars.environment.logs.push(config);
        broadcast(vars.environment.dashboard_id, "dashboard", {
            data: config,
            service: "dashboard-log"
        });
    },
    shell: function utilities_logShell(input:string[], summary?:boolean):void {
        const logger = function utilities_logShell_logger(item:string):void {
            // eslint-disable-next-line no-console
            console.log(item);
        };
        input.forEach(function utilities_logShell_each(value:string):void {
            logger(value);
        });
        if (summary === true && vars.environment.hash !== "") {
            const difference:string = (function terminal_utilities_log_difference():string {
                    const duration:number = Date.now() - vars.environment.date_commit,
                        day:number = (1000 * 60 * 60 * 24),
                        month:number = (day * 30),
                        months:number = Math.floor(duration / month),
                        year:number = (day * 365),
                        years:number = Math.floor(duration / year),
                        days:number = Math.floor(duration / day),
                        plural = function terminal_utilities_log_difference_plural(input:number):""|"s" {
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
                dateString:string = `Updated ${vars.environment.date_commit.dateTime(true, null)} (${difference})`,
                hash:string = `git log ${vars.text.cyan + vars.text.bold + vars.environment.hash + vars.text.none}`,
                max:number = Math.max(dateString.length, vars.environment.hash.length),
                border = function utilities_logShell_border(character:string):string {
                    let index:number = max;
                    const output:string[] = [];
                    do {
                        index = index - 1;
                        output.push(character);
                    } while (index > 0);
                    return output.join("");
                };
            logger("");
            logger(border("_"));
            logger(hash);
            logger(dateString);
            logger(border("\u203e"));
        }
    }
};

export default log;