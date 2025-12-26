
import directory from "../utilities/directory.ts";
import node from "../core/node.ts";
import send from "../transmit/send.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

import { detectAll } from "jschardet";

const fileSystem = function services_fileSystem(socket_data:socket_data, transmit:transmit_socket):void {
    if (vars.environment.features["file-system"] === false) {
        return;
    }
    const data:services_fileSystem = socket_data.data as services_fileSystem,
        service:services_fileSystem = {
            address: data.address,
            dirs: null,
            failures: [],
            file: null,
            mime: "",
            parent: null,
            search: data.search,
            sep: vars.path.sep
        },
        complete = function services_fileSystem_complete():void {
            send({
                data: service,
                service: "dashboard-fileSystem"
            }, transmit.socket as websocket_client, 3);
        },
        dirCallback = function services_fileSystem_dirCallback(list:core_directory_list):void {
            if (list.length === 0) {
                complete();
            } else if (list[0][1] === "directory") {
                const local:type_directory_item[] = [],
                    len:number = list.length - 1;
                let index:number = 1;
                if (len > 1) {
                    do {
                        if (list[index][2] === 0) {
                            local.push(list[index]);
                        }
                        index = index + 1;
                    } while (index < len);
                }
                local.sort(function services_fileSystem_dirCallback_sort(a:type_directory_item, b:type_directory_item):-1|0|1 {
                    if (a[1] < b[1]) {
                        return -1;
                    }
                    if (a[1] > b[1]) {
                        return 1;
                    }
                    if (a[1] === b[1]) {
                        if ((vars.path.sep === "/" && a[0] < b[0]) || (vars.path.sep === "\\" && a[0].toLowerCase() < b[0].toLowerCase())) {
                            return -1;
                        }
                        if ((vars.path.sep === "/" && a[0] > b[0]) || (vars.path.sep === "\\" && a[0].toLowerCase() > b[0].toLowerCase())) {
                            return 1;
                        }
                    }
                    return 0;
                });
                if (list[0][0] !== "\\") {
                    local.splice(0, 0, list[0]);
                }
                service.dirs = local;
                service.failures = list.failures;
                service.parent = list.parent;
                complete();
            } else {
                service.dirs = [list[0]];
                service.parent = list.parent;
                if (vars.commands.file === "") {
                    node.fs.readFile(data.address, readCallback);
                } else {
                    spawn(`${vars.commands.file}"${data.address}"`, fileCallback).execute();
                }
            }
        },
        fileCallback = function services_fileSystem_fileCallback(output:core_spawn_output):void {
            if (output.stdout.includes("cannot open") === true) {
                service.file = output.stdout.slice(output.stdout.indexOf("; ") + 2).replace("\r\n", "");
                service.failures[0] = "file not found";
                complete();
            } else {
                const data_file:string[] = output.stdout.split("; "),
                    category:string = data_file[0].slice(0, data_file[0].indexOf("/")),
                    accepted:string[] = ["message", "multipart", "text"],
                    charset:string = (data_file[1] === undefined)
                        ? output.stdout
                        : data_file[1].replace("charset=", ""),
                    binary:boolean = (charset.includes("binary") === true || charset.includes("octet") === true);
                service.failures[0] = charset;
                if (data_file.length > 1) {
                    service.mime = data_file[0];
                }
                if (accepted.includes(category) === true || binary === false) {
                    node.fs.readFile(data.address, function services_fileSystem_fileCallback_read(erf:node_error, fileData:Buffer):void {
                        if (erf === null) {
                            const decoder:node_stringDecoder_StringDecoder = new node.stringDecoder.StringDecoder("utf8");
                            service.file = (binary === true)
                                ? fileData.toString()
                                : decoder.write(fileData);
                        } else {
                            service.file = erf.message;
                            service.failures.push(erf.code);
                        }
                        complete();
                    });
                } else {
                    service.file = "File appears to be binary.";
                    complete();
                }
            }
        },
        readCallback = function services_fileSystem_readCallback(err:node_error, fileContents:Buffer):void {
            if (err === null) {
                const detect:string_detect[] = detectAll(fileContents),
                    decoder:node_stringDecoder_StringDecoder = new node.stringDecoder.StringDecoder("utf8");
                detect.sort(function services_fileSystem_readCallback_sort(a:string_detect, b:string_detect):-1|1 {
                    if (a.confidence > b.confidence) {
                        return -1;
                    }
                    return 1;
                });
                if (detect[0].confidence > 0.6) {
                    service.file = decoder.write(fileContents);
                    service.failures[0] = detect[0].encoding;
                    complete();
                    return;
                }
                service.failures[0] = "binary";
                service.file = "Text encoding cannot be determined with confidence. File is most likely binary.";
                complete();
                return;
            }
            service.failures[0] = "unknown";
            service.file = `Error, ${err.code}, reading file at ${data.address}. ${err.message}`;
            complete();
        },
        config_parent:config_directory = {
            callback: dirCallback,
            depth: (data.search === null)
                ? 2
                : 0,
            exclusions: [],
            parent: true,
            path: data.address,
            relative: (data.search === null),
            search: (data.search === null)
                ? ""
                : data.search,
            symbolic: true
        };
    if (data.search === null) {
        directory(config_parent);
    } else {
        dirCallback(null);
    }
};

export default fileSystem;