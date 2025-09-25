

const test_listLocalBrowserHash:test_list = [
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
                    ["getElementsByTagName", "button", 15]
                ]
            }
        ],
        name: "Navigate to hash / base64",
        type: "dom",
        unit: []
    }
];
test_listLocalBrowserHash.name = "Local browser tests - hash";

export default test_listLocalBrowserHash;