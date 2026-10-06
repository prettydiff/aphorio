
import vars from "../core/vars.ts";

const test_listLocalBrowserHash = function test_listLocalBrowserHash():test_list_dom {
    const list:test_list_dom = [
        {
            delay: {
                node: [
                    ["getElementById", "hash", null],
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
                        ["getElementsByTagName", "div", 4],
                        ["getElementsByTagName", "button", 3]
                    ]
                }
            ],
            name: "Navigate to hash / base64",
            unit: []
        },
        {
            delay: {
                node: [
                    ["getElementById", "hash", null],
                    ["getElementsByClassName", "form", 1],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "is",
                target: ["value"],
                type: "property",
                value: "cdc5194d384287cb6cf19cd9a0d6df33e844e37b1416f701bd597c791a179199eab851716900f6ebd41b788fd7210db14ef90bf54cf0be78a924de0ca0aa3e70"
            },
            interaction: [
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "textarea", 0]
                    ],
                    value: "hello test automation!"
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Execute hash with defaults",
            unit: []
        },
        {
            delay: {
                node: [
                    ["getElementById", "hash", null],
                    ["getElementsByClassName", "form", 1],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "is",
                target: ["value"],
                type: "property",
                value: "zcUZTThCh8ts8ZzZoNbfM+hE43sUFvcBvVl8eRoXkZnquFFxaQD269QbeI/XIQ2xTvkL9UzwvnipJN4MoKo+cA=="
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 5]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Execute hash with base64 digest",
            unit: []
        },
        {
            delay: {
                node: [
                    ["getElementById", "hash", null],
                    ["getElementsByClassName", "form", 1],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "is",
                target: ["value"],
                type: "property",
                value: "aGVsbG8gdGVzdCBhdXRvbWF0aW9uIQ=="
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 1]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Encode as base64",
            unit: [
                {
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 4]
                    ],
                    qualifier: "is",
                    target: ["disabled"],
                    type: "property",
                    value: true
                },
                {
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 5]
                    ],
                    qualifier: "is",
                    target: ["disabled"],
                    type: "property",
                    value: true
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "hash", null],
                    ["getElementsByClassName", "form", 1],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "is",
                target: ["value"],
                type: "property",
                value: "IyEvdXNyL2Jpbi9lbnYgbm9kZQ0KaW1wb3J0ICIuLi9saWIvaW5kZXgudHMiOw=="
            },
            interaction: [
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "textarea", 0]
                    ],
                    value: `${vars.path.project.replace("test", "")}bin${vars.path.sep}aphorio.js`
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 3]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "base64 of a file",
            unit: [
                {
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 4]
                    ],
                    qualifier: "is",
                    target: ["disabled"],
                    type: "property",
                    value: true
                },
                {
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 5]
                    ],
                    qualifier: "is",
                    target: ["disabled"],
                    type: "property",
                    value: true
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "hash", null],
                    ["getElementsByClassName", "form", 1],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "is",
                target: ["value"],
                type: "property",
                value: "glnA0bd9Ei2LO+1bIa7Wj4V/rrFw7jPNUZl0ZYtVsnhQgJt6e8/XUWNaEYH9QFvW55IwwBxMOaMnAAlqPTrheQ=="
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "hash a file to base64 digest",
            unit: [
                {
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 4]
                    ],
                    qualifier: "is",
                    target: ["disabled"],
                    type: "property",
                    value: false
                },
                {
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 5]
                    ],
                    qualifier: "is",
                    target: ["disabled"],
                    type: "property",
                    value: false
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "hash", null],
                    ["getElementsByClassName", "form", 1],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "is",
                target: ["value"],
                type: "property",
                value: "f470ac101d63d603c6038523d2df66b5e895a0750eb8c2dcf8a896f04e2ddf9ab6cd444c"
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 4]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "select", 0]
                    ],
                    value: "md5-sha1"
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "hash a file to hex digest with md5-sha1",
            unit: []
        }
    ];
    list.name = "Local browser tests - hash";
    list.type = "dom";
    return list;
};

export default test_listLocalBrowserHash;