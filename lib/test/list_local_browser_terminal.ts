

const test_listLocalBrowserTerminal:test_list = [
    {
        delay: {
            node: [
                ["getElementById", "terminal", null],
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
                    ["getElementsByTagName", "button", 9]
                ]
            }
        ],
        name: "Navigate to terminal",
        type: "dom",
        unit: []
    }
];
test_listLocalBrowserTerminal.name = "Local browser tests - terminal";

export default test_listLocalBrowserTerminal;