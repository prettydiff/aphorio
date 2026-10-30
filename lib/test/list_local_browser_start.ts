
import vars from "../core/vars.ts";

const test_listLocalBrowserStart = function test_listLocalBrowserStart():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["id", "connection-status", 0],
                    ["tag", "strong", 0]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "Online (Insecure)"
            },
            interaction: [],
            name: "Page load",
            unit: [
                {
                    node: [
                        ["tag", "h1", 0]
                    ],
                    qualifier: "begins",
                    target: ["textContent"],
                    type: "property",
                    value: `${vars.environment.name.charAt(0).toUpperCase() + vars.environment.name.slice(1, vars.environment.name.length)} Dashboard`
                },
                {
                    node: [
                        ["tag", "nav", 0],
                        ["tag", "h2", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Navigation"
                },
                {
                    node: [
                        ["tag", "nav", 0],
                        ["tag", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["data-section"],
                    type: "attribute",
                    value: "servers-web"
                },
                {
                    node: [
                        ["tag", "nav", 0],
                        ["tag", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["class"],
                    type: "attribute",
                    value: "nav-focus"
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["tag", "h2", 0]
                    ],
                    qualifier: "greater",
                    target: ["offsetTop"],
                    type: "property",
                    value: 0
                }
            ]
        },
        {
            delay: null,
            interaction: [
                {
                    event: "wait",
                    node: null,
                    value: "1000"
                }
            ],
            name: "Clock Time 1",
            unit: [
                {
                    node: [
                        ["id", "clock", null],
                        ["tag", "time", 0]
                    ],
                    qualifier: "not contains",
                    store: true,
                    target: ["textContent"],
                    type: "property",
                    value: "00:00:00"
                }
            ]
        },
        {
            delay: null,
            interaction: [
                {
                    event: "wait",
                    node: null,
                    value: "1200"
                }
            ],
            name: "Clock Time 2",
            unit: [
                {
                    node: [
                        ["id", "clock", null],
                        ["tag", "time", 0]
                    ],
                    qualifier: "not",
                    target: ["textContent"],
                    type: "property",
                    value: vars.test.magicString
                }
            ]
        }
    ];
    list.name = "Local browser tests - start";
    list.type = "dom";
    return list;
};
export default test_listLocalBrowserStart;