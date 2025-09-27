

const test_listLocalBrowserStorage:test_list = [
    {
        delay: {
            node: [
                ["getElementById", "disks", null],
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
                    ["getElementsByTagName", "button", 6]
                ]
            }
        ],
        name: "Navigate to storage",
        type: "dom",
        unit: []
    }
];
test_listLocalBrowserStorage.name = "Local browser tests - storage";

export default test_listLocalBrowserStorage;