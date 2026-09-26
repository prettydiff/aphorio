

import file from "../utilities/file.ts";
import vars from "../core/vars.ts";

const version = function start_version(complete_tasks:(task:type_start_primary_tasks) => void, process_path:string):core_start_task {
    return {
        label: "Get application version number from package.json file.",
        task: function start_version_task():void {
            file.read({
                callback: function start_version_task_callback(file_contents:Buffer):void {
                    vars.environment.version = JSON.parse(file_contents.toString()).version;
                    complete_tasks("version");
                },
                location: `${process_path}package.json`,
                no_file: null,
                section: "startup"
            });
        }
    };
};

export default version;