
const list:test_item_proxy[] = [
    {
        name: "Expecting a 404, no page in assets directory of test server",
        request: {
            body: "test body",
            encryption: false,
            host: "localhost",
            method: "GET",
            port: "server_1",
            resource: "/",
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
        name: "Redirect asset from /dashboard to the actual dashboard html file",
        request: {
            body: "test body",
            encryption: false,
            host: "localhost",
            method: "GET",
            port: "server_1",
            resource: "/dashboard",
            timeout: 1000
        },
        unit: [
            {
                property: "response_body_raw",
                qualifier: "contains",
                value: " Dashboard"
            },
            {
                property: "response_body_raw",
                qualifier: "greater",
                value: 1e5
            }
        ]
    },
    {
        name: "Redirect asset from /google to google.com",
        request: {
            body: "test body",
            encryption: false,
            host: "localhost",
            method: "GET",
            port: "server_1",
            resource: "/google",
            timeout: 1000
        },
        unit: [
            {
                property: "response_body_raw",
                qualifier: "contains",
                value: " Dashboard"
            },
            {
                property: "response_body_raw",
                qualifier: "greater",
                value: 1e5
            }
        ]
    },
    {
        name: "Redirect request for blog.localhost to /blog",
        request: {
            body: "test body",
            encryption: false,
            host: "blog.localhost",
            method: "GET",
            port: "server_1",
            resource: "/",
            timeout: 1000
        },
        unit: [
            {
                property: "response_body_raw",
                qualifier: "contains",
                value: " Dashboard"
            },
            {
                property: "response_body_raw",
                qualifier: "greater",
                value: 1e5
            }
        ]
    }
];

export default list;