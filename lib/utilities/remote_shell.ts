
import vars from "../core/vars.ts";

const remote_shell:core_module_remoteShell = {
    init: function utilities_remoteShell_init(socket:websocket_client):void {
        const asterisk:string = `${vars.text.angry}*${vars.text.none} `,
            output:string[] = [
                `${vars.text.underline + vars.environment.name.capitalize()} Supported Commands${vars.text.none}`,
                "",
                `${asterisk}clock - Fetch current server time.`,
                "",
                `${vars.environment.name}> `
            ];
        socket.write(output.join("\n"));
        socket.on("data", remote_shell.receiver);
    },
    prompt: `\n${vars.environment.name}> `,
    receiver: function utilities_remoteShell_receiver(this:websocket_client, data:Buffer):void {
        const socket:websocket_client = this,
            input:string = data.toString().replace(/\s+$/, ""),
            space:number = input.indexOf(" "),
            command:string = (space < 0)
                ? input
                : input.slice(0, space),
            now:number = Date.now();
        if (command === "exit" || command === "quit") {
            socket.destroy();
            return;
        }
        if (command === "clock") {
            const offset:number = new Date().getTimezoneOffset();
            socket.write(now.dateTime(false, offset));
        }
        socket.write(remote_shell.prompt);
    }
};

export default remote_shell;