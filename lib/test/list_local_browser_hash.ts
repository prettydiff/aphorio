
import vars from "../core/vars.ts";

const test_listLocalBrowserHash = function test_listLocalBrowserHash():test_list {
    const list:test_list= [
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
                        ["getElementsByTagName", "div", 3],
                        ["getElementsByTagName", "button", 3]
                    ]
                }
            ],
            name: "Navigate to hash / base64",
            type: "dom",
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
            type: "dom",
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
            type: "dom",
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
            type: "dom",
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
                value: "CmltcG9ydCBsb2cgZnJvbSAiLi9jb3JlL2xvZy50cyI7CmltcG9ydCBub2RlIGZyb20gIi4vY29yZS9ub2RlLnRzIjsKaW1wb3J0IHNjcmVlbnNob3RzIGZyb20gIi4vdXRpbGl0aWVzL3NjcmVlbnNob3RzLnRzIjsKaW1wb3J0IHN0YXJ0X2FwcGxpY2F0aW9uIGZyb20gIi4vdXRpbGl0aWVzL3N0YXJ0X2FwcGxpY2F0aW9uLnRzIjsKaW1wb3J0IHZhcnMgZnJvbSAiLi9jb3JlL3ZhcnMudHMiOwoKdmFycy5wYXRoLnNlcCA9IG5vZGUucGF0aC5zZXA7Cgp7CiAgICBsZXQgcHJvY2Vzc19wYXRoOnN0cmluZyA9ICIiLAogICAgICAgIGluZGV4Om51bWJlciA9IHByb2Nlc3MuYXJndi5sZW5ndGgsCiAgICAgICAgY29sb25JbmRleDpudW1iZXIgPSBudWxsLAogICAgICAgIGFyZzpzdHJpbmcgPSBudWxsLAogICAgICAgIHZhbHVlOnN0cmluZyA9IG51bGw7CgogICAgaWYgKHZhcnMuY29tbWFuZHMgPT09IHVuZGVmaW5lZCkgewogICAgICAgIGxvZy5zaGVsbChbYE9wZXJhdGluZyBzeXN0ZW0gdHlwZSAke3Byb2Nlc3MucGxhdGZvcm19IGlzIG5vdCB5ZXQgc3VwcG9ydGVkLmBdKTsKICAgICAgICBwcm9jZXNzLmV4aXQoMSk7CiAgICB9CiAgICBkbyB7CiAgICAgICAgaW5kZXggPSBpbmRleCAtIDE7CiAgICAgICAgaWYgKHByb2Nlc3MuYXJndltpbmRleF0uaW5jbHVkZXMoYCR7dmFycy5wYXRoLnNlcH1ub2RlYCkgPT09IHRydWUgJiYgdmFycy5wYXRoLm5vZGUgPT09ICIiKSB7CiAgICAgICAgICAgIHZhcnMucGF0aC5ub2RlID0gcHJvY2Vzcy5hcmd2W2luZGV4XTsKICAgICAgICB9IGVsc2UgaWYgKHByb2Nlc3MuYXJndltpbmRleF0uaW5jbHVkZXMoYCR7dmFycy5wYXRoLnNlcH1saWIke3ZhcnMucGF0aC5zZXB9aW5kZXgudHNgKSA9PT0gdHJ1ZSAmJiB2YXJzLnBhdGgucHJvamVjdCA9PT0gIiIpIHsKICAgICAgICAgICAgcHJvY2Vzc19wYXRoID0gcHJvY2Vzcy5hcmd2W2luZGV4XS5yZXBsYWNlKGBsaWIke3ZhcnMucGF0aC5zZXB9aW5kZXgudHNgLCAiIik7CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgY29sb25JbmRleCA9IHByb2Nlc3MuYXJndltpbmRleF0uaW5kZXhPZigiOiIpOwogICAgICAgICAgICBhcmcgPSAoY29sb25JbmRleCA+IDApCiAgICAgICAgICAgICAgICA/IHByb2Nlc3MuYXJndltpbmRleF0uc2xpY2UoMCwgY29sb25JbmRleCkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9eLS0vLCAiIikKICAgICAgICAgICAgICAgIDogcHJvY2Vzcy5hcmd2W2luZGV4XS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL14tLS8sICIiKTsKICAgICAgICAgICAgdmFsdWUgPSAoY29sb25JbmRleCA+IDApCiAgICAgICAgICAgICAgICA/IHByb2Nlc3MuYXJndltpbmRleF0uc2xpY2UoY29sb25JbmRleCArIDEpCiAgICAgICAgICAgICAgICA6IG51bGw7CiAgICAgICAgICAgIGlmICh2YXJzLm9wdGlvbnNbYXJnIGFzICJ0ZXN0Il0gIT09IHVuZGVmaW5lZCB8fCB2YXJzLm9wdGlvbnNbYXJnLnNsaWNlKDAsIGFyZy5pbmRleE9mKCI6IikpIGFzICJ0ZXN0Il0gIT09IHVuZGVmaW5lZCkgewogICAgICAgICAgICAgICAgaWYgKGFyZy5pbmRleE9mKCJicm93c2VyIikgPT09IDApIHsKICAgICAgICAgICAgICAgICAgICB2YXJzLm9wdGlvbnNbImJyb3dzZXIiXSA9IHZhbHVlOwogICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcuaW5kZXhPZigibGlzdCIpID09PSAwKSB7CiAgICAgICAgICAgICAgICAgICAgdmFycy5vcHRpb25zWyJsaXN0Il0gPSB2YWx1ZTsKICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJnLmluZGV4T2YoInBvcnQtb3BlbiIpID09PSAwICYmIGlzTmFOKE51bWJlcih2YWx1ZSkpID09PSBmYWxzZSkgewogICAgICAgICAgICAgICAgICAgIHZhcnMub3B0aW9uc1sicG9ydC1vcGVuIl0gPSBOdW1iZXIodmFsdWUpOwogICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcuaW5kZXhPZigicG9ydC1zZWN1cmUiKSA9PT0gMCAmJiBpc05hTihOdW1iZXIodmFsdWUpKSA9PT0gZmFsc2UpIHsKICAgICAgICAgICAgICAgICAgICB2YXJzLm9wdGlvbnNbInBvcnQtc2VjdXJlIl0gPSBOdW1iZXIodmFsdWUpOwogICAgICAgICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgICAgICAgICB2YXJzLm9wdGlvbnNbYXJnIGFzICJ0ZXN0Il0gPSB0cnVlOwogICAgICAgICAgICAgICAgICAgIHZhcnMudGVzdC50ZXN0aW5nID0gdHJ1ZTsKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQogICAgICAgIH0KICAgIH0gd2hpbGUgKGluZGV4ID4gMCk7CgogICAgdmFycy5wYXRoLnByb2plY3QgPSAodmFycy50ZXN0LnRlc3RpbmcgPT09IHRydWUpCiAgICAgICAgPyBgJHtwcm9jZXNzX3BhdGh9dGVzdCR7dmFycy5wYXRoLnNlcH1gCiAgICAgICAgOiBwcm9jZXNzX3BhdGg7CiAgICB2YXJzLnBhdGguY29tcG9zZV9lbXB0eSA9IGAke3Byb2Nlc3NfcGF0aH1jb21wb3NlJHt2YXJzLnBhdGguc2VwfWVtcHR5LnltbGA7CiAgICB2YXJzLnBhdGguY29tcG9zZSA9IGAke3ZhcnMucGF0aC5wcm9qZWN0fWNvbXBvc2Uke3ZhcnMucGF0aC5zZXB9YDsKICAgIHZhcnMucGF0aC5zZXJ2ZXJzID0gYCR7dmFycy5wYXRoLnByb2plY3R9c2VydmVycyR7dmFycy5wYXRoLnNlcH1gOwogICAgdmFycy5jb21tYW5kcy5jb21wb3NlX2VtcHR5ID0gYCR7dmFycy5jb21tYW5kcy5jb21wb3NlfSAtZiAke3ZhcnMucGF0aC5jb21wb3NlX2VtcHR5fWA7CgogICAgaWYgKHZhcnMub3B0aW9uc1sibm8tY29sb3IiXSA9PT0gdHJ1ZSkgewogICAgICAgIGNvbnN0IGtleXM6c3RyaW5nW10gPSBPYmplY3Qua2V5cyh2YXJzLnRleHQpOwogICAgICAgIGluZGV4ID0ga2V5cy5sZW5ndGg7CiAgICAgICAgZG8gewogICAgICAgICAgICBpbmRleCA9IGluZGV4IC0gMTsKICAgICAgICAgICAgdmFycy50ZXh0W2tleXNbaW5kZXhdXSA9ICIiOwogICAgICAgIH0gd2hpbGUgKGluZGV4ID4gMCk7CiAgICB9CiAgICBpZiAocHJvY2Vzcy5hcmd2LmluY2x1ZGVzKCJzY3JlZW5zaG90IikgPT09IHRydWUgfHwgcHJvY2Vzcy5hcmd2LmluY2x1ZGVzKCJzY3JlZW5zaG90cyIpID09PSB0cnVlKSB7CiAgICAgICAgc2NyZWVuc2hvdHMoKTsKICAgIH0gZWxzZSB7CiAgICAgICAgc3RhcnRfYXBwbGljYXRpb24ocHJvY2Vzc19wYXRoKTsKICAgIH0KfQ=="
            },
            interaction: [
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "textarea", 0]
                    ],
                    value: `${vars.path.project.replace("test", "")}lib${vars.path.sep}index.ts`
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
            type: "dom",
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
                value: "Ya1hlvPEdU9UL+r5H38mMkwnfZS6zJg14+pK+/qXOsR3u0NZ/HrQZbl2rZFRTLBxzQuislMgPLkxCxM3jb5apQ=="
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
            type: "dom",
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
                value: "f4f97e71594ae606e277369b54cd6c08d740ae0caa2130278be3ecac6e5f475a44daecb0"
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
            type: "dom",
            unit: []
        }
    ];
    list.name = "Local browser tests - hash";
    return list;
};

export default test_listLocalBrowserHash;