
import list_local_proxy from "./list_local_proxy.ts";
import server_create from "../server/server_create.ts";

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
        create_callback = function test_indexProxy_serverCreate():void {
            server_count = server_count + 1;
            if (server_count > 1) {
                console.log("2 servers");
            }
        };
    let server_count:number = 0;
    server_create({
        action: "add",
        server: server_config_1
    }, create_callback, false);
    server_create({
        action: "add",
        server: server_config_2
    }, create_callback, false);
};

export default index_proxy;