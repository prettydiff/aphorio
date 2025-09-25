
import vars from "../utilities/vars.ts";

const test_listLocalBrowserUsers:test_list = [
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
                    ["getElementsByTagName", "button", 9]
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
                ["getElementById", "users", null],
                ["getElementsByTagName", "tbody", 0],
                ["getElementsByTagName", "tr", null]
            ],
            qualifier: "greater",
            store: true,
            target: ["length"],
            type: "property",
            value: 1
        },
        interaction: [],
        name: "Check if users table is populated",
        type: "dom",
        unit: [
            {
                node: [
                    ["getElementById", "users", null],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", 0],
                    ["getElementsByTagName", "td", 0]
                ],
                qualifier: "is",
                target: ["textContent", "typeof"],
                type: "property",
                value: "string"
            },
            {
                node: [
                    ["getElementById", "users", null],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", 0],
                    ["getElementsByTagName", "td", 1]
                ],
                qualifier: "greater",
                target: ["textContent"],
                type: "property",
                value: 1
            },
            {
                node: [
                    ["getElementById", "users", null],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", 0],
                    ["getElementsByTagName", "td", 2]
                ],
                qualifier: "greater",
                target: ["data-raw"],
                type: "attribute",
                value: -1
            },
            {
                node: [
                    ["getElementById", "users", null],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", 0],
                    ["getElementsByTagName", "td", 3]
                ],
                qualifier: "greater",
                target: ["data-raw"],
                type: "attribute",
                value: -1
            },
            {
                node: [
                    ["getElementById", "users", null],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", 0],
                    ["getElementsByTagName", "td", 4]
                ],
                qualifier: "is",
                target: ["textContent", "typeof"],
                type: "property",
                value: "string"
            }
        ]
    },
    {
        delay: null,
        interaction: [
            {
                event: "click",
                node: [
                    ["getElementById", "users", null],
                    ["getElementsByClassName", "table-filters", 0],
                    ["getElementsByTagName", "input", 0]
                ]
            },
            {
                event: "setValue",
                node: [
                    ["getElementById", "users", null],
                    ["getElementsByClassName", "table-filters", 0],
                    ["getElementsByTagName", "input", 0]
                ],
                value: "system"
            },
            {
                event: "keyup",
                node: [
                    ["getElementById", "users", null],
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
        name: "Filter users",
        type: "dom",
        unit: [
            {
                node: [
                    ["getElementById", "users", null],
                    ["getElementsByClassName", "table-stats", 0],
                    ["getElementsByTagName", "em", 1]
                ],
                qualifier: "lesser",
                target: ["textContent"],
                type: "property",
                value: vars.test.magicString
            }
        ]
    }
];
test_listLocalBrowserUsers.name = "Local browser tests - users";

export default test_listLocalBrowserUsers;