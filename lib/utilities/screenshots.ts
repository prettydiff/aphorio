import directory from "./directory.ts";
import file from "./file.ts";
import log from "../core/log.ts";
import spawn from "../core/spawn.ts";
import universal from "../core/universal.ts";
import vars from "../core/vars.ts";

// cspell: words vipsheader, vipsthumbnail

const screenshots = function screenshots():void {
    BigInt.prototype.time = universal.time;
    String.prototype.capitalize = universal.capitalize;
    const path_vips:string = "C:\\Users\\info\\vips-dev-8.18\\bin\\",
        dir_config:config_directory = {
        callback: function screenshots_directory(list:core_directory_list):void {
            const len:number = list.length,
                html:string[] = [`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${vars.environment.name.capitalize()} Screenshots</title>
<meta content="text/html;charset=UTF-8" http-equiv="Content-Type"/>
<meta content="width=device-width, initial-scale=1" name="viewport"/>
<meta content="noindex, nofollow" name="robots"/>
<meta content="#fff" name="theme-color"/>
<meta content="Global" name="distribution"/>
<meta content="en" http-equiv="Content-Language"/>
<meta content="blendTrans(Duration=0)" http-equiv="Page-Enter"/>
<meta content="blendTrans(Duration=0)" http-equiv="Page-Exit"/>
<meta content="text/css" http-equiv="content-style-type"/>
<meta content="application/javascript" http-equiv="content-script-type"/>
<meta content="#bbbbff" name="msapplication-TileColor"/>
<style type="text/css">
:root{
    scrollbar-color:#444 #181818;
    --black:#000;
    --background:#333;
    --background_button:#444;
    --background_dark:#111;
    --background_fieldset:#181818;
    --background_nav:#282828;
    --background_textarea:#222;
    --border_color:#999;
    --border_input:#666;
    --border_soft:#555;
    --fail_background:#322;
    --fail_bright:#f66;
    --fail_dark:#911;
    --status_amber:#443;
    --status_green:#131;
    --status_red:#422;
    --text:#ccc;
    --text_input:#eee;
    --text_cyan:#39f;
    --text_green:#090;
    --text_row_odd:#383838;
    --text_table_header:#282828;
    --text_yellow:#ca3;
    --textarea_border:#676767;

    --font-size:1.2em;
    --h3-size:1.8em;
}
html{font-size:10px}
body{background:var(--background);color:var(--text);font-family:sans-serif;letter-spacing:0.05em;margin:0}
li {
    p,
    h2,
    h3,
    h4,
    h5,
    h6,
    li{font-size:1em}
}
div.section{border-color:var(--border_color);border-style:solid;border-width:0.1em;margin:0 0 2em;min-width:fit-content;padding:2em}
div.section:last-child{margin:0}
h1{font-size:3em}
h2{font-size:2em}
h3{font-size:var(--h3-size)}
h4{font-size:1.6em}
h5{font-size:1.4em}
h6{font-size:1.2em}
h1,h2,h3,h4,h5,h6{margin:0 0 1em}
p,li,dd,dt,td,th,textarea{font-size:var(--font-size)}
p textarea{font-size:1em}
label input,
label select{display:block}
label input[type="checkbox"]{display:inline-block;margin:0.4em 0.5em 0 0}
dt em{color:var(--text_input);font-style:normal;font-weight:bold;text-decoration:underline}
dt{font-size:1.4em}
dd{margin:0 0 1em 2.5em}
dd p{font-size:1em}
li{margin:1em 0 0}
a{color:var(--fail_bright)}
button{background:var(--background_button);border-color:var(--border_input);border-style:revert;border-width:0.1em;box-shadow:0.1em 0.1em 0.25em var(--black);color:var(--text_input);cursor:pointer;padding:0.25em 0.5em}
button:hover{background:var(--background)}
button:active{border-style:inset;box-shadow:-0.1em -0.1em 0.25em var(--background_dark)}
strong,
em{color:var(--text_yellow)}
.clear{background:transparent;border-style:none;display:block;clear:both;float:none}

table.data-table{margin:0 0 2em;min-width:120em}
table.data-table td,
table.data-table th{border:0.1em solid var(--black)}
table.data-table th{background:var(--text_table_header);padding:0.5em}

.odd{background:var(--text_row_odd)}
.odd td{background:inherit}
.even{background:var(--background)}
table{border-collapse:collapse}
td{background:var(--background);font-family:monospace}
td .icon{display:inline-block;width:1.5em}
td{padding:0.5em 1.5em}
td.right{text-align:right}
th{border-color:var(--background_button);border-style:solid;border-width:0.1em;padding:0.2em 0.5em;text-align:left}
th{background:var(--background_textarea);min-width:9em}
td button{padding:0}

#screenshots {
    .sub_section{margin:0 0 4em}
    .sub_section h3{border-color:var(--border);border-style:none none solid;border-width:0.05em}
    .section{display:none}
    li{display:block;float:left;list-style:none;margin:0 1em 0}
    main {
        div.section:last-child{display:block}
        nav{display:block}
        li span{display:block}
        li a{text-decoration:none}
    }
    nav {
        margin:0 0 2em;
        button{border-style:none;box-shadow:none}
        li{border-color:border;border-style:none solid none none;border-width:0.1em;padding:0 1em}
        li:first-child{margin:0 1em 0 0;padding:0 1em 0 0}
        li:last-child{border-style:none}
        ul{margin:0;padding:0}
    }
}
</style>
</head><body id="screenshots">`,
                    `<h1>${vars.environment.name.capitalize()} Screenshots</h1>`,
                    "<p>Some screenshots may have information blacked out to hide identifying information.</p>",
                    "<nav style=\"display:none\"><ul>"
                ],
                increment = function screenshots_directory_increment():void {
                    index = index + 1;
                    do {
                        if (index < len && list[index][0].includes("thumb") === false && list[index][0].includes(".png") === true && list[index][0].includes("index.html") === false) {
                            path_abs = vars.path.project + list[index][0];
                            spawn(`${path_vips}vipsheader.exe -f width -f height ${path_abs}`, function screenshots_directory_increment_vipsheader(output_size:core_spawn_output):void {
                                if (output_size.stderr === "") {
                                    const width:number = Number(output_size.stdout.slice(0, output_size.stdout.indexOf("\r\n"))),
                                        height:number = Number(output_size.stdout.slice(output_size.stdout.indexOf("\r\n") + 2).replace("\r\n", "")),
                                        path_thumb:string = path_abs.replace("screenshots", `screenshots${vars.path.sep}thumbs`);
                                    spawn(`${path_vips}vips.exe crop ${path_abs} ${path_thumb} 0 0 ${Math.min(1920, width)} ${Math.min(1080, height)}`, function screenshots_directory_increment_crop(output_crop:core_spawn_output):void {
                                        if (output_crop.stderr === "") {
                                            spawn(`${path_vips}vipsthumbnail.exe ${path_thumb} --size 384 -o ${path_thumb}`, function screenshots_directory_increment_spawn(output_resize:core_spawn_output):void {
                                                if (output_resize.stderr === "") {
                                                    const paths:string[] = path_abs.split(vars.path.sep),
                                                        formal_name:string = paths[paths.length - 1].replace(/dashboard_v\d+-\d+-\d+_/, "").replace(/\.png/, "").replace(/_/g, " "),
                                                        section_name:string = formal_name.replace(/ \d+$/, "").capitalize();
                                                    let section_new:boolean = false;
                                                    log.shell([`[${process.hrtime.bigint().time(vars.environment.start_time)}] Thumbnail written to ${path_thumb}`]);
                                                    if (paths[paths.length - 2] !== section) {
                                                        if (section !== "") {
                                                            html.push("</ul><span class=\"clear\"></span></div></div>");
                                                            section_new = true;
                                                        }
                                                        section = paths[paths.length - 2];
                                                        html.push(`<div class="section" data-section="${paths[paths.length - 2]}"><h2>${paths[paths.length - 2].replace(/-/g, ".")}</h2>`);
                                                    }
                                                    if (section_name !== sub_section) {
                                                        if (sub_section !== "" && section_new === false) {
                                                            html.push("</ul><span class=\"clear\"></span></div>");
                                                        }
                                                        sub_section = section_name;
                                                        html.push(`<div class="sub_section"><h3>${sub_section}</h3><ul>`);
                                                    }
                                                    html.push(`<li><a href="${path_abs.split(`screenshots${vars.path.sep}`)[1].replace(/\\/g, "/")}"><img src="${path_thumb.split(`screenshots${vars.path.sep}`)[1].replace(/\\/g, "/")}" alt="${formal_name}"/><span>${formal_name}</span></a></li>`);
                                                    increment();
                                                } else {
                                                    log.shell([output_resize.stderr]);
                                                }
                                            }).execute();
                                        } else {
                                            log.shell([output_crop.stderr]);
                                        }
                                    }).execute();
                                } else {
                                    log.shell([output_size.stderr]);
                                }
                            }).execute();
                            return;
                        }
                        index = index + 1;
                    } while (index < len);
                    html.push("<span class=\"clear\"></span></ul></div></div></main><script type=\"application/javascript\">");
                    html.push(`(function (){
    const buttons = document.getElementsByTagName("nav")[0].getElementsByTagName("button"),
        toggle = function (event) {
            const target = event.target,
                sections = document.getElementsByClassName("section");
            let index_sections = sections.length;
            if (index_sections > 0) {
                do {
                    index_sections = index_sections - 1;
                    if (sections[index_sections].dataset.section === target.dataset.section) {
                        sections[index_sections].style.display = "block";
                    } else {
                        sections[index_sections].style.display = "none";
                    }
                } while (index_sections > 0);
            }
        };
    let index_buttons = buttons.length;
    if (index_buttons > 0) {
        do {
            index_buttons = index_buttons - 1;
            buttons[index_buttons].onclick = toggle;
        } while (index_buttons > 0);
    }
}())`);
                    html.push("</script></body></html>");
                    file.write({
                        callback: function screenshots_directory_increment_write(identifier:string):void {
                            log.shell([`[${process.hrtime.bigint().time(vars.environment.start_time)}] HTML written to ${identifier}`]);
                        },
                        contents: html.join("\n"),
                        identifier: `${vars.path.project}screenshots${vars.path.sep}index.html`,
                        location: `${vars.path.project}screenshots${vars.path.sep}index.html`,
                        section: "startup"
                    });
                },
                mkdir = function screenshots_directory_mkdir(identifier:string):void {
                    count = count + 1;
                    html.push(`<li><button data-section="${identifier.split(vars.path.sep).pop()}">${identifier.split(vars.path.sep).pop().replace(/-/g, ".")}</button></li>`);
                    if (count === dirs) {
                        html.push("</ul><span class=\"clear\"></span></nav><main>");
                        index = 0;
                        increment();
                    }
                };
            let index:number = len,
                count:number = 0,
                dirs:number = 0,
                path_abs:string = "",
                section:string = "",
                sub_section:string = "";
            list.sort(function screenshots_directory_sort(a:type_directory_item, b:type_directory_item):-1|1 {
                if (a[0] < b[0]) {
                    return -1;
                }
                return 1;
            });
            if (len > 1) {
                do {
                    index = index - 1;
                    if (list[index][0].includes("thumbs") === false && list[index][0].includes(".png") === false && list[index][0].includes("index.html") === false) {
                        dirs = dirs + 1;
                        file.mkdir({
                            callback: mkdir,
                            identifier: list[index][0],
                            location: list[index][0].replace("screenshots", `screenshots${vars.path.sep}thumbs`),
                            section: "startup"
                        });
                    }
                } while (index > 1);
            }
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