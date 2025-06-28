
const commas = function utilities_commas():string {
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
};

export default commas;