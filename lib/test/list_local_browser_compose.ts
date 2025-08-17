


var test_listLocalBrowserCompose:test_list = [
    {
        delay: {
            node: [
                ["getElementById", "compose", null],
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
                    ["getElementsByTagName", "button", 1]
                ]
            }
        ],
        name: "Navigate to compose",
        type: "dom",
        unit: []
    }
]

export default test_listLocalBrowserCompose;