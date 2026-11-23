

const test_listProxyLegacy = function test_listProxyLegacy():test_list_proxy {
    const list_proxy_legacy:test_list_proxy = [
        {
            name: "Redirect to lib/dashboard/styles.css, no trailing slash",
            request: {
                body: "test body",
                encryption: false,
                host: "localhost",
                method: "GET",
                port: "server_0",
                resource: "/redirect_asset_1",
                timeout: 1000
            },
            unit: [
                {
                    property: "headers",
                    qualifier: "contains",
                    value: "HTTP/1.1 200"
                },
                {
                    property: "body",
                    qualifier: "greater",
                    value: 250000
                },
                {
                    property: "body",
                    qualifier: "contains",
                    value: "display:block;height:5em;position:absolute;transform:translate3d(0, 0, 0);width:5em;z-index:10;"
                }
            ]
        },
        {
            name: "Redirect to project lib/dashboard/styles.css, with trailing slash",
            request: {
                body: "test body",
                encryption: false,
                host: "localhost",
                method: "GET",
                port: "server_0",
                resource: "/redirect_asset_1/",
                timeout: 1000
            },
            unit: [
                {
                    property: "headers",
                    qualifier: "contains",
                    value: "HTTP/1.1 200"
                },
                {
                    property: "body",
                    qualifier: "greater",
                    value: 250000
                },
                {
                    property: "body",
                    qualifier: "contains",
                    value: "display:block;height:5em;position:absolute;transform:translate3d(0, 0, 0);width:5em;z-index:10;"
                }
            ]
        },
        {
            name: "Redirect to project lib/dashboard/styles.css, using wildcard '/redirect_wild_1/*'",
            request: {
                body: "test body",
                encryption: false,
                host: "localhost",
                method: "GET",
                port: "server_0",
                resource: "/redirect_wild_1/style.css",
                timeout: 1000
            },
            unit: [
                {
                    property: "headers",
                    qualifier: "contains",
                    value: "HTTP/1.1 200"
                },
                {
                    property: "body",
                    qualifier: "greater",
                    value: 250000
                },
                {
                    property: "body",
                    qualifier: "contains",
                    value: "display:block;height:5em;position:absolute;transform:translate3d(0, 0, 0);width:5em;z-index:10;"
                }
            ]
        },
        {
            name: "Redirect to project lib/dashboard/styles.css, using wildcard '/redirect_wild_2/*', no terminating slash",
            request: {
                body: "test body",
                encryption: false,
                host: "localhost",
                method: "GET",
                port: "server_0",
                resource: "/redirect_wild_2/style.css",
                timeout: 1000
            },
            unit: [
                {
                    property: "headers",
                    qualifier: "contains",
                    value: "HTTP/1.1 200"
                },
                {
                    property: "body",
                    qualifier: "greater",
                    value: 250000
                },
                {
                    property: "body",
                    qualifier: "contains",
                    value: "display:block;height:5em;position:absolute;transform:translate3d(0, 0, 0);width:5em;z-index:10;"
                }
            ]
        },
        {
            name: "Requesting an asset with no corresponding redirect rule and not asset at the specified address",
            request: {
                body: "test body",
                encryption: false,
                host: "localhost",
                method: "GET",
                port: "server_0",
                resource: "/redirect_wild_4/style.css",
                timeout: 1000
            },
            unit: [
                {
                    property: "headers",
                    qualifier: "contains",
                    value: "HTTP/1.1 404 NOT FOUND"
                }
            ]
        },
        {
            name: "Resolve to a directory without an index.html file, with trailing slash",
            request: {
                body: "test body",
                encryption: false,
                host: "localhost",
                method: "GET",
                port: "server_0",
                resource: "/redirect_wild_3/",
                timeout: 1000
            },
            unit: [
                {
                    property: "headers",
                    qualifier: "contains",
                    value: "HTTP/1.1 200 OK"
                },
                {
                    property: "body",
                    qualifier: "contains",
                    value: "dom = function core_dom()"
                },
                {
                    property: "body",
                    qualifier: "contains",
                    value: "<h2>Directory List - /folder/</h2>"
                }
            ]
        },
        {
            name: "Resolve to a directory without an index.html file, without trailing slash",
            request: {
                body: "test body",
                encryption: false,
                host: "localhost",
                method: "GET",
                port: "server_0",
                resource: "/redirect_wild_3",
                timeout: 1000
            },
            unit: [
                {
                    property: "headers",
                    qualifier: "contains",
                    value: "HTTP/1.1 200 OK"
                },
                {
                    property: "body",
                    qualifier: "contains",
                    value: "dom = function core_dom()"
                },
                {
                    property: "body",
                    qualifier: "contains",
                    value: "<h2>Directory List - /folder/</h2>"
                }
            ]
        },
        {
            name: "Redirecting to a different server, by domain, on a path the other server redirects",
            request: {
                body: "test body",
                encryption: false,
                host: "localhost",
                method: "GET",
                port: "server_1",
                resource: "/redirect_asset_1/",
                timeout: 1000
            },
            unit: [
                {
                    property: "headers",
                    qualifier: "contains",
                    value: "HTTP/1.1 200"
                },
                {
                    property: "body",
                    qualifier: "greater",
                    value: 250000
                },
                {
                    property: "body",
                    qualifier: "contains",
                    value: "display:block;height:5em;position:absolute;transform:translate3d(0, 0, 0);width:5em;z-index:10;"
                },
                {
                    property: "encrypted_proxy",
                    qualifier: "is",
                    value: false
                }
            ]
        },
        {
            name: "Redirecting to a different server using a .secure domain",
            request: {
                body: "test body",
                encryption: false,
                host: "localhost",
                method: "GET",
                port: "server_2",
                resource: "/redirect_asset_1/",
                timeout: 1000
            },
            unit: [
                {
                    property: "headers",
                    qualifier: "contains",
                    value: "HTTP/1.1 200"
                },
                {
                    property: "body",
                    qualifier: "greater",
                    value: 250000
                },
                {
                    property: "body",
                    qualifier: "contains",
                    value: "display:block;height:5em;position:absolute;transform:translate3d(0, 0, 0);width:5em;z-index:10;"
                },
                {
                    property: "encrypted_proxy",
                    qualifier: "is",
                    value: true
                }
            ]
        }
    ];
    list_proxy_legacy.name = "proxy legacy";
    list_proxy_legacy.type = "proxy";
    return list_proxy_legacy;
};

export default test_listProxyLegacy;