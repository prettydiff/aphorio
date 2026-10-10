
import vars from "../core/vars.ts";

const test_listLocalBrowserProcesses = function test_listLocalBrowserProcesses():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["id", "processes", null],
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
                        ["tag", "button", 3]
                    ]
                }
            ],
            name: "Navigate to processes",
            unit: [
                {
                    node: [
                        ["id", "processes", null],
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
                        ["id", "processes", null],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 0],
                        ["tag", "td", 1]
                    ],
                    qualifier: "greater",
                    target: ["textContent"],
                    type: "property",
                    value: "100"
                },
                {
                    node: [
                        ["id", "processes", null],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 0],
                        ["tag", "td", 2]
                    ],
                    qualifier: "greater",
                    target: ["data-raw"],
                    type: "attribute",
                    value: 100
                },
                {
                    node: [
                        ["id", "sockets", null],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 0],
                        ["tag", "td", 3]
                    ],
                    qualifier: "greater",
                    target: ["data-raw"],
                    type: "attribute",
                    value: -1
                }
            ]
        },
        {
            delay: {
                node: [
                    ["id", "processes", null],
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
            name: "Check if processes table is populated",
            unit: []
        },
        {
            delay: null,
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "processes", null],
                        ["class", "form", 0],
                        ["tag", "input", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "processes", null],
                        ["class", "form", 0],
                        ["tag", "input", 0]
                    ],
                    value: "running"
                },
                {
                    event: "keyup",
                    node: [
                        ["id", "processes", null],
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
            name: "Filter processes",
            unit: [
                {
                    node: [
                        ["id", "processes", null],
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
    list.name = "Local browser tests - processes";
    list.type = "dom";
    return list;
};

export default test_listLocalBrowserProcesses;