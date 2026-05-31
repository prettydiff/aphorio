
import save from "../utilities/save.ts";
import vars from "../core/vars.ts";

const notes = function services_notes(socket_data:socket_data):void {
    const data:store_string = socket_data.data as store_string;
    vars.data.notes = data.notes;
    save(null, "notes");
};

export default notes;