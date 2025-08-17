

var test_listLocalBrowserUsers:test_list = [
    {
        delay: {
            node: [
                ["getElementById", "users", null],
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
                    ["getElementsByTagName", "button", 8]
                ]
            }
        ],
        name: "Navigate to users",
        type: "dom",
        unit: []
    }
];

export default test_listLocalBrowserUsers;