var Perry = new class {

    // UI Helpers
    showElement(id) {
        var e = document.getElementById(id);
        e.style.visibility = "visible";
    } // showElement()

    hideElement(id) {
        var e = document.getElementById(id);
        e.style.visibility = "hidden";
    } // hideElement()

    fadeElement(id, fade, count) {
        var e = document.getElementById(id);
        e.style.visibility = "visible";
        var opacity = parseFloat(e.style.opacity);
        if (isNaN(opacity)) {
            opacity = 0.0;
        } // if
        if (typeof count === "undefined") {
            count = 6;
        } // if
        e.style.opacity = (fade + opacity + opacity) / 3;
        if (count > 0) {
            e.style.opacity = (fade + opacity + opacity) / 3;
            setTimeout(function() {
                Perry.fadeElement(id, fade, count - 1);
            }, 50);
        } // if count
        else {
            e.style.opacity = fade;
            if (fade === 0) {
                e.style.visibility = "hidden";
            } // if
        } // else done
    } // fadeElement()

    fadeInElement(id) {
        Perry.fadeElement(id, 1.0);
    } // fadeInElement()

    fadeOutElement(id) {
        Perry.fadeElement(id, 0.0);
    } // fadeOutElement()

} // class Perry
