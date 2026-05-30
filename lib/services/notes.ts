
import file from "../utilities/file.ts";
import vars from "../core/vars.ts";

const notes = function services_notes(socket_data:socket_data):void {
    const data:store_string = socket_data.data as store_string,
        payload:core_servers_file = {
            "compose-variables": vars.data.compose_variables,
            dashboard_id: vars.environment.dashboard_id,
            notes: data.notes,
            servers: vars.data.servers,
            stats: vars.stats
        };
    vars.data.notes = data.notes;
    file.write({
        callback: null,
        contents: JSON.stringify(payload),
        location: `${vars.path.project}servers.json`,
        section: "notes"
    });
};

export default notes;