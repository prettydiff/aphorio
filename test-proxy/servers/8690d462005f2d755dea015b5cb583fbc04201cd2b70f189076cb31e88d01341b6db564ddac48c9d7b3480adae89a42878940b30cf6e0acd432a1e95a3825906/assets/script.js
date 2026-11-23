(function () {
    const body = document.getElementsByTagName("body")[0],
        cursor = body.getElementsByClassName("cursor")[0],
        a = document.getElementsByTagName("a");
    let index = a.length;
    // body.onmousemove = function (event) {
    //     cursor.style.top = `${event.clientY - 25}px`;
    //     cursor.style.left = `${event.clientX - 25}px`;
    // };
    if (index > 0) {
        do {
            index = index - 1;
            if (a[index].getAttribute("href").charAt(0) !== "#") {
                a[index].setAttribute("target", "_blank");
            }
        } while (index > 0);
    }
}());