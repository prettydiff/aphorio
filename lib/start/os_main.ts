
import broadcast from "../transmit/broadcast.ts";
import os_lists from "../utilities/os_lists.ts";
import vars from "../core/vars.ts";

const os_main = function start_osMain(start_prerequisites:() => void):core_start_task {
    return {
        label: "Gathers basic operating system and machine data.",
        task: function start_osMain_task():void {
            const osDelay = function start_osMain_task_osDelay():void {
                    os_lists("all", function start_osMain_task_osDelay_callback(payload:socket_data):void {
                        broadcast(vars.id.dashboard_server, "dashboard", payload);
                    });
                    osDaily();
                },
                osDaily = function start_osMain_task_osDaily():void {
                    setTimeout(osDelay, 86399975);
                },
                midnight:number = (function start_osMain_task_midnight():number {
                    const date:Date = new Date(),
                        hours:number = date.getHours(),
                        minutes:number = date.getMinutes(),
                        seconds:number = date.getSeconds(),
                        mill:number = date.getMilliseconds(),
                        night:number = ((23 - hours) * 3600 * 1000) + ((59 - minutes) * 60 * 1000) + ((59 - seconds) * 1000) + (1000 - mill);
                    vars.environment.timeZone_offset = date.getTimezoneOffset() * 60000;
                    return night - 25;
                }());
            os_lists("main", start_prerequisites);
            setTimeout(osDelay, midnight);
        }
    };
};

export default os_main;