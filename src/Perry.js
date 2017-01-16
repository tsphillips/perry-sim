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

if (typeof Perry === "undefined") {
    Perry = new class {
        constructor() {
            this.Math = {};
            this.Sim = {};
            this.Client = {};
            this.Server = {};
        } // constructor()

        // Random things
        random() {
            return Math.random();
        } // random()
        clamp(val, min, max) {
            return Math.max(min, Math.min(max, val));
        } // clamp()

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

        // LZW-compress a string
        // LGPL: http://stackoverflow.com/questions/294297/javascript-implementation-of-gzip?sort=newest
        lzw_encode(s) {
            var dict = {};
            var data = (s + "").split("");
            var out = [];
            var currChar;
            var phrase = data[0];
            var code = 256;
            for (var i=1; i<data.length; i++) {
                currChar=data[i];
                if (dict[phrase + currChar] != null) {
                    phrase += currChar;
                }
                else {
                    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                    dict[phrase + currChar] = code;
                    code++;
                    phrase=currChar;
                }
            }
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            for (var i=0; i<out.length; i++) {
                out[i] = String.fromCharCode(out[i]);
            }
            return out.join("");
        }

        // Decompress an LZW-encoded string
        // LGPL: http://stackoverflow.com/questions/294297/javascript-implementation-of-gzip?sort=newest
        lzw_decode(s) {
            var dict = {};
            var data = (s + "").split("");
            var currChar = data[0];
            var oldPhrase = currChar;
            var out = [currChar];
            var code = 256;
            var phrase;
            for (var i=1; i<data.length; i++) {
                var currCode = data[i].charCodeAt(0);
                if (currCode < 256) {
                    phrase = data[i];
                }
                else {
                   phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
                }
                out.push(phrase);
                currChar = phrase.charAt(0);
                dict[code] = oldPhrase + currChar;
                code++;
                oldPhrase = phrase;
            }
            return out.join("");
        }

    } // class Perry
} // if Perry undefined
