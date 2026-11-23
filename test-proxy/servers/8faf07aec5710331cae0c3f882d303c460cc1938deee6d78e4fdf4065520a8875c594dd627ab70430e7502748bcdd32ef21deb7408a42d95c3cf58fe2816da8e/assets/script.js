(function (){
    const body = document.getElementsByTagName("body")[0],
        copyright = document.getElementsByClassName("copyright")[0],
        version = document.getElementsByTagName("h1")[0].getElementsByTagName("span")[0],
        year = new Date().getFullYear().toString();
    if (document.getElementById("index") !== null) {
        const socketCall = function(config) {
                const socket = function(){
                        const scheme = (location.protocol === "http:")
                                ? "ws"
                                : "wss",
                            socketItem = new WebSocket(`${scheme}://${location.host}`, [config.type]),
                            open = function(event) {
                                const target = event.target;
                                socket_object.socket = target;
                                if (socket_object.queueStore.length > 0) {
                                    do {
                                        socket_object.socket.send(socket_object.queueStore[0]);
                                        socket_object.queueStore.splice(0, 1);
                                    } while (socket_object.queueStore.length > 0);
                                }
                            };
                        socketItem.onmessage = config.message;
                        socketItem.onopen = (config.open === null || config.open === undefined)
                            ? open
                            : config.open;
                        if (config.close !== null && config.close !== undefined) {
                            socketItem.onclose = config.close;
                        }
                        return socketItem;
                    },
                    socket_object = {
                        connected: false,
                        invoke: socket,
                        queueStore: [],
                        queue: function(message_item) {
                            // eslint-disable-next-line @typescript-eslint/no-this-alias
                            const instance = this;
                            if (instance.socket === null || instance.socket.readyState !== 1) {
                                instance.queueStore.push(message_item);
                            } else if (instance.queueStore.length > 0) {
                                instance.queueStore.push(message_item);
                                do {
                                    instance.socket.send(instance.queueStore.splice(0, 1)[0]);
                                } while (instance.queueStore.length > 0);
                            } else {
                                instance.socket.send(message_item);
                            }
                        },
                        socket: null
                    };
                return socket_object;
            },
            reset=function() {
                const status = document.getElementsByClassName("demo-status")[0],
                    a = status.getElementsByTagName("a")[0];
                button.disabled = false;
                status.style.display = "none";
                a.setAttribute("href", "#");
                a.textContent = "#";
            },
            button = document.getElementsByClassName("button-demo")[0],
            phone = (window.navigator.userAgent.includes(" Mobile") === true && body.clientWidth < 600);
        window.socket = socketCall({
            close: function() {
                socket.connected = false;
                reset();
                setTimeout(function() {
                    socket.invoke();
                }, 10000);
            },
            message: function(event) {
                if (typeof event.data === "string") {
                    const payload = JSON.parse(event.data),
                        status = document.getElementsByClassName("demo-status")[0],
                        a = status.getElementsByTagName("a")[0],
                        timer = status.getElementsByTagName("time")[0];
                    if (payload.data.time_string === "00:00") {
                        reset();
                    } else {
                        const scroll = [window.scrollX, window.scrollY],
                            origins = location.origin.split(":"),
                            address = (origins.length === 2)
                                ? `${location.origin.replace("https", "http")}:${payload.data.port}/`
                                : `${location.origin.slice(0, location.origin.lastIndexOf(":")).replace("https", "http")}:${payload.data.port}/`;
                        a.setAttribute("href", address);
                        a.textContent = address;
                        status.style.display = "block";
                        timer.textContent = payload.data.time_string;
                        window.scrollTo(scroll[0], scroll[1]);
                    }
                }
            },
            open: function(event) {
                const target = event.target;
                socket.connected = true;
                socket.socket = target;
                if (socket.queueStore.length > 0) {
                    do {
                        socket.socket.send(socket.queueStore[0]);
                        socket.queueStore.splice(0, 1);
                    } while (socket.queueStore.length > 0);
                }
                if (phone === false) {
                    button.onclick = function(event_click){
                        const target = event_click.target,
                            status = document.getElementsByClassName("demo-status")[0];
                        target.disabled = true;
                        status.getElementsByTagName("time")[0].textContent = "10:00";
                        window.socket.queue(JSON.stringify({
                            data: {
                                port: 0,
                                process: 0,
                                socket: "",
                                time: 0,
                                time_string: ""
                            },
                            service: "services_demo"
                        }));
                    };
                }
            },
            type: "aphorio-website"
        });
        window.socket.invoke();
        if (phone === true) {
            const status = document.getElementsByClassName("demo-status")[0];
            button.disabled = true;
            status.textContent = "Demo feature is not available to mobile devices.";
            status.style.display = "block";
        }
    }
    copyright.textContent = `\u00a9${year}`;
    version.textContent = "v0.7.4";
}());
