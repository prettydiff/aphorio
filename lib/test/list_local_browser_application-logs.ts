
const test_listLocalBrowserApplicationLogs = function test_listLocalBrowserApplicationLogs():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["id", "application-logs", null],
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
                        ["tag", "button", 0]
                    ]
                }
            ],
            name: "Navigate to application-logs",
            unit: [
                {
                    node: [
                        ["id", "application-logs", null],
                        ["tag", "li", 0],
                        ["tag", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "sockets-application-tcp"
                },
                {
                    node: [
                        ["id", "application-logs", null],
                        ["tag", "li", 0],
                        ["child", null, 0]
                    ],
                    qualifier: "is",
                    target: ["lowName()"],
                    type: "property",
                    value: "time"
                },
                {
                    node: [
                        ["id", "application-logs", null],
                        ["tag", "li", 0],
                        ["child", null, 1]
                    ],
                    qualifier: "is",
                    target: ["lowName()"],
                    type: "property",
                    value: "strong"
                },
                {
                    node: [
                        ["id", "application-logs", null],
                        ["tag", "li", 0],
                        ["child", null, 2]
                    ],
                    qualifier: "is",
                    target: ["lowName()"],
                    type: "property",
                    value: "span"
                },
                {
                    node: [
                        ["id", "application-logs", null],
                        ["tag", "li", 0],
                        ["child", null, 3]
                    ],
                    qualifier: "is",
                    target: ["lowName()"],
                    type: "property",
                    value: "p"
                }
            ]
        }
    ];
    list.name = "Local browser tests - application logs";
    list.type = "dom";
    return list;
};

export default test_listLocalBrowserApplicationLogs;