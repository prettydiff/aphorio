// cspell: words bootable, fsavail, fsroots, fssize, fstype, fsused, mountpoint, partflags, parttypename, serv, stcp, sudp, volu

interface os_child_out extends node_stream_Readable {
    type: type_os_key;
}

interface os_devs {
    kernel_module: string;
    name: string;
    type: string;
}

interface os_devs_windows {
    CreationClassName: string;
    FriendlyName: string;
    PNPClass: string;
    PNPDeviceID: string;
}

interface os_disk {
    bus: string;
    guid: string;
    id: string;
    name: string;
    partitions: os_disk_partition[];
    serial: string;
    size_disk: number;
}

interface os_disk_partition {
    active: boolean;
    bootable: boolean;
    diskId: string;
    diskName: string;
    file_system: string;
    hidden: boolean;
    id: string;
    path: string;
    read_only: boolean;
    size_free: number;
    size_free_percent: number;
    size_total: number;
    size_used: number;
    size_used_percent: number;
    type: string;
}

interface os_disk_posix {
    children: os_disk_posix_partition[];
    model: string;
    serial: string;
    size: number;
    tran: string;
    uuid: string;
}

interface os_disk_posix_partition {
    fsavail: number;
    fsroots: string[];
    fssize: number;
    fstype: string;
    fsused: number;
    mountpoint: string;
    partflags: string;
    parttypename: string;
    path: string;
    ro: boolean;
    type: string;
    uuid: string;
}

interface os_disk_windows {
    BusType: string;
    FriendlyName: string;
    Guid: string;
    SerialNumber: string;
    Size: number;
    UniqueId: string;
}

interface os_disk_windows_partition {
    Guid: string;
    IsActive: boolean;
    IsBoot: boolean;
    IsHidden: boolean;
    IsReadOnly: boolean;
    Type: string;
    UniqueId: string;
}

interface os_disk_windows_volume {
    DriveLetter: string;
    FileSystem: string;
    Size: number;
    SizeRemaining: number;
    UniqueId: string;
}

interface os_node_cpu_item {
    model: string;
    speed: number;
    times: {
        idle: number;
        irq: number;
        nice: number;
        sys: number;
        user: number;
    };
}
type os_node_cpu = Array<os_node_cpu_item>;

interface os_node_cpuUsage {
    system: number;
    user: number;
}

interface os_node_memoryUsage {
    arrayBuffers: number;
    external: number;
    heapTotal: number;
    heapUsed: number;
    rss: number;
}

interface os_proc {
    id: number;
    memory: number;
    name: string;
    time: number;
    user: string;
}

interface os_proc_windows {
    CPU: number;
    Id: number;
    Name: string;
    PM: number;
    UserName: string;
}

interface os_raw {
    devs: os_devs_windows[] | string[];
    disk: os_disk_posix[] | os_disk_windows[];
    part: os_disk_windows_partition[];
    proc: os_proc_windows[] | string[];
    serv: os_serv_posix[] | os_serv_windows[];
    sock: null;
    stcp: os_sock_tcp_windows[] | string[];
    sudp: os_sock_udp_windows[];
    user: os_user_windows[] | string[];
    volu: os_disk_windows_volume[];
}

interface os_serv {
    description: string;
    name: string;
    status: string;
}

interface os_serv_posix {
    active: "activating" | "active" | "deactivating" | "dead" | "exited" | "failed" | "inactive" | "running";
    description: string;
    unit: string;
}

interface os_serv_windows {
    Description: string;
    DisplayName: string;
    Name: string;
    Status: number;
}

interface os_sock {
    "local-address": string;
    "local-port": number;
    process: number;
    "remote-address": string;
    "remote-port": number;
}

interface os_sock_tcp_windows {
    LocalAddress: string;
    LocalPort: number;
    OwningProcess: number;
    RemoteAddress: string;
    RemotePort: number;
}

interface os_sock_udp_windows {
    LocalAddress: string;
    LocalPort: number;
    OwningProcess: number;
}

interface os_user {
    lastLogin: number;
    name: string;
    proc: number;
    type: "system" | "user";
    uid: number;
}

interface os_user_windows {
    LastLogon: string;
    Name: string;
    SID: string;
}

interface os_vars {
    admin_check: string;
    compose: string;
    compose_empty: string;
    devs: string;
    disk: string;
    file: string;
    open: string;
    part: string;
    proc: string;
    serv: string;
    stcp: string;
    sudp: string;
    user: string;
    volu: string;
}

interface os_var_list {
    [key:string]: os_vars;
}