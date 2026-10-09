
import list from "./list_proxy.ts";
import server_create from "../server/server_create.ts";
import test_runner from "./runner.ts";
import test_summary from "./summary.ts";
import vars from "../core/vars.ts";

const index_proxy = function test_indexProxy():void {
    const server_config_1:supplemental_server_config = {
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
            redirect_asset: {
                "localhost": {
                    "/lib/assets/dashboard/*": "/lib/dashboard/*"
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
        list_object:test_list_proxy = Object.assign(list, {
            id_1: "",
            id_2: "",
            name: "proxy",
            port_1_open: 0,
            port_2_open: 0,
            port_1_secure: 0,
            port_2_secure: 0,
            type: "proxy" as type_test_type
        }),
        test_server = function test_indexProxy_testServer():void {
            test_summary(list_object.name, true);
        },
        callback_server = function test_indexProxy_callbackServer(id:string):void {
            count_server = count_server + 1;
            if (vars.data.server[id].config.name === "server_1") {
                list_object.id_1 = id;
                list_object.port_1_open = vars.data.server[id].ports.open;
                list_object.port_1_secure = vars.data.server[id].ports.secure;
            } else {
                list_object.id_2 = id;
                list_object.port_2_open = vars.data.server[id].ports.open;
                list_object.port_2_secure = vars.data.server[id].ports.secure;
            }
            if (count_server > 1) {
                test_runner.list(list_object, test_server)
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