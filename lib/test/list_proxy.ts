

const test_listProxy = function test_listProxy():test_list_proxy {
    const list_proxy:test_list_proxy = [
        {
            name: "Expecting a 404, no page in assets directory of test server",
            request: {
                body: "test body",
                encryption: false,
                host: "localhost",
                method: "GET",
                port: "server_0",
                resource: "/no_file_here.txt",
                timeout: 1000
            },
            unit: [
                {
                    property: "response_headers",
                    qualifier: "contains",
                    value: "404 NOT FOUND"
                },
                {
                    property: "response_body_raw",
                    qualifier: "lesser",
                    value: 2000
                }
            ]
        },
        {
            name: "Request directory list of root",
            request: {
                body: "test body",
                encryption: false,
                host: "localhost",
                method: "GET",
                port: "server_0",
                resource: "/path/",
                timeout: 1000
            },
            unit: [
                {
                    property: "response_body_raw",
                    qualifier: "contains",
                    value: "<h2>Directory List - /path</h2>"
                },
                {
                    property: "response_body_raw",
                    qualifier: "contains",
                    value: "<td class=\"file-name\"><span class=\"icon\">📁</span> <a href=\"http://localhost:port_open/path/browser\">browser</a></td><td>directory</td>"
                },
                {
                    property: "response_body_raw",
                    qualifier: "greater",
                    value: 20000
                }
            ]
        },
        {
            name: "Redirect asset from /google_1 to google.com without the scheme or slash",
            request: {
                body: "test body",
                encryption: false,
                host: "localhost",
                method: "GET",
                port: "server_0",
                resource: "/google_1",
                timeout: 1000
            },
            unit: [
                {
                    property: "response_body_raw",
                    qualifier: "contains",
                    value: "<TITLE>301 Moved</TITLE></HEAD><BODY>"
                },
                {
                    property: "response_body_raw",
                    qualifier: "lesser",
                    value: 1e3
                }
            ]
        },
        {
            name: "Redirect asset from /google_2 to google.com without slash",
            request: {
                body: "test body",
                encryption: false,
                host: "localhost",
                method: "GET",
                port: "server_0",
                resource: "/google_2",
                timeout: 1000
            },
            unit: [
                {
                    property: "response_body_raw",
                    qualifier: "contains",
                    value: "<TITLE>301 Moved</TITLE></HEAD><BODY>"
                },
                {
                    property: "response_body_raw",
                    qualifier: "lesser",
                    value: 1e3
                }
            ]
        },
        {
            name: "Redirect asset from /google_3 to google.com with scheme and slash",
            request: {
                body: "test body",
                encryption: false,
                host: "localhost",
                method: "GET",
                port: "server_0",
                resource: "/google_3",
                timeout: 1000
            },
            unit: [
                {
                    property: "response_body_raw",
                    qualifier: "contains",
                    value: "<TITLE>301 Moved</TITLE></HEAD><BODY>"
                },
                {
                    property: "response_body_raw",
                    qualifier: "lesser",
                    value: 1e3
                }
            ]
        },
        {
            name: "Redirect asset from /google_4 to google.com with scheme and slash and encryption from scheme",
            request: {
                body: "test body",
                encryption: false,
                host: "localhost",
                method: "GET",
                port: "server_0",
                resource: "/google_4",
                timeout: 1000
            },
            unit: [
                {
                    property: "response_body_raw",
                    qualifier: "contains",
                    value: "<TITLE>301 Moved</TITLE></HEAD><BODY>"
                },
                {
                    property: "response_body_raw",
                    qualifier: "lesser",
                    value: 1e3
                },
                {
                    property: "encrypted_proxy",
                    qualifier: "is",
                    value: true
                },
                {
                    property: "encrypted_self",
                    qualifier: "is",
                    value: false
                }
            ]
        },
        {
            name: "Redirect asset from /google_4 to google.com with scheme and slash and encryption from rule",
            request: {
                body: "test body",
                encryption: false,
                host: "localhost",
                method: "GET",
                port: "server_0",
                resource: "/google_5",
                timeout: 1000
            },
            unit: [
                {
                    property: "response_body_raw",
                    qualifier: "contains",
                    value: "<TITLE>301 Moved</TITLE></HEAD><BODY>"
                },
                {
                    property: "response_body_raw",
                    qualifier: "lesser",
                    value: 1e3
                },
                {
                    property: "encrypted_proxy",
                    qualifier: "is",
                    value: true
                },
                {
                    property: "encrypted_self",
                    qualifier: "is",
                    value: false
                }
            ]
        },
        {
            name: "Redirect asset from /google_6 to google.com using rules sorted by priority",
            request: {
                body: "test body",
                encryption: false,
                host: "localhost",
                method: "GET",
                port: "server_0",
                resource: "/google_6",
                timeout: 1000
            },
            unit: [
                {
                    property: "response_body_raw",
                    qualifier: "contains",
                    value: "<TITLE>301 Moved</TITLE></HEAD><BODY>"
                },
                {
                    property: "response_body_raw",
                    qualifier: "lesser",
                    value: 1e3
                },
                {
                    property: "encrypted_proxy",
                    qualifier: "is",
                    value: true
                },
                {
                    property: "encrypted_self",
                    qualifier: "is",
                    value: false
                }
            ]
        }
    ];
    list_proxy.name = "proxy object";
    list_proxy.type = "proxy";
    return list_proxy;
};

export default test_listProxy;