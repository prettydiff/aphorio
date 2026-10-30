
import list_proxy from "./list_proxy.ts";
import list_proxy_legacy from "./list_proxy_legacy.ts";
import server_create from "../server/server_create.ts";
import test_runner from "./runner.ts";
import test_summary from "./summary.ts";
import vars from "../core/vars.ts";

const index_proxy = function test_indexProxy():void {
    let total_lists:number = 0,
        count_server:number = 0;
    const list_proxy_tests:test_list_proxy = list_proxy(),
        list:test_list_proxy[] = (vars.test.list === null)
            ? [
                list_proxy_legacy(),
                list_proxy_tests
            ]
            : [
                vars.test.list as test_item_proxy[]
            ],
        len_list:number = list.length,
        project_path:string = vars.path.project.replace(/test(\\|\/)$/, ""),
        servers:supplemental_server_config[] = [
            {
                activate: true,
                domain_local: [
                    "127.0.0.1",
                    "::1"
                ],
                encryption: "both",
                message_segmentation: 1e6,
                mutual_tls: false,
                name: "",
                ports: {
                    open: 0,
                    secure: 0
                },
                proxy: [
                    {
                        "description": "directory list of project lib directory",
                        incoming: {
                            resource: "/path/"
                        },
                        outgoing: {
                            resource: `${project_path}lib`
                        }
                    },
                    {
                        "description": "Redirect to google without scheme or slash",
                        incoming: {
                            resource: "/google_1/*"
                        },
                        outgoing: {
                            domain: "google.com",
                            resource: "/"
                        }
                    },
                    {
                        "description": "Redirect to google without slash",
                        incoming: {
                            resource: "/google_2/*"
                        },
                        outgoing: {
                            domain: "http://google.com",
                            resource: "/"
                        }
                    },
                    {
                        "description": "Redirect to google",
                        incoming: {
                            resource: "/google_3/*"
                        },
                        outgoing: {
                            domain: "http://google.com/",
                            resource: "/"
                        }
                    },
                    {
                        "description": "Redirect to encrypted google using scheme",
                        incoming: {
                            resource: "/google_4/*"
                        },
                        outgoing: {
                            domain: "https://google.com/",
                            resource: "/"
                        }
                    },
                    {
                        "description": "Redirect to encrypted google using rule",
                        incoming: {
                            resource: "/google_5/*"
                        },
                        outgoing: {
                            domain: "google.com/",
                            encryption: "secure",
                            resource: "/"
                        }
                    },
                    {
                        "description": "Redirect to encrypted yahoo",
                        incoming: {
                            domain: "localhost",
                            resource: "/google_6/*"
                        },
                        outgoing: {
                            domain: "yahoo.com/",
                            encryption: "secure",
                            resource: "/"
                        }
                    },
                    {
                        "description": "Redirect to encrypted google using multiple criteria",
                        incoming: {
                            domain: "localhost",
                            port: 0,
                            resource: "/google_6/*"
                        },
                        outgoing: {
                            domain: "google.com/",
                            encryption: "secure",
                            resource: "/"
                        }
                    },
                    {
                        "description": "Redirect to encrypted google from method POST to method GET",
                        incoming: {
                            method: "POST",
                            resource: "/google_7/*"
                        },
                        outgoing: {
                            domain: "google.com/",
                            encryption: "secure",
                            method: "GET",
                            resource: "/"
                        }
                    }
                ],
                redirect_asset: {
                    "localhost": {
                        "/redirect_asset_1/": `${project_path}lib/dashboard/styles.css`.replace(/(\/|\\)/g, vars.path.sep),
                        "/redirect_wild_1/*": `${project_path}lib/dashboard/`,
                        "/redirect_wild_2/*": `${project_path}lib/dashboard`,
                        "/redirect_wild_3/": `${project_path}lib/transmit/`
                    }
                },
                upgrade: true
            },
            {
                activate: true,
                domain_local: ["::1", "127.0.0.1"],
                encryption: "both",
                message_segmentation: 1e6,
                mutual_tls: false,
                name: "",
                ports: {
                    open: 0,
                    secure: 0
                },
                redirect_domain: {
                    "localhost": ["localhost", 0, "default"]
                },
                upgrade: true
            },
            {
                activate: true,
                domain_local: ["::1", "127.0.0.1"],
                encryption: "both",
                message_segmentation: 1e6,
                mutual_tls: false,
                name: "",
                ports: {
                    open: 0,
                    secure: 0
                },
                redirect_domain: {
                    "localhost.secure": ["localhost", 0, "default"]
                },
                upgrade: true
            }
        ],
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
            const index:number = Number(vars.data.server[id].config.name.split("_")[1]);
            count_server = count_server + 1;
            vars.test.servers[index] = {
                id: id,
                port_open: vars.data.server[id].ports.open,
                port_secure: vars.data.server[id].ports.secure
            };
            if (count_server === servers.length) {
                // server to server alignment here:
                vars.data.server[vars.test.servers[0].id].config.proxy[7].incoming.port = vars.data.server[vars.test.servers[0].id].ports.open;
                vars.data.server[vars.test.servers[1].id].config.redirect_domain["localhost"][1] = vars.data.server[vars.test.servers[0].id].ports.open;
                vars.data.server[vars.test.servers[2].id].config.redirect_domain["localhost.secure"][1] = vars.data.server[vars.test.servers[0].id].ports.secure;
                list_proxy_tests[1].unit[1].value = (list_proxy_tests[1].unit[1].value as string).replace("port_open", vars.test.servers[0].port_open.toString());

                // start testing here
                test_runner.list(list[total_lists], test_server);
            }
        };
    vars.test.total_time_start = process.hrtime.bigint();
    servers.forEach(function test_indexProxy_serversEach(value:supplemental_server_config, index:number):void {
        value.name = `server_${index}`;
        server_create({
            action: "add",
            server: value
        }, callback_server, false);
    });
};

export default index_proxy;