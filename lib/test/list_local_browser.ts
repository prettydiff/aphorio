
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
                value: "1200"
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
                value: vars.test.magicString
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
    },
    {
        delay: {
            node: [
                ["getElementById", "interfaces", null],
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
                    ["getElementsByTagName", "button", 3]
                ]
            }
        ],
        name: "Navigate to interfaces",
        type: "dom",
        unit: []
    },
    {
        delay: {
            node: [
                ["getElementById", "os", null],
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
                    ["getElementsByTagName", "button", 4]
                ]
            }
        ],
        name: "Navigate to os",
        type: "dom",
        unit: []
    },
    {
        delay: {
            node: [
                ["getElementById", "processes", null],
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
                    ["getElementsByTagName", "button", 5]
                ]
            }
        ],
        name: "Navigate to processes",
        type: "dom",
        unit: []
    },
    {
        delay: {
            node: [
                ["getElementById", "services", null],
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
                    ["getElementsByTagName", "button", 6]
                ]
            }
        ],
        name: "Navigate to services",
        type: "dom",
        unit: []
    },
    {
        delay: {
            node: [
                ["getElementById", "storage", null],
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
                    ["getElementsByTagName", "button", 7]
                ]
            }
        ],
        name: "Navigate to storage",
        type: "dom",
        unit: []
    },
    {
        delay: {
            node: [
                ["getElementById", "users", null],
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
                    ["getElementsByTagName", "button", 8]
                ]
            }
        ],
        name: "Navigate to users",
        type: "dom",
        unit: []
    },
    {
        delay: {
            node: [
                ["getElementById", "terminal", null],
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
                    ["getElementsByTagName", "button", 9]
                ]
            }
        ],
        name: "Navigate to terminal",
        type: "dom",
        unit: []
    },
    {
        delay: {
            node: [
                ["getElementById", "file-system", null],
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
                    ["getElementsByTagName", "button", 10]
                ]
            }
        ],
        name: "Navigate to file-system",
        type: "dom",
        unit: []
    },
    {
        delay: {
            node: [
                ["getElementById", "http", null],
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
                    ["getElementsByTagName", "button", 11]
                ]
            }
        ],
        name: "Navigate to http test",
        type: "dom",
        unit: []
    },
    {
        delay: {
            node: [
                ["getElementById", "websocket", null],
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
                    ["getElementsByTagName", "button", 12]
                ]
            }
        ],
        name: "Navigate to websocket test",
        type: "dom",
        unit: []
    },
    {
        delay: {
            node: [
                ["getElementById", "dns", null],
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
                    ["getElementsByTagName", "button", 13]
                ]
            }
        ],
        name: "Navigate to dns query",
        type: "dom",
        unit: []
    },
    {
        delay: {
            node: [
                ["getElementById", "hash", null],
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
                    ["getElementsByTagName", "button", 14]
                ]
            }
        ],
        name: "Navigate to hash / base64",
        type: "dom",
        unit: []
    },
    {
        delay: {
            node: [
                ["getElementById", "application-logs", null],
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
                    ["getElementsByTagName", "button", 15]
                ]
            }
        ],
        name: "Navigate to application-logs",
        type: "dom",
        unit: []
    },
    {
        delay: {
            node: [
                ["getElementById", "help", null],
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
                    ["getElementsByTagName", "button", 16]
                ]
            }
        ],
        name: "Navigate to help",
        type: "dom",
        unit: []
    },
    {
        delay: {
            node: [
                ["getElementById", "faq", null],
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
                    ["getElementsByTagName", "button", 17]
                ]
            }
        ],
        name: "Navigate to faq",
        type: "dom",
        unit: []
    }
];
test_listLocalBrowser.name = "Local browser tests";
export default test_listLocalBrowser;