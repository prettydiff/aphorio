import directory from "./directory.ts";
import vars from "../core/vars.ts";

const screenshots = function screenshots():void {
    const dir_config:config_directory = {
        callback: function screenshots_directory(list:core_directory_list):void {
            console.log(list);
        },
        depth: 0,
        exclusions: [],
        parent: false,
        path: `${vars.path.project}screenshots`,
        relative: true,
        search: "",
        symbolic: false
    };
    directory(dir_config);
};

export default screenshots;