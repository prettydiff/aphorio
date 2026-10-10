

const test_listLocalBrowserServicesApp = function test_listLocalBrowserServicesApp():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["id", "services-app", null],
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
                        ["tag", "button", 1]
                    ]
                }
            ],
            name: "Navigate to services-app",
            unit: [
                {
                    node: [
                        ["id", "services-app", null],
                        ["tag", "h3", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "services_compose"
                },
                {
                    node: [
                        ["id", "services-app", null],
                        ["tag", "h3", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "services_compose_container"
                },
                {
                    node: [
                        ["id", "services-app", null],
                        ["tag", "h4", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Type Dependencies"
                },
                {
                    node: [
                        ["id", "services-app", null],
                        ["tag", "h4", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "References"
                }
            ]
        }
    ];
    list.name = "Local browser tests - services_app";
    list.type = "dom";
    return list;
};

export default test_listLocalBrowserServicesApp;