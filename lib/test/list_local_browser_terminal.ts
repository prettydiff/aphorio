

const test_listLocalBrowserTerminal:test_list = [
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
                    ["getElementsByTagName", "button", 10]
                ]
            }
        ],
        name: "Navigate to terminal",
        type: "dom",
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
test_listLocalBrowserTerminal.name = "Local browser tests - terminal";

export default test_listLocalBrowserTerminal;