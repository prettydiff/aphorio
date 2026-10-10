

const test_listLocalBrowserTerminal = function test_listLocalBrowserTerminal():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["id", "terminal", null],
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
                        ["tag", "div", 4],
                        ["tag", "button", 0]
                    ]
                }
            ],
            name: "Navigate to terminal",
            unit: [
                {
                    node: [
                        ["id", "terminal", null],
                        ["class", "terminal-output", 0]
                    ],
                    qualifier: "contains",
                    target: ["data-info"],
                    type: "attribute",
                    value: "pid"
                },
                {
                    node: [
                        ["id", "terminal", null],
                        ["class", "terminal-output", 0]
                    ],
                    qualifier: "contains",
                    target: ["data-info"],
                    type: "attribute",
                    value: "port_browser"
                },
                {
                    node: [
                        ["id", "terminal", null],
                        ["class", "terminal-output", 0]
                    ],
                    qualifier: "contains",
                    target: ["data-info"],
                    type: "attribute",
                    value: "port_terminal"
                },
                {
                    node: [
                        ["id", "terminal", null],
                        ["class", "terminal-output", 0]
                    ],
                    qualifier: "contains",
                    target: ["data-info"],
                    type: "attribute",
                    value: "server_name"
                },
                {
                    node: [
                        ["id", "terminal", null],
                        ["class", "terminal-output", 0]
                    ],
                    qualifier: "contains",
                    target: ["data-info"],
                    type: "attribute",
                    value: "socket_hash"
                }
            ]
        }
    ];
    list.name = "Local browser tests - terminal";
    list.type = "dom";
    return list;
};

export default test_listLocalBrowserTerminal;