

var test_listLocalBrowserHelp:test_list = [
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
                    ["getElementsByTagName", "button", 16]
                ]
            }
        ],
        name: "Navigate to help",
        type: "dom",
        unit: []
    }
];

export default test_listLocalBrowserHelp;