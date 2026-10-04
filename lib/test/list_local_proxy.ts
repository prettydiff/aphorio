


const test_listLocalProxy = function test_listLocalProxy():test_list_proxy {
    const list:test_list_proxy = [
            {
                config: {
                    encryption: false,
                    headers: "",
                    uri: ""
                },
                name: "experiment",
                output: {
                    origin: "",
                    pathname: "",
                    port: "",
                    response_body_raw: "",
                    response_headers: ""
                },
                type: "proxy"
            }
        ];
    list.name = "Local proxy tests";
    return list;
};

export default test_listLocalProxy;