
import file from "../utilities/file.ts";
import log from "../core/log.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

const docker:core_docker = {
    activate: function services_docker_activate():void {},
    create: function services_docker_create():void {},
    deactivate: function services_docker_deactivate():void {},
    delete: function services_docker_delete():void {},
    list: function services_docker_list(callback:() => void):void {
        const complete = function (message:string):void {
                vars.compose.status = message;
                vars.compose.time = now;
                callback();
            },
            now:number = Date.now();
        if (vars.os.process.admin === true) {
            const child = function services_docker_list_child(output:core_spawn_output):void {
                const stdout:string = output.stdout.trim();
                if (stdout.charAt(0) !== "{" || stdout.charAt(stdout.length - 1) !== "}") {
                    const str:string = `${output.stderr.replace("error during connect: ", "")}`;
                    log.application({
                        error: null,
                        message: vars.compose.status,
                        section: "compose_containers",
                        status: "error",
                        time: now
                    });
                    complete((str === "")
                        ? "Format error on docker compose process list."
                        : str
                    );
                } else {
                    const list:core_compose_properties[] = JSON.parse(`[${output.stdout.replace(/\}\n\{/g, "},{")}]`),
                        len:number = list.length,
                        file_callback = function services_docker_list_child_fileCallback(file:Buffer, location:string, identifier:string):void {
                            count = count + 1;
                            vars.compose.containers[identifier].compose = file.toString();
                            if (count === len) {console.log(vars.compose.containers.jellyfin);console.log(vars.compose.containers.pihole);
                                complete("");
                            }
                        },
                        ports = function services_docker_list_child_ports():type_docker_ports {
                            const items:string[] = list[index].Ports.replace(/, /g, ",").split(","),
                                output:type_docker_ports = [],
                                len:number = items.length;
                            if (len > 0) {
                                let index_ports:number = 0,
                                    value:string[] = null,
                                    port:number = 0,
                                    type:"tcp" = "tcp",
                                    end:number = 0,
                                    add:boolean = true;
                                do {
                                    if (items[index_ports].includes("->") === true) {
                                        value = items[index_ports].split("->");
                                        port = Number(value[0].slice(value[0].lastIndexOf(":") + 1));
                                        type = value[1].split("/")[1] as "tcp";
                                    } else {
                                        value = items[index_ports].split("/");
                                        port = Number(value[0]);
                                        type = value[1] as "tcp";
                                    }
                                    end = output.length;
                                    add = true;
                                    if (end > 0) {
                                        do {
                                            end = end - 1;
                                            if (output[end][0] === port && output[end][1] === type) {
                                                add = false;
                                                break;
                                            }
                                        } while (end > 0);
                                    }
                                    if (add === true) {
                                        output.push([port, type]);
                                    }
                                    index_ports = index_ports + 1;
                                } while (index_ports < len);
                            }
                            return output.sort(function services_docker_list_child_ports_sort(a:[number, string], b:[number, string]):-1|1 {
                                if (a[1] < b[1] || (a[1] === b[1] && a[0] < b[0])) {
                                    return -1;
                                }
                                return 1;
                            });
                        };
                    let index:number = 0,
                        count:number = 0,
                        label_index:number = 0,
                        labels:string[] = null,
                        location:string = "";
                    if (len > 0) {
                        do {
                            labels = list[index].Labels.split(",");
                            label_index = labels.length;
                            if (label_index > 0) {
                                do {
                                    label_index = label_index - 1;
                                    if (labels[label_index].indexOf("com.docker.compose.project.config_files=") === 0) {
                                        location = labels[label_index].slice(labels[label_index].indexOf("=") + 1);
                                        vars.compose.containers[list[index].Name] = {
                                            compose: "",
                                            location: location,
                                            ports: ports(),
                                            properties: list[index],
                                            state: list[index].State
                                        };
                                        file.read({
                                            callback: file_callback,
                                            identifier: list[index].Name,
                                            location: location,
                                            no_file: null,
                                            section: "compose_containers"
                                        });
                                        break;
                                    }
                                } while (label_index > 0);
                            }
                            index = index + 1;
                        } while (index < len);
                    }
                }
            };
            spawn(vars.commands.docker_list, child).execute();
        } else {
            complete("Application must be executed with administrative privilege for Docker support.");
        }
    },
    modify: function services_docker_modify():void {}
};

export default docker;