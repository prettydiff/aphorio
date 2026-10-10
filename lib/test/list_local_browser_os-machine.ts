
import vars from "../core/vars.ts";

const test_listLocalBrowserOSMachine = function test_listLocalBrowserOSMachine():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["id", "os-machine", null],
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
                        ["tag", "button", 0]
                    ]
                }
            ],
            name: "Navigate to os",
            unit: [
                {
                    node: [
                        ["id", "os-machine", null],
                        ["class", "table-stats", 0],
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
                        ["id", "os-machine", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["tag", "h3", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Machine"
                },
                {
                    node: [
                        ["id", "os-machine", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["tag", "h4", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "CPU"
                },
                {
                    node: [
                        ["id", "os-machine", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["tag", "h4", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Memory"
                },
                {
                    node: [
                        ["id", "os-machine", null],
                        ["class", "section", 0],
                        ["class", "section", 1],
                        ["tag", "h3", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Operating System"
                },
                {
                    node: [
                        ["id", "os-machine", null],
                        ["class", "section", 0],
                        ["class", "section", 1],
                        ["tag", "h4", 0]
                    ],
                    qualifier: "is",
                    target: ["firstChild", "textContent"],
                    type: "property",
                    value: "Path "
                },
                {
                    node: [
                        ["id", "os-machine", null],
                        ["class", "section", 0],
                        ["class", "section", 1],
                        ["tag", "h4", 1]
                    ],
                    qualifier: "is",
                    target: ["firstChild", "textContent"],
                    type: "property",
                    value: "Environmental Variables "
                },
                {
                    node: [
                        ["id", "os-machine", null],
                        ["class", "section", 0],
                        ["class", "section", 2],
                        ["tag", "h3", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Application Process"
                },
                {
                    node: [
                        ["id", "os-machine", null],
                        ["class", "section", 0],
                        ["class", "section", 2],
                        ["tag", "h4", 0]
                    ],
                    qualifier: "is",
                    target: ["firstChild", "textContent"],
                    type: "property",
                    value: "Node.js Dependency Versions "
                },
                {
                    node: [
                        ["id", "os-machine", null],
                        ["class", "section", 0],
                        ["class", "section", 3],
                        ["tag", "h3", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "User"
                }
            ]
        },
        {
            delay: {
                node: [
                    ["id", "os-machine", null],
                    ["class", "table-stats", 0],
                    ["tag", "time", 0]
                ],
                qualifier: "not",
                target: ["textContent"],
                type: "property",
                value: vars.test.magicString
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "os-machine", null],
                        ["class", "table-stats", 0],
                        ["tag", "button", 0]
                    ]
                }
            ],
            name: "Update OS content",
            unit: []
        }
    ];
    list.name = "Local browser tests - os";
    list.type = "dom";
    return list;
};

export default test_listLocalBrowserOSMachine;