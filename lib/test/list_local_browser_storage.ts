

var test_listLocalBrowserStorage:test_list = [
    {
        delay: {
            node: [
                ["getElementById", "storage", null],
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
                    ["getElementsByTagName", "button", 7]
                ]
            }
        ],
        name: "Navigate to storage",
        type: "dom",
        unit: []
    }
];

export default test_listLocalBrowserStorage;