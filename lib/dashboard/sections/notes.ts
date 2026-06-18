

import dashboard from "../dashboard.ts";

const ui_notes = function ui_notes():void {
    const notes:section_notes = {
        events: {
            blur: function dashboard_sections_notes_blur():void {
                clearTimeout(dashboard.sections["notes"].timer);
                dashboard.sections["notes"].tools.save();
            },
            key: function dashboard_sections_notes_key():void {
                clearTimeout(dashboard.sections["notes"].timer);
                dashboard.sections["notes"].timer = setTimeout(dashboard.sections["notes"].tools.save, 5000);
            },
            resize: function dashboard_sections_notes_resize():void {
                const outer_height:number = (window.innerHeight - 235) / 10;
                dashboard.sections["notes"].nodes.textarea.style.height = `${outer_height}em`;
            }
        },
        init: function dashboard_sections_notes_init():void {
            dashboard.sections["notes"].nodes.textarea.value = dashboard.global.payload.notes;
            dashboard.sections["notes"].nodes.textarea.onblur = dashboard.sections["notes"].events.blur;
            dashboard.sections["notes"].nodes.textarea.onkeyup = dashboard.sections["notes"].events.key;
            dashboard.sections["notes"].events.resize();
        },
        nodes: {
            textarea: document.getElementById("notes").getElementsByTagName("textarea")[0] as HTMLTextAreaElement
        },
        receive: function dashboard_sections_nodes_receiver(socket_data:socket_data):void {
            const data:services_notes = socket_data.data as services_notes;
            dashboard.sections["notes"].nodes.textarea.value = data.notes;
        },
        timer: null,
        tools: {
            save: function dashboard_sections_notes_save():void {
                const value:string = dashboard.sections["notes"].nodes.textarea.value,
                    payload:services_notes = {
                        notes: value
                    };
                dashboard.message.send({data: payload, service: "services_notes"});
            }
        }
    };
    dashboard.sections["notes"] = notes;
};

export default ui_notes;