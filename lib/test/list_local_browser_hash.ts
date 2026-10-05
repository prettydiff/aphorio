
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
                value: "Ci8vIGNoYW5nZXMgdG8gdGhpcyBtb2R1bGUgbGlzdCBtdXN0IGJlIHJlZmxlY3RlZCBpbiB0aGUgZXF1aXZhbGVudCBzdHJpbmcgaW4gZmlsZToKaW1wb3J0IGxvZyBmcm9tICIuL2NvcmUvbG9nLnRzIjsKaW1wb3J0IG5vZGUgZnJvbSAiLi9jb3JlL25vZGUudHMiOwppbXBvcnQgc2NyZWVuc2hvdHMgZnJvbSAiLi91dGlsaXRpZXMvc2NyZWVuc2hvdHMudHMiOwppbXBvcnQgc3RhcnQgZnJvbSAiLi9zdGFydC9pbmRleC50cyI7CmltcG9ydCB2YXJzIGZyb20gIi4vY29yZS92YXJzLnRzIjsKCmZ1bmN0aW9uIGluZGV4KCk6dm9pZCB7CiAgICB2YXJzLnBhdGguc2VwID0gbm9kZS5wYXRoLnNlcDsKCiAgICB7CiAgICAgICAgbGV0IHByb2Nlc3NfcGF0aDpzdHJpbmcgPSAiIiwKICAgICAgICAgICAgaW5kZXg6bnVtYmVyID0gcHJvY2Vzcy5hcmd2Lmxlbmd0aCwKICAgICAgICAgICAgY29sb25JbmRleDpudW1iZXIgPSBudWxsLAogICAgICAgICAgICBhcmc6dHlwZV9vcHRpb25zID0gbnVsbCwKICAgICAgICAgICAgdmFsdWU6c3RyaW5nID0gbnVsbDsKICAgICAgICBjb25zdCBtb2Rlczp0eXBlX21vZGVbXSA9IFsiY2VydGlmaWNhdGUiLCAiZGVtbyIsICJzZXJ2ZXIiLCAidGVzdC1icm93c2VyIiwgInRlc3QtcHJveHkiXSwKICAgICAgICAgICAgYXNzaWduID0gZnVuY3Rpb24gaW5kZXhfYXNzaWduKGtleTp0eXBlX29wdGlvbnMsIHZhbHVlOnN0cmluZyk6dm9pZCB7CiAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAiZmVhdHVyZSIpIHsKICAgICAgICAgICAgICAgICAgICBpZiAodmFycy5lbnZpcm9ubWVudC5mZWF0dXJlc1t2YWx1ZSBhcyB0eXBlX2Rhc2hib2FyZF9mZWF0dXJlc10gIT09IHVuZGVmaW5lZCkgewogICAgICAgICAgICAgICAgICAgICAgICB2YXJzLm9wdGlvbnMuZmVhdHVyZSA9IHZhbHVlIGFzIHR5cGVfZGFzaGJvYXJkX2ZlYXR1cmVzOwogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAibW9kZSIgJiYgbW9kZXMuaW5jbHVkZXModmFsdWUgYXMgdHlwZV9tb2RlKSA9PT0gdHJ1ZSkgewogICAgICAgICAgICAgICAgICAgIHZhcnMub3B0aW9ucy5tb2RlID0gdmFsdWUgYXMgdHlwZV9tb2RlOwogICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFycy5vcHRpb25zW2tleV0gPT09ICJudW1iZXIiKSB7CiAgICAgICAgICAgICAgICAgICAgY29uc3QgbnVtYjpudW1iZXIgPSBOdW1iZXIodmFsdWUpOwogICAgICAgICAgICAgICAgICAgIGlmIChpc05hTihudW1iKSA9PT0gZmFsc2UpIHsKICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW50Om51bWJlciA9IE1hdGguZmxvb3IobnVtYik7CiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgKICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoa2V5ID09PSAicG9ydC1vcGVuIiB8fCBrZXkgPT09ICJwb3J0LXNlY3VyZSIpICYmIGludCA+IC0xICYmIGludCA8IDY1NTM2KSB8fAogICAgICAgICAgICAgICAgICAgICAgICAgICAgKGtleSAhPT0gInBvcnQtb3BlbiIgJiYga2V5ICE9PSAicG9ydC1zZWN1cmUiKQogICAgICAgICAgICAgICAgICAgICAgICApIHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcnMub3B0aW9uc1trZXkgYXMgImRlbGF5LWludGVydmFscyJdID0gaW50OwogICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFycy5vcHRpb25zW2tleV0gPT09ICJzdHJpbmciICYmIHR5cGVvZiB2YWx1ZSA9PT0gInN0cmluZyIpIHsKICAgICAgICAgICAgICAgICAgICB2YXJzLm9wdGlvbnNba2V5IGFzICJsaXN0Il0gPSB2YWx1ZTsKICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhcnMub3B0aW9uc1trZXldID09PSAiYm9vbGVhbiIpIHsKICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09ICJ0cnVlIikgewogICAgICAgICAgICAgICAgICAgICAgICB2YXJzLm9wdGlvbnNba2V5IGFzICJuby1jb2xvciJdID0gdHJ1ZTsKICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAiZmFsc2UiKSB7CiAgICAgICAgICAgICAgICAgICAgICAgIHZhcnMub3B0aW9uc1trZXkgYXMgIm5vLWNvbG9yIl0gPSBmYWxzZTsKICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH07CiAgICAgICAgaWYgKHZhcnMuY29tbWFuZHMgPT09IHVuZGVmaW5lZCkgewogICAgICAgICAgICBsb2cuc2hlbGwoW2BPcGVyYXRpbmcgc3lzdGVtIHR5cGUgJHtwcm9jZXNzLnBsYXRmb3JtfSBpcyBub3QgeWV0IHN1cHBvcnRlZC5gXSk7CiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTsKICAgICAgICB9CiAgICAgICAgZG8gewogICAgICAgICAgICBpbmRleCA9IGluZGV4IC0gMTsKICAgICAgICAgICAgaWYgKHByb2Nlc3MuYXJndltpbmRleF0uaW5jbHVkZXMoYCR7dmFycy5wYXRoLnNlcH1ub2RlYCkgPT09IHRydWUgJiYgdmFycy5wYXRoLm5vZGUgPT09ICIiKSB7CiAgICAgICAgICAgICAgICB2YXJzLnBhdGgubm9kZSA9IHByb2Nlc3MuYXJndltpbmRleF07CiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5hcmd2W2luZGV4XS5pbmNsdWRlcyhgJHt2YXJzLnBhdGguc2VwfWxpYiR7dmFycy5wYXRoLnNlcH1pbmRleC50c2ApID09PSB0cnVlICYmIHZhcnMucGF0aC5wcm9qZWN0ID09PSAiIikgewogICAgICAgICAgICAgICAgcHJvY2Vzc19wYXRoID0gcHJvY2Vzcy5hcmd2W2luZGV4XS5yZXBsYWNlKGBsaWIke3ZhcnMucGF0aC5zZXB9aW5kZXgudHNgLCAiIik7CiAgICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgICAgICBjb2xvbkluZGV4ID0gcHJvY2Vzcy5hcmd2W2luZGV4XS5pbmRleE9mKCI6Iik7CiAgICAgICAgICAgICAgICBhcmcgPSAoY29sb25JbmRleCA+IDApCiAgICAgICAgICAgICAgICAgICAgPyBwcm9jZXNzLmFyZ3ZbaW5kZXhdLnNsaWNlKDAsIGNvbG9uSW5kZXgpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXi0tLywgIiIpIGFzIHR5cGVfb3B0aW9ucwogICAgICAgICAgICAgICAgICAgIDogcHJvY2Vzcy5hcmd2W2luZGV4XS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL14tLS8sICIiKSBhcyB0eXBlX29wdGlvbnM7CiAgICAgICAgICAgICAgICB2YWx1ZSA9IChjb2xvbkluZGV4ID4gMCkKICAgICAgICAgICAgICAgICAgICA/IHByb2Nlc3MuYXJndltpbmRleF0uc2xpY2UoY29sb25JbmRleCArIDEpCiAgICAgICAgICAgICAgICAgICAgOiBudWxsOwogICAgICAgICAgICAgICAgaWYgKHZhcnMub3B0aW9uc1thcmcgYXMgdHlwZV9vcHRpb25zXSAhPT0gdW5kZWZpbmVkKSB7CiAgICAgICAgICAgICAgICAgICAgYXNzaWduKGFyZywgdmFsdWUpOwogICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtb2Rlcy5pbmNsdWRlcyhhcmcgYXMgdHlwZV9tb2RlKSA9PT0gdHJ1ZSkgewogICAgICAgICAgICAgICAgICAgIHZhcnMub3B0aW9ucy5tb2RlID0gYXJnIGFzIHR5cGVfbW9kZTsKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQogICAgICAgIH0gd2hpbGUgKGluZGV4ID4gMCk7CiAgICAgICAgaWYgKHZhcnMub3B0aW9ucy5tb2RlID09PSAidGVzdC1icm93c2VyIikgewogICAgICAgICAgICB2YXJzLnRlc3QudGVzdGluZyA9IHRydWU7CiAgICAgICAgfSBlbHNlIGlmICh2YXJzLm9wdGlvbnMuZmVhdHVyZSAhPT0gbnVsbCkgewogICAgICAgICAgICB2YXJzLm9wdGlvbnMubW9kZSA9ICJzaGVsbCI7CiAgICAgICAgfQoKICAgICAgICB2YXJzLnBhdGgucHJvamVjdCA9ICh2YXJzLnRlc3QudGVzdGluZyA9PT0gdHJ1ZSkKICAgICAgICAgICAgPyBgJHtwcm9jZXNzX3BhdGh9dGVzdCR7dmFycy5wYXRoLnNlcH1gCiAgICAgICAgICAgIDogcHJvY2Vzc19wYXRoOwogICAgICAgIHZhcnMucGF0aC5jb21wb3NlX2VtcHR5ID0gYCR7cHJvY2Vzc19wYXRofWNvbXBvc2Uke3ZhcnMucGF0aC5zZXB9ZW1wdHkueW1sYDsKICAgICAgICB2YXJzLnBhdGguY29tcG9zZSA9IGAke3ZhcnMucGF0aC5wcm9qZWN0fWNvbXBvc2Uke3ZhcnMucGF0aC5zZXB9YDsKICAgICAgICB2YXJzLnBhdGguc2VydmVycyA9IGAke3ZhcnMucGF0aC5wcm9qZWN0fXNlcnZlcnMke3ZhcnMucGF0aC5zZXB9YDsKICAgICAgICB2YXJzLmNvbW1hbmRzLmNvbXBvc2VfZW1wdHkgPSBgJHt2YXJzLmNvbW1hbmRzLmNvbXBvc2V9IC1mICR7dmFycy5wYXRoLmNvbXBvc2VfZW1wdHl9YDsKCiAgICAgICAgaWYgKHZhcnMub3B0aW9uc1sibm8tY29sb3IiXSA9PT0gdHJ1ZSkgewogICAgICAgICAgICBjb25zdCBrZXlzOnN0cmluZ1tdID0gT2JqZWN0LmtleXModmFycy50ZXh0KTsKICAgICAgICAgICAgaW5kZXggPSBrZXlzLmxlbmd0aDsKICAgICAgICAgICAgZG8gewogICAgICAgICAgICAgICAgaW5kZXggPSBpbmRleCAtIDE7CiAgICAgICAgICAgICAgICB2YXJzLnRleHRba2V5c1tpbmRleF1dID0gIiI7CiAgICAgICAgICAgIH0gd2hpbGUgKGluZGV4ID4gMCk7CiAgICAgICAgfQogICAgICAgIGlmIChwcm9jZXNzLmFyZ3YuaW5jbHVkZXMoInNjcmVlbnNob3QiKSA9PT0gdHJ1ZSB8fCBwcm9jZXNzLmFyZ3YuaW5jbHVkZXMoInNjcmVlbnNob3RzIikgPT09IHRydWUpIHsKICAgICAgICAgICAgc2NyZWVuc2hvdHMoKTsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgICBzdGFydChwcm9jZXNzX3BhdGgpOwogICAgICAgIH0KICAgIH0KfTsKaW5kZXgoKTsKCmV4cG9ydCBkZWZhdWx0IGluZGV4Ow=="
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
                value: "iMFSoIhYzkTCSOcn/Ybs4MYQlJVf0hVf1lTTMXRhJrJQZUANPchbwJgMQaZU89IYD+vffn398uE9ttBXqGkntA=="
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
                value: "d7d1f0d3adc44ae36eeb8385cbb8bdcf3deb803c4d700225be664269fc6e7344fe5483bc"
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