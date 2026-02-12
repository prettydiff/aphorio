
// cspell: words serv, Tlsa, stcp, sudp, volu

type type_activation_status = ["amber" | "green" | "red", "deactivated" | "new" | "offline" | "online" | "partially online"];
type type_browserDOM = ["activeElement" | "addClass" | "childNodes" | "documentElement" | "firstChild" | "getAncestor" | "getElementById" | "getElementsByAttribute" | "getElementsByClassName" | "getElementsByName" | "getElementsByTagName" | "getElementsByText" | "getModalsByModalType" | "getNodesByType" | "lastChild" | "nextSibling" | "parentNode" | "previousSibling" | "removeClass" | "window", string, number];
type type_certKey = "ca" | "crt" | "key";
type type_dashboard_action = type_halt_action | "activate" | "add" | "update";
type type_dashboard_list = "container" | "server";
type type_dashboard_init = "application-logs" | "compose-containers" | "disks" | "dns-query" | "file-system" | "hash" | "interfaces" | "os-machine" | "servers-web" | "statistics" | "terminal" | "test-http" | "test-websocket" | "udp-socket";
type type_dashboard_features = type_dashboard_init | type_dashboard_tables;
type type_dashboard_sections = type_dashboard_features | "faq" | "help";
type type_dashboard_status = "error" | "informational";
type type_dashboard_tables = "devices" | "ports-application" | "processes" | "services" | "sockets-application-tcp" | "sockets-application-udp" | "sockets-os-tcp" | "sockets-os-udp" | "users";
// type_directory_type
// 0 - absolute path
// 1 - file system item type
// 2 - hash
// 3 - index of parent
// 4 - child item count
// 5 - stats
// 6 - rename write path
type type_directory_item = [string, type_file, number, number, core_directory_data, string];
type type_dns_records = node_dns_anyRecord[] | node_dns_caaRecord[] | node_dns_mxRecord[] | node_dns_naptrRecord[] | node_dns_soaRecord | node_dns_srvRecord[] | node_dns_TlsaRecord[] | string[] | string[][];
type type_dns_types = "A" | "AAAA" | "CAA" | "CNAME" | "MX" | "NAPTR" | "NS" | "PTR" | "SOA" | "SRV" | "TLSA" | "TXT";
type type_docker_ports = [number, "tcp"|"udp"][];
type type_docker_state = "created" | "dead" | "exited" | "paused" | "removing" | "restarting" | "running";
type type_encryption = "both" | "open" | "secure";
type type_external_port = [number, string, string, string];
type type_file = "block_device" | "character_device" | "directory" | "fifo_pipe" | "file" | "socket" | "symbolic_link";
type type_fileSystem_media = "application" | "audio" | "image" | "text" | "video";
type type_graph = "cpu" | "disk" | "mem" | "net" | "threads";
type type_graph_datasets = [graph_dataset[], string[]];
type type_graph_keys = "cpu" | "disk_in" | "disk_out" | "mem" | "net_in" | "net_out" | "threads";
type type_halt_action = "deactivate" | "destroy" | "modify";
type type_hash_input = "direct" | "file";
type type_http_method = "connect" | "get" | "head" | "options" | "trace";
type type_keys = "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "Backspace" | "c" | "Delete" | "Enter" | "v";
type type_list_services = services_os_devs | services_os_proc | services_os_serv | services_os_sock | services_os_user | services_ports_application;
type type_lists = os_devs | os_proc | os_serv | os_sock | os_user | services_ports_application_item;

type type_os_key = type_os_list_names_base | "disk" | "part" | "stcp" | "sudp" | "volu";
type type_os_list_names = type_os_list_names_base | "stcp" | "sudp";
type type_os_list_names_base = "devs" | "proc" | "serv" | "user";
type type_os_services = type_os_list_names | "all" | "disk" | "intr" | "main";

type type_paths = "storage" | "web_root";
type type_search = "fragment" | "negation" | "regex";
type type_selector = "class" | "id" | "tag";
type type_server_property = "activate" | "block_list" | "domain_local" | "encryption" | "id" | "method" | "name" | "ports" | "redirect_asset" | "redirect_domain" | "single_socket" | "temporary" | "upgrade";

//   service name                  - data type transmitted        - description
//   ---
// * dashboard-compose             - core_compose                 - docker compose objects and service status
// * dashboard-compose-container   - services_compose_container   - changes from the user for docker compose objects
// * dashboard-compose-out         - string[]                     - streams stdout of docker spawn commands to the ui
// * dashboard-compose-variables   - store_string                 - a key/value list of custom docker compose template variables
// * dashboard-dns                 - services_dns_output          - data response to a dns query
// * dashboard-fileSystem          - services_fileSystem          - file system list
// * dashboard-hash                - services_hash                - hash and base64 computational output
// * dashboard-http                - services_http_test           - response messaging for an HTTP test request
// * dashboard-log                 - config_log                   - a log entry
// * dashboard-os-all              - services_os_all              - all the information regarding machine, application, process, and more
// * dashboard-os-devs             - services_os_devs             - only the device portion of dashboard-os-all
// * dashboard-os-disk             - services_os_disk             - only the disk portion of dashboard-os-all
// * dashboard-os-intr             - services_os_intr             - only the network interface data of dashboard-os-all
// * dashboard-os-main             - services_os_all              - only the hardware, application, and process information of dashboard-os-all
// * dashboard-os-proc             - services_os_proc             - only the process list information of dashboard-os-all
// * dashboard-os-serv             - services_os_serv             - only the service information of dashboard-os-all
// * dashboard-os-stcp             - services_os_sockets          - only the tcp socket information of dashboard-os-all
// * dashboard-os-sudp             - services_os_sockets          - only the udp socket information of dashboard-os-all
// * dashboard-os-user             - services_os_user             - only the user list information of dashboard-os-all
// * dashboard-ports-application   - services_ports_application   - a list of port information and associated processes managed from this application
// * dashboard-server              - store_servers                - configuration details and port status for all servers
// * dashboard-socket-application  - services_socket_application  - status updates about sockets created by this application
// * dashboard-status-clock        - services_status_clock        - current server clock time as epoch number
// * dashboard-statistics-change   - services_statistics-change   - modifies control information respective to service statistical data collection
// * dashboard-statistics-data     - services_statistics-data     - resource consumption statistics
// * dashboard-terminal-resize     - services_terminal-resize     - resizes the shell such that text is formatted properly with invisible control characters
// * dashboard-udp-socket          - services_udp_socket          - sends information about the creation of a UDP socket
// * dashboard-udp-status          - string[]                     - notifies the user a UDP socket is created
// * dashboard-websocket-handshake - services_websocket_handshake - custom created message to create a test WebSocket connection
// * dashboard-websocket-message   - services_websocket_message   - parses the header of a WebSocket message frame header sufficient to respond to the message on a test socket
// * dashboard-websocket-status    - services_websocket_status    - sends connection establishment details for a test socket
// * test-browser                  - services_test_browser        - test automation messaging to the browser
type type_service = "dashboard-compose-container" | "dashboard-compose-out" | "dashboard-compose-variables" | "dashboard-compose" | "dashboard-dns" | "dashboard-fileSystem" | "dashboard-hash" | "dashboard-http" | "dashboard-log" | "dashboard-os-all" | "dashboard-os-devs" | "dashboard-os-disk" |
    "dashboard-os-intr" | "dashboard-os-main" | "dashboard-os-proc" | "dashboard-os-serv" | "dashboard-os-stcp" | "dashboard-os-sudp" | "dashboard-os-user" | "dashboard-ports-application" | "dashboard-server" | "dashboard-socket-application" | "dashboard-statistics-change" | "dashboard-statistics-data" | "dashboard-status-clock" |
    "dashboard-terminal-resize" | "dashboard-udp-socket"| "dashboard-udp-status" | "dashboard-websocket-handshake" | "dashboard-websocket-message" | "dashboard-websocket-status" | "test-browser";

type type_socket_data = config_log | core_compose | core_server_os | services_action_server | services_compose_container | services_dns_input | services_dns_output | services_dns_reverse | services_fileSystem | services_hash | services_http_test | services_os_disk | services_os_intr | services_ports_application | services_socket_application |
    services_statistics_change | services_statistics_data | services_status_clock |services_terminal_resize | services_testBrowser | services_udp_socket | services_websocket_handshake | services_websocket_message | services_websocket_status | store_servers | store_string | string[] | transmit_dashboard | type_list_services;

type type_socket_status = "closed" | "end" | "open" | "pending";
type type_start_pre_tasks = "admin" | "compose" | "os_main";
type type_start_primary_tasks = "cgroup" | "file"| "git" | "html" | "os_devs" | "os_disk" | "os_intr" | "os_proc" | "os_serv" | "os_stcp" | "os_sudp" | "os_user" | "servers" | "test_browser" | "test_list" | "version";
type type_ui_control = "select" | "text";
type type_vars = "block_list" | "domain_local" | "ports" | "redirect_asset" | "redirect_domain" | "server_name";
type type_youtubeDownload_media = "audio" | "video";
type type_youtubeDownload = "audio-file" | "audio-playlist" | "video-file" | "video-playlist";

type http_action = (headerList:string[], socket:websocket_client, payload:Buffer) => void;
type receiver = (socketData:socket_data, transmit:transmit_socket) => void;
type type_server_action = (data:services_action_server, callback:() => void, halt?:type_halt_action) => void;
type websocket_message_handler = (socket:websocket_client, resultBuffer:Buffer, frame:websocket_frame) => void;