

const test_listLocalBrowserServersWeb = function test_listLocalBrowserServersWeb():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["id", "servers-web", null],
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
                        ["tag", "div", 0],
                        ["tag", "button", 0]
                    ]
                }
            ],
            name: "Navigate to servers-web",
            unit: [
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0]
                    ],
                    qualifier: "is",
                    target: ["class"],
                    type: "attribute",
                    value: "green"
                }
            ]
        },
        {
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "button", 0]
                    ]
                }
            ],
            name: "Expand dashboard server accordion",
            unit: [
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["tag", "textarea", 0]
                    ],
                    qualifier: "greater",
                    target: ["offsetTop"],
                    type: "property",
                    value: 10
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["class", "active-ports", 0],
                        ["tag", "li", 1]
                    ],
                    qualifier: "begins",
                    target: ["textContent"],
                    type: "property",
                    value: "Secure - "
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["class", "active-ports", 0],
                        ["tag", "code", 0]
                    ],
                    qualifier: "begins",
                    target: ["textContent"],
                    type: "property",
                    value: "-----BEGIN CERTIFICATE-----"
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["class", "active-ports", 0],
                        ["tag", "code", 1]
                    ],
                    qualifier: "greater",
                    target: ["textContent", "length"],
                    type: "property",
                    value: 500
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["tag", "button", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "✎ Edit"
                }
            ]
        },
        {
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["tag", "button", 1]
                    ]
                }
            ],
            name: "Edit mode for a server",
            unit: [
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["tag", "button", 1]
                    ],
                    qualifier: "is",
                    target: ["disabled"],
                    type: "property",
                    value: true
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["tag", "button", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "🖪 Modify"
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["tag", "h5", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Edit Summary"
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["class", "edit-summary", 0]
                    ],
                    qualifier: "is",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: "The server configuration is valid, but not modified."
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["class", "edit-summary", 0],
                        ["last", null, null]
                    ],
                    qualifier: "is",
                    target: ["class"],
                    type: "attribute",
                    value: "pass-false"
                }
            ]
        },
        {
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["tag", "button", 0]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["tag", "button", 0]
                    ]
                }
            ],
            name: "Close and reopen server accordion",
            unit: [
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["tag", "button", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "✎ Edit"
                }
            ]
        },
        {
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["parent", null, null],
                        ["tag", "button", 0]
                    ]
                }
            ],
            name: "Prepare new insecure server",
            unit: [
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "edit", 0],
                        ["class", "edit-summary", 0],
                        ["class", "pass-warn", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Warning: The name 'new_server' is a default placeholder. A more unique name is preferred."
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "edit", 0],
                        ["class", "edit-summary", 0],
                        ["class", "pass-warn", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Warning: A port value of 0 will assign a randomly available port from the local machine. A number greater than 0 and less than 65535 is preferred."
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["parent", null, null],
                        ["tag", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["disabled"],
                    type: "property",
                    value: true
                }
            ]
        },
        {
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "edit", 0],
                        ["tag", "textarea", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "edit", 0],
                        ["tag", "textarea", 0]
                    ],
                    value: `{
    "activate": true,
    "domain_local": [
        "localhost"
    ],
    "encryption": "open",
    "id": "",
    "message_segmentation": 1e6,
    "mutual_tls": false,
    "name": "test-server",
    "ports": {
        "open": 54321
    },
    "upgrade": false
}`
                },
                {
                    event: "keydown",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "edit", 0],
                        ["tag", "textarea", 0]
                    ],
                    value: "shift"
                },
                {
                    event: "keyup",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "edit", 0],
                        ["tag", "textarea", 0]
                    ],
                    value: "shift"
                }
            ],
            name: "Define new insecure server",
            unit: [
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "edit", 0],
                        ["class", "edit-summary", 0],
                        ["class", "pass-warn", null]
                    ],
                    qualifier: "is",
                    target: ["length"],
                    type: "property",
                    value: 0
                }
            ]
        },
        {
            delay: {
                node: [
                    ["id", "servers-web", null],
                    ["class", "edit", null]
                ],
                qualifier: "is",
                target: ["length"],
                type: "property",
                value: 1
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "edit", 0],
                        ["class", "server-cancel", 0]
                    ]
                }
            ],
            name: "Cancel new insecure server",
            unit: [
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["parent", null, null],
                        ["tag", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["disabled"],
                    type: "property",
                    value: false
                }
            ]
        },
        {
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-new", 0]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "edit", 0],
                        ["tag", "textarea", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "edit", 0],
                        ["tag", "textarea", 0]
                    ],
                    value: `{
    "activate": true,
    "domain_local": [
        "localhost"
    ],
    "encryption": "open",
    "id": "",
    "message_segmentation": 1e6,
    "mutual_tls": false,
    "name": "test-server",
    "ports": {
        "open": 54321
    },
    "upgrade": false
}`
                },
                {
                    event: "keydown",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "edit", 0],
                        ["tag", "textarea", 0]
                    ],
                    value: "shift"
                },
                {
                    event: "keyup",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "edit", 0],
                        ["tag", "textarea", 0]
                    ],
                    value: "shift"
                },
                {
                    event: "click",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "edit", 0],
                        ["class", "server-add", 0]
                    ]
                },
                {
                    event: "wait",
                    node: [],
                    value: "200"
                }

            ],
            name: "Create new insecure server",
            unit: [
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "edit", null]
                    ],
                    qualifier: "is",
                    target: ["length"],
                    type: "property",
                    value: 0
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["tag", "button", 0],
                        ["last", null, null]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "dashboard - online"
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 1],
                        ["tag", "button", 0],
                        ["last", null, null]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "test-server - online"
                }
            ]
        },
        {
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "button", 0]
                    ]
                }
            ],
            name: "Expand new open server accordion",
            unit: [
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["tag", "textarea", 0]
                    ],
                    qualifier: "greater",
                    target: ["offsetTop"],
                    type: "property",
                    value: 10
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["class", "active-ports", 0],
                        ["tag", "li", 0]
                    ],
                    qualifier: "begins",
                    target: ["textContent"],
                    type: "property",
                    value: "Open - "
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["class", "active-ports", 0],
                        ["tag", "code", 0]
                    ],
                    qualifier: "begins",
                    target: ["textContent"],
                    type: "property",
                    value: "-----BEGIN CERTIFICATE-----"
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["class", "active-ports", 0],
                        ["tag", "code", 1]
                    ],
                    qualifier: "greater",
                    target: ["textContent", "length"],
                    type: "property",
                    value: 3000
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["tag", "button", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "✎ Edit"
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["class", "edit-summary", 0],
                        ["class", "pass-warn", null]
                    ],
                    qualifier: "is",
                    target: ["length"],
                    type: "property",
                    value: 0
                }
            ]
        },
        {
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 0],
                        ["tag", "button", 0]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 1],
                        ["tag", "button", 0]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 1],
                        ["tag", "button", 1]
                    ]
                }
            ],
            name: "Open server accordion and edit",
            unit: [
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 1],
                        ["class", "edit", 0],
                        ["class", "buttons", 0],
                        ["tag", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["class"],
                    type: "attribute",
                    value: "server-deactivate"
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 1],
                        ["class", "edit", 0],
                        ["class", "buttons", 0],
                        ["tag", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "። Deactivate"
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 1],
                        ["class", "edit", 0],
                        ["class", "buttons", 0],
                        ["tag", "button", 1]
                    ],
                    qualifier: "is",
                    target: ["class"],
                    type: "attribute",
                    value: "server-activate"
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 1],
                        ["class", "edit", 0],
                        ["class", "buttons", 0],
                        ["tag", "button", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "⌁ Activate"
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 1],
                        ["class", "edit", 0],
                        ["class", "buttons", 0],
                        ["tag", "button", 1]
                    ],
                    qualifier: "is",
                    target: ["disabled"],
                    type: "property",
                    value: true
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 1],
                        ["class", "edit", 0],
                        ["class", "buttons", 1],
                        ["tag", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["class"],
                    type: "attribute",
                    value: "server-destroy"
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 1],
                        ["class", "edit", 0],
                        ["class", "buttons", 1],
                        ["tag", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "✘ Destroy"
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 1],
                        ["class", "edit", 0],
                        ["class", "buttons", 1],
                        ["tag", "button", 1]
                    ],
                    qualifier: "is",
                    target: ["class"],
                    type: "attribute",
                    value: "server-modify"
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 1],
                        ["class", "edit", 0],
                        ["class", "buttons", 1],
                        ["tag", "button", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "🖪 Modify"
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 1],
                        ["class", "edit", 0],
                        ["class", "buttons", 1],
                        ["tag", "button", 1]
                    ],
                    qualifier: "is",
                    target: ["disabled"],
                    type: "property",
                    value: true
                },
                {
                    node: [
                        ["id", "servers-web", null],
                        ["class", "edit", 0],
                        ["class", "edit-summary", 0],
                        ["class", "pass-false", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "The server configuration is valid, but not modified."
                }
            ]
        },
        {
            delay: {
                node: [
                    ["id", "servers-web", null],
                    ["class", "server-list", 0],
                    ["tag", "li", 1]
                ],
                qualifier: "is",
                target: [],
                type: "element",
                value: undefined
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["id", "servers-web", null],
                        ["class", "server-list", 0],
                        ["tag", "li", 1],
                        ["class", "edit", 0],
                        ["class", "buttons", 1],
                        ["tag", "button", 0]
                    ]
                }
            ],
            name: "Destroy new server",
            unit: []
        }
    ];
    list.name = "Local browser tests - servers, web";
    list.type = "dom";
    return list;
};

export default test_listLocalBrowserServersWeb;