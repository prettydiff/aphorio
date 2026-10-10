
// cspell: words bootable

const test_listLocalBrowserDisks = function test_listLocalBrowserDisks():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["id", "disks", null],
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
                        ["tag", "button", 2]
                    ]
                }
            ],
            name: "Navigate to disks",
            unit: []
        },
        {
            delay: null,
            interaction: [],
            name: "Check if disks list is populated",
            unit: [
                {
                    node: [
                        ["id", "disks", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["tag", "h3", 0]
                    ],
                    qualifier: "greater",
                    target: ["offsetTop"],
                    type: "property",
                    value: 10
                },
                {
                    node: [
                        ["id", "disks", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["tag", "li", 0],
                        ["tag", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Bus"
                },
                {
                    node: [
                        ["id", "disks", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["tag", "li", 1],
                        ["tag", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Guid"
                },
                {
                    node: [
                        ["id", "disks", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["tag", "li", 2],
                        ["tag", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Name"
                },
                {
                    node: [
                        ["id", "disks", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["tag", "li", 3],
                        ["tag", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Serial"
                },
                {
                    node: [
                        ["id", "disks", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["tag", "li", 4],
                        ["tag", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Size Disk"
                },
                {
                    node: [
                        ["id", "disks", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["tag", "h4", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Partitions"
                },
                {
                    node: [
                        ["id", "disks", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["class", "os-interface", 0],
                        ["tag", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Active"
                },
                {
                    node: [
                        ["id", "disks", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["class", "os-interface", 0],
                        ["tag", "strong", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Bootable"
                },
                {
                    node: [
                        ["id", "disks", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["class", "os-interface", 0],
                        ["tag", "strong", 2]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "File System"
                },
                {
                    node: [
                        ["id", "disks", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["class", "os-interface", 0],
                        ["tag", "strong", 3]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Hidden"
                },
                {
                    node: [
                        ["id", "disks", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["class", "os-interface", 0],
                        ["tag", "strong", 4]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Id"
                },
                {
                    node: [
                        ["id", "disks", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["class", "os-interface", 0],
                        ["tag", "strong", 5]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Path"
                },
                {
                    node: [
                        ["id", "disks", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["class", "os-interface", 0],
                        ["tag", "strong", 6]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Read Only"
                },
                {
                    node: [
                        ["id", "disks", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["class", "os-interface", 0],
                        ["tag", "strong", 7]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Size Free"
                },
                {
                    node: [
                        ["id", "disks", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["class", "os-interface", 0],
                        ["tag", "strong", 8]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Size Used"
                },
                {
                    node: [
                        ["id", "disks", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["class", "os-interface", 0],
                        ["tag", "strong", 9]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Size Total"
                },
                {
                    node: [
                        ["id", "disks", null],
                        ["class", "section", 0],
                        ["class", "section", 0],
                        ["class", "os-interface", 0],
                        ["tag", "strong", 10]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Type"
                }
            ]
        }
    ];
    list.name = "Local browser tests - disks";
    list.type = "dom";
    return list;
};

export default test_listLocalBrowserDisks;