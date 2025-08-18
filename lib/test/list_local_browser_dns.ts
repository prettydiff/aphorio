// cspell: words bxsw, docusign, onetrust, smime, tlds

var test_listLocalBrowserDNS:test_list = [
    {
        delay: {
            node: [
                ["getElementById", "dns", null],
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
        name: "Navigate to dns query",
        type: "dom",
        unit: []
    },
    {
        delay: {
            node: [
                ["getElementById", "dns", null],
                ["getElementsByTagName", "textarea", 0]
            ],
            qualifier: "not",
            target: ["value"],
            type: "property",
            value: ""
        },
        interaction: [
            {
                event: "click",
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "input", 0]
                ]
            },
            {
                event: "click",
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "input", 2]
                ]
            },
            {
                event: "setValue",
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "input", 2]
                ],
                value: "google.com"
            },
            {
                event: "click",
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "input", 3]
                ]
            },
            {
                event: "setValue",
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "input", 3]
                ],
                value: "A"
            },
            {
                event: "click",
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "button", 1]
                ]
            }
        ],
        name: "Query google.com with A record type",
        type: "dom",
        unit: [{
            node: [
                ["getElementById", "dns", null],
                ["getElementsByTagName", "textarea", 0]
            ],
            qualifier: "begins",
            target: ["value"],
            type: "property",
            value: `{
    "google.com": {
        "A": ["`
        }]
    },
    {
        delay: {
            node: [
                ["getElementById", "dns", null],
                ["getElementsByTagName", "textarea", 0]
            ],
            qualifier: "not",
            target: ["value"],
            type: "property",
            value: ""
        },
        interaction: [
            {
                event: "click",
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "input", 0]
                ]
            },
            {
                event: "click",
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "input", 2]
                ]
            },
            {
                event: "setValue",
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "input", 2]
                ],
                value: "google.com"
            },
            {
                event: "click",
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "input", 3]
                ]
            },
            {
                event: "setValue",
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "input", 3]
                ],
                value: "AAAA"
            },
            {
                event: "keyup",
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "input", 3]
                ],
                value: "Enter"
            }
        ],
        name: "Query google.com with AAAA record type",
        type: "dom",
        unit: [{
            node: [
                ["getElementById", "dns", null],
                ["getElementsByTagName", "textarea", 0]
            ],
            qualifier: "begins",
            target: ["value"],
            type: "property",
            value: `{
    "google.com": {
        "AAAA": ["`
        }]
    },
    {
        delay: {
            node: [
                ["getElementById", "dns", null],
                ["getElementsByTagName", "textarea", 0]
            ],
            qualifier: "not",
            target: ["value"],
            type: "property",
            value: ""
        },
        interaction: [
            {
                event: "click",
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "input", 0]
                ]
            },
            {
                event: "click",
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "input", 2]
                ]
            },
            {
                event: "setValue",
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "input", 2]
                ],
                value: "google.com"
            },
            {
                event: "click",
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "input", 3]
                ]
            },
            {
                event: "setValue",
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "input", 3]
                ],
                value: ""
            },
            {
                event: "keyup",
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "input", 3]
                ],
                value: "Enter"
            }
        ],
        name: "Query google.com with all record types",
        type: "dom",
        unit: [
            {
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "begins",
                target: ["value"],
                type: "property",
                value: `{
    "google.com": {
        "A"    : ["`
            },
            {
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "contains",
                target: ["value"],
                type: "property",
                value: `
        "AAAA" : ["`
            },
            {
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "contains",
                target: ["value"],
                type: "property",
                value: `
        "CAA"  : [`
            },
            {
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "contains",
                target: ["value"],
                type: "property",
                value: `
        "CNAME": []`
            },
            {
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "contains",
                target: ["value"],
                type: "property",
                value: `
        "MX"   : [`
            },
            {
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "contains",
                target: ["value"],
                type: "property",
                value: `
        "NAPTR": []`
            },
            {
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "contains",
                target: ["value"],
                type: "property",
                value: `
        "NS"   : ["`
            },
            {
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "contains",
                target: ["value"],
                type: "property",
                value: `
        "PTR"  : []`
            },
            {
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "contains",
                target: ["value"],
                type: "property",
                value: `
        "SOA"  : {`
            },
            {
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "contains",
                target: ["value"],
                type: "property",
                value: `
        "SRV"  : []`
            },
            {
                node: [
                    ["getElementById", "dns", null],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "contains",
                target: ["value"],
                type: "property",
                value: `
        "TXT"  : [`
            }
        ]
    }
];
test_listLocalBrowserDNS.name = "Local browser tests - dns";

export default test_listLocalBrowserDNS;