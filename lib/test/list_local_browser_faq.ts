

const test_listLocalBrowserFAQ = function test_listLocalBrowserFAQ():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["id", "faq", null],
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
                        ["tag", "button", 2]
                    ]
                }
            ],
            name: "Navigate to faq",
            unit: []
        }
    ];
    list.name = "Local browser tests - faq";
    list.type = "dom";
    return list;
};
export default test_listLocalBrowserFAQ;