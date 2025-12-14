
import node from "../core/node.ts";

const directory = function utilities_directory(args:config_directory):void {
    // arguments:
    // * callback - function - the output is passed into the callback as an argument
    // * depth - number - how many directories deep a recursive scan should read, 0 = full recursion
    // * exclusions - string array - a list of items to exclude
    // * path - string - where to start in the local file system
    // * relative - boolean - where to use absolute paths or paths relative to the path argument
    // * search - string - the string transformed into a regular express to search for out of the result set
    // * symbolic - boolean - if symbolic links should be identified as opposed to the artifact they point to
    // -
    // core_directory_list: [].failures
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
        dir_store:store_number = {},
        failures:string[] = [],
        sep:string = node.path.sep,
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
            const output:string[] = [],
                len:number = output.length;
            let index:number = 0;
            if (sep === "/") {
                return args.exclusions;
            }
            if (len > 0) {
                do {
                    output.push(args.exclusions[index].toLowerCase());
                    index = index + 1;
                } while (index < len);
            }
            return output;
        }()),
        method:(filePath:string, callback:(er:node_error, stat:node_fs_Stats) => void) => void = (args.symbolic === true)
            ? node.fs.lstat
            : node.fs.stat,
        complete = function utilities_directory_complete():void {
            if (count === total) {
                output.failures = failures;
                output.sort(function utilities_directory_complete_sort(a:type_directory_item, b:type_directory_item):-1|1 {
                    if (a[1] === "directory" && b[1] !== "directory") {
                        return -1;
                    }
                    if (a[1] < b[1]) {
                        return -1;
                    }
                    if (a[1] === b[1] && a[0] < b[0]) {
                        return -1;
                    }
                    return 1;
                });
                args.callback(output);
            }
        },
        stat_wrap = function utilities_directory_statWrap(path:string):void {
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
                                    size: stat.size
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
                                dirs:string[] = path.replace(args.path, "").split(sep),
                                rel_name:string = dirs.pop(),
                                parent:number = (path === args.path)
                                    ? 0
                                    : dir_store[path.replace(sep + rel_name, "")],
                                name:string = (args.relative === true && path !== args.path)
                                    ? rel_name
                                    : path;
                            if ((exclusions.includes(rel_name) === true && sep === "/") || (exclusions.includes(rel_name.toLowerCase()) === true && sep === "\\")) {
                                complete();
                            } else {
                                if (type === "directory") {
                                    if (path === args.path || args.depth < 1 || dirs.length < args.depth) {
                                        node.fs.readdir(path, function utilities_directory_statWrap_stat_populate_readdir(err:node_error, dir:string[]):void {
                                            if (err === null) {
                                                if (include() === true) {
                                                    dir_store[path] = output.length;
                                                    output.push([name, "directory", parent, dir.length, stat_obj, ""]);
                                                }
                                                total = total + dir.length;
                                                dir.forEach(function utilities_directory_statWrap_stat_populate_readdir_each(value:string):void {
                                                    stat_wrap(path + sep + value);
                                                });
                                            } else {
                                                failures.push(`${err.code} - ${path}`);
                                                output.push([name, "directory", parent, 0, stat_obj, ""]);
                                            }
                                            complete();
                                        });
                                    } else {
                                        complete();
                                    }
                                } else if (type === "symbolic_link") {
                                    if (include() === true) {
                                        node.fs.realpath(path, {encoding:"utf8"}, function utilities_directory_statWrap_stat_populate_linkPath(erp:node_error, real_path:string):void {
                                            if (erp === null) {
                                                stat_obj.linkPath = real_path;
                                                node.fs.stat(real_path, function utilities_directory_statWrap_stat_populate_linkPath_linkType(ert:node_error, link_type:node_fs_Stats):void {
                                                    if (ert === null) {
                                                        stat_obj.linkType = get_type(link_type);
                                                    } else {
                                                        failures.push(`${ert.code} - ${real_path}`);
                                                    }
                                                    output.push([name, "symbolic_link", parent, 0, stat_obj, ""]);
                                                    complete();
                                                });
                                            } else {
                                                failures.push(`${erp.code} - ${path}`);
                                                output.push([name, "symbolic_link", parent, 0, stat_obj, ""]);
                                                complete();
                                            }
                                        });
                                    } else {
                                        complete();
                                    }
                                } else {
                                    if (include() === true) {
                                        output.push([name, type, parent, 0, stat_obj, ""]);
                                    }
                                    complete();
                                }
                            }
                        };
                    populate(get_type(stat));
                } else {
                    failures.push(`${ers.code} - ${path}`);
                }
            });
        };
    stat_wrap(args.path);
};

export default directory;