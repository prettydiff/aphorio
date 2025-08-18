

var test_listLocalBrowserServices:test_list = [
    {
        delay: {
            node: [
                ["getElementById", "services", null],
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
                    ["getElementsByTagName", "button", 6]
                ]
            }
        ],
        name: "Navigate to services",
        type: "dom",
        unit: []
    }
];
test_listLocalBrowserServices.name = "Local browser tests - services";

export default test_listLocalBrowserServices;