
import file from "./file.ts";
import vars from "../core/vars.ts";

const save = function utilities_save(callback:() => void, section:type_dashboard_sections|"startup"):void {
    const payload:core_servers_file = {
            "compose-variables": vars.data.compose_variables,
            dashboard_id: vars.id.dashboard_server,
            notes: vars.data.notes,
            servers: vars.data.servers,
            stats: vars.stats
        };
    file.write({
        callback: callback,
        contents: JSON.stringify(payload),
        location: `${vars.path.project}servers.json-lib/utilities/save.ts`,
        section: section
    });
};

export default save;