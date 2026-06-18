

import dashboard from "../dashboard.ts";

const ui_interfaces = function ui_interfaces():void {
    const interfaces:section_interfaces = {
        events: {
            update: function dashboard_sections_interfaces_update():void {
                dashboard.utility.performance_set("interfaces");
                dashboard.message.send({data: null, service: "services_os_intr"});
            }
        },
        init: function dashboard_sections_interfaces_init():void {
            dashboard.sections["interfaces"].nodes.update_button.onclick = dashboard.sections["interfaces"].events.update;
            dashboard.sections["interfaces"].receive({
                data: dashboard.global.payload.os.intr,
                service: "services_os_intr"
            });
            dashboard.sections["interfaces"].nodes.update_button.setAttribute("data-list", "intr");
        },
        receive: function dashboard_sections_interfaces_receive(socket_data:socket_data):void {
            const item:services_os_intr = socket_data.data as services_os_intr,
                output_old:HTMLElement = dashboard.sections["interfaces"].nodes.list,
                output_new:HTMLElement = document.createElement("div"),
                keys:string[] = Object.keys(item.data),
                len:number = keys.length,
                data_item = function dashboard_sections_interfaces_receive_dataItem(ul:HTMLElement, item:node_os_NetworkInterfaceInfo, key:"address"|"cidr"|"family"|"internal"|"mac"|"netmask"|"scopeid"):void {
                    if (item[key] !== undefined) {
                        const li:HTMLElement = document.createElement("li"),
                            strong:HTMLElement = document.createElement("strong"),
                            span:HTMLElement = document.createElement("span");
                        strong.textContent = key;
                        span.textContent = String(item[key]);
                        li.appendChild(strong);
                        li.appendChild(span);
                        ul.appendChild(li);
                    }
                },
                property = function dashboard_sections_interfaces_receive_property():void {
                    const ul:HTMLElement = document.createElement("ul");
                    ul.setAttribute("class", "os-interface");
                    data_item(ul, item.data[keys[index]][index_child], "address");
                    data_item(ul, item.data[keys[index]][index_child], "netmask");
                    data_item(ul, item.data[keys[index]][index_child], "family");
                    data_item(ul, item.data[keys[index]][index_child], "mac");
                    data_item(ul, item.data[keys[index]][index_child], "internal");
                    data_item(ul, item.data[keys[index]][index_child], "cidr");
                    data_item(ul, item.data[keys[index]][index_child], "scopeid");
                    div.appendChild(ul);
                };
            let index:number = 0,
                index_child:number = 0,
                len_child:number = 0,
                div:HTMLElement = null,
                h3:HTMLElement = null;
            if (len > 0) {
                do {
                    div = document.createElement("div");
                    h3 = document.createElement("h3");
                    h3.textContent = keys[index];
                    div.appendChild(h3);
                    len_child = item.data[keys[index]].length;
                    if (len_child > 0) {
                        index_child = 0;
                        do {
                            property();
                            index_child = index_child + 1;
                        } while (index_child < len_child);
                    }
                    div.setAttribute("class", "section");
                    output_new.appendChild(div);
                    index = index + 1;
                } while (index < len);
                output_new.setAttribute("class", "item-list");
                output_old.parentNode.insertBefore(output_new, output_old);
                output_old.parentNode.removeChild(output_old);
                dashboard.sections["interfaces"].nodes.list = output_new;
                dashboard.sections["interfaces"].nodes.count.textContent = String(len);
                dashboard.sections["interfaces"].nodes.update_text.textContent = item.time.dateTime(true, dashboard.global.payload.timeZone_offset);
                dashboard.global.payload.os.intr = item;
            }
            dashboard.sections["interfaces"].nodes.update_duration.textContent = dashboard.utility.performance_get("interfaces");
        },
        nodes: {
            count: document.getElementById("interfaces").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
            list: document.getElementById("interfaces").getElementsByClassName("item-list")[0] as HTMLElement,
            update_button: document.getElementById("interfaces").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
            update_duration: document.getElementById("interfaces").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[1],
            update_text: document.getElementById("interfaces").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[0]
        },
        time: 0,
        tools: null
    };
    dashboard.sections["interfaces"] = interfaces;
};

export default ui_interfaces;