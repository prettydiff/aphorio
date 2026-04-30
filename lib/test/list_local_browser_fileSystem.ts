
import vars from "../core/vars.ts";

const test_listLocalBrowserFileSystem = function test_listLocalBrowserFileSystem():test_list {
    const list:test_list = [
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
                        ["getElementsByTagName", "div", 3],
                        ["getElementsByTagName", "button", 1]
                    ]
                }
            ],
            name: "Navigate to file-system",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", null]
                    ],
                    qualifier: "greater",
                    target: ["length"],
                    type: "property",
                    value: 15
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "table-filters", 0],
                        ["getElementsByTagName", "input", null]
                    ],
                    qualifier: "is",
                    target: ["length"],
                    type: "property",
                    value: 3
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "table-filters", 0],
                        ["getElementsByTagName", "select", 0],
                        ["getElementsByTagName", "option", null]
                    ],
                    qualifier: "is",
                    target: ["length"],
                    type: "property",
                    value: 2
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", null]
                    ],
                    qualifier: "greater",
                    target: ["length"],
                    type: "property",
                    value: 15
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "table-filters", 0],
                        ["getElementsByTagName", "input", 0]
                    ],
                    qualifier: "ends",
                    target: ["value"],
                    type: "property",
                    value: ["webserver", "aphorio"]
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "table-filters", 0],
                        ["getElementsByTagName", "input", 1]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: ""
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "table-filters", 0],
                        ["getElementsByTagName", "input", 2]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: "1"
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "table-filters", 0],
                        ["getElementsByTagName", "select", 0]
                    ],
                    qualifier: "is",
                    target: ["selectedIndex"],
                    type: "property",
                    value: 1
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "table-filters", 0],
                        ["getElementsByTagName", "select", 1]
                    ],
                    qualifier: "is",
                    target: ["selectedIndex"],
                    type: "property",
                    value: 0
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: " .."
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 1],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: " ."
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 2],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: " .git"
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "file-system", null],
                    ["getElementsByClassName", "section", 0],
                    ["getElementsByClassName", "file-system-failures", 0]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "System cannot access file system object at this address."
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "table-filters", 0],
                        ["getElementsByTagName", "input", 2]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "table-filters", 0],
                        ["getElementsByTagName", "input", 2]
                    ],
                    value: "1"
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "table-filters", 0],
                        ["getElementsByTagName", "input", 1]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "table-filters", 0],
                        ["getElementsByTagName", "input", 1]
                    ],
                    value: "index"
                },
                {
                    event: "keydown",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "table-filters", 0],
                        ["getElementsByTagName", "input", 1]
                    ],
                    value: "Enter"
                }
            ],
            name: "Search for 'index' at depth '1'",
            type: "dom",
            unit: []
        },
        {
            delay: {
                node: [
                    ["getElementById", "file-system", null],
                    ["getElementsByClassName", "file-list", 0],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", null]
                ],
                qualifier: "is",
                target: ["length"],
                type: "property",
                value: 2
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "table-filters", 0],
                        ["getElementsByTagName", "input", 2]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "table-filters", 0],
                        ["getElementsByTagName", "input", 2]
                    ],
                    value: "2"
                },
                {
                    event: "keydown",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "table-filters", 0],
                        ["getElementsByTagName", "input", 2]
                    ],
                    value: "Enter"
                }
            ],
            name: "Search for 'index' at depth '2'",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: ` .git${vars.path.sep}index`
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 1],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: ` lib${vars.path.sep}index.ts`
                }
            ]
        }
    ];
    list.name = "Local browser tests - file system";
    return list;
};

export default test_listLocalBrowserFileSystem;