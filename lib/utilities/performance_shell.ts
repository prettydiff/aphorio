
// powering application mode - performance
// a script to execute a variety of performance tests in test mode
import log from "../core/log.ts";
import os_list from "./os_lists.ts";
import performance from "./performance.ts";
import vars from "../core/vars.ts";

const performance_shell = function utilities_performanceShell():void {
    const servers:string[] = Object.keys(vars.data.server),
        len:number = servers.length;
    let index:number = 0;
    servers.sort(function utilities_performanceShell_serverSort(a:string, b:string):-1|1 {
        if (vars.data.server[a].config.name < vars.data.server[b].config.name) {
            return -1;
        }
        return 1;
    });
    do {
        vars.test.servers.push({
            id: servers[index],
            name: vars.data.server[servers[index]].config.name,
            port_open: vars.data.server[servers[index]].ports.open,
            port_secure: vars.data.server[servers[index]].ports.secure
        });
        index = index + 1;
    } while (index < len);
    vars.id.dashboard_server = vars.test.servers[0].id;
    os_list("main", function utilities_performanceShell_OS(data:socket_data):void {
        vars.os.main = data.data as services_os_main;
        const heading = function utilities_performanceShell_heading(message:string):string {
                return vars.text.underline + message + vars.text.none;
            },
            callback = function utilities_performanceShell_callback(output:services_test_performance_output) {
                console.log(output);
                console.log(output.roundtrip.average.commas());
            },
            payload:services_test_performance_input = {
                body: "test",
                call_stack: true,
                encryption: false,
                frame_body_size: 16382,
                location: "127.0.0.1",
                measure: "send",
                port: vars.test.servers[0].port_open,
                quantity_tests: 10,
                quantity_transmit: 10000,
                type: "http"
            },
            cpu:string =    `CPU    - ${vars.os.main.machine.cpu.name} at ${vars.os.main.machine.cpu.frequency}MHz`,
            memory:string = `Memory - ${vars.os.main.machine.memory.total.bytes()} at ${vars.os.main.machine.memory.speed}, ${vars.os.main.machine.memory.free.bytes()} free`;
        log.shell([
            "",
            heading("Machine Information"),
            cpu,
            memory
        ]);
        performance(payload, vars.test.servers[0].id, callback);
    });
};

export default performance_shell;