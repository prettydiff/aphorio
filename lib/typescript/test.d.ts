
interface test_assertion_command {
    format?: "json" | "lines" | "string";
    properties?: (number|string)[];
    qualifier: test_qualifier;
    type: "stderr" | "stdout";
    value: number | string;
}

interface test_assertion_dom {
    node: test_browserDOM;
    qualifier: test_qualifier;
    target: string[];
    type: "attribute" | "element" | "property";
    value: boolean | number | string | null;
}

interface test_browserDOM extends Array<type_browserDOM> {
    nodeString?: string;
}

interface test_evaluations {
    [key:string]: (value:string, comparator:string) => boolean;
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

type test_eventName = "blur" | "click" | "command" | "contextmenu" | "dblclick" | "focus" | "keydown" | "keyup" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "move" | "refresh-interaction" | "refresh" | "resize" | "select" | "setValue" | "touchend" | "touchstart" | "wait";
type test_qualifier = "begins" | "contains" | "ends" | "greater" | "is" | "lesser" | "not contains" | "not";

// type test_type = "command" | "dom" | "file" | "http" | "websocket"