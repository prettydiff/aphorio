
const utilities:core_universal = {
    commas: function core_universalCommas():string {
        // eslint-disable-next-line no-restricted-syntax
        const str:string = String(this),
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
        return arr.join("");
    },
    dateTime: function core_universalDateTime(date:boolean, timeZone_offset:number):string {
        // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
        const epoch:number = this,
            dateItem:Date = new Date(epoch),
            month:number = dateItem.getMonth(),
            output:string[] = [],
            pad = function utilities_dateTime_pad(input:number, milliseconds:boolean):string {
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
            hours:string = pad(dateItem.getHours(), false),
            minutes:string = pad(dateItem.getMinutes(), false),
            seconds:string = pad(dateItem.getSeconds(), false),
            milliseconds:string = pad(dateItem.getMilliseconds(), true),
            zulu_test:boolean = (isNaN(timeZone_offset) === false && timeZone_offset > 0),
            lima:string = (zulu_test === true)
                ? "L"
                : "";
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
        if (date === false) {
            return `${hours}:${minutes}:${seconds}.${milliseconds}`;
        }
        output.push(`${dateItem.getUTCFullYear()},`);
        output.push(`${hours}:${minutes}:${seconds}.${milliseconds + lima}`);
        if (zulu_test === true) {
            const zulu:number = epoch + timeZone_offset;
            output.push(`(${zulu.dateTime(false, null)}Z)`);
        }
        return output.join(" ");

    },
    time: function core_universalTime(start?:bigint):string {
        const elapsed:boolean = (typeof start === "bigint"),
            number:bigint = (elapsed === true)
                // eslint-disable-next-line no-restricted-syntax
                ? this
                // eslint-disable-next-line no-restricted-syntax
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