import vars from "../utilities/vars.ts";

var test_listLocalBrowserSockets:test_list = [
    
    {
        delay: {
            node: [
                ["getElementById", "sockets", null],
                ["getElementsByTagName", "h2", 0]
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
                    ["getElementsByTagName", "nav", 0],
                    ["getElementsByTagName", "button", 2]
                ]
            }
        ],
        name: "Navigate to sockets",
        type: "dom",
        unit: []
    },
    {
        delay: {
            node: [
                ["getElementById", "sockets", null],
                ["getElementsByTagName", "tbody", 0],
                ["getElementsByTagName", "tr", null]
            ],
            qualifier: "greater",
            store: true,
            target: ["length"],
            type: "property",
            value: 1
        },
        interaction: [
            {
                event: "click",
                node: [
                    ["getElementsByTagName", "nav", 0],
                    ["getElementsByTagName", "button", 2]
                ]
            }
        ],
        name: "Check if application socket table is populated",
        type: "dom",
        unit: [
            {
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", 0],
                    ["getElementsByTagName", "td", 0]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "dashboard"
            },
            {
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", 0],
                    ["getElementsByTagName", "td", 1]
                ],
                qualifier: "contains",
                target: ["textContent"],
                type: "property",
                value: "-"
            },
            {
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", 0],
                    ["getElementsByTagName", "td", 2]
                ],
                qualifier: "contains",
                target: ["textContent"],
                type: "property",
                value: "http"
            },
            {
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", 0],
                    ["getElementsByTagName", "td", 3]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "server"
            },
            {
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", 0],
                    ["getElementsByTagName", "td", 4]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: ""
            },
            {
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", 0],
                    ["getElementsByTagName", "td", 5]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "false"
            },
            {
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", 0],
                    ["getElementsByTagName", "td", 6]
                ],
                qualifier: "not",
                target: ["textContent"],
                type: "property",
                value: ""
            },
            {
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", 0],
                    ["getElementsByTagName", "td", 7]
                ],
                qualifier: "not",
                target: ["textContent"],
                type: "property",
                value: ""
            },
            {
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", 0],
                    ["getElementsByTagName", "td", 8]
                ],
                qualifier: "not",
                target: ["textContent"],
                type: "property",
                value: ""
            },
            {
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", 0],
                    ["getElementsByTagName", "td", 9]
                ],
                qualifier: "not",
                target: ["textContent"],
                type: "property",
                value: ""
            }
        ]
    },
    {
        delay: null,
        interaction: [
            {
                event: "click",
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByClassName", "table-filters", 0],
                    ["getElementsByTagName", "input", 0]
                ]
            },
            {
                event: "setValue",
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByClassName", "table-filters", 0],
                    ["getElementsByTagName", "input", 0]
                ],
                value: "http-"
            },
            {
                event: "keyup",
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByClassName", "table-filters", 0],
                    ["getElementsByTagName", "input", 0]
                ],
                value: "Enter"
            },
            {
                event: "wait",
                node: [],
                value: "50"
            }
        ],
        name: "Filter application sockets",
        type: "dom",
        unit: [
            {
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByClassName", "table-stats", 0],
                    ["getElementsByTagName", "em", 1]
                ],
                qualifier: "lesser",
                target: ["textContent"],
                type: "property",
                value: vars.test.magicString
            }
        ]
    },
    {
        delay: {
            node: [
                ["getElementById", "sockets", null],
                ["getElementsByTagName", "tbody", 1],
                ["getElementsByTagName", "tr", null]
            ],
            qualifier: "greater",
            store: true,
            target: ["length", "toString(10)"],
            type: "property",
            value: 5
        },
        interaction: [
            {
                event: "click",
                node: [
                    ["getElementsByTagName", "nav", 0],
                    ["getElementsByTagName", "button", 2]
                ]
            }
        ],
        name: "Check if os socket table is populated",
        type: "dom",
        unit: [
            {
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByTagName", "thead", 1],
                    ["getElementsByTagName", "th", 0]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "Type"
            },
            {
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByTagName", "thead", 1],
                    ["getElementsByTagName", "th", 1]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "Local Address"
            },
            {
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByTagName", "thead", 1],
                    ["getElementsByTagName", "th", 2]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "Local Port"
            },
            {
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByTagName", "thead", 1],
                    ["getElementsByTagName", "th", 3]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "Remote Address"
            },
            {
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByTagName", "thead", 1],
                    ["getElementsByTagName", "th", 4]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "Remote Port"
            },
            {
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByClassName", "table-stats", 1],
                    ["getElementsByTagName", "em", 0]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: vars.test.magicString
            }
        ]
    },
    {
        delay: null,
        interaction: [
            {
                event: "click",
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByClassName", "table-filters", 1],
                    ["getElementsByTagName", "input", 0]
                ]
            },
            {
                event: "setValue",
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByClassName", "table-filters", 1],
                    ["getElementsByTagName", "input", 0]
                ],
                value: "udp"
            },
            {
                event: "keyup",
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByClassName", "table-filters", 1],
                    ["getElementsByTagName", "input", 0]
                ],
                value: "Enter"
            },
            {
                event: "wait",
                node: [],
                value: "50"
            }
        ],
        name: "Filter os sockets",
        type: "dom",
        unit: [
                {
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByClassName", "table-stats", 1],
                    ["getElementsByTagName", "em", 1]
                ],
                qualifier: "lesser",
                target: ["textContent"],
                type: "property",
                value: vars.test.magicString
            },
            {
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByClassName", "table-stats", 1],
                    ["getElementsByTagName", "em", 2]
                ],
                qualifier: "not",
                store: true,
                target: ["textContent"],
                type: "property",
                value: ""
            },
        ]
    },
    {
        delay: {
            node: [
                ["getElementById", "sockets", null],
                ["getElementsByClassName", "table-stats", 1],
                ["getElementsByTagName", "em", 2]
            ],
            qualifier: "not",
            store: true,
            target: ["textContent"],
            type: "property",
            value: vars.test.magicString
        },
        interaction: [
            {
                event: "click",
                node: [
                    ["getElementById", "sockets", null],
                    ["getElementsByClassName", "update-button", 1],
                    ["getElementsByTagName", "button", 0]
                ]
            }
        ],
        name: "Update os sockets",
        type: "dom",
        unit: null
    }
];

export default test_listLocalBrowserSockets;