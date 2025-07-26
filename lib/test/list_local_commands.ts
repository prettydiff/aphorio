import vars from "../utilities/vars.ts";

// cspell: words fsavail, fssize, fsused, fstype, mountpoint, partflags, pwsh, serv, volu

const win32:boolean = (process.platform === "win32"),
    shell:string = (win32 === true)
        ? (vars.terminal.includes("C:\\Program Files\\PowerShell\\7\\pwsh.exe") === true)
            ? "C:\\Program Files\\PowerShell\\7\\pwsh.exe"
            : "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"
        : "/bin/sh",
    test_listLocalCommands:test_list = [
        // os.disk
        {
            command: vars.commands.disk,
            name: "Command os.disk",
            shell: shell,
            type: "command",
            unit: [
                {
                    format: "json",
                    properties: ["length"],
                    qualifier: "greater",
                    type: "stdout",
                    value: 1
                },
                {
                    format: "json",
                    properties: [0, (win32 === true) ? "BusType" : "tran", "typeof"],
                    qualifier: "is",
                    type: "stdout",
                    value: "string"
                },
                {
                    format: "json",
                    properties: [0, (win32 === true) ? "Guid" : "uuid", "typeof"],
                    qualifier: "is",
                    type: "stdout",
                    value: "string"
                },
                (win32 === true)
                    ? {
                        format: "json",
                        properties: [0, "UniqueId", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "string"
                    }
                    : null,
                {
                    format: "json",
                    properties: [0, (win32 === true) ? "FriendlyName" : "model", "typeof"],
                    qualifier: "is",
                    type: "stdout",
                    value: "string"
                },
                {
                    format: "json",
                    properties: [0, (win32 === true) ? "SerialNumber" : "serial", "typeof"],
                    qualifier: "is",
                    type: "stdout",
                    value: "string"
                },
                {
                    format: "json",
                    properties: [0, (win32 === true) ? "Size" : "size", "typeof"],
                    qualifier: "is",
                    type: "stdout",
                    value: "number"
                },
                (win32 === true)
                    ? null
                    : {
                        format: "json",
                        properties: [0, "children", "length"],
                        qualifier: "greater",
                        type: "stdout",
                        value: 1
                    },
                (win32 === true)
                    ? null
                    : {
                        format: "json",
                        nullable: true,
                        properties: [0, "children", 0, "mountpoint", "typeof"],
                        qualifier: "not",
                        type: "stdout",
                        value: "string"
                    },
                (win32 === true)
                    ? null
                    : {
                        format: "json",
                        properties: [0, "children", 0, "partflags", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "string"
                    },
                (win32 === true)
                    ? null
                    : {
                        format: "json",
                        properties: [0, "children", 0, "fstype", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "string"
                    },
                (win32 === true)
                    ? null
                    : {
                        format: "json",
                        properties: [0, "children", 0, "fsavail", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "string"
                    },
                (win32 === true)
                    ? null
                    : {
                        format: "json",
                        properties: [0, "children", 0, "fssize", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "string"
                    },
                (win32 === true)
                    ? null
                    : {
                        format: "json",
                        properties: [0, "children", 0, "fsused", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "string"
                    },
                (win32 === true)
                    ? null
                    : {
                        format: "json",
                        properties: [0, "children", 0, "mountpoint"],
                        qualifier: "not",
                        type: "stdout",
                        value: null
                    },
                (win32 === true)
                    ? null
                    : {
                        format: "json",
                        properties: [0, "children", 0, "uuid", "typeof"],
                        qualifier: "not",
                        type: "stdout",
                        value: "string"
                    },
                (win32 === true)
                    ? null
                    : {
                        format: "json",
                        properties: [0, "children", 0, "path", "typeof"],
                        qualifier: "not",
                        type: "stdout",
                        value: "string"
                    },
                (win32 === true)
                    ? null
                    : {
                        format: "json",
                        properties: [0, "children", 0, "ro", "typeof"],
                        qualifier: "not",
                        type: "stdout",
                        value: "boolean"
                    },
                (win32 === true)
                    ? null
                    : {
                        format: "json",
                        properties: [0, "children", 0, "type", "typeof"],
                        qualifier: "not",
                        type: "stdout",
                        value: "string"
                    }
            ]
        },
        // os.part
        (win32 === true)
            ? {
                command: vars.commands.part,
                name: "Command os.part",
                shell: shell,
                type: "command",
                unit: [
                    {
                        format: "json",
                        properties: ["length"],
                        qualifier: "greater",
                        type: "stdout",
                        value: 1
                    },
                    {
                        format: "json",
                        properties: [0, "IsActive", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "boolean"
                    },
                    {
                        format: "json",
                        nullable: true,
                        properties: [0, "IsBoot", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "boolean"
                    },
                    {
                        format: "json",
                        properties: [0, "IsHidden", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "boolean"
                    },
                    {
                        format: "json",
                        properties: [0, "Guid", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "string"
                    },
                    {
                        format: "json",
                        nullable: true,
                        properties: [0, "IsReadOnly", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "boolean"
                    },
                    {
                        format: "json",
                        properties: [0, "Type", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "string"
                    }
                ]
            }
            : null,
        // os.proc
        {
            command: vars.commands.proc,
            name: "Command os.proc",
            shell: shell,
            type: "command",
            unit: (win32 === true)
                ? [
                    {
                        format: "json",
                        properties: ["length"],
                        qualifier: "greater",
                        type: "stdout",
                        value: 10
                    },
                    {
                        format: "json",
                        properties: [0, "Id", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "number"
                    },
                    {
                        format: "json",
                        properties: [0, "PM", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "number"
                    },
                    {
                        format: "json",
                        properties: [0, "Name", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "string"
                    },
                    {
                        format: "json",
                        nullable: true,
                        properties: [0, "CPU", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "string"
                    },
                    {
                        format: "json",
                        nullable: true,
                        properties: [0, "UserName", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "string"
                    },
                ]
                : []
        },
        // os.serv
        {
            command: vars.commands.serv,
            name: "Command os.serv",
            shell: shell,
            type: "command",
            unit: [
                {
                    format: "json",
                    properties: ["length"],
                    qualifier: "greater",
                    type: "stdout",
                    value: 10
                },
                {
                    format: "json",
                    properties: [0, (win32 === true) ? "Description" : "description", "typeof"],
                    qualifier: "is",
                    type: "stdout",
                    value: "string"
                },
                {
                    format: "json",
                    properties: [0, (win32 === true) ? "Name" : "unit", "typeof"],
                    qualifier: "is",
                    type: "stdout",
                    value: "string"
                },
                {
                    format: "json",
                    properties: [0, (win32 === true) ? "Status" : "active", "typeof"],
                    qualifier: "is",
                    type: "stdout",
                    value: (win32 === true) ? "number" : "string"
                }
            ]
        },
        // os.socT
        {
            command: vars.commands.socT,
            name: "Command os.socT",
            shell: shell,
            type: "command",
            unit: (win32 === true)
                ? [
                    {
                        format: "json",
                        properties: ["length"],
                        qualifier: "greater",
                        type: "stdout",
                        value: 10
                    },
                    {
                        format: "json",
                        nullable: true,
                        properties: [0, "LocalAddress", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "string"
                    },
                    {
                        format: "json",
                        nullable: true,
                        properties: [0, "LocalPort", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "number"
                    },
                    {
                        format: "json",
                        nullable: true,
                        properties: [0, "RemoteAddress", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "string"
                    },
                    {
                        format: "json",
                        nullable: true,
                        properties: [0, "RemotePort", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "number"
                    }
                ]
            : []
        },
        // os.socU
        (win32 === true)
            ? {
                command: vars.commands.socU,
                name: "Command os.socU",
                shell: shell,
                type: "command",
                unit: [
                    {
                        format: "json",
                        properties: ["length"],
                        qualifier: "greater",
                        type: "stdout",
                        value: 10
                    },
                    {
                        format: "json",
                        nullable: true,
                        properties: [0, "LocalAddress", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "string"
                    },
                    {
                        format: "json",
                        nullable: true,
                        properties: [0, "LocalPort", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "number"
                    }
                ]
            }
            : null,
        // os.user
        {
            command: vars.commands.user,
            name: "Command os.user",
            shell: shell,
            type: "command",
            unit: (win32 === true)
                ? [
                    {
                        format: "json",
                        properties: ["length"],
                        qualifier: "greater",
                        type: "stdout",
                        value: 2
                    },
                    {
                        format: "json",
                        nullable: true,
                        properties: [0, "LastLogon", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "number"
                    },
                    {
                        format: "json",
                        properties: [0, "Name", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "string"
                    },
                    {
                        format: "json",
                        nullable: true,
                        properties: [0, "SID", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "string"
                    }
                ]
            : []
        },
        // os.volu
        (win32 === true)
            ? {
                command: vars.commands.volu,
                name: "Command os.volu",
                shell: shell,
                type: "command",
                unit: [
                    {
                        format: "json",
                        properties: ["length"],
                        qualifier: "greater",
                        type: "stdout",
                        value: 1
                    },
                    {
                        format: "json",
                        properties: [0, "FileSystem", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "string"
                    },
                    {
                        format: "json",
                        nullable: true,
                        properties: [0, "DriveLetter", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "string"
                    },
                    {
                        format: "json",
                        properties: [0, "SizeRemaining", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "number"
                    },
                    {
                        format: "json",
                        properties: [0, "Size", "typeof"],
                        qualifier: "is",
                        type: "stdout",
                        value: "number"
                    }
                ]
            }
            : null
    ];

test_listLocalCommands.name = "Local shell commands";

export default test_listLocalCommands;