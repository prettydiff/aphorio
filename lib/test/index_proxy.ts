
import list_local_proxy from "./list_local_proxy.ts";
import server_start from "../server/server_start.ts";

const index_proxy = function test_indexProxy():void {
    const server_config_1:supplemental_server_config = {
        activate: true,
        domain_local: ["::1", "127.0.0.1"],
        encryption: "both",
        id: "server_1",
        message_segmentation: 1e6,
        mutual_tls: false,
        name: "server_!",
        ports: {
            open: 0,
            secure: 0
        },
        upgrade: true
    };
};

export default index_proxy;