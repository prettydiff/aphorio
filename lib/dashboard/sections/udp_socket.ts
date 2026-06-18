

import dashboard from "../dashboard.ts";

const ui_udp_socket = function ui_udp_socket():void {
    const udp_socket:section_udpSocket = {
        events: {
            create: function dashboard_sections_udpSocket_create():void {
                const select:HTMLSelectElement = dashboard.sections["udp-socket"].nodes.multicast_interface.getElementsByTagName("select")[0],
                    port_destination:number = Number(dashboard.sections["udp-socket"].nodes.input_port_destination.value.trim()),
                    port_source:number = Number(dashboard.sections["udp-socket"].nodes.input_port_source.value.trim()),
                    multicast_type:"membership"|"none"|"source" = (dashboard.sections["udp-socket"].nodes.input_multicast_membership.checked === true)
                        ? "membership"
                        : (dashboard.sections["udp-socket"].nodes.input_multicast_source.checked === true)
                            ? "source"
                            : "none",
                    role:"client"|"server" = (dashboard.sections["udp-socket"].nodes.input_role_client.checked === true)
                        ? "client"
                        : "server",
                    payload:services_udp_socket = {
                        address_source: (role === "client")
                            ? dashboard.sections["udp-socket"].nodes.input_address_destination.value
                            : dashboard.sections["udp-socket"].nodes.input_address_source.value,
                        address_destination: null,
                        handler: null,
                        hash: "",
                        multicast_group: dashboard.sections["udp-socket"].nodes.multicast_group.getElementsByTagName("input")[0].value,
                        multicast_interface: select[select.selectedIndex].textContent,
                        multicast_membership: dashboard.sections["udp-socket"].nodes.multicast_source.getElementsByTagName("input")[0].value,
                        multicast_source: dashboard.sections["udp-socket"].nodes.multicast_source.getElementsByTagName("input")[0].value,
                        multicast_type: multicast_type,
                        port_source: (role === "client" && isNaN(port_destination) === false)
                            ? port_destination
                            : (role === "server" && isNaN(port_source) === false)
                                ? port_source
                                : 0,
                        port_destination: null,
                        role: role,
                        time: 0,
                        type: (dashboard.sections["udp-socket"].nodes.input_type_ipv4.checked === true)
                            ? "ipv4"
                            : "ipv6"
                    };
                dashboard.message.send({data: payload, service: "services_udp_socket"});
            },
            setState: function dashboard_sections_udpSocket_setState():void {
                dashboard.utility.setState();
            },
            toggle_multicast: function dashboard_sections_udpSocket_toggleMulticast():void {
                if (dashboard.sections["udp-socket"].nodes.input_multicast_membership.checked === true) {
                    dashboard.sections["udp-socket"].nodes.multicast_group.style.display = "none";
                    dashboard.sections["udp-socket"].nodes.multicast_interface.style.display = "block";
                    dashboard.sections["udp-socket"].nodes.multicast_membership.style.display = "block";
                    dashboard.sections["udp-socket"].nodes.multicast_source.style.display = "none";
                } else if (dashboard.sections["udp-socket"].nodes.input_multicast_none.checked === true) {
                    dashboard.sections["udp-socket"].nodes.multicast_group.style.display = "none";
                    dashboard.sections["udp-socket"].nodes.multicast_interface.style.display = "none";
                    dashboard.sections["udp-socket"].nodes.multicast_membership.style.display = "none";
                    dashboard.sections["udp-socket"].nodes.multicast_source.style.display = "none";
                } else {
                    dashboard.sections["udp-socket"].nodes.multicast_group.style.display = "block";
                    dashboard.sections["udp-socket"].nodes.multicast_interface.style.display = "block";
                    dashboard.sections["udp-socket"].nodes.multicast_membership.style.display = "none";
                    dashboard.sections["udp-socket"].nodes.multicast_source.style.display = "block";
                }
                dashboard.utility.setState();
            },
            toggle_role: function dashboard_sections_udpSocket_toggleRole():void {
                if (dashboard.sections["udp-socket"].nodes.input_role_client.checked === true) {
                    dashboard.sections["udp-socket"].nodes.toggle_client.style.display = "block";
                    dashboard.sections["udp-socket"].nodes.toggle_server.style.display = "none";
                } else {
                    dashboard.sections["udp-socket"].nodes.toggle_client.style.display = "none";
                    dashboard.sections["udp-socket"].nodes.toggle_server.style.display = "block";
                }
                dashboard.utility.setState();
            },
            toggle_type: function dashboard_sections_udpSocket_toggleType():void {
                const type:string = (dashboard.sections["udp-socket"].nodes.input_type_ipv4.checked === true)
                        ? "IPv4"
                        : "IPv6",
                    labels:HTMLCollectionOf<HTMLElement> = document.getElementById("udp-socket").getElementsByTagName("label");
                let index:number = labels.length,
                    span:HTMLElement = null;
                do {
                    index = index - 1;
                    span = labels[index].getElementsByTagName("span")[0];
                    if (span !== undefined) {
                        span.textContent = type;
                    }
                } while (index > 0);
                dashboard.utility.setState();
            }
        },
        init: function dashboard_sections_udpSocket_init():void {
            const keys:string[] = Object.keys(dashboard.global.payload.os.intr.data),
                len:number = keys.length,
                nodes:store_elements = dashboard.sections["udp-socket"].nodes,
                events:store_function = dashboard.sections["udp-socket"].events;
            if (len > 0) {
                let index:number = 0,
                    option:HTMLElement = null;
                do {
                    option = document.createElement("option");
                    option.textContent = keys[index];
                    if (dashboard.global.state.udp_socket !== null && dashboard.global.state.udp_socket !== undefined && keys[index] === dashboard.global.state.udp_socket.interfaces) {
                        (nodes.interfaces as HTMLSelectElement).selectedIndex = index;
                    }
                    nodes.interfaces.appendChild(option);
                    index = index + 1;
                } while (index < len);
            }
            if (dashboard.global.state.udp_socket === null || dashboard.global.state.udp_socket === undefined) {
                dashboard.global.state.udp_socket = {
                    address_destination: "",
                    address_source: "",
                    interfaces: "",
                    multicast_group: "",
                    multicast_membership: "",
                    multicast_source: "",
                    port_destination: "",
                    port_source: "",
                    toggle_multicast: "none",
                    toggle_role: "connect",
                    toggle_type: "ipv6"
                };
            } else {
                if (dashboard.global.state.udp_socket.toggle_multicast === "membership") {
                    (nodes.input_multicast_membership as HTMLInputElement).checked = true;
                } else if (dashboard.global.state.udp_socket.toggle_multicast === "source") {
                    (nodes.input_multicast_source as HTMLInputElement).checked = true;
                } else {
                    (nodes.input_multicast_none as HTMLInputElement).checked = true;
                }
                if (dashboard.global.state.udp_socket.toggle_role === "connect") {
                    (nodes.input_role_client as HTMLInputElement).checked = true;
                } else {
                    (nodes.input_role_server as HTMLInputElement).checked = true;
                }
                if (dashboard.global.state.udp_socket.toggle_type === "ipv4") {
                    (nodes.input_type_ipv4 as HTMLInputElement).checked = true;
                } else {
                    (nodes.input_type_ipv6 as HTMLInputElement).checked = true;
                }
                (nodes.input_address_destination as HTMLInputElement).value = dashboard.global.state.udp_socket.address_destination;
                (nodes.input_address_source as HTMLInputElement).value = dashboard.global.state.udp_socket.address_source;
                (nodes.input_port_destination as HTMLInputElement).value = dashboard.global.state.udp_socket.port_destination;
                (nodes.input_port_source as HTMLInputElement).value = dashboard.global.state.udp_socket.port_source;
                nodes.multicast_group.getElementsByTagName("input")[0].value = dashboard.global.state.udp_socket.multicast_group;
                nodes.multicast_membership.getElementsByTagName("input")[0].value = dashboard.global.state.udp_socket.multicast_membership;
                nodes.multicast_source.getElementsByTagName("input")[0].value = dashboard.global.state.udp_socket.multicast_source;
            }
            nodes.button_create.onclick = events.create;
            nodes.input_multicast_membership.onclick = events.toggle_multicast;
            nodes.input_multicast_none.onclick = events.toggle_multicast;
            nodes.input_multicast_source.onclick = events.toggle_multicast;
            nodes.input_role_client.onclick = events.toggle_role;
            nodes.input_role_server.onclick = events.toggle_role;
            nodes.input_type_ipv4.onclick = events.toggle_type;
            nodes.input_type_ipv6.onclick = events.toggle_type;
            nodes.input_address_destination.onblur = events.setState;
            nodes.input_address_source.onblur = events.setState;
            nodes.input_port_destination.onblur = events.setState;
            nodes.input_port_source.onblur = events.setState;
            nodes.interfaces.onchange = events.setState;
            nodes.multicast_group.getElementsByTagName("input")[0].onblur = events.setState;
            nodes.multicast_membership.getElementsByTagName("input")[0].onblur = events.setState;
            nodes.multicast_source.getElementsByTagName("input")[0].onblur = events.setState;
            events.toggle_multicast();
            events.toggle_role();
            events.toggle_type();
        },
        nodes: {
            button_create: document.getElementById("udp-socket").getElementsByClassName("form")[1].getElementsByTagName("button")[0],
            input_address_destination: document.getElementById("udp-socket").getElementsByTagName("input")[12],
            input_address_source: document.getElementById("udp-socket").getElementsByTagName("input")[4],
            input_multicast_membership: document.getElementById("udp-socket").getElementsByTagName("input")[7],
            input_multicast_none: document.getElementById("udp-socket").getElementsByTagName("input")[8],
            input_multicast_source: document.getElementById("udp-socket").getElementsByTagName("input")[6],
            input_port_destination: document.getElementById("udp-socket").getElementsByTagName("input")[13],
            input_port_source: document.getElementById("udp-socket").getElementsByTagName("input")[5],
            input_role_client: document.getElementById("udp-socket").getElementsByTagName("input")[0],
            input_role_server: document.getElementById("udp-socket").getElementsByTagName("input")[1],
            input_type_ipv4: document.getElementById("udp-socket").getElementsByTagName("input")[2],
            input_type_ipv6: document.getElementById("udp-socket").getElementsByTagName("input")[3],
            interfaces: document.getElementById("udp-socket").getElementsByTagName("select")[0],
            multicast_group: document.getElementById("udp-socket").getElementsByClassName("udp-socket-multicast-group")[0] as HTMLElement,
            multicast_interface: document.getElementById("udp-socket").getElementsByClassName("udp-socket-multicast-interface")[0] as HTMLElement,
            multicast_membership: document.getElementById("udp-socket").getElementsByClassName("udp-socket-multicast-membership")[0] as HTMLElement,
            multicast_source: document.getElementById("udp-socket").getElementsByClassName("udp-socket-multicast-source")[0] as HTMLElement,
            status: document.getElementById("udp-socket").getElementsByClassName("udp-socket-status")[0] as HTMLElement,
            toggle_client: document.getElementById("udp-socket").getElementsByClassName("udp-role-client")[0] as HTMLElement,
            toggle_server: document.getElementById("udp-socket").getElementsByClassName("udp-role-server")[0] as HTMLElement
        },
        receive: function dashboard_sections_udpSocket_receive(socket_data:socket_data):void {
            const data:services_udp_status = socket_data.data as services_udp_status;
            dashboard.sections["udp-socket"].nodes.status.textContent = data.status;
        },
        tools: {}
    };
    dashboard.sections["udp-socket"] = udp_socket;
};

export default ui_udp_socket;