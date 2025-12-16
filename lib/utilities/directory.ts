
import node from "../core/node.ts";
import spawn from "../core/spawn.ts";

// cspell: words convertto

const directory = function utilities_directory(args:config_directory):void {
    // arguments:
    // * callback - function - the output is passed into the callback as an argument
    // * depth - number - how many directories deep a recursive scan should read, 0 = full recursion
    // * exclusions - string array - a list of items to exclude
    // * parent - boolean - whether to capture data about the parent directory
    // * path - string - where to start in the local file system
    // * relative - boolean - where to use absolute paths or paths relative to the path argument
    // * search - string - the string transformed into a regular express to search for out of the result set
    // * symbolic - boolean - if symbolic links should be identified as opposed to the artifact they point to
    // -
    // core_directory_list: [] with a .failures and .parent property
    // 0. absolute path (string)
    // 1. type (fileType)
    // 2. parent index (number)
    // 3. child item count (number)
    // 4. selected properties from fs.Stat plus some link resolution data
    // 5. write path from the lib/utilities/rename library for file copy
    // * property "failures" is a list of file paths that could not be read or opened
    let total:number = 1,
        count:number = 0;
    const output:core_directory_list = [],
        failures:string[] = [],
        sep:string = node.path.sep,
        driveSize:store_number = {},
        search_value:string = (typeof args.search === "string" && args.search !== "")
            ? (sep === "\\")
                ? args.search.toLowerCase()
                : args.search
            : null,
        search_last:number = (search_value === null)
            ? 0
            : search_value.length,
        search_reg_token:string = (search_value === null)
            ? ""
            : search_value.slice(1, search_last - 1),
        search_type:type_search = (function utilities_directory_searchType():type_search {
            if (search_value === null) {
                return null;
            }
            if (search_value !== "//" && search_value !== "/" && search_value.charAt(0) === "/" && search_value.charAt(search_last - 1) === "/" && (/^(?:(?:[^?+*{}()[\]\\|]+|\\.|\[(?:\^?\\.|\^[^\\]|[^\\^])(?:[^\]\\]+|\\.)*\]|\((?:\?[:=!]|\?<[=!]|\?>|\?<[^\W\d]\w*>|\?'[^\W\d]\w*')?|\))(?:(?:[?+*]|\{\d+(?:,\d*)?\})[?+]?)?|\|)*$/).test(search_reg_token) === true) {
                return "regex";
            }
            if (search_value.charAt(0) === "!") {
                return "negation";
            }
            return "fragment";
        }()),
        search_reg:RegExp = (search_type === "regex")
            ? new RegExp(search_reg_token)
            : null,
        exclusions:string[] = (function utilities_directory_exclusions():string[] {
            const ex:string[] = [],
                len:number = args.exclusions.length;
            let index:number = 0;
            if (sep === "/") {
                return args.exclusions;
            }
            if (len > 0) {
                do {
                    ex.push(args.exclusions[index].toLowerCase());
                    index = index + 1;
                } while (index < len);
            }
            return ex;
        }()),
        method:(filePath:string, callback:(er:node_error, stat:node_fs_Stats) => void) => void = (args.symbolic === true)
            ? node.fs.lstat
            : node.fs.stat,
        complete = function utilities_directory_complete(parent:type_directory_item):void {
            output.failures = failures;
            output.parent = parent;
            args.callback(output);
        },
        fail = function utilities_directory_fail(code:string, path:string):void {
            failures.push(`${code} - ${path}`);
        },
        counter = function utilities_directory_counter(item:type_directory_item):void {
            if (item !== null) {
                output.push(item);
            }
            if (count === total) {
                output.failures = failures;
                if (args.parent === true) {
                    if (args.path === "/" || args.path === "\\") {
                        output.parent = null;
                        args.callback(output);
                    } else if ((/^\w:(\\)?$/).test(args.path) === true) {
                        output.parent = ["\\", "directory", 0, 0, {
                            atimeMs: 0,
                            ctimeMs: 0,
                            linkPath: "",
                            linkType: "",
                            mode: 0,
                            mtimeMs: 0,
                            size: 0
                        }, ""];
                        args.callback(output);
                    } else {
                        const parent_path:string = (function utilities_directory_counter_parentPath():string {
                            const paths:string[] = args.path.split(sep);
                            paths.pop();
                            if ((paths[0] === "" && paths.length === 1) || (paths[0] === "" && paths[1] === "" && paths.length === 2 && sep === "/")) {
                                return "/";
                            }
                            return paths.join(sep);
                        }());
                        stat_wrap(parent_path, true, 0);
                    }
                } else {
                    complete(null);
                }
            }
        },
        stat_wrap = function utilities_directory_statWrap(path:string, parent_item:boolean, parent:number):void {
            method(path, function utilities_directory_statWrap_stat(ers:node_error, stat:node_fs_Stats):void {
                count = count + 1;
                if (ers === null) {
                    const get_type = function utilities_directory_statWrap_stat_getType(stat_item:node_fs_Stats):type_file {
                            if (stat_item.isFile() === true) {
                                return "file";
                            }
                            if (stat_item.isDirectory() === true) {
                                return "directory";
                            }
                            if (stat_item.isBlockDevice() === true) {
                                return "block_device";
                            }
                            if (stat_item.isCharacterDevice() === true) {
                                return "character_device";
                            }
                            if (stat_item.isFIFO() === true) {
                                return "fifo_pipe";
                            }
                            if (stat_item.isSocket() === true) {
                                return "socket";
                            }
                            if (stat_item.isSymbolicLink() === true) {
                                return "symbolic_link";
                            }
                        },
                        populate = function utilities_directory_statWrap_stat_populate(type:"block_device"|"character_device"|"directory"|"fifo_pipe"|"file"|"socket"|"symbolic_link"):void {
                            const stat_obj:core_directory_data = {
                                    atimeMs: stat.atimeMs,
                                    ctimeMs: stat.ctimeMs,
                                    linkPath: "",
                                    linkType: "",
                                    mode: stat.mode,
                                    mtimeMs: stat.mtimeMs,
                                    size: ((/^\w:(\\)?$/).test(path) === true && driveSize[path] !== undefined)
                                        ? driveSize[path]
                                        : stat.size
                                },
                                include = function utilities_directory_statWrap_stat_populate_include():boolean {
                                    if (search_value === null) {
                                        return true;
                                    }
                                    if (search_type === "regex" && search_reg.test(rel_name) === true) {
                                        return true;
                                    }
                                    if (search_type === "negation" && rel_name.includes(search_value) === false) {
                                        return true;
                                    }
                                    if (search_type === "fragment" && rel_name.includes(search_value) === true) {
                                        return true;
                                    }
                                    return false;
                                },
                                path_drive:string = ((/^\w:(\\)?$/).test(path) === true)
                                    ? `${path}\\`
                                    : path,
                                dirs:string[] = (args.path === "\\")
                                    ? path.split(sep)
                                    : path.replace(args.path, "").split(sep),
                                rel_name:string = dirs.pop(),
                                name:string = ((/^\w:(\\)?$/).test(path) === true)
                                    ? path_drive
                                    : (args.relative === true && path !== args.path)
                                        ? rel_name
                                        : path,
                                dir_len:number = (args.path === "\\")
                                    ? dirs.length + 1
                                    : dirs.length;
                            if ((exclusions.includes(rel_name) === true && sep === "/") || (exclusions.includes(rel_name.toLowerCase()) === true && sep === "\\")) {
                                counter(null);
                            } else {
                                if (type === "directory") {
                                    if (parent_item === true || path_drive === args.path || args.depth < 1 || dir_len < args.depth) {
                                        node.fs.readdir(path_drive, function utilities_directory_statWrap_stat_populate_readdir(err:node_error, dir:string[]):void {
                                            if (err === null) {
                                                if (parent_item === true) {
                                                    complete([path_drive, "directory", 0, dir.length, stat_obj, ""]);
                                                } else {
                                                    total = total + dir.length;
                                                    counter([name, "directory", parent, dir.length, stat_obj, ""]);
                                                    if (args.path !== "\\" || dir_len - 1 < args.depth) {
                                                        dir.forEach(function utilities_directory_statWrap_stat_populate_readdir_each(value:string):void {
                                                            utilities_directory_statWrap(path + sep + value, false, output.length - 1);
                                                        });
                                                    }
                                                }
                                            } else {
                                                fail(err.code, path);
                                                counter(null);
                                            }
                                        });
                                    } else {
                                        counter([name, "directory", parent, 0, stat_obj, ""]);
                                    }
                                } else if (include() === true) {
                                    if (type === "symbolic_link") {
                                        node.fs.realpath(path_drive, {encoding:"utf8"}, function utilities_directory_statWrap_stat_populate_linkPath(erp:node_error, real_path:string):void {
                                            if (erp === null) {
                                                stat_obj.linkPath = real_path;
                                                node.fs.stat(real_path, function utilities_directory_statWrap_stat_populate_linkPath_linkType(ert:node_error, link_type:node_fs_Stats):void {
                                                    if (ert === null) {
                                                        stat_obj.linkType = get_type(link_type);
                                                    } else {
                                                        fail(ert.code, real_path);
                                                    }
                                                    if (parent_item === true) {
                                                        complete([path, "symbolic_link", 0, 0, stat_obj, ""]);
                                                    } else {
                                                        counter([name, "symbolic_link", parent, 0, stat_obj, ""]);
                                                    }
                                                });
                                            } else {
                                                fail(erp.code, path);
                                                counter([name, "symbolic_link", parent, 0, stat_obj, ""]);
                                            }
                                        });
                                    } else {
                                        counter([name, type, parent, 0, stat_obj, ""]);
                                    }
                                } else {
                                    counter(null);
                                }
                            }
                        };
                    populate(get_type(stat));
                } else {
                    fail(ers.code, path);
                    counter(null);
                }
            });
        },
        args_len:number = args.path.length;
    if (args.path.charAt(args_len - 1) === sep && args_len > 2) {
        args.path = args.path.slice(0, args_len - 1);
    }
    if (args.path === "\\") {
        spawn("get-volume | convertto-json", function utilities_directory_windows(out:core_spawn_output):void {
            const drives:windows_drives[] = JSON.parse(out.stdout);
            let index:number = drives.length;
            output.push(["\\", "directory", 0, index, {
                atimeMs: 0,
                ctimeMs: 0,
                linkPath: "",
                linkType: "",
                mode: 0,
                mtimeMs: 0,
                size: 0
            }, ""]);
            if (index > 0) {
                do {
                    index = index - 1;
                    if (drives[index].DriveLetter !== null) {
                        driveSize[`${drives[index].DriveLetter}:`] = drives[index].Size;
                        stat_wrap(`${drives[index].DriveLetter}:`, false, 0);
                    }
                } while (index > 0);
            }
        }, {
            error: function utilities_directory_indowsRootError(erw:node_childProcess_ExecException):void {
                failures.push(`${erw.code} - \\`);
                complete(null);
            },
            shell: "powershell"
        }).execute();
    } else {
        stat_wrap(args.path, false, 0);
    }
};

export default directory;