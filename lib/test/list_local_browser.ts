

const test_listLocalBrowser:test_list = [
    {
        delay: null,
        interaction: [],
        name: "Page title",
        type: "dom",
        unit: [{
            node: [
                ["getElementsByTagName", "h1", 0]
            ],
            qualifier: "is",
            target: ["textContent"],
            type: "property",
            value: "Server Management Dashboard"
        }]
    }
];
test_listLocalBrowser.name = "Local browser tests";
export default test_listLocalBrowser;