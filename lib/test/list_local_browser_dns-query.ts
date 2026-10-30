// cspell: words bxsw, docusign, onetrust, smime, tlds

const test_listLocalBrowserDNSQuery = function test_listLocalBrowserDNSQuery():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["id", "dns-query", null],
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
                        ["tag", "div", 4],
                        ["tag", "button", 2]
                    ]
                }
            ],
            name: "Navigate to dns query",
            unit: []
        },
        {
            delay: {
                node: [
                    ["id", "dns-query", null],
                    ["tag", "textarea", 0]
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
                        ["id", "dns-query", null],
                        ["tag", "input", 0]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "input", 2]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "input", 2]
                    ],
                    value: "google.com"
                },
                {
                    event: "click",
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "input", 3]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "input", 3]
                    ],
                    value: "A"
                },
                {
                    event: "click",
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "button", 1]
                    ]
                }
            ],
            name: "Query google.com with A record type",
            unit: [{
                node: [
                    ["id", "dns-query", null],
                    ["tag", "textarea", 0]
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
                    ["id", "dns-query", null],
                    ["tag", "textarea", 0]
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
                        ["id", "dns-query", null],
                        ["tag", "input", 0]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "input", 2]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "input", 2]
                    ],
                    value: "google.com"
                },
                {
                    event: "click",
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "input", 3]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "input", 3]
                    ],
                    value: "AAAA"
                },
                {
                    event: "keyup",
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "input", 3]
                    ],
                    value: "Enter"
                }
            ],
            name: "Query google.com with AAAA record type",
            unit: [{
                node: [
                    ["id", "dns-query", null],
                    ["tag", "textarea", 0]
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
                    ["id", "dns-query", null],
                    ["tag", "textarea", 0]
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
                        ["id", "dns-query", null],
                        ["tag", "input", 0]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "input", 2]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "input", 2]
                    ],
                    value: "google.com"
                },
                {
                    event: "click",
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "input", 3]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "input", 3]
                    ],
                    value: ""
                },
                {
                    event: "keyup",
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "input", 3]
                    ],
                    value: "Enter"
                }
            ],
            name: "Query google.com with all record types",
            unit: [
                {
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "textarea", 0]
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
                        ["id", "dns-query", null],
                        ["tag", "textarea", 0]
                    ],
                    qualifier: "contains",
                    target: ["value"],
                    type: "property",
                    value: `
        "AAAA" : ["`
                },
                {
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "textarea", 0]
                    ],
                    qualifier: "contains",
                    target: ["value"],
                    type: "property",
                    value: `
        "CAA"  : [`
                },
                {
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "textarea", 0]
                    ],
                    qualifier: "contains",
                    target: ["value"],
                    type: "property",
                    value: `
        "CNAME": []`
                },
                {
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "textarea", 0]
                    ],
                    qualifier: "contains",
                    target: ["value"],
                    type: "property",
                    value: `
        "MX"   : [`
                },
                {
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "textarea", 0]
                    ],
                    qualifier: "contains",
                    target: ["value"],
                    type: "property",
                    value: `
        "NAPTR": []`
                },
                {
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "textarea", 0]
                    ],
                    qualifier: "contains",
                    target: ["value"],
                    type: "property",
                    value: `
        "NS"   : ["`
                },
                {
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "textarea", 0]
                    ],
                    qualifier: "contains",
                    target: ["value"],
                    type: "property",
                    value: `
        "PTR"  : []`
                },
                {
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "textarea", 0]
                    ],
                    qualifier: "contains",
                    target: ["value"],
                    type: "property",
                    value: `
        "SOA"  : {`
                },
                {
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "textarea", 0]
                    ],
                    qualifier: "contains",
                    target: ["value"],
                    type: "property",
                    value: `
        "SRV"  : []`
                },
                {
                    node: [
                        ["id", "dns-query", null],
                        ["tag", "textarea", 0]
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
    list.name = "Local browser tests - dns";
    list.type = "dom";
    return list;
};

export default test_listLocalBrowserDNSQuery;