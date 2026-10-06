

const test_listLocalBrowserTerminal = function test_listLocalBrowserTerminal():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["getElementById", "terminal", null],
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
            name: "Navigate to terminal",
            unit: [
                {
                    node: [
                        ["getElementById", "terminal", null],
                        ["getElementsByClassName", "terminal-output", 0]
                    ],
                    qualifier: "contains",
                    target: ["data-info"],
                    type: "attribute",
                    value: "pid"
                },
                {
                    node: [
                        ["getElementById", "terminal", null],
                        ["getElementsByClassName", "terminal-output", 0]
                    ],
                    qualifier: "contains",
                    target: ["data-info"],
                    type: "attribute",
                    value: "port_browser"
                },
                {
                    node: [
                        ["getElementById", "terminal", null],
                        ["getElementsByClassName", "terminal-output", 0]
                    ],
                    qualifier: "contains",
                    target: ["data-info"],
                    type: "attribute",
                    value: "port_terminal"
                },
                {
                    node: [
                        ["getElementById", "terminal", null],
                        ["getElementsByClassName", "terminal-output", 0]
                    ],
                    qualifier: "contains",
                    target: ["data-info"],
                    type: "attribute",
                    value: "server_name"
                },
                {
                    node: [
                        ["getElementById", "terminal", null],
                        ["getElementsByClassName", "terminal-output", 0]
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