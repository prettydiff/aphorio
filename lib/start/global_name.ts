
import file from "../utilities/file.ts";
import index from "../index.ts";
import node from "../core/node.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

const global_name = function start_globalName(complete_tasks:(task:type_start_primary_tasks) => void, process_path:string):core_start_task {
    return {
        label: "Creates a global application name for the shell.",
        task: function start_globalName_task():void {
            spawn("npm root -g", function start_globalName_task_spawn(output:core_spawn_output):void {
                const commandName:string = vars.environment.name.toLowerCase().file_sanitize(),
                    globalPath:string = output.stdout.replace(/\s+$/, "") + vars.path.sep + commandName,
                    bin:string = `${globalPath + vars.path.sep}bin`,
                    isWindows:boolean = (process.platform === "win32" || process.platform === "cygwin"),
                    files = function start_globalName_task_spawn_files():void {
                        let fileCount:number = 0,
                            removeCount:number = 0;
                        const binName:string = `${bin + vars.path.sep + commandName}.mjs`,
                            index_path:string = `${process_path}lib${vars.path.sep}index.ts`,
                            readEntry = function start_globalName_task_spawn_files_readEntry():void {
                                const globalWrite = function start_globalName_task_spawn_files_readEntry_read_globalWrite():void {
                                        fileCount = fileCount + 1;
                                        if (isWindows === false || (isWindows === true && fileCount === 4)) {
                                            complete_tasks("global_name");
                                        }
                                    },
                                    exe:string = process.argv[0].replace(".exe", ""),
                                    fileData:string = `import log from "./core/log.ts";
import node from "./core/node.ts";
import screenshots from "./utilities/screenshots.ts";
import start from "./start/index.ts";
import vars from "./core/vars.ts";(${index.toString()}());`
                                        .replace("process_path = process.argv[index].replace(`lib${vars.path.sep}index.ts`, \"\");", `process_path = "${process_path.replace(/\\/g, "\\\\")}"`)
                                        .replace(/from\s*"\.\//g, `from "file://${process_path.replace(/\\/g, "/")}lib/`)
                                        .replace(/file:\/\/\/+/g, "file://");
                                // adds the command to the path for windows
                                if (isWindows === true) {
                                    // The three following strings follow conventions created by NPM.
                                    // * See /documentation/credits.md for license information
                                    // cspell:disable
                                    const cyg:string = `#!/bin/sh\n\nexec ${exe} "${index_path}" "$@"\n`,
                                        cmd:string = `@ECHO off\r\nendLocal & goto #_undefined_# 2>NUL || title %COMSPEC% & "${exe}"  "${index_path}" %*\r\n`,
                                        ps1:string = `#!/usr/bin/env pwsh\n\n$exe=""\nif ($PSVersionTable.PSVersion -lt "6.0" -or $IsWindows) {\n  $exe=".exe"\n}\n$ret=0\nif ($MyInvocation.ExpectingInput) {\n    $input | & "${exe}$exe"  "${index_path}" $args\n  } else {\n    & "${exe}$exe"  "${index_path}" $args\n  }\n  $ret=$LASTEXITCODE\nexit $ret\n`,
                                        // cspell:enable
                                        dir:string = output.stdout.replace(/node_modules\s*$/, "");
                                    file.write({
                                        callback: globalWrite,
                                        contents: cyg,
                                        location: dir + commandName,
                                        section: "startup"
                                    });
                                    file.write({
                                        callback: globalWrite,
                                        contents: cmd,
                                        location: `${dir + commandName}.cmd`,
                                        section: "startup"
                                    });
                                    file.write({
                                        callback: globalWrite,
                                        contents: ps1,
                                        location: `${dir + commandName}.ps1`,
                                        section: "startup"
                                    });
                                }
                                // writes the global script plus the 3 windows specific files for windows users
                                node.fs.writeFile(binName, fileData, {
                                    encoding: "utf8",
                                    mode: 509
                                }, function start_globalName_task_spawn_files_readEntry_read_write():void {
                                    if (isWindows === true) {
                                        globalWrite();
                                    } else {
                                        const link:string = node.path.resolve(`${output.stdout + vars.path.sep}..${vars.path.sep}..${vars.path.sep}bin${vars.path.sep + commandName}`);
                                        file.remove({
                                            callback: function  start_globalName_task_spawn_files_readEntry_read_write_link():void {
                                                node.fs.symlink(binName, link, globalWrite);
                                            },
                                            exclusions: [],
                                            location: link,
                                            section: "startup"
                                        });
                                    }
                                });
                            },
                            removeCallback = function start_globalName_task_spawn_files_removeCallback():void {
                                removeCount = removeCount + 1;
                                if (removeCount === 2) {
                                    readEntry();
                                }
                            };
                        file.remove({
                            callback: removeCallback,
                            exclusions: [],
                            location: binName.replace(".mjs", ".js"),
                            section: "startup"
                        });
                        file.remove({
                            callback: removeCallback,
                            exclusions: [],
                            location: binName,
                            section: "startup"
                        });
                    };
                file.stat({
                    callback: files,
                    location: "",
                    no_file: function start_globalName_task_spawn_noFile():void {
                        if (isWindows === true) {
                            file.mkdir({
                                callback: files,
                                location: bin,
                                section: "startup"
                            });
                        } else {
                            file.mkdir({
                                callback: function start_globalName_task_spawn_noFile_posix():void {
                                    spawn(`chmod 755 ${bin}`, function start_globalName_task_spawn_noFile_posix_callback():void {
                                        files();
                                    }).execute();
                                },
                                location: bin,
                                section: "startup"
                            });
                        }
                    },
                    section: "startup"
                });
            }).execute();
        }
    };
}

export default global_name;