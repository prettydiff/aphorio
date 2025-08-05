
interface test_assertion_command {
    format?: "csv" | "json" | "lines" | "string";
    nullable?: boolean;
    properties?: (number|string)[];
    qualifier: test_qualifier;
    type: "stderr" | "stdout";
    value: boolean | number | string;
}

interface test_assertion_dom {
    node: test_browserDOM;
    nullable?: boolean;
    qualifier: test_qualifier;
    target: string[];
    type: "attribute" | "element" | "property";
    value: boolean | number | string | null;
}

interface test_browserDOM extends Array<type_browserDOM> {
    nodeString?: string;
}

interface test_browserEvent {
    coords?: [number, number];
    event: test_eventName;
    node: test_browserDOM;
    value?: string;
}

interface test_browserItem {
    delay?: test_assertion_dom;
    interaction: test_browserEvent[];
    name: string;
    unit: test_assertion_dom[];
}

interface test_command_format {
    csv: () => string[][];
    json: () => object;
    lines: () => string[];
    string: () => string;
}

interface test_config_summary {
    final: boolean;
    list_assertions: number;
    list_fail_assertions: number;
    list_fail_tests: number;
    list_tests: number;
    name: string;
    time_list_end: bigint;
    time_list_start: bigint;
    time_total_end: bigint;
    time_total_start: bigint;
    total_assertions: number;
    total_fail_assertions: number;
    total_fail_tests: number;
    total_lists: number;
    total_tests: number;
}

interface test_event {
    coords?: [number, number];
    event: test_eventName;
    node: test_browserDOM;
    value?: string;
}

interface test_item_command {
    command: string;
    name: string;
    shell?: string;
    type: "command";
    unit: test_assertion_command[];
}

interface test_item_dom {
    delay?: test_assertion_dom;
    interaction: test_event[];
    name: string;
    type: "dom";
    unit: test_assertion_dom[];
}

interface test_list extends Array<test_item_command|test_item_dom> {
    name?: string;
}

interface test_runner {
    assert: {
        [key:string]: (value:string, unit:test_assertion_command|test_assertion_dom, location:string) => test_assertionItem;
    };
    count: number;
    execution: {
        command: () => void;
        dom: () => void;
    };
    list: (list:test_list, callback:(name:string) => void) => void;
    logger: (assertions:test_assertionItem[], name:string) => void;
    logs: string[];
    receive: (socket_data:socket_data) => void;
    tools: {
        browser_open: () => void;
        callback: (name:string) => void;
        complete: () => void;
        next: () => void;
        time: () => string;
    };
}

// pass/fail, actual value, location, assessment
type test_assertionItem = [boolean, string, string, string];
type test_browserAction = "close" | "exit" | "nothing" | "reset-complete" | "reset" | "result";
type test_domMethod = "activeElement" | "addClass" | "childNodes" | "documentElement" | "firstChild" | "getAncestor" | "getElementById" | "getElementsByAttribute" | "getElementsByClassName" | "getElementsByName" | "getElementsByTagName" | "getElementsByText" | "getModalsByModalType" | "getNodesByType" | "lastChild" | "nextSibling" | "parentNode" | "previousSibling" | "removeClass" | "window";
type test_eventName = "blur" | "click" | "command" | "contextmenu" | "dblclick" | "focus" | "keydown" | "keyup" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "move" | "refresh-interaction" | "refresh" | "resize" | "select" | "setValue" | "touchend" | "touchstart" | "wait";
type test_primitive = boolean | number | string | null | undefined;
type test_qualifier = "begins" | "contains" | "ends" | "greater" | "is" | "lesser" | "not contains" | "not";

// type test_type = "command" | "dom" | "file" | "http" | "websocket"