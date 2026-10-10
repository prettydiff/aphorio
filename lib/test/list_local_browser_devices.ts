
import vars from "../core/vars.ts";

const test_listLocalBrowserDevices = function test_listLocalBrowserDevices():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["id", "devices", null],
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
                        ["tag", "div", 3],
                        ["tag", "button", 1]
                    ]
                }
            ],
            name: "Navigate to devices",
            unit: []
        },
        {
            delay: {
                node: [
                    ["id", "devices", null],
                    ["tag", "tbody", 0],
                    ["tag", "tr", null]
                ],
                qualifier: "greater",
                store: true,
                target: ["length"],
                type: "property",
                value: 1
            },
            interaction: [],
            name: "Check if devices table is populated",
            unit: [
                {
                    node: [
                        ["id", "devices", null],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 0],
                        ["tag", "td", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent", "typeof"],
                    type: "property",
                    value: "string"
                },
                {
                    node: [
                        ["id", "devices", null],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 0],
                        ["tag", "td", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent", "typeof"],
                    type: "property",
                    value: "string"
                },
                {
                    node: [
                        ["id", "devices", null],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 0],
                        ["tag", "td", 2]
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
                        ["id", "devices", null],
                        ["class", "form", 0],
                        ["tag", "input", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "devices", null],
                        ["class", "form", 0],
                        ["tag", "input", 0]
                    ],
                    value: "USB"
                },
                {
                    event: "keyup",
                    node: [
                        ["id", "devices", null],
                        ["class", "form", 0],
                        ["tag", "input", 0]
                    ],
                    value: "Enter"
                },
                {
                    event: "wait",
                    node: [],
                    value: "50"
                }
            ],
            name: "Filter devices",
            unit: [
                {
                    node: [
                        ["id", "devices", null],
                        ["class", "table-stats", 0],
                        ["tag", "em", 1]
                    ],
                    qualifier: "lesser",
                    target: ["textContent"],
                    type: "property",
                    value: vars.test.magicString
                }
            ]
        }
    ];
    list.name = "Local browser tests - devices";
    list.type = "dom";
    return list;
};

export default test_listLocalBrowserDevices;