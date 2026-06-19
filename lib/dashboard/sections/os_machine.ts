

import dashboard from "../dashboard.ts";

const ui_os_machine = function ui_os_machine():void {
    const os_machine:section_os = {
        events: {
            update: function dashboard_sections_osMachine_update():void {
                dashboard.utility.performance_set("os-machine");
                dashboard.message.send({data: null, service: "services_os_main"});
            }
        },
        init: function dashboard_sections_osMachine_init():void {
            const time:string = dashboard.global.payload.os.time.dateTime(true, dashboard.global.payload.timeZone_offset);
            let keys:string[] = null,
                li:HTMLElement = null,
                strong:HTMLElement = null,
                span:HTMLElement = null,
                len:number = 0,
                index:number = 0;
            dashboard.sections["os-machine"].nodes_os.update_text.textContent = time;
            dashboard.sections["os-machine"].nodes_os.cpu.arch.textContent = dashboard.global.payload.os.main.machine.cpu.arch;
            dashboard.sections["os-machine"].nodes_os.cpu.cores.textContent = dashboard.global.payload.os.main.machine.cpu.cores.commas();
            dashboard.sections["os-machine"].nodes_os.cpu.endianness.textContent = dashboard.global.payload.os.main.machine.cpu.endianness;
            dashboard.sections["os-machine"].nodes_os.cpu.frequency.textContent = `${dashboard.global.payload.os.main.machine.cpu.frequency.commas()}mhz`;
            dashboard.sections["os-machine"].nodes_os.cpu.name.textContent = dashboard.global.payload.os.main.machine.cpu.name;
            dashboard.sections["os-machine"].nodes_os.memory.free.textContent = `${dashboard.global.payload.os.main.machine.memory.free.bytesLong()}, ${((dashboard.global.payload.os.main.machine.memory.free / dashboard.global.payload.os.main.machine.memory.total) * 100).toFixed(2)}%`;
            dashboard.sections["os-machine"].nodes_os.memory.used.textContent = `${(dashboard.global.payload.os.main.machine.memory.total - dashboard.global.payload.os.main.machine.memory.free).bytesLong()}, ${(((dashboard.global.payload.os.main.machine.memory.total - dashboard.global.payload.os.main.machine.memory.free) / dashboard.global.payload.os.main.machine.memory.total) * 100).toFixed(2)}%`;
            dashboard.sections["os-machine"].nodes_os.memory.total.textContent = `${dashboard.global.payload.os.main.machine.memory.total.bytesLong()}, 100%`;
            dashboard.sections["os-machine"].nodes_os.os.hostname.textContent = dashboard.global.payload.os.main.os.hostname;
            dashboard.sections["os-machine"].nodes_os.os.name.textContent = dashboard.global.payload.os.main.os.name;
            dashboard.sections["os-machine"].nodes_os.os.platform.textContent = dashboard.global.payload.os.main.os.platform;
            dashboard.sections["os-machine"].nodes_os.os.release.textContent = dashboard.global.payload.os.main.os.release;
            dashboard.sections["os-machine"].nodes_os.os.type.textContent = dashboard.global.payload.os.main.os.type;
            dashboard.sections["os-machine"].nodes_os.os.uptime.textContent = dashboard.global.payload.os.main.os.uptime.time_elapsed();
            dashboard.sections["os-machine"].nodes_os.process.admin.textContent = dashboard.global.payload.os.main.process.admin.toString();
            dashboard.sections["os-machine"].nodes_os.process.arch.textContent = dashboard.global.payload.os.main.process.arch;
            dashboard.sections["os-machine"].nodes_os.process.argv.textContent = JSON.stringify(dashboard.global.payload.os.main.process.argv);
            dashboard.sections["os-machine"].nodes_os.process.cpuSystem.textContent = dashboard.global.payload.os.main.process.cpuSystem.time_elapsed();
            dashboard.sections["os-machine"].nodes_os.process.cpuUser.textContent = dashboard.global.payload.os.main.process.cpuUser.time_elapsed();
            dashboard.sections["os-machine"].nodes_os.process.cwd.textContent = dashboard.global.payload.os.main.process.cwd;
            dashboard.sections["os-machine"].nodes_os.process.platform.textContent = dashboard.global.payload.os.main.process.platform;
            dashboard.sections["os-machine"].nodes_os.process.pid.textContent = String(dashboard.global.payload.os.main.process.pid);
            dashboard.sections["os-machine"].nodes_os.process.ppid.textContent = String(dashboard.global.payload.os.main.process.ppid);
            dashboard.sections["os-machine"].nodes_os.process.uptime.textContent = dashboard.global.payload.os.main.process.uptime.time_elapsed();
            dashboard.sections["os-machine"].nodes_os.process.memoryProcess.textContent = `${dashboard.global.payload.os.main.process.memory.rss.bytesLong()}, ${((dashboard.global.payload.os.main.process.memory.rss / dashboard.global.payload.os.main.machine.memory.total) * 100).toFixed(2)}%`;
            dashboard.sections["os-machine"].nodes_os.process.memoryV8.textContent = dashboard.global.payload.os.main.process.memory.V8.bytesLong();
            dashboard.sections["os-machine"].nodes_os.process.memoryExternal.textContent = dashboard.global.payload.os.main.process.memory.external.bytesLong();
            if (dashboard.global.payload.os.main.process.platform === "win32") {
                dashboard.sections["os-machine"].nodes_os.user.gid.parentNode.style.display = "none";
                dashboard.sections["os-machine"].nodes_os.user.uid.parentNode.style.display = "none";
            } else {
                dashboard.sections["os-machine"].nodes_os.user.gid.textContent = String(dashboard.global.payload.os.main.user_account.gid);
                dashboard.sections["os-machine"].nodes_os.user.uid.textContent = String(dashboard.global.payload.os.main.user_account.uid);
            }
            dashboard.sections["os-machine"].nodes_os.user.homedir.textContent = dashboard.global.payload.os.main.user_account.homedir;
            dashboard.sections["os-machine"].nodes_os.update_button.onclick = dashboard.sections["os-machine"].events.update;
            dashboard.sections["os-machine"].nodes_os.update_button.setAttribute("data-list", "main");

            // System Path
            len = dashboard.global.payload.os.main.os.path.length;
            if (len > 0) {
                index = 0;
                do {
                    li = document.createElement("li");
                    li.textContent = dashboard.global.payload.os.main.os.path[index];
                    dashboard.sections["os-machine"].nodes_os.path.appendChild(li);
                    index = index + 1;
                } while (index < len);
            }
            delete dashboard.global.payload.os.main.os.env.Path;
            delete dashboard.global.payload.os.main.os.env.PATH;

            // Environmental Variables
            keys = Object.keys(dashboard.global.payload.os.main.os.env);
            len = keys.length;
            if (len > 0) {
                do {
                    li = document.createElement("li");
                    strong = document.createElement("strong");
                    strong.textContent = keys[index];
                    span = document.createElement("span");
                    span.textContent = dashboard.global.payload.os.main.os.env[keys[index]];
                    li.appendChild(strong);
                    li.appendChild(span);
                    dashboard.sections["os-machine"].nodes_os.env.appendChild(li);
                    index = index + 1;
                } while (index < len);
            }

            // Node Dependency Versions
            keys = Object.keys(dashboard.global.payload.os.main.process.versions);
            len = keys.length;
            if (len > 0) {
                index = 0;
                do {
                    li = document.createElement("li");
                    strong = document.createElement("strong");
                    strong.textContent = keys[index];
                    span = document.createElement("span");
                    span.textContent = dashboard.global.payload.os.main.process.versions[keys[index]];
                    li.appendChild(strong);
                    li.appendChild(span);
                    dashboard.sections["os-machine"].nodes_os.versions.appendChild(li);
                    index = index + 1;
                } while (index < len);
            }
        },
        nodes: null,
        nodes_os: (function dashboard_sections_osMachine_nodes():module_os_nodes {
            const sectionList:HTMLCollectionOf<HTMLElement> = document.getElementById("os-machine").getElementsByClassName("section")[0].getElementsByClassName("section") as HTMLCollectionOf<HTMLElement>,
                sections:store_elements = {
                    cpu: sectionList[0].getElementsByTagName("ul")[0],
                    env: sectionList[1].getElementsByTagName("ul")[1],
                    memory: sectionList[0].getElementsByTagName("ul")[1],
                    os: sectionList[1].getElementsByTagName("ul")[0],
                    path: sectionList[1].getElementsByTagName("ul")[2],
                    process: sectionList[2].getElementsByTagName("ul")[0],
                    user: sectionList[3].getElementsByTagName("ul")[0],
                    versions: sectionList[2].getElementsByTagName("ul")[1]
                },
                item = function dashboard_sections_osMachine_nodes_item(section:"cpu"|"memory"|"os"|"process"|"user", index:number):HTMLElement {
                    return sections[section].getElementsByTagName("li")[index].getElementsByTagName("span")[0];
                },
                nodeList:module_os_nodes = {
                    cpu: {
                        arch: item("cpu", 0),
                        cores: item("cpu", 1),
                        endianness: item("cpu", 2),
                        frequency: item("cpu", 3),
                        name: item("cpu", 4)
                    },
                    env: sections.env,
                    memory: {
                        free: item("memory", 0),
                        total: item("memory", 2),
                        used: item("memory", 1)
                    },
                    os: {
                        hostname: item("os", 0),
                        name: item("os", 1),
                        platform: item("os", 2),
                        release: item("os", 3),
                        type: item("os", 4),
                        uptime: item("os", 5)
                    },
                    path: sections.path,
                    process: {
                        admin: item("process", 0),
                        arch: item("process", 1),
                        argv: item("process", 2),
                        cpuSystem: item("process", 3),
                        cpuUser: item("process", 4),
                        cwd: item("process", 5),
                        memoryProcess: item("process", 6),
                        memoryV8: item("process", 7),
                        memoryExternal: item("process", 8),
                        platform: item("process", 9),
                        pid: item("process", 10),
                        ppid: item("process", 11),
                        uptime: item("process", 12)
                    },
                    update_button: document.getElementById("os-machine").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
                    update_duration: document.getElementById("os-machine").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[1],
                    update_text: document.getElementById("os-machine").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[0],
                    user: {
                        gid: item("user", 0),
                        uid: item("user", 1),
                        homedir: item("user", 2)
                    },
                    versions: sections.versions
                };
            return nodeList;
        }()),
        receive: function dashboard_sections_osMachine_receive(socket_data:socket_data):void {
            const data:services_os_main = socket_data.data as services_os_main;
            dashboard.sections["os-machine"].nodes_os.update_text.textContent = data.time.dateTime(true, dashboard.global.payload.timeZone_offset);
            dashboard.global.payload.os.main = data;
            dashboard.sections["os-machine"].nodes_os.memory.free.textContent = `${dashboard.global.payload.os.main.machine.memory.free.bytesLong()}, ${((dashboard.global.payload.os.main.machine.memory.free / dashboard.global.payload.os.main.machine.memory.total) * 100).toFixed(2)}%`;
            dashboard.sections["os-machine"].nodes_os.memory.used.textContent = `${(dashboard.global.payload.os.main.machine.memory.total - dashboard.global.payload.os.main.machine.memory.free).bytesLong()}, ${(((dashboard.global.payload.os.main.machine.memory.total - dashboard.global.payload.os.main.machine.memory.free) / dashboard.global.payload.os.main.machine.memory.total) * 100).toFixed(2)}%`;
            dashboard.sections["os-machine"].nodes_os.memory.total.textContent = `${dashboard.global.payload.os.main.machine.memory.total.bytesLong()}, 100%`;
            dashboard.sections["os-machine"].nodes_os.os.uptime.textContent = dashboard.global.payload.os.main.os.uptime.time_elapsed();
            dashboard.sections["os-machine"].nodes_os.process.admin.textContent = dashboard.global.payload.os.main.process.admin.toString();
            dashboard.sections["os-machine"].nodes_os.process.cpuSystem.textContent = dashboard.global.payload.os.main.process.cpuSystem.time_elapsed();
            dashboard.sections["os-machine"].nodes_os.process.cpuUser.textContent = dashboard.global.payload.os.main.process.cpuUser.time_elapsed();
            dashboard.sections["os-machine"].nodes_os.process.uptime.textContent = dashboard.global.payload.os.main.process.uptime.time_elapsed();
            dashboard.sections["os-machine"].nodes_os.process.memoryProcess.textContent = `${dashboard.global.payload.os.main.process.memory.rss.bytesLong()}, ${((dashboard.global.payload.os.main.process.memory.rss / dashboard.global.payload.os.main.machine.memory.total) * 100).toFixed(2)}%`;
            dashboard.sections["os-machine"].nodes_os.process.memoryV8.textContent = dashboard.global.payload.os.main.process.memory.V8.bytesLong();
            dashboard.sections["os-machine"].nodes_os.process.memoryExternal.textContent = dashboard.global.payload.os.main.process.memory.external.bytesLong();
            dashboard.sections["os-machine"].nodes_os.update_duration.textContent = dashboard.utility.performance_get("os-machine");
        },
        time: 0,
        tools: null
    };
    dashboard.sections["os-machine"] = os_machine;
};

export default ui_os_machine;