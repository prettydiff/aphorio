

const test_listLocalBrowserHash = function test_listLocalBrowserHash():test_list {
    const list:test_list= [
        {
            delay: {
                node: [
                    ["getElementById", "hash", null],
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
                        ["getElementsByTagName", "button", 3]
                    ]
                }
            ],
            name: "Navigate to hash / base64",
            type: "dom",
            unit: []
        }
    ];
    list.name = "Local browser tests - hash";
    return list;
};

export default test_listLocalBrowserHash;