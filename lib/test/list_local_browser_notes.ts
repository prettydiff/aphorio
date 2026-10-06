

const test_listLocalBrowserNotes = function test_listLocalBrowserNotes():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["getElementById", "notes", null],
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
                        ["getElementsByTagName", "div", 4],
                        ["getElementsByTagName", "button", 4]
                    ]
                }
            ],
            name: "Navigate to notes",
            unit: []
        },
        {
            delay: {
                node: [
                    ["getElementById", "notes", null],
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
                        ["getElementById", "notes", null],
                        ["getElementsByTagName", "textarea", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "notes", null],
                        ["getElementsByTagName", "textarea", 0]
                    ],
                    value: "testing section notes from test automation"
                },
                {
                    event: "blur",
                    node: [
                        ["getElementById", "notes", null],
                        ["getElementsByTagName", "textarea", 0]
                    ]
                },
                {
                    event: "refresh",
                    node: []
                },
                {
                    event: "wait",
                    node: [],
                    value: "1000"
                }
            ],
            name: "Refresh page and check notes value",
            unit: [
                {
                    node: [
                        ["getElementById", "notes", null],
                        ["getElementsByTagName", "textarea", 0]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: "testing section notes from test automation"
                }
            ]
        }
    ];
    list.name = "Local browser tests - notes";
    list.type = "dom";
    return list;
};
export default test_listLocalBrowserNotes;