

const test_listProxyLegacy = function test_listProxyLegacy():test_list_proxy {
    const list_proxy_legacy:test_list_proxy = [
        {
            name: "Redirect to project lib/dashboard/styles.css, no trailing slash",
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
                    property: "response_headers",
                    qualifier: "contains",
                    value: "HTTP/1.1 200"
                },
                {
                    property: "response_body_raw",
                    qualifier: "greater",
                    value: 250000
                },
                {
                    property: "response_body_raw",
                    qualifier: "contains",
                    value: ".highlight{outline:var(--fail_bright) solid 0.1em;overflow:visible;z-index:20}"
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
                    property: "response_headers",
                    qualifier: "contains",
                    value: "HTTP/1.1 200"
                },
                {
                    property: "response_body_raw",
                    qualifier: "greater",
                    value: 250000
                },
                {
                    property: "response_body_raw",
                    qualifier: "contains",
                    value: ".highlight{outline:var(--fail_bright) solid 0.1em;overflow:visible;z-index:20}"
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
                resource: "/redirect_wild_1/styles.css",
                timeout: 1000
            },
            unit: [
                {
                    property: "response_headers",
                    qualifier: "contains",
                    value: "HTTP/1.1 200"
                },
                {
                    property: "response_body_raw",
                    qualifier: "greater",
                    value: 250000
                },
                {
                    property: "response_body_raw",
                    qualifier: "contains",
                    value: ".highlight{outline:var(--fail_bright) solid 0.1em;overflow:visible;z-index:20}"
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
                resource: "/redirect_wild_2/styles.css",
                timeout: 1000
            },
            unit: [
                {
                    property: "response_headers",
                    qualifier: "contains",
                    value: "HTTP/1.1 200"
                },
                {
                    property: "response_body_raw",
                    qualifier: "greater",
                    value: 250000
                },
                {
                    property: "response_body_raw",
                    qualifier: "contains",
                    value: ".highlight{outline:var(--fail_bright) solid 0.1em;overflow:visible;z-index:20}"
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
                resource: "/redirect_wild_3/styles.css",
                timeout: 1000
            },
            unit: [
                {
                    property: "response_headers",
                    qualifier: "contains",
                    value: "HTTP/1.1 404 NOT FOUND"
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
                    property: "response_headers",
                    qualifier: "contains",
                    value: "HTTP/1.1 200"
                },
                {
                    property: "response_body_raw",
                    qualifier: "greater",
                    value: 250000
                },
                {
                    property: "response_body_raw",
                    qualifier: "contains",
                    value: ".highlight{outline:var(--fail_bright) solid 0.1em;overflow:visible;z-index:20}"
                }
            ]
        }
    ];
    list_proxy_legacy.name = "proxy legacy";
    list_proxy_legacy.type = "proxy";
    return list_proxy_legacy;
};

export default test_listProxyLegacy;