

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
                    ["getElementsByTagName", "button", 11]
                ]
            }
        ],
        name: "Navigate to file-system",
        type: "dom",
        unit: []
    }
];
test_listLocalBrowserFileSystem.name = "Local browser tests - file system";

export default test_listLocalBrowserFileSystem;