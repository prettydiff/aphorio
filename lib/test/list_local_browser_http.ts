

var test_listLocalBrowserHTTP:test_list = [
    {
        delay: {
            node: [
                ["getElementById", "http", null],
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
        name: "Navigate to http test",
        type: "dom",
        unit: []
    }
];

export default test_listLocalBrowserHTTP;