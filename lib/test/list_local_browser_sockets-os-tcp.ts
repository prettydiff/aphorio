
import vars from "../core/vars.ts";

const test_listLocalSocketsOS_TCP = function test_listLocalSocketsOS_TCP():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["id", "sockets-os-tcp", null],
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
                        ["tag", "button", 1]
                    ]
                }
            ],
            name: "Navigate to OS TCP Sockets",
            unit: [
                {
                    node: [
                        ["id", "sockets-os-tcp", null],
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
                        ["id", "sockets-os-tcp", null],
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
                    ["id", "sockets-os-tcp", null],
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
            name: "Check if sockets-os-tcp table is populated",
            unit: []
        },
        {
            delay: null,
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "sockets-os-tcp", null],
                        ["class", "form", 0],
                        ["tag", "input", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "sockets-os-tcp", null],
                        ["class", "form", 0],
                        ["tag", "input", 0]
                    ],
                    value: "running"
                },
                {
                    event: "keyup",
                    node: [
                        ["id", "sockets-os-tcp", null],
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
            name: "Filter sockets-os-tcp",
            unit: [
                {
                    node: [
                        ["id", "sockets-os-tcp", null],
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
    list.name = "Local browser tests - sockets-os-tcp";
    list.type = "dom";
    return list;
};

export default test_listLocalSocketsOS_TCP;