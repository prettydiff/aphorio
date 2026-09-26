
import file from "../utilities/file.ts";
import node from "../core/node.ts";
import vars from "../core/vars.ts";

const certificates = function start_certificates(complete_tasks:(task:type_start_primary_tasks) => void, process_path:string):core_start_task {
    return {
        label: "Read all default client certificates for available web servers.",
        task: function start_certificates_task():void {
            node.fs.readdir(`${process_path}servers`, function start_certificates_task_readdir(err:node_error, dir:string[]):void {
                if (err === null) {
                    let index:number = dir.length;
                    if (index > 0) {
                        const read_cert = function start_certificates_task_readdir_readCert(path:string):void {
                                let count:number = 0;
                                const callback = function start_certificates_task_readdir_readCert_callback(file:Buffer, location:string, identifier:string):void {
                                    count = count + 1;
                                    if (file !== null) {
                                        if (identifier === "crt") {
                                            vars.data.server[dir[index]].certificates_client.crt = file.toString("utf-8");
                                        } else {
                                            vars.data.server[dir[index]].certificates_client.pfx = file.toString("base64");
                                        }
                                    }
                                    if (count > 1) {
                                        add_cert();
                                    }
                                };
                                file.read({
                                    callback: callback,
                                    identifier: "pfx",
                                    location: path,
                                    no_file: null,
                                    section: "startup"
                                });
                                file.read({
                                    callback: callback,
                                    identifier: "crt",
                                    location: path.replace(/\.pfx$/, ".crt"),
                                    no_file: null,
                                    section: "startup"
                                });
                            },
                            add_cert = function start_certificates_task_readdir_addCert():void {
                                index = index - 1;
                                if (index > -1) {
                                    if (vars.data.server[dir[index]] === undefined) {
                                        start_certificates_task_readdir_addCert();
                                    } else {
                                        vars.data.server[dir[index]].certificates_client = {
                                            crt: null,
                                            pfx: null
                                        };
                                        node.fs.readdir(`${process_path}servers${vars.path.sep + dir[index] + vars.path.sep}certs`, function start_certificates_task_readdir_addCert_files(erf:node_error, certs:string[]):void {
                                            if (erf === null) {
                                                let index_certs:number = certs.length,
                                                    test:boolean = false;
                                                if (index_certs > 0) {
                                                    do {
                                                        index_certs = index_certs - 1;
                                                        if (certs[index_certs].slice(certs[index_certs].length - 4) === ".pfx") {
                                                            read_cert(`${process_path}servers${vars.path.sep + dir[index] + vars.path.sep}certs${vars.path.sep + certs[index_certs]}`);
                                                            test = true;
                                                            break;
                                                        }
                                                    } while (index_certs > 0);
                                                    if (test === false) {
                                                        start_certificates_task_readdir_addCert(); 
                                                    }
                                                } else {
                                                    start_certificates_task_readdir_addCert();
                                                }
                                            } else {
                                                start_certificates_task_readdir_addCert();
                                            }
                                        });
                                    }
                                } else {
                                    complete_tasks("certificates");
                                }
                            };
                        add_cert();
                    } else {
                        complete_tasks("certificates");
                    }
                } else {
                    complete_tasks("certificates");
                }
            });
        }
    };
};

export default certificates;