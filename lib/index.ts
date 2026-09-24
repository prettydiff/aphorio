
import log from "./core/log.ts";
import node from "./core/node.ts";
import screenshots from "./utilities/screenshots.ts";
import start_application from "./utilities/start_application.ts";
import vars from "./core/vars.ts";

vars.path.sep = node.path.sep;

{
    let process_path:string = "",
        index:number = process.argv.length,
        colonIndex:number = null,
        arg:type_options = null,
        value:string = null;
    const assign = function index_assign(key:type_options, value:string):void {
        if (key === "mode" && (value === "certificate" || value === "demo" || value === "server" || value === "test")) {
            vars.options.mode = value;
        } else if (typeof vars.options[key] === "number") {
            const numb:number = Number(value);
            if (isNaN(numb) === false) {
                const int:number = Math.floor(numb);
                if (
                    ((key === "port-open" || key === "port-secure") && int > -1 && int < 65536) ||
                    (key !== "port-open" && key !== "port-secure")
                ) {
                    vars.options[key as "delay-intervals"] = int;
                }
            }
        } else if (typeof vars.options[key] === "string" && typeof value === "string") {
            vars.options[key as "list"] = value;
        } else if (typeof vars.options[key] === "boolean") {
            if (value === null || value === "true") {
                vars.options[key as "no-color"] = true;
            } else if (value === "false") {
                vars.options[key as "no-color"] = false;
            }
        }
    };
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
            colonIndex = process.argv[index].indexOf(":");
            arg = (colonIndex > 0)
                ? process.argv[index].slice(0, colonIndex).toLowerCase().replace(/^--/, "") as type_options
                : process.argv[index].toLowerCase().replace(/^--/, "") as type_options;
            value = (colonIndex > 0)
                ? process.argv[index].slice(colonIndex + 1)
                : null;
            if (vars.options[arg as type_options] !== undefined) {
                assign(arg, value);
            }
        }
    } while (index > 0);
    if (vars.options.mode === "test") {
        vars.test.testing = true;
    }

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
    } else {
        start_application(process_path);
    }
}