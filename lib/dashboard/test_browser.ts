
const test_browser = function testBrowser(socketData:socket_data):void {
    const remote:module_remote = {

        /* Executes the delay test unit if a given test has a delay property */
        delay: function testBrowser_delay(config:test_browserItem):void {
            let a:number = 0;
            const delay:number = 25,
                maxTries:number = 200,
                delayFunction = function testBrowser_delay_timeout():void {
                    const testResult:test_assert = remote.evaluate(config.delay);
                    if (testResult.pass === true) {
                        if (config.unit === null || config.unit.length < 1) {
                            remote.sendTest([testResult], remote.index);
                        } else {
                            remote.report(config.delay, config.unit, remote.index);
                        }
                        return;
                    }
                    a = a + 1;
                    if (a === maxTries) {
                        const element:HTMLElement = remote.node(config.delay.node, config.delay.target[0]),
                            assessment:test_assert = remote.evaluate(config.delay);
                        if (element !== undefined && element !== null && element.nodeType === 1) {
                            element.highlight();
                        }
                        assessment.assessment = ` delay timeout,${assessment.assessment}`;
                        remote.sendTest([assessment], remote.index);
                        return;
                    }
                    setTimeout(testBrowser_delay_timeout, delay);
                };
            if (config.delay === undefined || config.delay === null) {
                remote.report(config.delay, config.unit, remote.index);
            } else {
                setTimeout(delayFunction, delay);
            }
        },

        /* Indicates a well formed test that is logically invalid against the DOM */
        domFailure: false,

        /* Report javascript errors as test failures */
        // eslint-disable-next-line
        error: function testBrowser_error(message:string, source:string, line:number, col:number, error:Error):void {
            remote.sendTest([{
                assessment: "",
                location: "",
                pass: false,
                store: false,
                value: JSON.stringify({
                    file: source,
                    column: col,
                    line: line,
                    message: message,
                    stack: (error === null)
                        ? null
                        : error.stack
                })
            }], remote.index);
        },

        /* Determine whether a given test item is pass or fail */
        evaluate: function testBrowser_evaluate(unit:test_assertion_dom):test_assert {
            const rawValue:[HTMLElement, test_primitive] = remote.getProperty(unit),
                value:HTMLElement|test_primitive = (unit.type === "element")
                    ? rawValue[0]
                    : rawValue[1],
                qualifier:test_qualifier = unit.qualifier,
                test_nullable:boolean = (unit.nullable === true),
                highlight = function testBrowser_evaluate_highlight():void {
                    if (unit !== remote.test_item.test.delay && rawValue[0] !== null && rawValue[0] !== undefined && rawValue[0].nodeType === 1) {
                        rawValue[0].highlight();
                    }
                },
                s_value:string = (typeof value === "string")
                    ? `"${value}"`
                    : String(value),
                s_unit:string = (typeof unit.value === "string")
                    ? `"${unit.value}"`
                    : String(unit.value);
            if (unit.store === true) {
                remote.store = value;
            } else if (unit.value === remote.magicString) {
                unit.value = remote.store as string;
            }
            if (qualifier === "begins") {
                const nullable:boolean = (test_nullable === true && value === null),
                    test:boolean = (String(value).indexOf(String(unit.value)) === 0);
                return {
                    assessment: (nullable === true)
                        ? " is null, which is accepted"
                        : (test === true)
                            ? ` begins with "${unit.value}"`
                            : ` begins with "${value.toString().slice(0, String(unit.value).length)}", not "${unit.value}"`,
                    location: unit.node.nodeString,
                    pass: (test === true || nullable === true),
                    store: unit.store,
                    value: value as string
                };
            }
            if (qualifier === "contains") {
                const nullable:boolean = (unit.nullable === true && value === null),
                    test:boolean = (String(value).includes(String(unit.value)) === true);
                return {
                    assessment: (nullable === true)
                        ? " is null, which is accepted"
                        : (test === true)
                            ? ` is ${s_value}, which contains ${s_unit}`
                            : ` is ${s_value}, which does not contain ${s_unit}`,
                    location: unit.node.nodeString,
                    pass: (test === true || nullable === true),
                    store: unit.store,
                    value: value as string
                };
            }
            if (qualifier === "ends") {
                const str_value:string = String(value),
                    str_unit:string = String(unit.value),
                    nullable:boolean = (unit.nullable === true && value === null),
                    test:boolean = (str_value.indexOf(str_unit) === str_value.length - str_unit.length);
                return {
                    assessment: (nullable === true)
                        ? " is null, which is accepted"
                        : (test === true)
                            ? ` is "${str_value}", which ends with "${str_unit}"`
                            :  ` ends with "${str_value.slice(str_value.length - str_unit.length)}", not "${str_unit}"`,
                    location: unit.node.nodeString,
                    pass: (test === true || nullable === true),
                    store: unit.store,
                    value: value as string
                };
            }
            if (qualifier === "greater") {
                const nullable:boolean = (unit.nullable === true && value === null),
                    test:boolean = (((typeof value === "bigint" || (typeof value === "string" && (/^\d+n$/).test(String(value)) === true)) && BigInt(value as string) > BigInt(unit.value)) || Number(value) > Number(unit.value));
                return {
                    assessment: (nullable === true)
                        ? " is null, which is accepted"
                        : (test === true)
                            ? ` is ${value}, which is greater than ${unit.value}`
                            : ` is ${value}, which is not greater than ${unit.value}`,
                    location: unit.node.nodeString,
                    pass: (test === true || nullable === true),
                    store: unit.store,
                    value: value as string
                };
            }
            if (qualifier === "is") {
                const s_value:string = (typeof value === "string")
                        ? `"${value}"`
                        : String(value),
                    s_unit:string = (typeof unit.value === "string")
                        ? `"${unit.value}"`
                        : String(unit.value),
                    nullable:boolean = (unit.nullable === true && value === null),
                    test:boolean = (value === unit.value);
                return {
                    assessment: (nullable === true)
                        ? " is null, which is accepted"
                        : (test === true)
                            ? ` is exactly ${s_unit}`
                            : ` is ${s_value}, which is not ${s_unit}`,
                    location: unit.node.nodeString,
                    pass: (test === true || nullable === true),
                    store: unit.store,
                    value: value as string
                };
            }
            if (qualifier === "lesser") {
                const nullable:boolean = (unit.nullable === true && value === null),
                    test:boolean = (((typeof value === "bigint" || (typeof value === "string" && (/^\d+n$/).test(String(value)) === true)) && BigInt(value as string) < BigInt(unit.value)) || Number(value) < Number(unit.value));
                return {
                    assessment: (nullable === true)
                        ? " is null, which is accepted"
                        : (test === true)
                            ? ` is ${value}, which is lesser than ${unit.value}`
                            : ` is ${value}, which is not lesser than ${unit.value}`,
                    location: unit.node.nodeString,
                    pass: (test === true || nullable === true),
                    store: unit.store,
                    value: value as string
                };
            }
            if (qualifier === "not") {
                const s_value:string = (typeof value === "string")
                        ? `"${value}"`
                        : String(value),
                    s_unit:string = (typeof unit.value === "string")
                        ? `"${unit.value}"`
                        : String(unit.value),
                    nullable:boolean = (unit.nullable === true && value === null),
                    test:boolean = (value !== unit.value);
                return {
                    assessment: (nullable === true)
                        ? " is null, which is accepted"
                        : (test === true)
                            ? ` is ${s_value}, not ${s_unit}`
                            : ` is exactly ${s_value}`,
                    location: unit.node.nodeString,
                    pass: (test === true || nullable === true),
                    store: unit.store,
                    value: value as string
                };
            }
            if (qualifier === "not contains") {
                const s_value:string = (typeof value === "string")
                        ? `"${value}"`
                        : String(value),
                    s_unit:string = (typeof unit.value === "string")
                        ? `"${unit.value}"`
                        : String(unit.value),
                    nullable:boolean = (unit.nullable === true && value === null),
                    test:boolean = (String(value).includes(String(unit.value)) === false);
                return {
                    assessment: (nullable === true)
                        ? " is null, which is accepted"
                        : (test === true)
                            ? ` is ${s_value}, which does not contain ${s_unit}`
                            : ` is ${s_value}, which contains ${s_unit}`,
                    location: unit.node.nodeString,
                    pass: (test === true || nullable === true),
                    store: unit.store,
                    value: value as string
                };
            }
            if (unit.type === "element") {
                highlight();
                return {
                    assessment: " value is of type dom element",
                    location: unit.node.nodeString.replace(/\s?highlight/, ""),
                    pass: false,
                    store: false,
                    value: "element"
                };
            }
            highlight();
            return {
                assessment: " value does not match other assertion criteria",
                location: unit.node.nodeString,
                pass: false,
                store: false,
                value: remote.stringify(value as test_primitive)
            };
        },

        /* Process a single event instance */
        event: function testBrowser_event(item:services_testBrowser, pageLoad:boolean):void {
            if (item.index > remote.index || remote.index < 0) {
                remote.index = item.index;
                let a:number = 0,
                    refresh:boolean = false;
                const complete = function testBrowser_event_complete():void {
                        if (refresh === false) {
                            remote.delay(item.test);
                        }
                    },
                    action = function testBrowser_event_action(index:number):void {
                        let element:HTMLElement,
                            config:test_browserEvent,
                            htmlElement:HTMLInputElement,
                            delay:number;
                        do {
                            config = item.test.interaction[index];
                            if (config.event === "refresh") {
                                if (index === 0) {
                                    location.reload();
                                } else {
                                    remote.error("The event 'refresh' was provided not as the first event of a test", "", 0, 0, null);
                                }
                                return;
                            }
                            if (config.event === "wait") {
                                delay = (isNaN(Number(config.value)) === true)
                                    ? 0
                                    : Number(config.value);
                                index = index + 1;
                                setTimeout(function testBrowser_event_action_delayNext():void {
                                    if (index < eventLength) {
                                        testBrowser_event_action(index);
                                    } else {
                                        complete();
                                    }
                                }, delay);
                                return;
                            } else if (config.event === "resize" && config.node[0][0] === "window") {
                                if (config.coords === undefined || config.coords === null || config.coords.length !== 2 || isNaN(Number(config.coords[0])) === true || isNaN(Number(config.coords[0])) === true) {
                                    remote.sendTest([{
                                        assessment: " event error on resize",
                                        location: config.node.nodeString,
                                        pass: false,
                                        store: false,
                                        value: null
                                    }], item.index);
                                    remote.test_item = null;
                                    return;
                                }
                                window.resizeTo(Number(config.coords[0]), Number(config.coords[1]));
                            } else if (config.event !== "refresh-interaction") {
                                element = remote.node(config.node, null);
                                if (remote.domFailure === true) {
                                    remote.domFailure = false;
                                    return;
                                }
                                if (element === null || element === undefined) {
                                    remote.sendTest([{
                                        assessment: " event error on refresh",
                                        location: config.node.nodeString,
                                        pass: false,
                                        store: false,
                                        value: null
                                    }], item.index);
                                    remote.test_item = null;
                                    return;
                                }
                                if (config.event === "move") {
                                    element.style.top = `${config.coords[0]}em`;
                                    element.style.left = `${config.coords[1]}em`;
                                } else if (config.event === "resize") {
                                    element.style.width = `${config.coords[0]}em`;
                                    element.style.height = `${config.coords[1]}em`;
                                } else if (config.event === "setValue") {
                                    htmlElement = element as HTMLInputElement;
                                    if (config.value.indexOf("replace\u0000") === 0) {
                                        const values:[string, string] = ["", ""],
                                            parent:HTMLElement = element.parentNode,
                                            sep:string = (htmlElement.value.charAt(0) === "/")
                                                ? "/"
                                                : "\\";
                                        config.value = config.value.replace("replace\u0000", "");
                                        values[0] = config.value.slice(0, config.value.indexOf("\u0000"));
                                        values[1] = config.value.slice(config.value.indexOf("\u0000") + 1).replace(/(\\|\/)/g, sep);
                                        if (parent.getAttribute("class") === "fileAddress") {
                                            htmlElement.value = htmlElement.value.replace(values[0], values[1]);
                                        } else {
                                            htmlElement.value = config.value;
                                        }
                                    } else {
                                        htmlElement.value = config.value;
                                    }
                                } else {
                                    if (config.event === "keydown" || config.event === "keyup") {
                                        if (config.value === "Alt") {
                                            if (config.event === "keydown") {
                                                remote.keyAlt = true;
                                            } else {
                                                remote.keyAlt = false;
                                            }
                                        } else if (config.value === "Control") {
                                            if (config.event === "keydown") {
                                                remote.keyControl = true;
                                            } else {
                                                remote.keyControl = false;
                                            }
                                        } else if (config.value === "Shift") {
                                            if (config.event === "keydown") {
                                                remote.keyShift = true;
                                            } else {
                                                remote.keyShift = false;
                                            }
                                        } else {
                                            const tabIndex:number = element.tabIndex,
                                                event:KeyboardEvent = new KeyboardEvent(config.event, {
                                                    key: config.value,
                                                    altKey: remote.keyAlt,
                                                    ctrlKey: remote.keyControl,
                                                    shiftKey: remote.keyShift
                                                });
                                            element.tabIndex = 0;
                                            element.dispatchEvent(new Event("focus"));
                                            element.dispatchEvent(event);
                                            element.tabIndex = tabIndex;
                                        }
                                    } else if (config.event === "click" || config.event === "contextmenu" || config.event === "dblclick" || config.event === "mousedown" || config.event === "mouseenter" || config.event === "mouseleave" || config.event === "mousemove" || config.event === "mouseout" || config.event === "mouseover" || config.event === "mouseup" || config.event === "touchend" || config.event === "touchstart") {
                                        const event:MouseEvent = new MouseEvent(config.event, {
                                            altKey: remote.keyAlt,
                                            ctrlKey: remote.keyControl,
                                            shiftKey: remote.keyShift
                                        });
                                        element.dispatchEvent(event);
                                    } else {
                                        const event:Event = new Event(config.event, {bubbles: true, cancelable:true});
                                        element.dispatchEvent(event);
                                    }
                                }
                            }
                            index = index + 1;
                        } while (index < eventLength);
                        complete();
                    },
                    eventLength:number = (item.test.interaction === null)
                        ? 0
                        : item.test.interaction.length;
                remote.test_item = item;
                if (eventLength > 0) {
                    do {
                        if (item.test.interaction[a].event === "refresh-interaction") {
                            if (pageLoad === true) {
                                remote.delay(item.test);
                                return;
                            }
                            refresh = true;
                            break;
                        }
                        a = a + 1;
                    } while (a < eventLength);
                }
                if (item.test.interaction === null || item.test.interaction.length < 1) {
                    complete();
                } else {
                    action(0);
                }
            }
        },

        /* Get the value of the specified property/attribute */
        getProperty: function testBrowser_getProperty(unit:test_assertion_dom):[HTMLElement, test_primitive] {
            let type:boolean = false;
            const element:HTMLElement = (unit.node.length > 0)
                    ? remote.node(unit.node, unit.target[0])
                    : null,
                pLength:number = unit.target.length,
                property = function testBrowser_getProperty_property(origin:HTMLElement|Window):test_primitive {
                    let index_prop:number = 0,
                        prop:number|string = null,
                        method:string = null,
                        format:boolean|object|string = origin;
                    if (pLength > 0) {
                        do {
                            prop = unit.target[index_prop];
                            method = (typeof prop === "string" && prop.includes("(") === true && prop.includes(")") === true)
                                ? prop.slice(0, prop.indexOf("("))
                                : "";
                            if (prop === "typeOf" && type === false) {
                                unit.node.nodeString = `typeOf ${unit.node.nodeString}`;
                                type = true;
                            } else if (prop === "isNaN") {
                                format = isNaN(Number(prop));
                            } else if (prop !== "" && prop !== null && prop !== undefined) {
                                unit.node.nodeString = `${unit.node.nodeString}[${prop}]`;
                                // @ts-expect-error - dynamically infers a property on a static object
                                if (method !== "" && (format as object)[method] !== undefined) {
                                    // @ts-expect-error - dynamically infers a property on a static object
                                    format = format[method](prop.slice(prop.indexOf("(") + 1, prop.lastIndexOf(")")));
                                } else if (format !== null) {
                                    // @ts-expect-error - dynamically infers a property on a static object
                                    format = (format as Array<string>)[prop as number];
                                }
                            }
                            if (format === null || format === undefined) {
                                break;
                            }
                            index_prop = index_prop + 1;
                        } while (index_prop < pLength);
                    }
                    if (type === true) {
                        return typeof format;
                    }
                    return format as string;
                };
            if (unit.type === "element") {
                return [element, false];
            }
            if (unit.target[0] === "window") {
                return [element, property(window)];
            }
            if (element === null) {
                return [null, null];
            }
            if (element === undefined || pLength < 0) {
                return [undefined, undefined];
            }
            return (unit.type === "attribute")
                ? [element, element.getAttribute(unit.target[0])]
                : [element, property(element)];
        },

        /* The index of the current executing test */
        index: -1,

        /* Whether the Alt key is pressed, which can modify many various events */
        keyAlt: false,

        /* Whether the Control key is pressed, which can modify many various events */
        keyControl: false,

        /* Whether the Shift key is pressed, which can modify many various events */
        keyShift: false,

        /* Identifies that test comparison value should come from storage */
        magicString: null,

        /* Gather a DOM node using instructions from a data structure */
        node: function testBrowser_node(dom:test_browserDOM, property:string):HTMLElement {
            let element:Document|HTMLElement = document,
                node:[test_domMethod, string, number],
                a:number = 0,
                fail:string = "";
            const nodeLength:number = dom.length,
                str:string[] = ["document"];
            if (dom === null || dom === undefined) {
                return null;
            }
            do {
                node = dom[a];
                if (node[0] === "getElementById" && a > 0) {
                    fail = "Bad test. Method 'getElementById' must only occur as the first DOM method.";
                }
                if (node[2] === null && (node[0] === "childNodes" || node[0] === "getElementsByAttribute" || node[0] === "getElementsByClassName" || node[0] === "getElementsByName" || node[0] === "getElementsByTagName" || node[0] === "getElementsByText" || node[0] === "getModalsByModalType" || node[0] === "getNodesByType")) {
                    if (property !== "length" && a !== nodeLength - 1) {
                        fail = `Bad test. Property '${node[0]}' requires an index value as the third data point of a DOM item: ["${node[0]}", "${node[1]}", ${node[2]}]`;
                    }
                }
                if (node[1] === "" || node[1] === null || node[0] === "activeElement" || node[0] === "documentElement" || node[0] === "firstChild" || node[0] === "lastChild" || node[0] === "nextSibling" || node[0] === "parentNode" || node[0] === "previousSibling") {
                    if (fail === "") {
                        // @ts-expect-error - TypeScript's DOM types do not understand custom extensions to the Document object
                        element = element[node[0]];
                    }
                    str.push(".");
                    str.push(node[0]);
                } else if (node[0] === "childNodes" && node[2] !== null) {
                    if (fail === "") {
                        element = element.childNodes[node[2]] as HTMLElement;
                    }
                    str.push(".childNodes[");
                    str.push(String(node[2]));
                    str.push("]");
                } else if (node[2] === null || node[0] === "getElementById") {
                    if (fail === "") {
                        // @ts-expect-error - TypeScript cannot implicitly walk the DOM by combining data structures and DOM methods
                        element = element[node[0]](node[1]);
                    }
                    str.push(".");
                    str.push(node[0]);
                    str.push("(\"");
                    str.push(node[1]);
                    str.push("\")");
                } else {
                    // @ts-expect-error - TypeScript cannot implicitly walk the DOM by combining data structures and DOM methods
                    const el:HTMLElement[] = element[node[0]](node[1]),
                        len:number = (el === null || el.length < 1)
                            ? -1
                            : el.length;
                    str.push(".");
                    str.push(node[0]);
                    str.push("(\"");
                    str.push(node[1]);
                    str.push("\")");
                    str.push("[");
                    if (node[2] < 0 && len > 0) {
                        if (fail === "") {
                            element = el[len - 1];
                        }
                        str.push(String(len - 1));
                    } else {
                        if (fail === "") {
                            element = el[node[2]];
                        }
                        str.push(String(node[2]));
                    }
                    str.push("]");
                }
                if (element === null || element === undefined) {
                    dom.nodeString = str.join("");
                    if (element === undefined) {
                        return undefined;
                    }
                    return null;
                }
                a = a + 1;
            } while (a < nodeLength);
            dom.nodeString = str.join("");
            if (fail !== "") {
                remote.sendTest([{
                    assessment: fail,
                    location: dom.nodeString,
                    pass: false,
                    store: false,
                    value: ""
                }], remote.index);
                remote.domFailure = true;
                return null;
            }
            return element as HTMLElement;
        },

        /* Process all cases of a test scenario for a given test item */
        report: function testBrowser_report(delay:test_assertion_dom, test:test_assertion_dom[], index:number):void {
            let a:number = 0;
            const result:test_assert[] = [],
                length:number = test.length;
            if (delay !== undefined && delay !== null) {
                result.push(remote.evaluate(delay));
                if (remote.domFailure === true) {
                    remote.domFailure = false;
                    return;
                }
            }
            if (length > 0) {
                do {
                    result.push(remote.evaluate(test[a]));
                    if (remote.domFailure === true) {
                        remote.domFailure = false;
                        return;
                    }
                    a = a + 1;
                } while (a < length);
                remote.sendTest(result, index);
            }
        },

        /* A single location to package test evaluations into a format for transfer across the network */
        sendTest: function testBrowser_sendTest(payload:test_assert[], index:number):services_testBrowser {
            const test:services_testBrowser = {
                index: index,
                magicString: null,
                result: payload,
                store: null,
                test: null
            };
            // eslint-disable-next-line
            console.log(`On browser sending results for test index ${index}`);
            // utility.message_send(test, "test-browser");
            return test;
        },

        store: null,

        /* Converts a primitive of any type into a string for presentation */
        stringify: function testBrowser_raw(primitive:test_primitive):string {
            return (typeof primitive === "string")
                ? `"${primitive.replace(/"/g, "\\\"")}"`
                : String(primitive);
        },
        test_item: null

    };
    if (location.href.indexOf("?test_browser") > 0) {
        const data:services_testBrowser = socketData.data as services_testBrowser;
        // eslint-disable-next-line
        console.log(`On browser receiving test index ${data.index}`);
        remote.magicString = data.magicString;
        remote.store = data.store;
        if (data.index === -10) {
            window.close();
            return;
        }
        if (data.index === -20) {
            location.reload();
            return;
        }
        if (Array.isArray(data.result) === true && data.result.length > 0) {
            remote.sendTest(data.result, data.index);
            return;
        }
        remote.event(data, false);
    }
};

export default test_browser;