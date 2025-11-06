
import log from "../core/log.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

const docker_ps = function services_dockerPS(callback:() => void):void {
    const args:string[] = ["-f", vars.path.compose_empty, "ps", "--format=json"],
        logger = function services_dockerPS_logger(action:"activate"|"deactivate", config:services_docker_compose):void {
            log.application({
                error: null,
                message: (action === "activate")
                    ? `Docker container ${config.name} came online.`
                    : `Docker container ${config.name} went offline.`,
                section: "compose",
                status: "informational",
                time: Date.now()
            });
        },
        spawn_close_primary = function services_dockerPS_spawnClosePrimary(output:core_spawn_output):void {
            const lns:string[] = output.stdout.replace(/\s+$/, "").split("\n"),
                len:number = lns.length,
                keys:string[] = Object.keys(vars.compose.containers);
            let index:number = keys.length,
                compose:services_docker_compose = null,
                item:store_string = null;
            if (index < 1) {
                callback();
                return;
            }
            do {
                index = index - 1;
                vars.compose.containers[keys[index]].state = "dead";
            } while (index > 0);
            do {
                item = JSON.parse(lns[index]);
                compose = {
                    command: item.Command,
                    compose: "",
                    createdAt: item.CreatedAt,
                    description: "",
                    exitCode: Number(item.ExitCode),
                    health: item.Health,
                    id: item.ID,
                    image: item.Image,
                    labels: item.Labels.split(","),
                    localVolumes: Number(item.LocalVolumes),
                    mounts: item.Mounts.split(","),
                    name: item.Name,
                    names: item.Names.split(","),
                    networks: item.Networks.split(","),
                    ports: item.Ports.replace(/,\s+/g, ",").split(","),
                    project: item.Project,
                    publishers: JSON.parse(lns[index]).Publishers as services_docker_compose_publishers[],
                    runningFor: item.RunningFor,
                    service: item.Service,
                    size: Number(item.Size),
                    state: item.State as type_docker_state,
                    status: item.Status
                };
                if (vars.compose.containers[compose.name] === undefined) {
                    compose.compose = "";
                    compose.description = "";
                } else {
                    compose.compose = vars.compose.containers[compose.name].compose;
                    compose.description = vars.compose.containers[compose.name].description;
                    if (compose.state !== "running" && vars.compose.containers[compose.name].state === "running") {
                        logger("deactivate", compose);
                    } else if (compose.state === "running" && vars.compose.containers[compose.name].state === "running") {
                        logger("activate", compose);
                    }
                    vars.compose.containers[compose.name] = compose;
                }
                index = index + 1;
            } while (index < len);
            secondary.execute();
            callback();
        },
        spawn_close_secondary = function services_dockerPS_spawnCloseSecondary(output:core_spawn_output):void {
            const event:services_docker_event = JSON.parse(output.stdout);
            if (vars.compose.containers[event.service] !== undefined) {
                if (vars.compose.containers[event.service].state === "running" && (event.action === "destroy" || event.action === "die" || event.action === "kill" || event.action === "stop")) {
                    vars.compose.containers[event.service].state = "dead";
                    logger("deactivate", vars.compose.containers[event.service]);
                } else if (vars.compose.containers[event.service].state !== "running" && event.action === "start") {
                    vars.compose.containers[event.service].state = "running";
                    logger("activate", vars.compose.containers[event.service]);
                }
            }
            setTimeout(function utilities_spawn_finish_recurse():void {
                secondary.execute();
            }, vars.intervals.compose);
        },
        primary:core_spawn = spawn(`${vars.commands.compose} -f ${vars.path.compose_empty} ps --format=json`, spawn_close_primary),
        secondary:core_spawn = spawn(`${vars.commands.compose} -f ${vars.path.compose_empty} events --json`, spawn_close_secondary);
    if (process.platform !== "win32") {
        args.splice(0, 0, "compose");
    }
    primary.execute();
};

export default docker_ps;