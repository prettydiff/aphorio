
import vars from "../core/vars.ts";

const test_listLocalBrowserPortsApplication = function test_listLocalBrowserPortsApplication():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["id", "ports-application", null],
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
                        ["tag", "div", 1],
                        ["tag", "button", 0]
                    ]
                }
            ],
            name: "Navigate to ports-application",
            unit: []
        },
        {
            delay: {
                node: [
                    ["id", "ports-application", null],
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
            name: "Check if ports-application table is populated",
            unit: [
                {
                    node: [
                        ["id", "ports-application", null],
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
                        ["id", "ports-application", null],
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
                        ["id", "ports-application", null],
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
                        ["id", "ports-application", null],
                        ["class", "form", 0],
                        ["tag", "input", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "ports-application", null],
                        ["class", "form", 0],
                        ["tag", "input", 0]
                    ],
                    value: "USB"
                },
                {
                    event: "keyup",
                    node: [
                        ["id", "ports-application", null],
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
            name: "Filter ports-application",
            unit: [
                {
                    node: [
                        ["id", "ports-application", null],
                        ["class", "table-stats", 0],
                        ["tag", "em", 1]
                    ],
                    qualifier: "lesser",
                    target: ["textContent"],
                    type: "property",
                    value: vars.test.magicString
                },
                {
                    node: [
                        ["id", "ports-application", null],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 0]
                    ],
                    qualifier: "is",
                    target: ["style", "display"],
                    type: "property",
                    value: "none"
                }
            ]
        },
        {
            delay: null,
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "ports-application", null],
                        ["class", "form", 0],
                        ["tag", "input", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "ports-application", null],
                        ["class", "form", 0],
                        ["tag", "input", 0]
                    ],
                    value: ""
                },
                {
                    event: "keyup",
                    node: [
                        ["id", "ports-application", null],
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
            name: "Remove filter ports-application",
            unit: [
                {
                    node: [
                        ["id", "ports-application", null],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 0]
                    ],
                    qualifier: "is",
                    target: ["style", "display"],
                    type: "property",
                    value: "table-row"
                }
            ]
        }
    ];
    list.name = "Local browser tests - ports-application";
    list.type = "dom";
    return list;
};

export default test_listLocalBrowserPortsApplication;