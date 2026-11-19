
import file from "../utilities/file.ts";
import http_connect from "./http_connect.ts";
import http_get from "./http_get.ts";
import http_options from "./http_options.ts";
import http_redirect from "./http_redirect.ts";
import http_trace from "./http_trace.ts";
import vars from "../core/vars.ts";

const http = function http(config:config_http, socket:websocket_client):void {
    const methods:supplemental_http = {
        connect: http_connect,
        get: http_get,
        head: http_get,
        options: http_options,
        trace: http_trace
    },
    server:supplemental_server_config = vars.data.server[socket.server_hash].config,
    path_incoming:string = config.resource.replace(/^(\\|\/)/, "").replace(/(\\|\/)$/, "").replace(/\\|\//g, vars.path.sep),
    path_asset:string = `${vars.path.project}servers${vars.path.sep + server.id + vars.path.sep}assets`,
    path_resource:string = path_asset + vars.path.sep + path_incoming,
    stat_callback = function http_resourceStat_statCallback(stats:node_fs_BigIntStats, location:string):void {
        if (stats !== null) {
            config.resource_absolute = location;
            if (stats.isFile() === true) {
                config.resource_size = Number(stats.size);
                config.resource_type = "file";
            } else if (stats.isDirectory() === true) {
                config.resource_type = "directory";
            }
        }
        if (config.resource_type !== "file" && config.resource.charAt(config.resource.length - 1) !== "/") {
            config.resource = `${config.resource}/`;
            http_redirect(config, (socket.addresses.local.port === vars.data.server[socket.server_hash].ports.open) ? "http" : "https", socket);
        } else {
            methods[config.method as type_http_method_function](config, socket);
        }
    };
    if (methods[config.method as type_http_method_function] === undefined) {
        socket.destroy();
    } else {
        file.stat({
            // fs absolute
            callback: stat_callback,
            location: path_resource,
            no_file: null,
            section: "servers-web"
        });
    }
};

export default http;