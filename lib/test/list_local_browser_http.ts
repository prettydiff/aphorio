

const test_listLocalBrowserHTTP = function test_listLocalBrowserHTTP():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["id", "test-http", null],
                    ["tag", "h2", 0]
                ],
                qualifier: "greater",
                target: ["offsetTop"],
                type: "property",
                value: 10
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["tag", "nav", 0],
                        ["tag", "div", 5],
                        ["tag", "button", 0]
                    ]
                }
            ],
            name: "Navigate to http test",
            unit: [
                {
                    node: [
                        ["id", "test-http", 0],
                        ["class", "summary-stats", 0],
                        ["tag", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "0 seconds"
                }
            ]
        },
        {
            delay: {
                node: [
                    ["id", "test-http", 0],
                    ["class", "form", 1],
                    ["tag", "textarea", 0]
                ],
                qualifier: "begins",
                target: ["value"],
                type: "property",
                value: `{
    "absolute": "http`
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "test-http", 0],
                        ["class", "form", 0],
                        ["tag", "input", 0]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["id", "test-http", 0],
                        ["class", "form", 0],
                        ["tag", "button", 0]
                    ]
                }
            ],
            name: "Send HTTP request",
            unit: [
                {
                    node: [
                        ["id", "test-http", 0],
                        ["class", "form", 1],
                        ["tag", "textarea", 1]
                    ],
                    qualifier: "begins",
                    target: ["value"],
                    type: "property",
                    value: "HTTP/1.1 200\ncontent-type: text/html\ncontent-length: "
                },
                {
                    node: [
                        ["id", "test-http", 0],
                        ["class", "form", 1],
                        ["tag", "textarea", 2]
                    ],
                    qualifier: "begins",
                    target: ["value"],
                    type: "property",
                    value: "\n<!doctype html>\n<html lang=\"en\">"
                },
                {
                    node: [
                        ["id", "test-http", 0],
                        ["class", "summary-stats", 0],
                        ["tag", "strong", 0]
                    ],
                    qualifier: "not",
                    target: ["textContent"],
                    type: "property",
                    value: "0 seconds"
                }
            ]
        }
    ];
    list.name = "Local browser tests - http";
    list.type = "dom";
    return list;
};

export default test_listLocalBrowserHTTP;