
import execute from "../dashboard/execute.ts";
import global from "../dashboard/global.ts";
import message from "../dashboard/message.ts";
import shared_services from "../dashboard/shared_services.ts";
import tables from "../dashboard/tables.ts";
import utility from "../dashboard/utility.ts";

import ui_application_logs from "../dashboard/sections/application_logs.ts";
import ui_compose_containers from "../dashboard/sections/compose_containers.ts";
import ui_devices from "../dashboard/sections/devices.ts";
import ui_disks from "../dashboard/sections/disks.ts";
import ui_dns_query from "../dashboard/sections/dns_query.ts";
import ui_file_system from "../dashboard/sections/file_system.ts";
import ui_hash from "../dashboard/sections/hash.ts";
import ui_interfaces from "../dashboard/sections/interfaces.ts";
import ui_message_inspection from "../dashboard/sections/message_inspection.ts";
import ui_notes from "../dashboard/sections/notes.ts";
import ui_os_machine from "../dashboard/sections/os_machine.ts";
import ui_ports_application from "../dashboard/sections/ports_application.ts";
import ui_processes from "../dashboard/sections/processes.ts";
import ui_servers_web from "../dashboard/sections/servers_web.ts";
import ui_services_app from "../dashboard/sections/services_app.ts";
import ui_services_os from "../dashboard/sections/services_os.ts";
import ui_sockets_application_tcp from "../dashboard/sections/sockets_application_tcp.ts";
import ui_sockets_application_udp from "../dashboard/sections/sockets_application_udp.ts";
import ui_sockets_os_tcp from "../dashboard/sections/sockets_os_tcp.ts";
import ui_sockets_os_udp from "../dashboard/sections/sockets_os_udp.ts";
import ui_statistics_resources from "../dashboard/sections/statistics_resources.ts";
import ui_terminal from "../dashboard/sections/terminal.ts";
import ui_test_http from "../dashboard/sections/test_http.ts";
import ui_test_websocket from "../dashboard/sections/test_websocket.ts";
import ui_udp_socket from "../dashboard/sections/udp_socket.ts";
import ui_users from "../dashboard/sections/users.ts";

import vars from "../core/vars.ts";

const assembler = function utilities_assembler():void {
    const unwrap = function utilities_assembler_unwrap(fun:Function):string {
            let str:string = fun.toString().replace(/\n    /g, "\n");
            str = str.slice(str.indexOf("{") + 1);
            str = str.slice(str.indexOf("{"));
            str = str.slice(0, str.lastIndexOf("}"));
            str = str.replace(/;\s*dashboard\.\w+\s*(\["\w+(-\w+)+"\]\s*)?=\s*\w+\s*;\s*$/, "");
            return `${str}`;
        },
        object = function utilities_assembler_object(store:store_function, features:boolean):string[] {
            const keys:string[] = Object.keys(store),
                output:string[] = ["{"],
                len:number = keys.length;
            let index:number = 0,
                comma:string = "";
            do {
                if (features === false || (features === true && vars.environment.features[keys[index] as type_dashboard_features] === true)) {
                    output.push(`"${keys[index]}": ${unwrap(store[keys[index]]) + comma}`);
                    comma = ",";
                }
                index = index + 1;
            } while (index < len);
            return output;
        },
        dashboard_map:store_function = {
            execute: execute,
            global: global,
            message: message,
            shared_services: shared_services,
            tables: tables,
            utility: utility
        },
        section_map:store_function = {
            "application-logs": ui_application_logs,
            "compose-containers": ui_compose_containers,
            "devices": ui_devices,
            "disks": ui_disks,
            "dns-query": ui_dns_query,
            "file-system": ui_file_system,
            "hash": ui_hash,
            "interfaces": ui_interfaces,
            "message-inspection": ui_message_inspection,
            "notes": ui_notes,
            "os-machine": ui_os_machine,
            "ports=application": ui_ports_application,
            "processes": ui_processes,
            "servers-web": ui_servers_web,
            "services-app": ui_services_app,
            "services-os": ui_services_os,
            "sockets-application-tcp": ui_sockets_application_tcp,
            "sockets-application-udp": ui_sockets_application_udp,
            "sockets-os-tcp": ui_sockets_os_tcp,
            "sockets-os-udp": ui_sockets_os_udp,
            "statistics-resources": ui_statistics_resources,
            "terminal": ui_terminal,
            "test-http": ui_test_http,
            "test-websocket": ui_test_websocket,
            "udp=socket": ui_udp_socket,
            "users": ui_users
        },
        section_str:string[] = object(section_map, true);
    let dashboard:string[] = object(dashboard_map, false);
    section_str.push("}");
    dashboard.push(`,sections: ${section_str.join("\n")}`);
    dashboard.push("}");
    console.log(dashboard.join("\n")
        .replace("path: \"\",", `path: "${vars.path.project.replace(/\\/g, "\\\\")
        .replace(/"/g, "\\\"")}",`)
        .replace(/\(\s*\)/, "(core)"));
};

export default assembler;