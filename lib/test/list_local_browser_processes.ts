

const test_listLocalBrowserProcesses:test_list = [
    {
        delay: {
            node: [
                ["getElementById", "processes", null],
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
                    ["getElementsByTagName", "button", 5]
                ]
            }
        ],
        name: "Navigate to processes",
        type: "dom",
        unit: []
    }
];
test_listLocalBrowserProcesses.name = "Local browser tests - processes";

export default test_listLocalBrowserProcesses;