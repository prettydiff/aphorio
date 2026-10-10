

const test_listLocalBrowserHelp = function test_listLocalBrowserHelp():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["id", "help", null],
                    ["tag", "h2", 0]
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
                        ["tag", "nav", 0],
                        ["tag", "div", 6],
                        ["tag", "button", 3]
                    ]
                }
            ],
            name: "Navigate to help",
            unit: []
        }
    ];
    list.name = "Local browser tests - help";
    list.type = "dom";
    return list;
};

export default test_listLocalBrowserHelp;