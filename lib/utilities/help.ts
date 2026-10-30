
import log from "../core/log.ts";
import vars from "../core/vars.ts";

const help = function utilities_help():void {
    const output:string[] = [],
        asterisk:string = `${vars.text.angry}*${vars.text.none} `,
        term = function utilities_help_term(name:string, definition:string, value?:string):void {
            if (typeof value === "string") {
                output.push(`${asterisk + vars.text.cyan + name + vars.text.none}:${vars.text.green}<${value}>${vars.text.none} - ${definition}`);
            } else {
                output.push(`${asterisk + vars.text.cyan + name + vars.text.none} - ${definition}`);
            }
        },
        heading = function utilities_help_heading(message:string):void {
            output.push("");
            output.push(vars.text.underline + message.capitalize() + vars.text.none);
        };

    heading(`${vars.environment.name} Help Reference`);
    heading("Universal Options");
    term("no-color", "Eliminates use of ANSI color codes in a command terminal.");
    term("port-open", "Opens an insecure instance of the dashboard server on the specified port, if that port is open.", "port-number");
    term("port-secure", "Opens a secure instance of the dashboard server on the specified port, if that port is open.", "port-number");

    heading("Application Modes");
    term("certificate", "Certificate mode tells the application to generate new certificates for a specified server id and then immediately exits.");
    term("demo", "Executes the application demo mode.  Demo mode cripples many features of the application and uses false static data as a means of public interaction.");
    term("server", "Server mode is the default operating mode that provides no shell interaction, executes all supported services, and provides the dashboard for display in a web browser.");
    term("shell", "Shell mode instructs the application to accept shell interaction.  In most cases this means executing information for a content feature and presenting that information to the shell before exiting.");
    term("test", "Runs the application in test mode.  Test mode launches a dashboard on random ports and executes interactions in the browser.");

    heading("");

    output.push("");
    log.shell(output, true);
};

export default help;