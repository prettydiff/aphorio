

const test_listLocalBrowserHelp:test_list = [
    {
        delay: {
            node: [
                ["getElementById", "help", null],
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
                    ["getElementsByTagName", "button", 17]
                ]
            }
        ],
        name: "Navigate to help",
        type: "dom",
        unit: []
    }
];
test_listLocalBrowserHelp.name = "Local browser tests - help";

export default test_listLocalBrowserHelp;