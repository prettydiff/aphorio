
// cspell: words serv, volu

type type_activation_status = ["amber" | "green" | "red", "deactivated" | "new" | "offline" | "online" | "partially online"];
type type_certKey = "ca" | "crt" | "key";
type type_dashboard_action = type_halt_action | "activate" | "add";
type type_dashboard_config = config_websocket_create | config_websocket_server | external_ports | node_childProcess_ExecException | node_error | server | services_dashboard_activate | services_docker_compose | services_socket | store_string;
type type_dashboard_list = "container" | "server";
type type_dashboard_sections = "compose" | "dns" | "faq" | "file-system" | "hash" | "help" | "http" | "interfaces" | "log" | "os" | "processes" | "services" | "sockets" | "storage" | "terminal" | "web" | "websocket";
type type_dashboard_status = "error" | "informational" | "success";
type type_dashboard_type = "compose-containers" | "compose-variables" | "log" | "os" | "server" | "socket" | "terminal" | "websocket-test";
// type_directory_type
// 0 - absolute path
// 1 - file system item type
// 2 - hash
// 3 - index of parent
// 4 - child item count
// 5 - stats
// 6 - rename write path
type type_directory_item = [string, type_file, string, number, number, directory_data, string];
type type_directory_mode = "array" | "hash" | "list" | "read" | "search" | "type";
type type_dns_records = node_dns_anyRecord[] | node_dns_mxRecord[] | node_dns_naptrRecord[] | node_dns_soaRecord | node_dns_srvRecord[] | string[] | string[][];
type type_dns_types = "A" | "AAAA" | "CAA" | "CNAME" | "MX" | "NAPTR" | "NS" | "PTR" | "SOA" | "SRV" | "TXT";
type type_docker_state = "created" | "dead" | "exited" | "paused" | "removing" | "restarting" | "running";
type type_encryption = "both" | "open" | "secure";
type type_external_port = [number, string, string, string];
type type_file = "block_device" | "character_device" | "directory" | "fifo_pipe" | "file" | "socket" | "symbolic_link";
type type_halt_action = "deactivate" | "destroy" | "modify";
type type_hash_input = "direct" | "file";
type type_http_method = "connect" | "delete" | "get" | "head" | "post" | "put";
type type_keys = "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "Backspace" | "c" | "Delete" | "Enter" | "v";
type type_os = "all" | "disk" | "intr" | "main" | "proc" | "serv" | "sock" | "user";
type type_os_key = "disk" | "part" | "proc" | "serv" | "socT" | "socU" | "user" | "volu";
type type_paths = "storage" | "web_root";
type type_search = "fragment" | "negation" | "regex";
type type_selector = "class" | "id" | "tag";
type type_server_property = "block_list" | "domain_local" | "encryption" | "http" | "name" | "ports" | "redirect_asset" | "redirect_domain";

//   service name                  - data type transmitted        - description
//   ---
// * dashboard-clock               - number                       - Current server clock time as epoch number
// * dashboard-compose-container   - store_string                 - Docker compose variables
// * dashboard-compose-variables   - store_string                 - Stores YAML configuration content and a name for a single docker container
// * dashboard-dns                 - services_dns_output          - data response to a dns query
// * dashboard-fileSystem          - services_fileSystem          - file system list
// * dashboard-hash                - services_hash                - hash and base64 computational output
// * dashboard-http                - services_http_test           - response messaging for an HTTP test request
// * dashboard-os-all              - services_os_all              - all the information regarding machine, application, process, and more
// * dashboard-os-disks            - services_os_disk             - only the disk portion of dashboard-os-all
// * dashboard-os-intr             - services_os_intr             - only the network interface data of dashboard-os-all
// * dashboard-os-main             - services_os_all              - only the hardware, application, and process information of dashboard-os-all
// * dashboard-os-proc             - services_os_proc             - only the process list information of dashboard-os-all
// * dashboard-os-serv             - services_os_serv             - only the service information of dashboard-os-all
// * dashboard-os-sock             - services_os_sockets          - only the socket information of dashboard-os-all
// * dashboard-os-user             - services_os_user             - Only the user list information of dashboard-os-all
// * dashboard-server              - services_dashboard_status    - A single server's configuration data plus an action to perform
// * dashboard-status              - services_dashboard_status    - Typically conveys log entries
// * dashboard-terminal-resize     - services_terminal-resize     - Resizes the shell such that text is formatted properly with invisible control characters
// * dashboard-websocket-handshake - services_websocket_handshake - Custom created message to create a test WebSocket connection
// * dashboard-websocket-message   - services_websocket_message   - Parses the header of a WebSocket message frame header sufficient to respond to the message on a test socket
// * dashboard-websocket-status    - services_websocket_status    - Sends connection establishment details for a test socket
type type_service = "dashboard-clock" | "dashboard-compose-container" | "dashboard-compose-variables" | "dashboard-dns" | "dashboard-fileSystem" | "dashboard-hash" | "dashboard-http" | "dashboard-os-all" | "dashboard-os-disk" | "dashboard-os-intr" | "dashboard-os-main" | "dashboard-os-proc" | "dashboard-os-serv" | "dashboard-os-sock" | "dashboard-os-user" | "dashboard-server" | "dashboard-status" | "dashboard-terminal-resize" | "dashboard-websocket-handshake" | "dashboard-websocket-message" | "dashboard-websocket-status" | "youtube-download-status";
type type_socket_data = services_action_compose | services_action_server | services_dashboard_status | services_dashboard_terminal | services_dns_input | services_dns_output | services_docker_compose | services_fileSystem | services_hash | services_http_test | services_os_all | services_os_disk | services_os_intr | services_os_proc | services_os_serv | services_os_sock | services_os_user | services_processKill | services_terminal_resize | services_websocket_handshake | services_websocket_message | services_websocket_status | services_youtubeDownload | services_youtubeStatus | store_string | string[] | transmit_dashboard;
type type_socket_status = "closed" | "end" | "open" | "pending";
type type_ui_control = "select" | "text";
type type_vars = "block_list" | "domain_local" | "ports" | "redirect_asset" | "redirect_domain" | "server_name";
type type_youtubeDownload_media = "audio" | "video";
type type_youtubeDownload = "audio-file" | "audio-playlist" | "video-file" | "video-playlist";

type http_action = (headerList:string[], socket:websocket_client, payload:Buffer) => void;
type receiver = (socketData:socket_data, transmit:transmit_socket) => void;
type type_server_action = (data:services_action_server, callback:() => void, halt?:type_halt_action) => void;
type websocket_message_handler = (socket:websocket_client, resultBuffer:Buffer, frame:websocket_frame) => void;