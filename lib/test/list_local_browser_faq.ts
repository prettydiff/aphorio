

const test_listLocalBrowserFAQ:test_list = [
    {
        delay: {
            node: [
                ["getElementById", "faq", null],
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
                    ["getElementsByTagName", "button", 18]
                ]
            }
        ],
        name: "Navigate to faq",
        type: "dom",
        unit: []
    }
];
test_listLocalBrowserFAQ.name = "Local browser tests - faq";

export default test_listLocalBrowserFAQ;