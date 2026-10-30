
import vars from "../core/vars.ts";

const test_listLocalBrowserFileSystem = function test_listLocalBrowserFileSystem():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["id", "file-system", null],
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
                        ["tag", "div", 4],
                        ["tag", "button", 1]
                    ]
                }
            ],
            name: "Navigate to file-system",
            unit: []
        },
        {
            delay: {
                node: [
                    ["id", "file-system", null],
                    ["class", "file-list", 0],
                    ["tag", "tbody", 0],
                    ["tag", "tr", null]
                ],
                qualifier: "greater",
                target: ["length"],
                type: "property",
                value: 15
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 0]
                    ],
                    value: vars.path.project.replace(`${vars.path.sep}test`, "").replace(/(\\|\/)$/, "")
                },
                {
                    event: "keydown",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 0]
                    ],
                    value: "Enter"
                },
                {
                    event: "keyup",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 0]
                    ],
                    value: "Enter"
                }
            ],
            name: "Navigate to project path",
            unit: [
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", null]
                    ],
                    qualifier: "is",
                    target: ["length"],
                    type: "property",
                    value: 3
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 0]
                    ],
                    qualifier: "ends",
                    target: ["value"],
                    type: "property",
                    value: ["webserver", "aphorio"]
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 1]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: ""
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 2]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: "1"
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "select", 0],
                        ["tag", "option", null]
                    ],
                    qualifier: "is",
                    target: ["length"],
                    type: "property",
                    value: 2
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "file-list", 0],
                        ["tag", "tbody", 0],
                        ["tag", "tr", null]
                    ],
                    qualifier: "greater",
                    target: ["length"],
                    type: "property",
                    value: 15
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 1]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: ""
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 2]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: "1"
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "select", 0]
                    ],
                    qualifier: "is",
                    target: ["selectedIndex"],
                    type: "property",
                    value: 1
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "select", 1]
                    ],
                    qualifier: "is",
                    target: ["selectedIndex"],
                    type: "property",
                    value: 0
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "file-list", 0],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 0],
                        ["tag", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: " .."
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "file-list", 0],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 1],
                        ["tag", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: " ."
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "file-list", 0],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 2],
                        ["tag", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: " .git"
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "file-list", 0],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 2],
                        ["tag", "td", 2]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "0"
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "file-list", 0],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 3],
                        ["tag", "td", 2]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "0"
                }
            ]
        },
        {
            delay: {
                node: [
                    ["id", "file-system", null],
                    ["class", "section", 0],
                    ["class", "file-system-failures", 0]
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
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 2]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 2]
                    ],
                    value: "1"
                },
                {
                    event: "click",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 1]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 1]
                    ],
                    value: "index"
                },
                {
                    event: "keydown",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 1]
                    ],
                    value: "Enter"
                },
                {
                    event: "keyup",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 1]
                    ],
                    value: "Enter"
                }
            ],
            name: "Search for 'index' at depth '1'",
            unit: []
        },
        {
            delay: {
                node: [
                    ["id", "file-system", null],
                    ["class", "file-list", 0],
                    ["tag", "tbody", 0],
                    ["tag", "tr", null]
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
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 2]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 2]
                    ],
                    value: "2"
                },
                {
                    event: "keydown",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 2]
                    ],
                    value: "Enter"
                },
                {
                    event: "keyup",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 2]
                    ],
                    value: "Enter"
                }
            ],
            name: "Search for 'index' at depth '2'",
            unit: [
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "file-list", 0],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 0],
                        ["tag", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: ` .git${vars.path.sep}index`
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "file-list", 0],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 1],
                        ["tag", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: ` lib${vars.path.sep}index.ts`
                }
            ]
        },
        {
            delay: {
                node: [
                    ["id", "file-system", null],
                    ["class", "file-list", 0],
                    ["tag", "tbody", 0],
                    ["tag", "tr", null]
                ],
                qualifier: "greater",
                target: ["length"],
                type: "property",
                value: 10
            },
            interaction: [
                {
                    event: "setValue",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "select", 0]
                    ],
                    value: "Absolute"
                },
                {
                    event: "click",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 1]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 1]
                    ],
                    value: ""
                },
                {
                    event: "click",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 2]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 2]
                    ],
                    value: "1"
                },
                {
                    event: "keydown",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 2]
                    ],
                    value: "Enter"
                },
                {
                    event: "keyup",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 2]
                    ],
                    value: "Enter"
                }
            ],
            name: "Display absolute paths, no directory size",
            unit: [
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "file-list", 0],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 2],
                        ["tag", "button", 0]
                    ],
                    qualifier: "ends",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: `${vars.path.sep}.git`
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "file-list", 0],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 2],
                        ["tag", "td", 2]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "0"
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "file-list", 0],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 3],
                        ["tag", "button", 0]
                    ],
                    qualifier: "ends",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: `${vars.path.sep}bin`
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "file-list", 0],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 3],
                        ["tag", "td", 2]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "0"
                }
            ]
        },
        {
            delay: {
                node: [
                    ["id", "file-system", null],
                    ["class", "file-list", 0],
                    ["tag", "tbody", 0],
                    ["tag", "tr", 2],
                    ["tag", "button", 0]
                ],
                qualifier: "ends",
                target: ["lastChild", "textContent"],
                type: "property",
                value: `${vars.path.sep}.git`
            },
            interaction: [
                {
                    event: "setValue",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "select", 1]
                    ],
                    value: "true (extremely slow)"
                },
                {
                    event: "click",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 1]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 1]
                    ],
                    value: ""
                },
                {
                    event: "click",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 2]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 2]
                    ],
                    value: "1"
                },
                {
                    event: "keydown",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 2]
                    ],
                    value: "Enter"
                },
                {
                    event: "keyup",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 2]
                    ],
                    value: "Enter"
                }
            ],
            name: "Display absolute paths and directory size",
            unit: [
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "file-list", 0],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 2],
                        ["tag", "td", 2]
                    ],
                    qualifier: "not",
                    target: ["textContent"],
                    type: "property",
                    value: "0"
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "file-list", 0],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 3],
                        ["tag", "button", 0]
                    ],
                    qualifier: "ends",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: `${vars.path.sep}bin`
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "file-list", 0],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 3],
                        ["tag", "td", 2]
                    ],
                    qualifier: "not",
                    target: ["textContent"],
                    type: "property",
                    value: "0"
                }
            ]
        },
        {
            delay: {
                node: [
                    ["id", "file-system", null],
                    ["class", "file-list", 0],
                    ["tag", "tbody", 0],
                    ["tag", "tr", 2],
                    ["tag", "button", 0]
                ],
                qualifier: "ends",
                target: ["lastChild", "textContent"],
                type: "property",
                value: " .git"
            },
            interaction: [
                {
                    event: "setValue",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "select", 0]
                    ],
                    value: "Relative"
                },
                {
                    event: "click",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 1]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 1]
                    ],
                    value: ""
                },
                {
                    event: "click",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 2]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 2]
                    ],
                    value: "1"
                },
                {
                    event: "keydown",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 2]
                    ],
                    value: "Enter"
                },
                {
                    event: "keyup",
                    node: [
                        ["id", "file-system", null],
                        ["class", "form", 0],
                        ["tag", "input", 2]
                    ],
                    value: "Enter"
                }
            ],
            name: "Display relative paths and directory size",
            unit: [
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "file-list", 0],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 6],
                        ["tag", "td", 2]
                    ],
                    qualifier: "not",
                    target: ["textContent"],
                    type: "property",
                    value: "0"
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "file-list", 0],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 3],
                        ["tag", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: " bin"
                },
                {
                    node: [
                        ["id", "file-system", null],
                        ["class", "file-list", 0],
                        ["tag", "tbody", 0],
                        ["tag", "tr", 3],
                        ["tag", "td", 2]
                    ],
                    qualifier: "not",
                    target: ["textContent"],
                    type: "property",
                    value: "0"
                }
            ]
        }
    ];
    list.name = "Local browser tests - file system";
    list.type = "dom";
    return list;
};

export default test_listLocalBrowserFileSystem;