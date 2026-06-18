

import dashboard from "../dashboard.ts";

const ui_services_app = function ui_services_app():void {
    const services_app:module_sections = {
        events: null,
        init: function dashboard_sections_servicesApp_init():void {
            const len:number = dashboard.global.payload.services_app.length,
                build = function dashboard_sections_servicesApp_init_build(text:string, name:string, parent:HTMLElement):HTMLElement {
                    const element:HTMLElement = document.createElement(name);
                    if (text !== null) {
                        element.textContent = text;
                    }
                    parent.appendChild(element);
                    return element;
                },
                dependencies = function dashboard_sections_serviceApps_init_dependencies(deps:core_services_internal_dependency, parent:HTMLElement):void {
                    const dep_keys = Object.keys(dashboard.global.payload.services_app[index].dependencies).sort(),
                        dep_len = dep_keys.length;
                    if (dep_len > 0) {
                        const div:HTMLElement = document.createElement("div"),
                            h4:HTMLElement = document.createElement("h4"),
                            ul:HTMLElement = document.createElement("ul");
                        let index_dep:number = 0,
                            h5:HTMLElement = null,
                            code:HTMLElement = null,
                            li:HTMLElement = null,
                            em:HTMLElement = null;
                        h4.textContent = "Type Dependencies";
                        div.appendChild(h4);
                        do {
                            li = document.createElement("li");
                            h5 = document.createElement("h5");
                            em = document.createElement("em");
                            h5.textContent = `${dep_keys[index_dep]} - `;
                            em.textContent = deps[dep_keys[index_dep]][1];
                            h5.appendChild(em);
                            li.appendChild(h5);
                            code = document.createElement("code");
                            code.textContent = deps[dep_keys[index_dep]][0];
                            li.appendChild(code);
                            ul.appendChild(li);
                            index_dep = index_dep + 1;
                        } while (index_dep < dep_len);
                        div.appendChild(ul);
                        div.setAttribute("class", "service-dependencies");
                        parent.appendChild(div);
                    }
                };
            let index:number = 0,
                index_files:number = 0,
                plural:string = "",
                p:HTMLElement = null,
                em:HTMLElement = null,
                strong:HTMLElement = null,
                ul:HTMLElement = null,
                li:HTMLElement = null;
            dashboard.sections["services-app"].nodes.count.textContent = len.commas();
            dashboard.global.payload.services_app.sort(function dashboard_sections_ServicesApp_init_sort(a:core_service_internal, b:core_service_internal):-1|1 {
                if (a.name < b.name) {
                    return -1;
                }
                return 1;
            });
            do {
                li = document.createElement("li");
                em = document.createElement("em");
                strong = document.createElement("strong");
                p = document.createElement("p");
                build(dashboard.global.payload.services_app[index].name, "h3", li);
                build(dashboard.global.payload.services_app[index].description, "p", li);
                build(dashboard.global.payload.services_app[index].code, "code", li);
                dependencies(dashboard.global.payload.services_app[index].dependencies, li);
                build("References", "h4", li);
                index_files = dashboard.global.payload.services_app[index].files.length;
                plural = (index_files === 1)
                    ? ""
                    : "s";
                p.textContent = "Service ";
                strong.textContent = dashboard.global.payload.services_app[index].name;
                p.appendChild(strong);
                p.appendText(" referenced in ");
                em.textContent = index_files.toString();
                p.appendChild(em);
                p.appendText(` file${plural}.`);
                li.appendChild(p);
                if (index_files > 0) {
                    ul = build(null, "ul", li);
                    ul.setAttribute("class", "reference-list");
                    do {
                        index_files = index_files - 1;
                        build(dashboard.global.payload.services_app[index].files[index_files], "li", ul);
                    } while (index_files > 0);
                }
                dashboard.sections["services-app"].nodes.list.appendChild(li);
                index = index + 1;
            } while (index < len);
        },
        nodes: {
            count: document.getElementById("services-app").getElementsByClassName("section")[0].getElementsByTagName("em")[0],
            list: document.getElementById("services-app").getElementsByClassName("section")[0].getElementsByTagName("ul")[0]
        },
        receive: null,
        tools: null
    };
    dashboard.sections["services-app"] = services_app;
};

export default ui_services_app;