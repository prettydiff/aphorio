

const test_listLocalBrowserFileSystem:test_list = [
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
            }
        ]
    }
];
test_listLocalBrowserFileSystem.name = "Local browser tests - file system";

export default test_listLocalBrowserFileSystem;