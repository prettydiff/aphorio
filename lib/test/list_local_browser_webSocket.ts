

const test_listLocalBrowserWebSocket:test_list = [
    {
        delay: {
            node: [
                ["getElementById", "test-websocket", null],
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
                    ["getElementsByTagName", "button", 13]
                ]
            }
        ],
        name: "Navigate to websocket test",
        type: "dom",
        unit: []
    }
];
test_listLocalBrowserWebSocket.name = "Local browser tests - web socket";

export default test_listLocalBrowserWebSocket;