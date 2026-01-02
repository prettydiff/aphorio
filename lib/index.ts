
import log from "./core/log.ts";
import node from "./core/node.ts";
import screenshots from "./utilities/screenshots.ts";
import start_server from "./utilities/start_server.ts";
import vars from "./core/vars.ts";

vars.path.sep = node.path.sep;

{
    let process_path:string = "",
        index:number = process.argv.length,
        arg:string = null;

    if (vars.commands === undefined) {

        log.shell([`Operating system type ${process.platform} is not yet supported.`]);
        process.exit(1);
    }
    do {
        index = index - 1;
        if (process.argv[index].includes(`${vars.path.sep}node`) === true && vars.path.node === "") {
            vars.path.node = process.argv[index];
        } else if (process.argv[index].includes(`${vars.path.sep}lib${vars.path.sep}index.ts`) === true && vars.path.project === "") {
            process_path = process.argv[index].replace(`lib${vars.path.sep}index.ts`, "");
        } else {
            arg = process.argv[index].toLowerCase().replace(/^--/, "");
            if (vars.options[arg as "test"] !== undefined || vars.options[arg.slice(0, arg.indexOf(":")) as "test"] !== undefined) {
                if (arg.indexOf("browser") === 0 || arg.indexOf("list") === 0) {
                    vars.options.browser = process.argv[index].slice(process.argv[index].indexOf(":") + 1);
                } else {
                    vars.options[arg as "test"] = true;
                }
            }
        }
    } while (index > 0);

    vars.path.project = (vars.test.testing === true)
        ? `${process_path}test${vars.path.sep}`
        : process_path;
    vars.path.compose_empty = `${process_path}compose${vars.path.sep}empty.yml`;
    vars.path.compose = `${vars.path.project}compose${vars.path.sep}`;
    vars.path.servers = `${vars.path.project}servers${vars.path.sep}`;
    vars.commands.compose_empty = `${vars.commands.compose} -f ${vars.path.compose_empty}`;

    if (vars.options["no-color"] === true) {
        const keys:string[] = Object.keys(vars.text);
        index = keys.length;
        do {
            index = index - 1;
            vars.text[keys[index]] = "";
        } while (index > 0);
    }

    if (process.argv.includes("screenshot") === true || process.argv.includes("screenshots") === true) {
        screenshots();
    } else if (process.argv.includes("test") === true || process.argv.includes("--test") === true) {
        vars.test.testing = true;
        start_server(process_path, true);
    } else {
        start_server(process_path, false);
    }
}