

import dashboard from "../dashboard.ts";

const ui_message_inspection = function ui_message_inspection():void {
    const message_inspection:section_message_inspection = {
        events: {
            service: function dashboard_sections_messageInspection_service():void {
                const value_service:string = dashboard.sections["message-inspection"].nodes.service[dashboard.sections["message-inspection"].nodes.service.selectedIndex].textContent,
                    value_type:string = dashboard.sections["message-inspection"].nodes.type[dashboard.sections["message-inspection"].nodes.type.selectedIndex].textContent,
                    maximum_size:number = Number(dashboard.sections["message-inspection"].nodes.maximum_size.value),
                    throttle_size:number = Number(dashboard.sections["message-inspection"].nodes.throttle_size.value),
                    throttle_time:number = Number(dashboard.sections["message-inspection"].nodes.throttle_time.value),
                    payload:services_message_inspection = {
                        count: 0,
                        direction: "in",
                        maximum_size: (isNaN(maximum_size) === true)
                            ? 500000
                            : maximum_size,
                        message: "",
                        service: (value_service === "")
                            ? ""
                            : value_service.split(" - ")[1],
                        throttle_size: (isNaN(throttle_size) === true)
                            ? 500000
                            : throttle_size,
                        throttle_time: (isNaN(throttle_time) === true)
                            ? 10000
                            : throttle_time * 1000,
                        type: (value_type === "Web Server")
                            ? "web-server"
                            : "docker-container"
                    };
                if (value_service !== "") {
                    dashboard.sections["message-inspection"].nodes.label_in.getElementsByTagName("textarea")[0].value = "";
                    dashboard.sections["message-inspection"].nodes.label_out.getElementsByTagName("textarea")[0].value = "";
                    dashboard.sections["message-inspection"].nodes.em_in.textContent = "";
                    dashboard.sections["message-inspection"].nodes.em_out.textContent = "";
                }
                dashboard.message.send({data: payload, service: "services_message_inspection"});
            },
            type: function dashboard_sections_messageInspection_type():void {
                const value:string = dashboard.sections["message-inspection"].nodes.type[dashboard.sections["message-inspection"].nodes.type.selectedIndex].textContent,
                    populate = function dashboard_sections_messageInspection_type_populate(list:services_server_update|store_compose, type:"docker-container"|"web-server"):void {
                        const keys:string[] = Object.keys(list),
                            len:number = keys.length;
                        let option:HTMLElement = document.createElement("option"),
                            index:number = 0;
                        option.textContent = "";
                        dashboard.sections["message-inspection"].nodes.service.appendChild(option);
                        if (len > 0) {
                            keys.sort();
                            do {
                                if (type === "web-server" || (type === "docker-container" && (list[keys[index]] as core_compose_container).state === "running")) {
                                    option = document.createElement("option");
                                    option.textContent = `${(type === "docker-container")
                                        ? (list[keys[index]] as core_compose_container).name
                                        : (list[keys[index]] as supplemental_server).config.name} - ${keys[index]}`;
                                    dashboard.sections["message-inspection"].nodes.service.appendChild(option);
                                }
                                index = index + 1;
                            } while (index < len);
                        }
                    };
                dashboard.sections["message-inspection"].nodes.service.textContent = "";
                dashboard.sections["message-inspection"].nodes.label_in.getElementsByTagName("textarea")[0].value = "";
                dashboard.sections["message-inspection"].nodes.label_out.getElementsByTagName("textarea")[0].value = "";
                dashboard.sections["message-inspection"].nodes.em_in.textContent = "";
                dashboard.sections["message-inspection"].nodes.em_out.textContent = "";
                if (value === "Web Server") {
                    populate(dashboard.global.payload.server, "web-server");
                    dashboard.sections["message-inspection"].nodes.label_in.parentNode.style.display = "block";
                    dashboard.sections["message-inspection"].nodes.label_in.firstChild.textContent = "Messages in ";
                    dashboard.sections["message-inspection"].nodes.label_out.firstChild.textContent = "Messages out ";
                } else {
                    populate(dashboard.global.payload.compose.containers, "docker-container");
                    dashboard.sections["message-inspection"].nodes.label_in.parentNode.style.display = "none";
                    dashboard.sections["message-inspection"].nodes.label_out.firstChild.textContent = "Docker logs ";
                }
                dashboard.utility.setState();
            }
        },
        init: function dashboard_section_messageInspection():void {
            if (dashboard.global.state.messageInspection === "docker-container") {
                dashboard.sections["message-inspection"].nodes.type.selectedIndex = 1;
            }
            dashboard.sections["message-inspection"].nodes.service.onchange = dashboard.sections["message-inspection"].events.service;
            dashboard.sections["message-inspection"].nodes.type.onchange = dashboard.sections["message-inspection"].events.type;
            dashboard.sections["message-inspection"].events.type();
        },
        nodes: {
            em_in: document.getElementById("message-inspection").getElementsByClassName("section")[0].getElementsByTagName("label")[0].getElementsByTagName("em")[0],
            em_out: document.getElementById("message-inspection").getElementsByClassName("section")[0].getElementsByTagName("label")[1].getElementsByTagName("em")[0],
            label_in: document.getElementById("message-inspection").getElementsByClassName("section")[0].getElementsByTagName("label")[0],
            label_out: document.getElementById("message-inspection").getElementsByClassName("section")[0].getElementsByTagName("label")[1],
            maximum_size: document.getElementById("message-inspection").getElementsByClassName("form")[0].getElementsByTagName("input")[2] as HTMLInputElement,
            service: document.getElementById("message-inspection").getElementsByClassName("form")[0].getElementsByTagName("select")[1] as HTMLSelectElement,
            throttle_size: document.getElementById("message-inspection").getElementsByClassName("form")[0].getElementsByTagName("input")[0] as HTMLInputElement,
            throttle_time: document.getElementById("message-inspection").getElementsByClassName("form")[0].getElementsByTagName("input")[1] as HTMLInputElement,
            type: document.getElementById("message-inspection").getElementsByClassName("form")[0].getElementsByTagName("select")[0] as HTMLSelectElement
        },
        receive: function dashboard_services_messageInspection_receive(socket_data:socket_data):void {
            const data:services_message_inspection = socket_data.data as services_message_inspection;
            if (
                data.service === dashboard.sections["message-inspection"].nodes.service.value.split(" - ")[1] && (
                    (data.type === "web-server" && dashboard.sections["message-inspection"].nodes.type.value === "Web Server") ||
                    (data.type === "docker-container" && dashboard.sections["message-inspection"].nodes.type.value === "Docker Container")
                )
            ) {
                const textarea:HTMLTextAreaElement = dashboard.sections["message-inspection"].nodes[`label_${data.direction}`].getElementsByTagName("textarea")[0],
                    value_total:string = `${textarea.value}\n\n${data.message}`,
                    len:number = value_total.length,
                    value:string = (len < data.maximum_size)
                        ? value_total
                        : value_total.slice(len - data.maximum_size);
                textarea.value = value;
                dashboard.sections["message-inspection"].nodes[`em_${data.direction}`].textContent = `(${data.count.commas()} characters updated, ${value.length.commas()} characters total)`;
            }
        },
        tools: {}
    };
    dashboard.sections["message-inspection"] = message_inspection;
};

export default ui_message_inspection;