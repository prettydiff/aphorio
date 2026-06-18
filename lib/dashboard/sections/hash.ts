

import dashboard from "../dashboard.ts";

const ui_hash = function ui_hash():void {
    const hash:section_hash = {
        events: {
            request: function dashboard_sections_hash_request():void {
                const option:HTMLOptionElement = dashboard.sections["hash"].nodes.algorithm[dashboard.sections["hash"].nodes.algorithm.selectedIndex] as HTMLOptionElement,
                    selectValue:string = option.value,
                    service:services_hash = {
                        algorithm: selectValue,
                        base64: (dashboard.sections["hash"].nodes.base64.checked === true),
                        digest: (dashboard.sections["hash"].nodes.digest.checked === true)
                            ? "base64"
                            : "hex",
                        size: 0,
                        type: (dashboard.sections["hash"].nodes.type.checked === true)
                            ? "file"
                            : "direct",
                        value: dashboard.sections["hash"].nodes.source.value
                    };
                dashboard.sections["hash"].nodes.output.value = "";
                dashboard.utility.performance_set("hash");
                dashboard.utility.setState();
                dashboard.message.send({data: service, service: "services_hash"});
            },
            toggle_mode: function dashboard_sections_hash_toggleMode(event:MouseEvent):void {
                const target:HTMLElement = (event === null)
                    ? (dashboard.sections["hash"].nodes.hash.checked === true)
                        ? dashboard.sections["hash"].nodes.hash
                        : dashboard.sections["hash"].nodes.base64
                    : event.target;
                if (target === dashboard.sections["hash"].nodes.hash) {
                    dashboard.sections["hash"].nodes.digest.disabled = false;
                    dashboard.sections["hash"].nodes.hex.disabled = false;
                } else {
                    dashboard.sections["hash"].nodes.digest.disabled = true;
                    dashboard.sections["hash"].nodes.hex.disabled = true;
                }
            }
        },
        init: function dashboard_sections_hash_init():void {
            const len:number = dashboard.global.payload.hashes.length;
            let index:number = 0,
                option:HTMLElement = null;
            do {
                option = document.createElement("option");
                option.textContent = dashboard.global.payload.hashes[index];
                if (dashboard.global.state.hash.algorithm === dashboard.global.payload.hashes[index] || (dashboard.global.state.hash.algorithm === "" && dashboard.global.payload.hashes[index] === "sha3-512")) {
                    option.setAttribute("selected", "selected");
                }
                dashboard.sections["hash"].nodes.algorithm.appendChild(option);
                index = index + 1;
            } while (index < len);
            if (dashboard.global.state.hash === undefined || dashboard.global.state.hash === null) {
                dashboard.global.state.hash = {
                    algorithm: "sha3-512",
                    digest: "hex",
                    hashFunction: "hash",
                    source: "",
                    type: "string"
                };
            } else {
                if (dashboard.global.state.hash.hashFunction === "hash") {
                    dashboard.sections["hash"].nodes.hash.checked = true;
                } else {
                    dashboard.sections["hash"].nodes.base64.checked = true;
                }
                if (dashboard.global.state.hash.type === "string") {
                    dashboard.sections["hash"].nodes.string.checked = true;
                } else {
                    dashboard.sections["hash"].nodes.file.checked = true;
                }
                if (dashboard.global.state.hash.digest === "hex") {
                    dashboard.sections["hash"].nodes.hex.checked = true;
                } else {
                    dashboard.sections["hash"].nodes.digest.checked = true;
                }
                dashboard.sections["hash"].nodes.source.value = dashboard.global.state.hash.source;
            }
            dashboard.sections["hash"].nodes.button.onclick = dashboard.sections["hash"].events.request;
            dashboard.sections["hash"].nodes.base64.onclick = dashboard.sections["hash"].events.toggle_mode;
            dashboard.sections["hash"].nodes.hash.onclick = dashboard.sections["hash"].events.toggle_mode;
            dashboard.sections["hash"].events.toggle_mode(null);
        },
        nodes: {
            algorithm: document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("select")[0],
            base64: document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("input")[1],
            button: document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("button")[0],
            digest: document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("input")[5],
            file: document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("input")[3],
            hash: document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("input")[0],
            hex: document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("input")[4],
            output: document.getElementById("hash").getElementsByClassName("form")[1].getElementsByTagName("textarea")[0],
            size: document.getElementById("hash").getElementsByClassName("form")[1].getElementsByTagName("strong")[0],
            source: document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("textarea")[0],
            string: document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("input")[2],
            time: document.getElementById("hash").getElementsByClassName("form")[1].getElementsByTagName("strong")[1],
            type: document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("input")[3]
        },
        receive: function dashboard_sections_hash_receive(data_item:socket_data):void {
            const data:services_hash = data_item.data as services_hash;
            dashboard.sections["hash"].nodes.output.value = data.value;
            dashboard.sections["hash"].nodes.size.textContent = data.size.commas();
            dashboard.sections["hash"].nodes.time.textContent = dashboard.utility.performance_get("hash");
        },
        time: 0,
        tools: null
    };
    dashboard.sections["hash"] = hash;
};

export default ui_hash;