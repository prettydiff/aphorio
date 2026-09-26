
import directory from "../utilities/directory.ts";
import file from "../utilities/file.ts";
import vars from "../core/vars.ts";

const services_app = function start_servicesApp(complete_tasks:(task:type_start_primary_tasks) => void, process_path:string):core_start_task {
    return {
        label: "Provides the application's service list to the dashboard UI.",
        task: function start_servicesApp_task():void {
            const callback_directory = function start_servicesApp_task_callbackDirectory(dir:core_directory_list):void {
                const len:number = dir.length,
                    code:store_string = {},
                    definitions:core_services_internal_dependency = {},
                    keys_code:string[] = [],
                    // reads a file
                    read = function start_servicesApp_task_callbackDirectory_read(file:Buffer, location:string):void {
                        count = count - 1;

                        // type definition files
                        if ((/\.d\.ts$/).test(location) === true) {
                            // service_registry.d.ts
                            if (location === `${process_path}lib${vars.path.sep}typescript${vars.path.sep}service_registry.d.ts`) {
                                const services:string[] = file.toString().replace(/^\s+/, "").replace(/\s+$/, "").split("\n\n"),
                                    service_add = function start_serviceApp_task_callbackDirectory_read_serviceAdd(strings:string[]):void {
                                        const name:string = strings[0].replace(/\s*interface\s+/, "").replace(/\s+\{\s*$/, "");
                                        service = {
                                            code: strings.slice(0, strings.length - 1).join("\n"),
                                            dependencies: {},
                                            description: strings[strings.length - 1].replace(/^\s*\/\/\s*/, ""),
                                            files: [],
                                            name: name
                                        };
                                        vars.environment.services_app.push(service);
                                        definitions[name] = [services[index], location.replace(process_path, vars.path.sep)];
                                    },
                                    len:number = services.length - 1;
                                let index:number = 0,
                                    strings:string[] = null,
                                    service:core_service_internal = null;
                                do {
                                    strings = services[index].split("\n");
                                    if ((/^\s*\/(\*|\/)\s*cspell/).test(strings[0]) === true) {
                                        if (strings.length > 1) {
                                            strings.splice(0, 1);
                                            service_add(strings);
                                        }
                                    } else {
                                        service_add(strings);
                                    }
                                    index = index + 1;
                                } while (index < len);
                            // types.d.ts
                            } else if (location === `${process_path}lib${vars.path.sep}typescript${vars.path.sep}node.d.ts` || location === `${process_path}lib${vars.path.sep}typescript${vars.path.sep}types.d.ts`) {
                                const raw:string = file.toString(),
                                    list:string[] = raw.slice(raw.indexOf("type")).replace(/^\s+/, "").replace(/\s+$/, "").replace(/\n\n/g, "\n").split("\n");
                                let index_def:number = list.length,
                                    values:string[] = null;
                                do {
                                    index_def = index_def - 1;
                                    if (list[index_def].replace(/^\s*/, "").indexOf("type ") === 0) {
                                        values = list[index_def].replace(/^\s*/, "").replace(/\s*=\s*/, "=").split("=");
                                        definitions[values[0].slice(5)] = [`${values[0]} = ${values[1]}`, location.replace(process_path, vars.path.sep)];
                                    }
                                } while (index_def > 0);
                            // all other definitions
                            } else {
                                const list:string[] = file.toString().replace(/^\s+/, "").replace(/\s+$/, "").split("\n\n");
                                let index_def:number = list.length,
                                    name:string = "";
                                do {
                                    index_def = index_def - 1;
                                    // un-indent
                                    if (list[index_def].indexOf("    ") === 0) {
                                        do {
                                            list[index_def] = list[index_def].replace("    ", "").replace(/\n {4}/g, "\n");
                                        } while (list[index_def].indexOf("    ") === 0);
                                    }
                                    name = list[index_def].split("\n")[0].replace(/\s*interface\s+/, "");
                                    name = name.replace(/\s*\{\s*/, "");
                                    if (name.includes(" ") === true) {
                                        name = name.slice(0, name.indexOf(" "));
                                    }
                                    definitions[name] = [list[index_def], location.replace(process_path, vars.path.sep)];
                                } while (index_def > 0);
                            }
                        }
                        code[location] = file.toString();
                        keys_code.push(location);
                        if (count === 0) {
                            const len_code:number = keys_code.length,
                                dependency = function start_servicesApp_task_callbackDirectory_dependency(sample:[string, string], dep:core_services_internal_dependency):void {
                                    const lines:string[] = sample[0].split("\n");
                                    let index_lines:number = lines.length,
                                        index_names:number = 0,
                                        name:string = "",
                                        names:string[] = null;
                                    do {
                                        index_lines = index_lines - 1;
                                        if ((/^interface\s/).test(lines[index_lines]) === false) {
                                            name = ((/^type\s/).test(lines[index_lines]) === true)
                                                ? lines[index_lines].slice(lines[index_lines].indexOf("=") + 1).replace(/^\s+/, "").replace(/\s*;\s*$/, "")
                                                : lines[index_lines].slice(lines[index_lines].lastIndexOf(":") + 1).replace(/^\s+/, "").replace(/\s*;\s*$/, "");
                                            if (name.includes("|") === true) {
                                                names = name.split("|");
                                            } else {
                                                names = [name];
                                            }
                                            index_names = names.length;
                                            do {
                                                index_names = index_names - 1;
                                                if (names[index_names].includes("_") === true) {
                                                    name = names[index_names].replace(/\s+/g, "");
                                                    if (name.includes("<") === true) {
                                                        name = name.slice(0, name.indexOf("<"));
                                                    }
                                                    if (name.includes("[") === true) {
                                                        name = name.slice(0, name.indexOf("["));
                                                    }
                                                    if (dep[name] === undefined) {
                                                        dep[name] = definitions[name];
                                                        if (definitions[name] !== undefined) {
                                                            dependency(definitions[name], dep);
                                                        }
                                                    }
                                                }
                                            } while (index_names > 0);
                                        }
                                    } while (index_lines > 0);
                                };
                            let index_service:number = vars.environment.services_app.length,
                                index_code:number = 0,
                                reg_colon:RegExp = null,
                                reg_as:RegExp = null;
                            do {
                                index_service = index_service - 1;
                                index_code = len_code;
                                // find files referencing this service by name
                                do {
                                    index_code = index_code - 1;
                                    reg_colon = new RegExp(`:\\s*${vars.environment.services_app[index_service].name}`);
                                    reg_as = new RegExp(`as\\s+${vars.environment.services_app[index_service].name}`);
                                    if (reg_colon.test(code[keys_code[index_code]]) === true || reg_as.test(code[keys_code[index_code]]) === true || code[keys_code[index_code]].includes(`"${vars.environment.services_app[index_service].name}"`) === true) {
                                        vars.environment.services_app[index_service].files.push(keys_code[index_code].replace(process_path, vars.path.sep));
                                    }
                                } while (index_code > 0);

                                // find all type dependencies
                                dependency([vars.environment.services_app[index_service].code, ""], vars.environment.services_app[index_service].dependencies);
                            } while (index_service > 0);
                            complete_tasks("services_app");
                        }
                    };
                let index_dir:number = len,
                    count:number = len;
                do {
                    index_dir = index_dir - 1;
                    if (dir[index_dir][1] === "file" && (/\.ts$/).test(dir[index_dir][0]) === true) {
                        file.read({
                            callback: read,
                            location: dir[index_dir][0],
                            no_file: null,
                            section: "startup"
                        });
                    } else {
                        count = count - 1;
                    }
                } while (index_dir > 0);
            };
            if (vars.environment.features["services-app"] === true) {
                directory({
                    callback: callback_directory,
                    depth: 0,
                    directory_size: false,
                    exclusions: [],
                    parent: false,
                    path: `${process_path}lib`,
                    relative: false,
                    search: null,
                    symbolic: false
                });
            } else {
                complete_tasks("services_app");
            }
        }
    };
};

export default services_app;