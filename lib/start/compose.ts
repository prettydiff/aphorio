
import docker from "../services/docker.ts";
import vars from "../core/vars.ts";

const compose = function start_compose(start_prerequisites:() => void):core_start_task {
    return {
        label: "Restores the docker compose containers if docker is available.",
        task: function start_compose_task():void {
            if (vars.environment.features["compose-containers"] === true) {
                docker.shell_start();
                docker.list(start_prerequisites);
            } else {
                start_prerequisites();
            }
        }
    };
};

export default compose;