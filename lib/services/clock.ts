
import broadcast from "../transmit/broadcast.ts";
import vars from "../core/vars.ts";

const clock = function services_clock():void {
    const now:number = Date.now(),
        payload:services_status_clock = {
            time_local: now,
            time_zulu: (now + (new Date().getTimezoneOffset() * 60000))
        };
    broadcast(vars.dashboard_id, "dashboard", {
        data: payload,
        service: "dashboard-status-clock"
    });
    setTimeout(services_clock, 950);
};

export default clock;