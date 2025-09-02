
import directory from "../utilities/directory.ts";
import node from "../utilities/node.ts";
import send from "../transmit/send.ts";
import vars from "../utilities/vars.ts";

import { detectAll } from "jschardet";

// cspell: words jschardet

const fileSystem = function services_fileSystem(socket_data:socket_data, transmit:transmit_socket):void {
    let parent:type_directory_item = null,
        failures:string[] = [],
        file:string = null,
        list_local:directory_list = [];
    const data:services_fileSystem = socket_data.data as services_fileSystem,
        windows_root:RegExp = (/^\w:(\\)?$/),
        complete = function services_fileSystem_complete():void {
            const service:services_fileSystem = {
                address: data.address,
                dirs: list_local,
                failures: failures,
                file: file,
                parent: parent,
                search: data.search,
                sep: vars.sep
            };
            send({
                data: service,
                service: "dashboard-fileSystem"
            }, transmit.socket as websocket_client, 3);
        },
        dirCallback = function services_fileSystem_dirCallback(dir:directory_list|string[]):void {
            const list:directory_list = dir as directory_list,
                len:number = list.length - 1,
                self:type_directory_item = list[0];
            let index:number = 0;
            if (data.search === null) {
                list.splice(0, 1);
                if (len > 1) {
                    do {
                        if (list[index][3] === 0) {
                            list_local.push(list[index]);
                        }
                        index = index + 1;
                    } while (index < len);
                }
            } else {
                list_local = list;
            }
            list_local.sort(function services_fileSystem_dirCallback_sort(a:type_directory_item, b:type_directory_item):-1|0|1 {
                if (a[1] < b[1]) {
                    return -1;
                }
                if (a[1] > b[1]) {
                    return 1;
                }
                if (a[1] === b[1]) {
                    if (a[0] < b[0]) {
                        return -1;
                    }
                    if (a[0] > b[0]) {
                        return 1;
                    }
                }
                return 0;
            });
            if (data.search === null) {
                list_local.splice(0, 0, self);
            }
            failures = list.failures;
            complete();
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
                    file = decoder.write(fileContents);
                    failures[0] = detect[0].encoding;
                    complete();
                    return;
                }
                failures[0] = "binary";
                file = "Text encoding cannot be determined with confidence. File is most likely binary.";
                complete();
                return;
            }
            failures[0] = "unknown";
            file = `Error, ${err.code}, reading file at ${data.address}. ${err.message}`;
            complete();
        },
        parentCallback = function services_fileSystem_parentCallback(dir:directory_list|string[]):void {
            const list:directory_list = dir as directory_list,
                paths:string[] = data.address.split(vars.sep),
                config_dir:config_directory = {
                    callback: dirCallback,
                    depth: (data.search === null)
                        ? 2
                        : 0,
                    exclusions: [],
                    mode: (data.search === null)
                        ? "read"
                        : "search",
                    path: data.address,
                    relative: (data.search === null),
                    search: (data.search === null)
                        ? ""
                        : data.search,
                    symbolic: true
                };
            let index:number = (dir === null)
                    ? 0
                    : list.length,
                last_path:string = "";
            if (data.search === null && (data.address === "/" || data.address === "\\" || windows_root.test(data.address) === true)) {
                if (index > 0) {
                    parent = list[0];
                }
                dirCallback(list);
                return;
            }
            if (index > 0) {
                if (paths[paths.length - 1] === "") {
                    paths.pop();
                }
                last_path = paths[paths.length - 1];
                parent = list[0];
                do {
                    index = index - 1;
                    if (list[index][0] === last_path) {
                        if (list[index][1] === "directory") {
                            directory(config_dir);
                        } else {
                            list_local.push(list[index]);
                            node.fs.readFile(data.address, readCallback);
                        }
                        return;
                    }
                } while (index > 0);
            } else {
                directory(config_dir);
            }
        },
        parent_path:string = (function services_fileSystem_parentPath():string {
            if (data.address === "/" || data.address === "\\" || (windows_root.test(data.address) === true && vars.sep === "\\")) {
                return data.address;
            }
            const paths:string[] = data.address.split(vars.sep);
            // smb
            // if ((/^\\\\\[?(\w+\.?)+\]?/).test(config.path) === true && paths.length < 4) {
            //     return config.path;
            // }
            if (paths[paths.length - 1] === "" && paths.length > 2) {
                paths.pop();
            }
            paths.pop();
            if (paths[0] === "" && paths[1] === "" && paths.length === 2 && vars.sep === "/") {
                return "/";
            }
            return paths.join(vars.sep) + vars.sep;
        }()),
        config_parent:config_directory = {
            callback: parentCallback,
            depth: 2,
            exclusions: [],
            mode: "read",
            path: parent_path,
            relative: true,
            search: "",
            symbolic: true
        };
    if (data.search === null) {
        directory(config_parent);
    } else {
        parentCallback(null);
    }
};

export default fileSystem;