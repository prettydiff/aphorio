
import vars from "../utilities/vars.ts";

var test_listLocalBrowserCompose = function test_listLocalBrowserCompose():test_list {
    const list:test_list = [
        {
            delay: {
                node: [
                    ["getElementById", "compose", null],
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
                        ["getElementsByTagName", "button", 1]
                    ]
                }
            ],
            name: "Navigate to compose",
            type: "dom",
            unit: []
        }
    ];
    if (vars.compose === null) {
        list.push({
            delay: null,
            interaction: null,
            name: "Display compose error message.",
            type: "dom",
            unit: [{
                node: [
                    ["getElementById", "compose", null],
                    ["getElementsByTagName", "p", 1]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "Docker Compose is not available. Please see the logs for additional information."
            }]
        });
    }
    list.name = "Local browser tests - compose";
    return list;
};

export default test_listLocalBrowserCompose;