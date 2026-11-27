
// powering application mode - performance
// a script to execute a variety of performance tests in test mode
import log from "../core/log.ts";
import vars from "../core/vars.ts";

const performance = function utilities_performance():void {
    const heading = function start_readyServices_startupLogger_heading(message:string):string {
        return vars.text.underline + message + vars.text.none;
    };
    log.shell([
        "",
        heading("Performance Tests")
    ]);
};

export default performance;