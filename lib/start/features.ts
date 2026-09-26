
import file from "../utilities/file.ts";
import vars from "../core/vars.ts";

const features = function start_features(start_prerequisites:() => void, process_path:string):core_start_task {
    return {
        label: "Reading the features.json file and remove parts of the application.",
        task: function start_features_task():void {
            const flags:store_string = {
                    feature: null,
                    html: null
                },
                ready = function start_features_task_ready():void {
                    if (typeof flags.feature === "string" && typeof flags.html === "string") {
                        const feature_list:store_flag = JSON.parse(flags.feature),
                            section = function start_features_task_ready_section(section_name:type_dashboard_features, label:string):void {
                                if (feature_list[section_name] !== true) {
                                    const end_html:number = flags.html.indexOf(`<!-- ${section_name} end -->`),
                                        start_html:number = flags.html.indexOf(`<!-- ${section_name} start -->`);
                                    if (start_html > 0 && end_html > 0) {
                                        flags.html = flags.html.slice(0, start_html) + flags.html.slice(end_html + section_name.length + 13);
                                    }
                                    flags.html = (section_name === "servers-web")
                                        ? flags.html.replace(`<li><button class="nav-focus" data-section="servers-web">${label}</button></li>`, "")
                                        : flags.html.replace(`<li><button data-section="${section_name}">${label}</button></li>`, "");
                                    vars.environment.features[section_name] = false;
                                } else {
                                    vars.environment.features[section_name] = true;
                                }
                            },
                            parent = function start_features_task_ready_parent():void {
                                const nav_end:number = flags.html.indexOf("</nav>"),
                                    empty:number = flags.html.slice(nav_start, nav_end).indexOf("<ul></ul>");
                                let start:number = empty + nav_start,
                                    end:number = empty + nav_start;
                                if (empty > 0) {
                                    do {
                                        end = end + 1;
                                    } while (flags.html.slice(end - 4, end) !== "div>");
                                    do {
                                        start = start - 1;
                                    } while (flags.html.slice(start, start + 4) !== "<div");
                                    flags.html = flags.html.slice(0, start) + flags.html.slice(end);
                                    start_features_task_ready_parent();
                                } else {
                                    if (vars.environment.features["servers-web"] === false) {
                                        flags.html = flags.html.replace("<button", "<button class=\"nav-focus\"");
                                    }
                                    start_prerequisites();
                                }
                                flags.html = flags.html.replace(/<div( class="first")?>\s*<h3>\w+(\s\w+)*<\/h3>\s*<ul>\s*<\/ul>\s*<\/div>/g, "");
                                flags.html = flags.html.replace(/<h2>Navigation<\/h2>\s*<div>/, "<h2>Navigation</h2> <div class=\"first\">");
                            },
                            nav_start:number = flags.html.indexOf("<nav>");
                        section("application-logs", "Application Logs");
                        section("compose-containers", "Docker Compose");
                        section("devices", "Devices");
                        section("disks", "Disks");
                        section("dns-query", "DNS Query");
                        section("file-system", "File System");
                        section("hash", "Hash / Base64");
                        section("interfaces", "Interfaces");
                        section("message-inspection", "Message Inspection");
                        section("notes", "Notes");
                        section("os-machine", "OS/Machine");
                        section("ports-application", "App Ports");
                        section("processes", "Processes");
                        section("servers-web", "Web Servers");
                        section("services-os", "Services");
                        section("sockets-application-tcp", "App TCP Sockets");
                        section("sockets-application-udp", "App UDP Sockets");
                        section("sockets-os-tcp", "OS TCP Sockets");
                        section("sockets-os-udp", "OS UDP Sockets");
                        section("statistics-resources", "Resource Statistics");
                        section("terminal", "Terminal");
                        section("test-http", "HTTP Test");
                        section("test-performance", "Performance Test");
                        section("test-websocket", "WebSocket Test");
                        section("udp-socket", "UDP Socket");
                        section("users", "Users");
                        parent();
                        vars.environment.dashboard_page = flags.html;
                    }
                },
                callback_html = function start_features_task_callbackHTML(html_file:Buffer):void {
                    flags.html = html_file.toString();
                    ready();
                },
                callback_feature = function start_features_task_callbackFeature(feature_file:Buffer):void {
                    flags.feature = feature_file.toString();
                    ready();
                };
            file.read({
                callback: callback_html,
                location: `${process_path}lib${vars.path.sep}dashboard${vars.path.sep}dashboard.html`,
                no_file: null,
                section: "startup"
            });
            file.read({
                callback: callback_feature,
                location: `${process_path}features.json`,
                no_file: null,
                section: "startup"
            });
        }
    };
};

export default features;