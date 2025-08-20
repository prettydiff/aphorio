

const test_listLocalBrowserOS:test_list = [
    {
        delay: {
            node: [
                ["getElementById", "os", null],
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
                    ["getElementsByTagName", "button", 4]
                ]
            }
        ],
        name: "Navigate to os",
        type: "dom",
        unit: []
    }
];
test_listLocalBrowserOS.name = "Local browser tests - os";

export default test_listLocalBrowserOS;