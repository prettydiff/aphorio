
const time = function core_time(start?:bigint):string {
    const elapsed:boolean = (typeof start === "bigint"),
        number:bigint = (elapsed === true)
            // eslint-disable-next-line no-restricted-syntax
            ? this
            // eslint-disable-next-line no-restricted-syntax
            : BigInt(Math.floor(this as number * 1e9)),
        numberString = function utilities_humanTime_numberString(numb:bigint):string {
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
        nanoString:string  = (function utilities_humanTime_nanoString():string {
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
};

export default time;