/*
Copyright (c)2016 Thomas S. Phillips.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
