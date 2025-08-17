

var test_listLocalBrowserApplicationLogs:test_list = [
    {
        delay: {
            node: [
                ["getElementById", "application-logs", null],
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
        name: "Navigate to application-logs",
        type: "dom",
        unit: []
    }
];

export default test_listLocalBrowserApplicationLogs;