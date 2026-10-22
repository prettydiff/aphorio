
import list_proxy from "./list_proxy.ts";
import list_proxy_legacy from "./list_proxy_legacy.ts";
import server_create from "../server/server_create.ts";
import test_runner from "./runner.ts";
import test_summary from "./summary.ts";
import vars from "../core/vars.ts";

const index_proxy = function test_indexProxy():void {
    let total_lists:number = 0;
    const list:test_list_proxy[] = (vars.test.list === null)
            ? [
                list_proxy(),
                list_proxy_legacy()
            ]
            : [
                vars.test.list as test_item_proxy[]
            ],
        len_list:number = list.length,
        server_config_1:supplemental_server_config = {
            activate: true,
            domain_local: [
                "127.0.0.1",
                "::1"
            ],
            encryption: "both",
            message_segmentation: 1e6,
            mutual_tls: false,
            name: "server_1",
            ports: {
                open: 0,
                secure: 0
            },
            proxy: [
                {
                    "description": "",
                    incoming: {
                        resource: "/"
                    },
                    outgoing: {
                        resource: "/lib"
                    }
                }
            ],
            redirect_asset: {
                "localhost": {
                    "/*": "/lib/dashboard/*"
                }
            },
            upgrade: true
        },
        server_config_2:supplemental_server_config = {
            activate: true,
            domain_local: ["::1", "127.0.0.1"],
            encryption: "both",
            message_segmentation: 1e6,
            mutual_tls: false,
            name: "server_2",
            ports: {
                open: 0,
                secure: 0
            },
            upgrade: true
        },
        test_server = function test_indexProxy_testServer(name:string):void {
            total_lists = total_lists + 1;
            if (total_lists === len_list || (vars.options["stop-on-fail"] === true && vars.test.counts[name].assertions_fail > 0)) {
                test_summary(name, true);
            } else {
                test_summary(name, false);
                test_runner.list(list[total_lists], test_indexProxy_testServer);
            }
        },
        callback_server = function test_indexProxy_callbackServer(id:string):void {
            count_server = count_server + 1;
            if (vars.data.server[id].config.name === "server_1") {
                vars.test.servers[0] = {
                    id: id,
                    port_open: vars.data.server[id].ports.open,
                    port_secure: vars.data.server[id].ports.secure
                };
            } else {
                vars.test.servers[1] = {
                    id: id,
                    port_open: vars.data.server[id].ports.open,
                    port_secure: vars.data.server[id].ports.secure
                };
            }
            if (count_server > 1) {
                test_runner.list(list[total_lists], test_server);
            }
        };
    let count_server:number = 0;
    vars.test.total_time_start = process.hrtime.bigint();
    server_create({
        action: "add",
        server: server_config_1
    }, callback_server, false);
    server_create({
        action: "add",
        server: server_config_2
    }, callback_server, false);
};

export default index_proxy;