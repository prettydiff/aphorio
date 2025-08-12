
import vars from "../utilities/vars.ts";

const test_listLocalBrowser:test_list = [
    {
        delay: {
            node: [
                ["getElementById", "connection-status", 0],
                ["getElementsByTagName", "strong", 0]
            ],
            qualifier: "is",
            target: ["textContent"],
            type: "property",
            value: "Online"
        },
        interaction: [],
        name: "Page load",
        type: "dom",
        unit: [
            {
                node: [
                    ["getElementsByTagName", "h1", 0]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "Server Management Dashboard"
            },
            {
                node: [
                    ["getElementsByTagName", "nav", 0],
                    ["getElementsByTagName", "h2", 0]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "Navigation"
            },
            {
                node: [
                    ["getElementsByTagName", "nav", 0],
                    ["getElementsByTagName", "button", 0]
                ],
                qualifier: "is",
                target: ["data-section"],
                type: "attribute",
                value: "servers"
            },
            {
                node: [
                    ["getElementsByTagName", "nav", 0],
                    ["getElementsByTagName", "button", 0]
                ],
                qualifier: "is",
                target: ["class"],
                type: "attribute",
                value: "nav-focus"
            },
            {
                node: [
                    ["getElementById", "servers", null],
                    ["getElementsByTagName", "h2", 0]
                ],
                qualifier: "greater",
                target: ["offsetTop"],
                type: "property",
                value: 0
            }
        ]
    },
    {
        delay: null,
        interaction: [
            {
                event: "wait",
                node: null,
                value: "1000"
            }
        ],
        name: "Clock Time 1",
        type: "dom",
        unit: [
            {
                node: [
                    ["getElementById", "clock", null],
                    ["getElementsByTagName", "em", 0]
                ],
                qualifier: "not contains",
                store: true,
                target: ["textContent"],
                type: "property",
                value: "00:00:00"
            }
        ]
    },
    {
        delay: null,
        interaction: [
            {
                event: "wait",
                node: null,
                value: "1000"
            }
        ],
        name: "Clock Time 2",
        type: "dom",
        unit: [
            {
                node: [
                    ["getElementById", "clock", null],
                    ["getElementsByTagName", "em", 0]
                ],
                qualifier: "not",
                target: ["textContent"],
                type: "property",
                value: vars.test.store
            }
        ]
    },
    {
        delay: {
            node: [
                ["getElementById", "compose", null],
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
                    ["getElementsByTagName", "button", 1]
                ]
            }
        ],
        name: "Navigate to compose",
        type: "dom",
        unit: []
    },
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
    }
];
test_listLocalBrowser.name = "Local browser tests";
export default test_listLocalBrowser;