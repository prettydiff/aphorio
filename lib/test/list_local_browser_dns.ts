

var test_listLocalBrowserDNS:test_list = [
    {
        delay: {
            node: [
                ["getElementById", "dns", null],
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
                    ["getElementsByTagName", "button", 13]
                ]
            }
        ],
        name: "Navigate to dns query",
        type: "dom",
        unit: []
    }
];

export default test_listLocalBrowserDNS;