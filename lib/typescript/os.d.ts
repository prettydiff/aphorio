// cspell: words bootable, fsavail, fsroots, fssize, fstype, fsused, mountpoint, partflags, parttypename, serv, volu

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
    file_system: string;
    hidden: boolean;
    id: string;
    path: string;
    read_only: boolean;
    size_free: number;
    size_total: number;
    size_used: number;
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

interface os_proc {
    id: number;
    memory: number;
    name: string;
    time: number;
}

interface os_proc_windows {
    CPU: number;
    Id: number;
    Name: string;
    PM: number;
}

interface os_raw {
    disk: os_disk_posix[] | os_disk_windows[];
    part: os_disk_windows_partition[];
    proc: os_proc_windows[];
    serv: os_service_posix[] | os_service_windows[];
    socT: string | os_sockets_tcp_windows[];
    socU: string | os_sockets_udp_windows[];
    volu: os_disk_windows_volume[];
}

interface os_service {
    description: string;
    name_display: string;
    name_service: string;
    path: string;
    start_type: string;
    status: string;
}

interface os_service_posix {}

interface os_service_windows {
    BinaryPathName: string;
    Description: string;
    DisplayName: string;
    Name: string;
    ServiceName: string;
    StartType: number;
    Status: number;
}

interface os_sockets_tcp {
    "local-address": string;
    "local-port": number;
    process: number;
    "remote-address": string;
    "remote-port": number;
}

interface os_sockets_tcp_windows {
    LocalAddress: string;
    LocalPort: number;
    OwningProcess: number;
    RemoteAddress: string;
    RemotePort: number;
}

interface os_sockets_udp {
    address: string;
    port: number;
    process: number;
}

interface os_sockets_udp_windows {
    LocalAddress: string;
    LocalPort: number;
    OwningProcess: number;
}