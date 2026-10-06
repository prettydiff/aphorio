
import vars from "../core/vars.ts";

const test_listLocalBrowserComposeContainers = function test_listLocalBrowserComposeContainers():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["getElementById", "compose-containers", null],
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
            unit: []
        }
    ];
    if (vars.environment.compose_status === null) {
        list.push({
            delay: null,
            interaction: null,
            name: "Display compose error message.",
            unit: [{
                node: [
                    ["getElementById", "compose-containers", null],
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
    list.type = "dom";
    return list;
};

export default test_listLocalBrowserComposeContainers;