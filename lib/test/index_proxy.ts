
import file from "../utilities/file.ts";
import list_proxy from "./list_proxy.ts";
import list_proxy_legacy from "./list_proxy_legacy.ts";
import server_create from "../server/server_create.ts";
import server_start from "../server/server_start.ts";
import test_remove from "./remove.ts";
import test_runner from "./runner.ts";
import test_summary from "./summary.ts";
import vars from "../core/vars.ts";

const index_proxy = function test_indexProxy(generate_servers:boolean):void {
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
        test_server = function test_indexProxy_testServer(name:string):void {
            total_lists = total_lists + 1;
            if (total_lists === len_list || (vars.options["stop-on-fail"] === true && vars.test.counts[name].assertions_fail > 0)) {
                test_summary(name, true);
            } else {
                test_summary(name, false);
                test_runner.list(list[total_lists], test_indexProxy_testServer);
            }
        },
        start = function test_indexProxy_start():void {
            // server to server alignment here:
            vars.environment.interfaces.push("test.localhost");
            vars.data.server[vars.test.servers[0].id].config.proxy[1].outgoing.port = vars.data.server[vars.test.servers[3].id].ports.open;
            vars.data.server[vars.test.servers[0].id].config.proxy[8].incoming.port = vars.data.server[vars.test.servers[0].id].ports.open;
            vars.data.server[vars.test.servers[0].id].config.proxy[10].outgoing.port = vars.data.server[vars.test.servers[3].id].ports.open;
            vars.data.server[vars.test.servers[1].id].config.redirect_domain["localhost"][1] = vars.data.server[vars.test.servers[0].id].ports.open;
            vars.data.server[vars.test.servers[2].id].config.redirect_domain["localhost.secure"][1] = vars.data.server[vars.test.servers[0].id].ports.secure;
            list_proxy_tests[1].unit[1].value = (list_proxy_tests[1].unit[1].value as string).replace("port_open", vars.test.servers[0].port_open.toString());

            // start testing here
            test_runner.list(list[total_lists], test_server);
        };
    vars.test.total_time_start = process.hrtime.bigint();
    if (generate_servers === true) {
        test_remove(vars.path.project, function test_indexProxy_generateServers():void {
            const servers:supplemental_server_config[] = [
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
                                "description": "directory list of server's directory named 'folder'",
                                incoming: {
                                    resource: "/path/"
                                },
                                outgoing: {
                                    resource: `/folder/`
                                }
                            },
                            {
                                "description": "redirect subdomain to different server",
                                incoming: {
                                    domain: "test.localhost",
                                    resource: "/*"
                                },
                                outgoing: {
                                    port: 0,
                                    resource: "/"
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
                                    method: "post",
                                    resource: "/google_7/*"
                                },
                                outgoing: {
                                    domain: "google.com/",
                                    encryption: "secure",
                                    method: "get",
                                    resource: "/"
                                }
                            },
                            {
                                "description": "Redirect folder to different server",
                                incoming: {
                                    resource: "/folder_1/*"
                                },
                                outgoing: {
                                    port: 0,
                                    resource: "/"
                                }
                            }
                        ],
                        redirect_asset: {
                            "localhost": {
                                "/redirect_asset_1/": "/style.css",
                                "/redirect_asset_2/": "style.css",
                                "/redirect_wild_1/*": "/folder/",
                                "/redirect_wild_2/*": "/folder",
                                "/redirect_wild_3/": "/folder/"
                            }
                        },
                        upgrade: false
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
                        upgrade: false
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
                        upgrade: false
                    },
                    {
                        activate: true,
                        domain_local: ["::1", "127.0.0.1", "localhost", "test.localhost"],
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
                                description: "subdomain test",
                                incoming: {
                                    domain: "test.localhost",
                                    resource: "/lib/*"
                                },
                                outgoing: {
                                    resource: "/style.css"
                                }
                            }
                        ],
                        upgrade: false
                    }
                ],
                callback_server = function test_indexProxy_callbackServer(id:string):void {
                    const index:number = Number(vars.data.server[id].config.name.split("_")[1]);
                    count_server = count_server + 1;
                    vars.test.servers[index] = {
                        id: id,
                        port_open: vars.data.server[id].ports.open,
                        port_secure: vars.data.server[id].ports.secure
                    };
                    if (count_server === servers.length) {
                        file.write({
                            callback: start,
                            contents: JSON.stringify(servers),
                            location: `${vars.path.project}servers${vars.path.sep + vars.test.servers[3].id + vars.path.sep}assets${vars.path.sep}servers.json`,
                            section: "test-automation"
                        });
                    }
                };
            servers.forEach(function test_indexProxy_serversEach(value:supplemental_server_config, index:number):void {
                value.name = `server_${index}`;
                server_create({
                    action: "add",
                    server: value
                }, callback_server, false);
            });
        });
    } else {
        const keys:string[] = Object.keys(vars.data.server),
            key_len:number = keys.length,
            server_started = function test_indexProxy_serverStarted():void {
                vars.test.servers.push({
                    id: keys[index],
                    port_open: vars.data.server[keys[index]].ports.open,
                    port_secure: vars.data.server[keys[index]].ports.secure
                });
                index = index + 1;
                if (index === key_len) {
                    start();
                } else {
                    server_start(keys[index], server_started);
                }
            };
        let index:number = 0;
        keys.sort(function test_indexProxy_serversSort(a:string, b:string):-1|1 {
            if (vars.data.server[a].config.name < vars.data.server[b].config.name) {
                return -1;
            }
            return 1;
        });
        server_start(keys[index], server_started);
    }
};

export default index_proxy;