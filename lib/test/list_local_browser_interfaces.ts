

var test_listLocalBrowserInterfaces:test_list = [
    {
        delay: {
            node: [
                ["getElementById", "interfaces", null],
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
                    ["getElementsByTagName", "button", 3]
                ]
            }
        ],
        name: "Navigate to interfaces",
        type: "dom",
        unit: []
    }
];

export default test_listLocalBrowserInterfaces;