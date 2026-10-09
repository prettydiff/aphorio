
import file from "../utilities/file.ts";

const test_remove = function start_readyServices_testRemove(test_path:string, callback:() => void):void {
    let count:number = 0;
    const removed = function test_indexDOM_callback_removed():void {
        count = count + 1;
        if (count > 2) {
            callback();
        }
    };
    // in the context of testing vars.path.project is actually ${vars.path.project}test so removing files does not harm the project runtime
    file.remove({
        callback: removed,
        exclusions: [],
        location: `${test_path}compose`,
        section: "startup"
    });
    file.remove({
        callback: removed,
        exclusions: [],
        location: `${test_path}servers`,
        section: "startup"
    });
    file.remove({
        callback: removed,
        exclusions: [],
        location: `${test_path}servers.json`,
        section: "startup"
    });
};

export default test_remove;