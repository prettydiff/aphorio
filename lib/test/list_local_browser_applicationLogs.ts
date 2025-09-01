
import vars from "../utilities/vars.ts";

const test_listLocalBrowserApplicationLogs = function test_listLocalBrowserApplicationLogs():test_list {
    const list:test_list = [
        {
            delay: {
                node: [
                    ["getElementById", "application-logs", null],
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
                        ["getElementsByTagName", "button", 15]
                    ]
                }
            ],
            name: "Navigate to application-logs",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "application-logs", null],
                        ["getElementsByTagName", "li", 0]
                    ],
                    qualifier: "is",
                    target: ["class"],
                    type: "attribute",
                    value: (vars.compose === null)
                        ? "log-error"
                        : "log-success"
                },
                {
                    node: [
                        ["getElementById", "application-logs", null],
                        ["getElementsByTagName", "li", 0]
                    ],
                    qualifier: (vars.compose === null)
                        ? "begins"
                        : "is",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: (vars.compose === null)
                        ? "error during connect:"
                        : "Server named dashboard created."
                }
            ]
        }
    ];
    list.name = "Local browser tests - application logs";
    return list;
};

export default test_listLocalBrowserApplicationLogs;