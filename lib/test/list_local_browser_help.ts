

const test_listLocalBrowserHelp = function test_listLocalBrowserHelp():test_list_dom {
    const list:test_list_dom = [
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
                        ["getElementsByTagName", "div", 6],
                        ["getElementsByTagName", "button", 3]
                    ]
                }
            ],
            name: "Navigate to help",
            type: "dom",
            unit: []
        }
    ];
    list.name = "Local browser tests - help";
    return list;
};

export default test_listLocalBrowserHelp;