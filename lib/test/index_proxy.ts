
import server_create from "../server/server_create.ts";
import test_runner from "./runner.ts";
// import test_summary from "./summary.ts";
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
        list:test_list_proxy = Object.assign([
            {
                config: {
                    body: "test body",
                    encryption: false,
                    headers: [
                        "GET / HTTP/1.1",
                        "Host: host-value",
                        "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:156.0) Gecko/20100101 Firefox/156.0",
                        "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                        "Accept-Language: en-US,en;q=0.9",
                        "Accept-Encoding: gzip, deflate",
                        "Connection: keep-alive",
                        "Upgrade-Insecure-Requests: 1",
                        "Priority: u=0, i"
                    ].join("\r\n"),
                    stats: null,
                    timeout: 1000,
                    uri: ""
                },
                name: "",
                output: {
                    chunked: true,
                    error: null,
                    chunks: 1,
                    response_body_raw: "",
                    response_headers: "",
                    url: null
                }
            }
        ],
        {
            id_1: "",
            id_2: "",
            name: "proxy",
            port_1_open: 0,
            port_2_open: 0,
            port_1_secure: 0,
            port_2_secure: 0,
            type: "proxy" as type_test_type
        }),
        test_server = function test_indexProxy_testServer(id:string):void {
            //list[count_test].config.headers = list[count_test].config.headers.replace("Host: host-value", `Host: localhost:${vars.data.server[id].ports.open}`);
            //http_request(list[count_test].config, callback_test);
        },
        callback_server = function test_indexProxy_callbackServer(id:string):void {
            count_server = count_server + 1;
            if (vars.data.server[id].config.name === "server_1") {
                list.id_1 = id;
                list.port_1_open = vars.data.server[id].ports.open;
                list.port_1_secure = vars.data.server[id].ports.secure;
            } else {
                list.id_2 = id;
                list.port_2_open = vars.data.server[id].ports.open;
                list.port_2_secure = vars.data.server[id].ports.secure;
            }
            if (count_server > 1) {
                test_runner.list(list, test_server)
            }
        };
        // callback_test = function test_indexProxy_callbackTest(output:config_http_request_output):void {console.log(output);
        //     count_test = count_test + 1;
        //     if (count_test === len_list) {
        //         test_summary(list[count_test - 1].name, true);
        //     } else {
        //         test_summary(list[count_test - 1].name, false);
        //         test_server(id_1);
        //     }
        // };
    let count_server:number = 0;
    list.name = "proxy";
    list.type = "proxy";
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