
import node from "./node.ts";

const os_service:os_service = {
    create: function utilities_osServiceCreate(command:string, name:string):void {
        if (process.platform === "win32") {
            const params:string[] = [
                    "$params = @{",
                    `  Name = "${name}"`,
                    `  BinaryPathName = "${command}"`,
                    `  DisplayName = "${name}"`,
                    "  StartupType = \"Automatic\"",
                    "  Description = \"A machine monitoring dashboard plus embedded web server.\"",
                    "}",
                    "New-Service @params"
                ],
                spawn:node_childProcess_ChildProcess = node.child_process.spawn(params.join("\r\n"), {
                    shell: "PowerShell.exe",
                    windowsHide: true
                });
        }
    },
    delete: null,
    restart: null
};

export default os_service;