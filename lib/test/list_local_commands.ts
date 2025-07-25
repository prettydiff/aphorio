import vars from "../utilities/vars.ts";

// cspell: words pwsh, serv

const win32:boolean = (process.platform === "win32"),
    shell:string = (win32 === true)
        ? (vars.terminal.includes("C:\\Program Files\\PowerShell\\7\\pwsh.exe") === true)
            ? "C:\\Program Files\\PowerShell\\7\\pwsh.exe"
            : "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"
        : "/bin/sh",
    test_listLocalCommands:test_list = [
        {
            command: vars.commands.serv,
            name: "Command echo test",
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
                    properties: [0, "Description", "typeof"],
                    qualifier: "is",
                    type: "stdout",
                    value: "string"
                }
            ]
        }
    ];

test_listLocalCommands.name = "Local shell commands";

export default test_listLocalCommands;