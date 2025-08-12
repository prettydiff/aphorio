
// this file supports HTTP methods GET and HEAD

import core from "../browser/core.ts";
import directory from "../utilities/directory.ts";
import file from "../utilities/file.ts";
import file_list from "../browser/file_list.ts";
import node from "../utilities/node.ts";
import vars from "../utilities/vars.ts";

/* cspell: words msvideo, nofollow, onnection, prettydiff */

const http_get:http_action = function http_get(headerList:string[], socket:websocket_client):void {
    let input:string = "";
    const index0:string[] = headerList[0].replace(/^\s+/, "").replace(/\s+/, " ").split(" "),
        method:"GET"|"HEAD" = (index0.indexOf("HEAD") === 0)
            ? "HEAD"
            : "GET",
        server_name:string = socket.server,
        path:string = `${vars.path.servers + server_name + vars.sep}assets${vars.sep}`,
        resource:string = index0[1],
        asset:string[] = resource.split("/"),
        fileFragment:string = asset.join(vars.sep).replace(/^(\\|\/)/, ""),
        payload = function http_get_payload(heading:string[], body:string):string {
            if (method === "HEAD") {
                return heading.join("\r\n");
            }
            return heading.join("\r\n") + body;
        },
        // a dynamically generated template for page HTML
        html = function http_get_html(config:config_html):string {
            const statusText:string = (function http_get_html_status():string {
                    if (config.status === 200) {
                        return "200 OK";
                    }
                    if (config.status === 404) {
                        return "404 NOT FOUND";
                    }
                    if (config.status === 500) {
                        return "500 INTERNAL SERVER ERROR";
                    }
                }()),
                bodyText:string = config.content.join(""),
                headerText:string[] = [
                    `HTTP/1.1 ${statusText}`,
                    `content-type: ${config.content_type}`,
                    "",
                    "server: prettydiff/webserver",
                    "",
                    ""
                ];
            if (config.template === true) {
                const name:string = server_name,
                    templateText:string[] = [
                        "<!doctype html>",
                        "<html lang=\"en\">",
                        "<head>",
                        "<meta charset=\"utf-8\"/>",
                        (config.page_title === null)
                            ? `<title>${name}</title>`
                            : `<title>${name} ${config.page_title}</title>`,
                        "<meta content=\"text/html;charset=UTF-8\" http-equiv=\"Content-Type\"/>",
                        "<meta content=\"width=device-width, initial-scale=1\" name=\"viewport\"/>",
                        "<meta content=\"noindex, nofollow\" name=\"robots\"/>",
                        "<meta content=\"#fff\" name=\"theme-color\"/>",
                        "<meta content=\"Global\" name=\"distribution\"/>",
                        "<meta content=\"en\" http-equiv=\"Content-Language\"/>",
                        "<meta content=\"blendTrans(Duration=0)\" http-equiv=\"Page-Enter\"/>",
                        "<meta content=\"blendTrans(Duration=0)\" http-equiv=\"Page-Exit\"/>",
                        "<meta content=\"text/css\" http-equiv=\"content-style-type\"/>",
                        "<meta content=\"application/javascript\" http-equiv=\"content-script-type\"/>",
                        "<meta content=\"#bbbbff\" name=\"msapplication-TileColor\"/>",
                        (config.template === true)
                            ? `<style type="text/css">${vars.css.basic}</style>`
                            : "",
                        "<link rel=\"icon\" type=\"image/png\" href=\"data:image/png;base64,iVBORw0KGgo=\"/>",
                        "</head>",
                        "<body>",
                        `<h1>${name}</h1>`,
                        (config.status === 200)
                            ? ""
                            : `<h2>${config.status}</h2>`
                    ],
                    script:string = (config.script === null)
                        ? null
                        : (config.core === true)
                            ? `(${config.script.toString().replace(/\(\s*\)/, "(core)")}(${core.toString()}));`
                            : `(${config.script.toString()}());`,
                    templateEnd:string[] = (config.script === null)
                        ? ["</body></html"]
                        : [
                            `<script type="application/javascript">${script}</script></body></html>`
                        ],
                    bodyText:string = templateText.join("\r\n") + config.content.join("\r\n") + templateEnd.join("\r\n");
                    headerText[2] = `content-length: ${Buffer.byteLength(bodyText)}`;
                return payload(headerText, bodyText);
            }
            headerText[2] = `content-length: ${Buffer.byteLength(bodyText)}`;
            return payload(headerText, bodyText);
        },
        write = function http_get_write(payload:Buffer|string):void {
            const destroy = function http_get_write_destroy():void {
                socket.destroy();
            };
            if (socket.write(payload) === true) {
                setTimeout(destroy, 100);
            } else {
                socket.once("drain", function http_get_write_callback_drain():void {
                    setTimeout(destroy, 100);
                });
            }
        },
        notFound = function http_get_notFound():void {
            write(html({
                content: [`<p>Resource not found: <strong>${asset.join("/")}</strong></p>`],
                content_type: "text/html; utf8",
                core: false,
                page_title: "404",
                script: null,
                status: 404,
                template: true
            }));
        },
        statTest = function http_get_statTest(stat:node_fs_BigIntStats):void {
            const directory_item = function http_get_statTest_directoryItem():void {
                    const indexFile:string = `${input.replace(/\\|\/$/, "") + vars.sep}index.html`;
                    file.stat({
                        callback: function http_get_statItem_directoryItem_callback():void {
                            input = indexFile;
                            fileItem();
                        },
                        error_terminate: null,
                        location: indexFile,
                        no_file: function http_get_statTest_directoryItem_noFile():void {
                            const callback = function http_get_statTest_directoryItem_noFile_directory(dir:directory_list|string[]):void {
                                let index_item:number = 0,
                                    dtg:string[] = null,
                                    address:string = "";
                                const list:directory_list = dir as directory_list,
                                    content:string[] = [
                                        `<h2>Directory List - ${decodeURI(index0[1])}</h2>`,
                                        "<table class=\"file-list\"><thead><tr><th><button data-dir=\"1\">object</button></th><th><button data-dir=\"1\">type</button></th><th><button data-dir=\"1\">size</button></th><th><button data-dir=\"1\">modified date</button></th><th><button data-dir=\"1\">modified time</button></th><th><button data-dir=\"1\">permissions</button></th><th><button data-dir=\"1\">children</button></th></tr></thead><tbody>"
                                    ],
                                    total:number = list.length,
                                    icon:store_string = {
                                        "block_device": "\u2580",
                                        "character_device": "\u0258",
                                        "directory": "\ud83d\udcc1",
                                        "fifo_pipe": "\u275a",
                                        "file": "\ud83d\uddce",
                                        "socket": "\ud83d\udd0c",
                                        "symbolic_link": "\ud83d\udd17"
                                    },
                                    scheme:"http"|"https" = (socket.encrypted === true)
                                        ? "https"
                                        : "http",
                                    host:string = (function http_get_host():string {
                                        let index:number = headerList.length,
                                            value:string = "";
                                        do {
                                            index = index - 1;
                                            if (headerList[index].toLowerCase().indexOf("host:") === 0) {
                                                value = headerList[index].slice(headerList[index].indexOf(":") + 1).replace(/\s+/g, "");
                                            } else if (headerList[index].toLowerCase().indexOf("connection:") === 0) {
                                                headerList.splice(index, 1);
                                                index = index + 1;
                                            }
                                        } while (index > 0);
                                        return value;
                                    }());
                                do {
                                    if (list[index_item][3] === 0 && list[index_item][0].indexOf(input) !== list[index_item][0].length - input.length) {
                                        address = `${scheme}://${host + index0[1].replace(/\/$/, "") + vars.sep + list[index_item][0]}`;
                                        dtg = list[index_item][5].mtimeMs.dateTime(true, null).split(", ");
                                        content.push(`<tr class="${(index_item % 2 === 0) ? "even" : "odd"}"><td class="file-name"><span class="icon">${icon[list[index_item][1]]}</span> <a href="${address}">${list[index_item][0]}</a></td><td>${list[index_item][1]}</td><td data-raw="${list[index_item][5].size}">${list[index_item][5].size.commas()}</td><td data-raw="${list[index_item][5].mtimeMs}">${dtg[0]}</td><td>${dtg[1]}</td><td>${list[index_item][5].mode === null ? "" : (list[index_item][5].mode & parseInt("777", 8)).toString(8)}</td><td data-raw="${list[index_item][4]}">${list[index_item][4].commas()}</td></tr>`);
                                    }
                                    index_item = index_item + 1;
                                } while (index_item < total);
                                content.push("</tbody></table>");
                                write(html({
                                    content: content,
                                    content_type: "text/html; utf8",
                                    core: true,
                                    page_title: index0[1],
                                    status: 200,
                                    template: true,
                                    script: file_list
                                }));
                            };
                            directory({
                                callback: callback,
                                depth: 2,
                                exclusions: [],
                                mode: "read",
                                path: input,
                                relative: true,
                                search: "",
                                symbolic: false
                            });
                        }
                    });
                },
                fileItem = function http_get_statTest_fileItem():void {
                    const content_type:string = (function http_get_statTest_fileItem_contentType():string {
                            const extension:string = input.slice(input.lastIndexOf(".") + 1);
                            if (extension === "avi") {
                                return "video/x-msvideo";
                            }
                            if (extension === "css") {
                                return "text/css; utf8";
                            }
                            if (extension === "flv") {
                                return "video/x-flv";
                            }
                            if (extension === "gif") {
                                return "image/gif";
                            }
                            if (extension === "html") {
                                return "text/html; utf8";
                            }
                            if (extension === "ico") {
                                return "image/x-icon";
                            }
                            if (extension === "jpg" || extension === "jpeg") {
                                return "image/jpeg";
                            }
                            if (extension === "js" || extension === "ts") {
                                return "application/javascript; utf8";
                            }
                            if (extension === "json") {
                                return "application/json; utf8";
                            }
                            if (extension === "mp3") {
                                return "audio/mpeg";
                            }
                            if (extension === "mp4" || extension === "mpeg4" || extension === "mkv") {
                                return "video/mp4";
                            }
                            if (extension === "png") {
                                return "image/png";
                            }
                            if (extension === "wmv") {
                                return "video/x-ms-wmv";
                            }
                            if (extension === "xhtml") {
                                return "application/xml+html; utf8";
                            }
                            if (extension === "xml") {
                                return "application/xml; utf8";
                            }
                            return "text/plain; utf8";
                        }()),
                        binary:boolean = (content_type.includes("audio/") === true || content_type.includes("image/") === true || content_type.includes("video/") === true),
                        headerText:string[] = [
                            "HTTP/1.1 200",
                            `content-type: ${content_type}`,
                            (binary === true)
                                ? `content-length: ${Number(stat.size)}`
                                : "transfer-encoding: chunked",
                            "server: prettydiff/webserver",
                            "",
                            ""
                        ];
                    if (method === "HEAD") {
                        write(headerText.join("\r\n"));
                    } else if (binary === true) {
                        // binary media types use content-length type response
                        // - binary formats were failing on chunked responses because the browser only processed the first chunk
                        // - this approach has a lower processing overhead and is thus presumed to be faster to transfer
                        // - this approach looks like a single payload, but the pipe writes data chunks to the wire as they are available, which is still media streaming
                        const stream:node_fs_ReadStream = node.fs.createReadStream(input);
                        socket.write(headerText.join("\r\n"));
                        stream.pipe(socket);
                        stream.on("close", function http_get_statTest_fileItem_close():void {
                            socket.destroy();
                        });
                    } else {
                        // text media types use chunked type response
                        // - on TLS some text media was failing to fully transfer on content length type responses, so all text formats are not chunked
                        // - this is the most flexible approach when things like TLS impose segmentation separate from chunks piped to the socket
                        const stream:node_fs_ReadStream = node.fs.createReadStream(input);
                        stream.on("close", function http_get_statTest_fileItem_close():void {
                            const delay:number = Math.max(250, stream.bytesRead / 10000);
                            socket.write("0\r\n\r\n");
                            setTimeout(function http_get_statTest_fileItem_close_delay():void {
                                socket.destroy();
                            }, delay);
                        });
                        socket.write(headerText.join("\r\n"));
                        stream.on("data", function http_get_statTest_fileItem_data(chunk:Buffer|string):void {
                            socket.write(`${Buffer.byteLength(chunk).toString(16)}\r\n${chunk}\r\n`);
                        });
                    }
                };
            if (stat.isFile() === true) {
                fileItem();
            } else if (stat.isDirectory() === true) {
                directory_item();
            } else {
                notFound();
            }
        },
        decode:string = decodeURI(fileFragment),
        decoded:string = (decode.includes("?") === true)
            ? decode.slice(0, decode.indexOf("?"))
            : decode;
    if (server_name === "dashboard") {
        const real_path:string = vars.path.project.replace(`test${vars.sep}`, "");
        if (decoded.includes("xterm.css") === true) {
            input = `${real_path}node_modules${vars.sep}@xterm${vars.sep}xterm${vars.sep}css${vars.sep}xterm.css`;
        } else if (decoded === "" || decoded.includes("/") === true || decoded.charAt(0) === "?" || decoded.charAt(0) === "#") {
            const list:string = headerList.join("\n"),
                payload:transmit_dashboard = {
                    compose: vars.compose,
                    hashes: vars.hashes,
                    logs: vars.logs,
                    os: vars.os,
                    path: vars.path,
                    platform: process.platform,
                    ports: vars.system_ports,
                    servers: vars.servers,
                    terminal: vars.terminal,
                    timeZone_offset: vars.timeZone_offset
                },
                dashboard:string = vars.dashboard.replace("request: \"\"", `request: \`${list}\``).replace(/const\s+payload\s*=\s*null/, `const payload=${JSON.stringify(payload)}`),
                headers:string[] = [
                    "HTTP/1.1 200",
                    "content-type: text/html",
                    `content-length: ${Buffer.byteLength(dashboard)}`,
                    "server: prettydiff/webserver",
                    "",
                    ""
                ];
            write(headers.join("\r\n") + dashboard);
            return;
        }
    } else if (fileFragment === "") {
        // server root html file takes the name of the server, not index.html
        input = `${path}index.html`;
    } else {
        // all other HTTP requests
        input = path + decoded;
    }
    file.stat({
        callback: statTest,
        error_terminate: null,
        location: input,
        no_file: notFound
    });
};

export default http_get;
