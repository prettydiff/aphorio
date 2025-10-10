
import os_service from "./utilities/os_service.ts";
import start_server from "./utilities/start_server.ts";
import vars from "./utilities/vars.ts";

const process_path:string = process.argv[1].slice(0, process.argv[1].indexOf(`${vars.path.sep}lib${vars.path.sep}`)) + vars.path.sep;

vars.path.project = (vars.test.testing === true)
    ? `${process_path}test${vars.path.sep}`
    : process_path;
vars.path.compose_empty = `${process_path}compose${vars.path.sep}empty.yml`;
vars.path.compose = `${vars.path.project}compose${vars.path.sep}`;
vars.path.servers = `${vars.path.project}servers${vars.path.sep}`;

if (process.argv.includes("service-create")) {
    os_service.create(`${process.argv[0]} ${vars.path.project}lib${vars.path.sep}index.ts`, vars.name);
} else if (process.argv.includes("test")) {
    vars.test.testing = true;
    start_server(process_path, true);
} else {
    start_server(process_path, false);
}