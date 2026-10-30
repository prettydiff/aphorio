

const test_listLocalBrowserTestWebSocket = function test_listLocalBrowserTestWebSocket():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["id", "test-websocket", null],
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
                        ["tag", "button", 1]
                    ]
                }
            ],
            name: "Navigate to websocket test",
            unit: [
                {
                    node: [
                        ["id", "websocket-status", null],
                        ["tag", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Offline"
                },
                {
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "form", 0],
                        ["tag", "textarea", 1]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: "Disconnected."
                },
                {
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "form", 2],
                        ["class", "frame_validate", 0],
                        ["tag", "em", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Warning: Frame fin flag is set to false."
                }
            ]
        },
        {
            delay: {
                node: [
                    ["id", "websocket-status", null],
                    ["tag", "strong", 0]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "Online (Encrypted)"
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "form", 0],
                        ["tag", "button", 0]
                    ]
                }
            ],
            name: "Open encrypted websocket",
            unit: [
                {
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "form", 0],
                        ["tag", "textarea", 1]
                    ],
                    qualifier: "begins",
                    target: ["value"],
                    type: "property",
                    value: "Connected in "
                }
            ]
        },
        {
            delay: {
                node: [
                    ["id", "test-websocket", null],
                    ["class", "http_response", 1],
                    ["tag", "textarea", 3]
                ],
                qualifier: "is",
                target: ["value"],
                type: "property",
                value: `Response message.

test secure socket`
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "http_response", 1],
                        ["tag", "textarea", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "http_response", 1],
                        ["tag", "textarea", 0]
                    ],
                    value: `{
    "extended": 0,
    "fin": true,
    "len": 0,
    "mask": false,
    "maskKey": "",
    "opcode": 1,
    "rsv1": false,
    "rsv2": false,
    "rsv3": false,
    "startByte": 0,
}`
                },
                {
                    event: "click",
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "http_response", 1],
                        ["tag", "textarea", 1]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "http_response", 1],
                        ["tag", "textarea", 1]
                    ],
                    value: "test secure socket"
                },
                {
                    event: "keydown",
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "http_response", 1],
                        ["tag", "textarea", 1]
                    ],
                    value: "shift"
                },
                {
                    event: "keyup",
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "http_response", 1],
                        ["tag", "textarea", 1]
                    ],
                    value: "shift"
                },
                {
                    event: "click",
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "http_response", 1],
                        ["tag", "button", 0]
                    ]
                },
                {
                    event: "wait",
                    node: [],
                    value: "10"
                }
            ],
            name: "Send encrypted message",
            unit: [
                {
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "http_response", 1],
                        ["tag", "textarea", 2]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: `{
    "extended": 37,
    "fin": true,
    "len": 37,
    "mask": false,
    "maskKey": null,
    "opcode": 1,
    "rsv1": false,
    "rsv2": false,
    "rsv3": false,
    "size_buffer": 39,
    "size_fragment": 39,
    "startByte": 2
}`
                },
                {
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "form", 2],
                        ["class", "frame_validate", 0]
                    ],
                    qualifier: "is",
                    target: ["style", "display"],
                    type: "property",
                    value: "none"
                }
            ]
        },
        {
            delay: {
                node: [
                    ["id", "websocket-status", null],
                    ["tag", "strong", 0]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "Offline"
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "form", 0],
                        ["tag", "button", 0]
                    ]
                }
            ],
            name: "Close encrypted websocket",
            unit: [
                {
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "form", 0],
                        ["tag", "textarea", 1]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: "Disconnected."
                }
            ]
        },
        {
            delay: {
                node: [
                    ["id", "websocket-status", null],
                    ["tag", "strong", 0]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "Online (Insecure)"
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "form", 0],
                        ["tag", "input", 0]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "form", 0],
                        ["tag", "button", 0]
                    ]
                }
            ],
            name: "Open insecure websocket",
            unit: [
                {
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "http_response", 1],
                        ["tag", "textarea", 2]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: ""
                },
                {
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "http_response", 1],
                        ["tag", "textarea", 3]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: ""
                }
            ]
        },
        {
            delay: {
                node: [
                    ["id", "test-websocket", null],
                    ["class", "http_response", 1],
                    ["tag", "textarea", 3]
                ],
                qualifier: "is",
                target: ["value"],
                type: "property",
                value: `Response message.

test insecure socket`
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "http_response", 1],
                        ["tag", "textarea", 1]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "http_response", 1],
                        ["tag", "textarea", 1]
                    ],
                    value: "test insecure socket"
                },
                {
                    event: "keydown",
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "http_response", 1],
                        ["tag", "textarea", 1]
                    ],
                    value: "shift"
                },
                {
                    event: "keyup",
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "http_response", 1],
                        ["tag", "textarea", 1]
                    ],
                    value: "shift"
                },
                {
                    event: "click",
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "http_response", 1],
                        ["tag", "button", 0]
                    ]
                }
            ],
            name: "Send encrypted message",
            unit: [
                {
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "http_response", 1],
                        ["tag", "textarea", 2]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: `{
    "extended": 39,
    "fin": true,
    "len": 39,
    "mask": false,
    "maskKey": null,
    "opcode": 1,
    "rsv1": false,
    "rsv2": false,
    "rsv3": false,
    "size_buffer": 41,
    "size_fragment": 41,
    "startByte": 2
}`
                }
            ]
        },
        {
            delay: {
                node: [
                    ["id", "websocket-status", null],
                    ["tag", "strong", 0]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "Offline"
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "form", 0],
                        ["tag", "button", 0]
                    ]
                }
            ],
            name: "Close insecure websocket",
            unit: [
                {
                    node: [
                        ["id", "test-websocket", null],
                        ["class", "form", 0],
                        ["tag", "textarea", 1]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: "Disconnected."
                }
            ]
        }
    ];
    list.name = "Local browser tests - web socket";
    list.type = "dom";
    return list;
};

export default test_listLocalBrowserTestWebSocket;