import vars from "../core/vars.ts";

const test_listLocalBrowserSocketsApplicationTCP = function test_listLocalBrowserSocketsApplicationTCP():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["id", "sockets-application-tcp", null],
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
                        ["tag", "button", 1]
                    ]
                }
            ],
            name: "Navigate to sockets",
            unit: []
        },
        {
            delay: {
                node: [
                    ["id", "sockets-application-tcp", null],
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
            name: "Check if application socket table is populated",
            unit: [
                {
                    node: [
                        ["id", "sockets-application-tcp", null],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 0],
                        ["tag", "td", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent", "length"],
                    type: "property",
                    value: 128
                },
                {
                    node: [
                        ["id", "sockets-application-tcp", null],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 0],
                        ["tag", "td", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "dashboard"
                },
                {
                    node: [
                        ["id", "sockets-application-tcp", null],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 0],
                        ["tag", "td", 2]
                    ],
                    qualifier: "begins",
                    target: ["textContent"],
                    type: "property",
                    value: ["browserSocket-", "dashboard-term"]
                },
                {
                    node: [
                        ["id", "sockets-application-tcp", null],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 0],
                        ["tag", "td", 3]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: ["dashboard", "dashboard-terminal"]
                },
                {
                    node: [
                        ["id", "sockets-application-tcp", null],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 0],
                        ["tag", "td", 4]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "server"
                },
                {
                    node: [
                        ["id", "sockets-application-tcp", null],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 0],
                        ["tag", "td", 5]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: ""
                },
                {
                    node: [
                        ["id", "sockets-application-tcp", null],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 0],
                        ["tag", "td", 6]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "false"
                },
                {
                    node: [
                        ["id", "sockets-application-tcp", null],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 0],
                        ["tag", "td", 7]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: ["127.0.0.1", "::1"] as type_test_primitive[]
                },
                {
                    node: [
                        ["id", "sockets-application-tcp", null],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 0],
                        ["tag", "td", 8]
                    ],
                    qualifier: "numeric",
                    target: ["textContent"],
                    type: "property",
                    value: true
                },
                {
                    node: [
                        ["id", "sockets-application-tcp", null],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 0],
                        ["tag", "td", 9]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: ["127.0.0.1", "::1"]
                }
            ]
        },
        {
            delay: null,
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "sockets-application-tcp", null],
                        ["class", "form", 0],
                        ["tag", "input", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "sockets-application-tcp", null],
                        ["class", "form", 0],
                        ["tag", "input", 0]
                    ],
                    value: "services_terminal_"
                },
                {
                    event: "keyup",
                    node: [
                        ["id", "sockets-application-tcp", null],
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
            name: "Filter application sockets",
            unit: [
                {
                    node: [
                        ["id", "sockets-application-tcp", null],
                        ["class", "table-stats", 0],
                        ["tag", "em", 1]
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
                    ["id", "sockets-application-tcp", null],
                    ["class", "table-stats", 0],
                    ["tag", "em", 2]
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
                        ["id", "sockets-application-tcp", null],
                        ["class", "update-button", 0],
                        ["tag", "button", 0]
                    ]
                }
            ],
            name: "Update os sockets",
            unit: null
        }
    ];
    list.name = "Local browser tests - sockets-application-tcp";
    list.type = "dom";
    return list;
};

export default test_listLocalBrowserSocketsApplicationTCP;