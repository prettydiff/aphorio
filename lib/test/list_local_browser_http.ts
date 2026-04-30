

const test_listLocalBrowserHTTP = function test_listLocalBrowserHTTP():test_list {
    const list:test_list = [
        {
            delay: {
                node: [
                    ["getElementById", "test-http", null],
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
                        ["getElementsByTagName", "div", 4],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Navigate to http test",
            type: "dom",
            unit: []
        }
    ];
    list.name = "Local browser tests - http";
    return list;
};

export default test_listLocalBrowserHTTP;