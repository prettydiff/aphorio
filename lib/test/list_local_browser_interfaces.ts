
import vars from "../core/vars.ts";

const test_listLocalBrowserInterfaces = function test_listLocalBrowserInterfaces():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["id", "interfaces", null],
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
                        ["tag", "div", 2],
                        ["tag", "button", 0]
                    ]
                }
            ],
            name: "Navigate to interfaces",
            unit: [
                {
                    node: [
                        ["id", "interfaces", null],
                        ["class", "table-stats", 0],
                        ["tag", "p", 2],
                        ["tag", "time", 0]
                    ],
                    qualifier: "not",
                    store: true,
                    target: ["textContent"],
                    type: "property",
                    value: ""
                },
                {
                    node: [
                        ["id", "interfaces", null],
                        ["class", "item-list", 0],
                        ["class", "section", 0],
                        ["tag", "h2", 0]
                    ],
                    qualifier: "not",
                    target: ["textContent"],
                    type: "property",
                    value: ""
                },
                {
                    node: [
                        ["id", "interfaces", null],
                        ["class", "item-list", 0],
                        ["class", "section", 0],
                        ["tag", "h3", 0]
                    ],
                    qualifier: "not",
                    target: ["textContent"],
                    type: "property",
                    value: ""
                },
                {
                    node: [
                        ["id", "interfaces", null],
                        ["class", "item-list", 0],
                        ["class", "section", 0],
                        ["tag", "ul", null]
                    ],
                    qualifier: "greater",
                    target: ["length"],
                    type: "property",
                    value: 0
                },
                {
                    node: [
                        ["id", "interfaces", null],
                        ["class", "item-list", 0],
                        ["class", "section", 0],
                        ["tag", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "address"
                },
                {
                    node: [
                        ["id", "interfaces", null],
                        ["class", "item-list", 0],
                        ["class", "section", 0],
                        ["tag", "strong", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "netmask"
                },
                {
                    node: [
                        ["id", "interfaces", null],
                        ["class", "item-list", 0],
                        ["class", "section", 0],
                        ["tag", "strong", 2]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "family"
                },
                {
                    node: [
                        ["id", "interfaces", null],
                        ["class", "item-list", 0],
                        ["class", "section", 0],
                        ["tag", "strong", 3]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "mac"
                },
                {
                    node: [
                        ["id", "interfaces", null],
                        ["class", "item-list", 0],
                        ["class", "section", 0],
                        ["tag", "strong", 4]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "internal"
                },
                {
                    node: [
                        ["id", "interfaces", null],
                        ["class", "item-list", 0],
                        ["class", "section", 0],
                        ["tag", "strong", 5]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "cidr"
                }
            ]
        },
        {
            delay: {
                node: [
                    ["id", "interfaces", null],
                    ["class", "table-stats", 0],
                    ["tag", "p", 2],
                    ["tag", "time", 0]
                ],
                qualifier: "not",
                target: ["textContent"],
                type: "property",
                value: vars.test.magicString
            },
            interaction: [
                {
                    node: [
                        ["id", "interfaces", null],
                        ["class", "table-stats", 0],
                        ["tag", "button", 0]
                    ],
                    event: "click"
                }
            ],
            name: "Update interfaces",
            unit: []
        }
    ];
    list.name = "Local browser tests - interfaces";
    list.type = "dom";
    return list;
};

export default test_listLocalBrowserInterfaces;