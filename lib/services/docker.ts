
import directory from "../utilities/directory.ts";
import file from "../utilities/file.ts";
import log from "../core/log.ts";
import send from "../transmit/send.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

// cspell: words opencontainers

const docker:core_docker = {
    commands: {
        activate: " up --detach",
        add: " up --detach",
        deactivate: " down",
        destroy: " down",
        list: " ps --format json --no-trunc",
        modify: " down",
        update: ""
    },
    list: function services_docker_list(callback:() => void):void {
        const complete = function services_docker_list_complete(message:string):void {
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
                    const counts:store_number = {},
                        addresses:string[] = [],
                        list:core_compose_properties[] = JSON.parse(`[${output.stdout.replace(/\}\n\{/g, "},{")}]`),
                        len:number = list.length,
                        file_path = function services_docker_list_child_filePath(out:core_spawn_output):void {
                            if (out.stdout !== "") {
                                file.read({
                                    callback: file_callback,
                                    identifier: out.type,
                                    location: out.stdout.trim(),
                                    no_file: null,
                                    section: "compose_containers"
                                });
                            }
                        },
                        file_callback = function services_docker_list_child_fileCallback(file:Buffer, location:string, identifier:string):void {
                            const ind:number = Number(identifier),
                                id:string = list[ind].ID;
                            vars.compose.containers[id] = {
                                compose: file.toString(),
                                created: new Date(list[ind].CreatedAt).valueOf(),
                                description: "",
                                id: id,
                                image: list[ind].Image,
                                license: "",
                                name: list[ind].Names,
                                location: location,
                                ports: ports(list[ind]),
                                state: list[ind].State,
                                status: list[ind].Status,
                                version: ""
                            };
                            if (vars.compose.containers[location] !== undefined) {
                                delete vars.compose.containers[location];
                            }
                            addresses.push(location);
                            total = total + 1;
                            spawn(`docker inspect ${list[ind].ID} -f '{{index .Config.Labels "org.opencontainers.image.description"}}'`, description, {type: identifier}).execute();
                            spawn(`docker inspect ${list[ind].ID} -f '{{index .Config.Labels "org.opencontainers.image.licenses"}}'`, license, {type: identifier}).execute();
                            spawn(`docker inspect ${list[ind].ID} -f '{{index .Config.Labels "org.opencontainers.image.version"}}'`, version, {type: identifier}).execute();
                        },
                        ports = function services_docker_list_child_ports(properties:core_compose_properties):type_docker_ports {
                            const items:string[] = properties.Ports.replace(/, /g, ",").split(","),
                                output:type_docker_ports = [],
                                len:number = items.length;
                            if (len > 0) {
                                let index_ports:number = 0,
                                    value:string[] = null,
                                    port:number = 0,
                                    type:"tcp"|"udp" = "tcp",
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
                        },
                        complete_ps = function services_docker_list_child_completePS():void {
                            const read = function services_docker_list_child_completePS_read(file:Buffer, location:string):void {
                                    vars.compose.containers[location] = {
                                        compose: file.toString(),
                                        created: 0,
                                        description: "",
                                        id: location,
                                        image: "",
                                        location: location,
                                        license: "",
                                        name: location.split(vars.path.sep).pop().replace(/\.ya?ml$/, ""),
                                        ports: [],
                                        state: "dead",
                                        status: "",
                                        version: ""
                                    };
                                    count = count - 1;
                                    if (count === 0) {
                                        complete("");
                                    }
                                },
                                list = function services_docker_list_child_completePS_list(file_list:string[]|directory_list):void {
                                    const files:string[] = file_list as string[];
                                    let index:number = files.length,
                                        count:number = 0;
                                    if (index > 0) {
                                        do {
                                            index = index - 1;
                                            if (addresses.includes(files[index]) === false && (/\.ya?ml$/).test(files[index]) === true && files[index].includes("empty.yml") === false) {
                                                count = count + 1;
                                                file.read({
                                                    callback: read,
                                                    location: files[index],
                                                    no_file: null,
                                                    section: "compose_containers"
                                                });
                                            }
                                        } while (index > 0);
                                    }
                                };
                            directory({
                                callback: list,
                                depth: 1,
                                exclusions: [".env"],
                                mode: "array",
                                path: vars.path.compose,
                                relative: false,
                                search: "",
                                symbolic: false
                            });
                        },
                        complete_meta = function services_docker_list_child_completeMeta(id:string):void {
                            counts[id] = counts[id] + 1;
                            if (counts[id] === 3) {
                                count = count + 1;
                                if (count === total) {
                                    complete_ps();
                                }
                            }
                        },
                        description = function services_docker_list_child_description(out:core_spawn_output):void {
                            const id:string = list[Number(out.type)].ID;
                            vars.compose.containers[id].description = out.stdout.trim();
                            complete_meta(id);
                        },
                        license = function services_docker_list_child_license(out:core_spawn_output):void {
                            const id:string = list[Number(out.type)].ID;
                            vars.compose.containers[id].license = out.stdout.trim();
                            complete_meta(id);
                        },
                        version = function services_docker_list_child_version(out:core_spawn_output):void {
                            const id:string = list[Number(out.type)].ID;
                            vars.compose.containers[id].version = out.stdout.trim();
                            complete_meta(id);
                        };
                    let index:number = 0,
                        count:number = 0,
                        total:number = 0;
                    if (len > 0) {
                        do {
                            counts[list[index].ID] = 0;
                            spawn(`docker inspect ${list[index].ID} -f '{{index .Config.Labels "com.docker.compose.project.config_files"}}'`, file_path, {type: index.toString()}).execute();
                            index = index + 1;
                        } while (index < len);
                    }
                }
            };
            vars.compose.containers = {};
            spawn(`docker ${docker.commands.list}`, child).execute();
        } else {
            complete("Application must be executed with administrative privilege for Docker support.");
        }
    },
    receive: function services_docker_receive(socket_data:socket_data, transmit:transmit_socket):void {
        const socket:websocket_client = transmit.socket as websocket_client;
        if (socket_data.service === "dashboard-compose-variables") {
            docker.variables(socket_data.data as store_string, socket);
        } else if (socket_data.service === "dashboard-compose-container") {
            const data:services_compose_container = socket_data.data as services_compose_container,
                segment:string = data.compose.split("container_name")[1],
                name:string = (segment === undefined)
                    ? null
                    : segment.split("\n")[0].trim().replace(/^\s*:\s*/, ""),
                location:string = (data.action === "add" && name !== null)
                    ? `${vars.path.compose + name}.yml`
                    : data.location,
                compose_location:string = `${vars.commands.compose} --ansi never --env-file "${vars.path.compose}.env" -f ${location}`,
                command:string = compose_location + docker.commands[data.action];
            if (data.action === "activate" || data.action === "deactivate" || data.action === "destroy") {
                spawn(command, function services_docker_receive_spawn():void {
                    docker.list(function services_docker_receive_spawn_list():void {
                        send({
                            data: vars.compose,
                            service: "dashboard-compose"
                        }, socket, 3);
                    });
                }).execute();
            } else if (data.action === "add") {
                if (name === null || name === "") {
                    log.application({
                        error: null,
                        message: "Attempted to add a docker container without a 'container_name' field.",
                        section: "compose_containers",
                        status: "error",
                        time: Date.now()
                    });
                } else {
                    file.write({
                        callback: function services_docker_receive_add():void {
                            spawn(command, function services_docker_receive_add_spawn():void {
                                docker.list(function services_docker_receive_add_spawn_list():void {
                                    send({
                                        data: vars.compose,
                                        service: "dashboard-compose"
                                    }, socket, 3);
                                });
                            }).execute();
                        },
                        contents: data.compose,
                        location: location,
                        section: "compose_containers"
                    });
                }
            } else if (data.action === "modify") {
                const running:boolean = (vars.compose.containers[data.id].state === "running"),
                    list = function services_docker_receive_modifyList():void {
                        docker.list(function services_docker_receive_modifyList_callback():void {
                            send({
                                data: vars.compose,
                                service: "dashboard-compose"
                            }, socket, 3);
                        });
                    };
                spawn(command, function services_docker_receive_modify():void {
                    file.write({
                        callback: function services_docker_receive_modify_write():void {
                            if (running === true) {
                                spawn(compose_location + docker.commands.activate, list).execute();
                            } else {
                                list();
                            }
                        },
                        contents: data.compose,
                        location: data.location,
                        section: "compose_containers"
                    });
                });
            } else if (data.action === "update") {
                docker.list(function services_docker_receive_update():void {
                    send({
                        data: vars.compose,
                        service: "dashboard-compose"
                    }, socket, 3);
                });
            }
        }
    },
    variables: function services_docker_variables(variables:store_string, socket:websocket_client):void {
        const list:string[] = Object.keys(variables),
            len:number = list.length,
            output:string[] = [];
        if (len > 0) {
            let index:number = 0;
            do {
                output.push(`${list[index]}=${variables[list[index]]}`);
                index = index + 1;
            } while (index < len);
        }
        file.write({
            callback: function services_docker_variables_callback():void {
                vars.compose.variables = variables;
                docker.list(function services_docker_variables_callback_list():void {
                    send({
                        data: vars.compose,
                        service: "dashboard-compose"
                    }, socket, 3);
                });
            },
            contents: output.join("\n"),
            location: `${vars.path.project}compose${vars.path.sep}.env`,
            section: "compose_containers"
        });
    }
};

export default docker;