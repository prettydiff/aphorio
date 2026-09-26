
const utilities:core_module_universal = {
    // bytes - converts a number into something like "114.9GiB"
    bytes: function core_universal_bytes(this:number, input?:number):string {
        if (input === undefined) {
            input = Number(this);
        }
        //find the string length of input and divide into triplets
        let output:string = "",
            length:number = input.toString().length;

        const triples:number = (function core_universal_bytes_triples():number {
                if (length < 22) {
                    return Math.floor((length - 1) / 3);
                }
                //it seems the maximum supported length of integer is 22
                return 8;
            }()),
            //each triplet is worth an exponent of 1024 (2 ^ 10)
            power:number   = (function core_universal_bytes_power():number {
                let a:number = triples - 1,
                    b:number = 1024;
                if (triples === 0) {
                    return 0;
                }
                if (triples === 1) {
                    return 1024;
                }
                do {
                    b = b * 1024;
                    a = a - 1;
                } while (a > 0);
                return b;
            }()),
            //kilobytes, megabytes, and so forth...
            unit:string[] = [
                "",
                "KiB",
                "MiB",
                "GiB",
                "TiB",
                "PiB",
                "EiB",
                "ZiB",
                "YiB"
            ];

        if (typeof input !== "number" || Number.isNaN(input) === true || input < 0 || input % 1 > 0) {
            //input not a positive integer
            output = "0B";
        } else if (triples === 0) {
            //input less than 1000
            output = `${input}B`;
        } else {
            //for input greater than 999
            length = Math.floor((input / power) * 100) / 100;
            output = length.toFixed(1) + unit[triples];
        }
        return output;
    },
    // bytesLong - converts a number into something like "501,789,753,344 bytes (467.3GiB)"
    bytes_long: function core_universal_bytesLong(this:number):string {
        const input:number = Number(this);
        if (isNaN(input) === true) {
            return "0 bytes";
        }
        return `${input.commas()} bytes (${this.bytes(input)})`;
    },
    // converts a string byte abbreviation into a number
    bytes_numb: function core_universal_bytesNumb(this:string):number {
        const input:string = this.toLowerCase(),
            map:store_number = {
                kb: 1000,
                kib: 1024,
                mb: 1e6,
                mib: 1024**2,
                gb: 1e9,
                gib: 1024**3,
                tb: 1e12,
                tib: 1024**4,
                pb: 1e15,
                pib: 1024**5,
                eb: 1e18,
                eib: 1024**6
            },
            scale:string = input.match(/[a-z]+$/)[0],
            numb:number = Number(input.match(/^\d+(\.{1,2})?/)[0]);
        if (scale === null || isNaN(numb) === true || (/^\d+(\.\d{1,3})?[a-z]{2,3}$/).test(input) === false || map[scale] === undefined) {
            return null;
        }
        return numb * map[scale];
    },
    // Capitalize - makes first letter of a string uppercase
    capitalize: function core_universal_capitalize(this:string):string {
        const words:string[] = this.split(" "),
            output:string[] = [];
        words.forEach(function core_capitalize_each(value:string):void {
            output.push(value.charAt(0).toUpperCase() + value.slice(1));
        });
        return output.join(" ");
    },
    // 3,600,000 - converts a number into comma separated triples
    commas: function core_universal_commas(this:number):string {
        const negative:boolean = this < 0,
            str:string = String((negative === true)
                ? this * -1
                : this
            ),
            period:number = str.indexOf("."),
            arr:string[] = str.split("");
        let a:number   = (period > -1)
            ? period
            : str.length;
        if (a < 4) {
            return str;
        }
        do {
            a      = a - 3;
            arr[a] = "," + arr[a];
        } while (a > 3);
        return (negative === true)
            ? `-${arr.join("")}`
            : arr.join("");
    },
    // dateTime
    // data === true && timezone_offset        -> "22 SEP 2026, 13:43:05.669L (18:43:05.669Z)"
    // date === true && timezone_offset isNaN  -> "22 SEP 2026, 13:38:29.620"
    // date === false && timezone_offset       -> 13:43:05.669L (18:43:05.669Z)
    // date === false && timezone_offset isNaN -> 13:38:29.620
    dateTime: function core_universal_dateTime(this:number, date:boolean, timeZone_offset:number):string {
        const dateItem:Date = new Date(this),
            month:number = dateItem.getMonth(),
            output:string[] = [],
            pad = function core_universal_dateTime_pad(input:number, milliseconds:boolean):string {
                const str:string = String(input);
                if (milliseconds === true) {
                    if (str.length === 1) {
                        return `${str}00`;
                    }
                    if (str.length === 2) {
                        return `${str}0`;
                    }
                } else if (str.length === 1) {
                    return `0${str}`;
                }
                return str;
            },
            time = function core_universal_dateTime_time(date_object:Date, zone:string):string {
                const hours:string = pad(date_object.getHours(), false),
                    minutes:string = pad(date_object.getMinutes(), false),
                    seconds:string = pad(date_object.getSeconds(), false),
                    milliseconds:string = pad(date_object.getMilliseconds(), true);
                return `${hours}:${minutes}:${seconds}.${milliseconds + zone}`;
            },
            zulu_test:boolean = (isNaN(timeZone_offset) === false);
        if (date === true) {
            output.push(pad(dateItem.getDate(), false));
            if (month === 0) {
                output.push("JAN");
            } else if (month === 1) {
                output.push("FEB");
            } else if (month === 2) {
                output.push("MAR");
            } else if (month === 3) {
                output.push("APR");
            } else if (month === 4) {
                output.push("MAY");
            } else if (month === 5) {
                output.push("JUN");
            } else if (month === 6) {
                output.push("JUL");
            } else if (month === 7) {
                output.push("AUG");
            } else if (month === 8) {
                output.push("SEP");
            } else if (month === 9) {
                output.push("OCT");
            } else if (month === 10) {
                output.push("NOV");
            } else if (month === 11) {
                output.push("DEC");
            }
            output.push(`${dateItem.getUTCFullYear()},`);
        }
        output.push(time(dateItem, (zulu_test === true) ? "L" : ""));
        if (zulu_test === true) {
            const zulu:number = this + (timeZone_offset * 3600000);
            output.push(`(${time(new Date(zulu), "Z")})`);
        }
        return output.join(" ");

    },
    // attempts to convert a string into something compatible is with modern file systems
    file_sanitize: function core_universal_fileSanitize(this:string):string {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let input:string = this;
        if (process.platform === "win32" || process.platform === "cygwin") {
            input = input.replace(/\\|:/g, "")
                .replace(/[\u0001-\u001f]/g, "")
                .replace(/(CON)|(PRN)|(AUX)|(NUL)/gi, "")
                .replace(/(COM1)|(COM2)|(COM3)|(COM4)|(COM5)|(COM6)|(COM7)|(COM8)|(COM9)/gi, "")
                .replace(/(LPT1)|(LPT2)|(LPT3)|(LPT4)|(LPT5)|(LPT6)|(LPT7)|(LPT8)|(LPT9)/gi, "")
                .replace(/(\s+|\.)$/, "");
        }
        input = input.replace(/\u0000|\*|\?|\||<|>|"|\//g, "")
            .replace(/^-+/, "");
        return input;
    },
    // duration since a start time
    time_elapsed: function core_universal_timeElapsed(this:number, start?:bigint):string {
        const elapsed:boolean = (typeof start === "bigint"),
            number:bigint = (elapsed === true)
                ? BigInt(this)
                : BigInt(Math.floor(this as number * 1e9)),
            numberString = function core_universalTime_numberString(numb:bigint):string {
                const str:string = numb.toString();
                return (str.length < 2)
                    ? `0${str}`
                    : str;
            },
            value:bigint       = (elapsed === true)
                ? number - start
                : number,
            factorSec:bigint   = BigInt(1e9),
            factorMin:bigint   = (60n * factorSec),
            factorHour:bigint  = (3600n * factorSec),
            factorDay:bigint   = (86400n * factorSec),
            days:bigint        = (value / factorDay),
            elapsedDay:bigint  = (days * factorDay),
            hours:bigint       = ((value - elapsedDay) / factorHour),
            elapsedHour:bigint = (hours * factorHour),
            minutes:bigint     = ((value - (elapsedDay + elapsedHour)) / factorMin),
            elapsedMin:bigint  = (minutes * factorMin),
            seconds:bigint     = ((value - (elapsedDay + elapsedHour + elapsedMin)) / factorSec),
            nanosecond:bigint  = (value - (elapsedDay + elapsedHour + elapsedMin + (seconds * factorSec))),
            nanoString:string  = (function core_universalTime_nanoString():string {
                let nano:string = nanosecond.toString(),
                    a:number = nano.length;
                if (a < 9) {
                    do {
                        nano = `0${nano}`;
                        a = a + 1;
                    } while (a < 9);
                }
                return nano;
            }()),
            secondString:string = (nanoString === "")
                ? numberString(seconds)
                : `${numberString(seconds)}.${nanoString}`,
            minuteString:string = numberString(minutes),
            hourString:string = numberString(hours),
            dayString:string = (days === 1n)
                ? "1 day, "
                : `${days.toString()} days, `;
        if (elapsed === true) {
            return `${hourString}:${minuteString}:${secondString}`;
        }
        return `${dayString}${hourString}:${minuteString}:${secondString}`;
    }
};

export default utilities;