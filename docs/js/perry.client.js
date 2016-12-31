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

Perry;

Perry.Math = {
    min: 64000,
    max: 64000,

    /**
    Four-state XOR Shift PRNG by George Marsaglia.
    All values assumed to be 32-bit.
    Pass a 4-element array as seed, if desired.
    Returns a pseudo-random 32-bit number.
    Adapted from https://en.wikipedia.org/wiki/Xorshift#Example_implementation.
    Warning: This function is not thread-safe.
    */
    xorShift128: function(seed) {
        // Javascript is supposed to treat integers as 32-bit,
        // but just in case we will modulo everything 2^32.
        var Math = Perry.Math || {};
        if (seed) {
            Math._xorShiftState = seed;
        } // if seed
        else if (typeof Math._xorShiftState === "undefined") {
            Math._xorShiftState = [1, 2, 3, 4];
        } // if state undefined
        var t = Math._xorShiftState[3];
    	t ^= (t << 11) % 0x100000000;
    	t ^= (t >>> 8)  % 0x100000000; // logical shift
    	Math._xorShiftState[3] = Math._xorShiftState[2];
        Math._xorShiftState[2] = Math._xorShiftState[1];
        Math._xorShiftState[1] = Math._xorShiftState[0];
    	t ^= Math._xorShiftState[0];
    	t ^= (Math._xorShiftState[0] >>> 19) % 0x100000000; // logical shift
    	Math._xorShiftState[0] = t;
        if (t < Math.min) { Math.min = t; }
        if (t > Math.max) { Math.max = t; }
    	return t;
    } // xorShift128()
    ,
    random: function() {
        var x;
        x = Math.abs(Perry.Math.xorShift128()) / 0x80000000;
        return x;
    } // random()
    ,
    checkRnd: function() {
        var dist = [0, 0, 0, 0];
        var n = 64000000;
        for (var i=0; i<n; i++) {
            var x = Perry.Math.random();
            if (x <= 0.25) {
                dist[0]++;
            } else if (x <= 0.50) {
                dist[1]++;
            } else if (x <= 0.75) {
                dist[2]++;
            } else {
                dist[3]++;
            } // else
        } // for i
        var result = [];
        result[0] = dist[0] / n;
        result[1] = dist[1] / n;
        result[2] = dist[2] / n;
        result[3] = dist[3] / n;
        return result;
    } // checkRnd()
} // structure Math
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

Perry;

/**
* An ImageCache object will load images in the background and invoke
* callbacks when the images are ready.
*
* Set the onReady field to a callback function that will be invoked once all images are ready.
*/
Perry.Client.ImageCache = class {
    constructor() {
        this.cache     = {};    // images are stored here
        this.callbacks = {};    // a callback for each image
        this.startLoad = {};    // time load started
        this.endLoad   = {};    // time load ended
        this.loaded    = 0;     // how many images are loaded
        this.ready     = 0;     // how many images are ready
        this.onReady   = null;  // callback when all images ready
    } // constructor()

    /**
    * @param name The URI to the image, or an array of URIs.
    * @param callback An optional callback function to invoke when the image is ready.
    */
    loadImage(nameOrArray, callback) {
        // Function takes a single URI or an array of URIs
        if (Array.isArray(nameOrArray)) {
            for (var i=0; i<nameOrArray.length; i++) {
                this.loadImage(nameOrArray[i], callback);
            } // for i
            return;
        } // if
        var name = nameOrArray;
        if (typeof this.cache[name] !== "undefined") {
            return;
        } // if
        this.cache[name] = "loading " + name;
        this.callbacks[name] = callback;
        this.startLoad[name] = Date.now();
        this.loaded++;
        var img = new Image();
        img.src = name;
        img.onload = (function(ic, name, img) {
            return function() {
                if (ic.debug === true) {
                    console.log("loading " + name);
                } // if
                ic.cache[name] = img;
                ic.endLoad[name] = Date.now();
                ic.ready++;
                if (typeof ic.callbacks[name] === "function") {
                    ((ic.callbacks[name])());
                } // if specific callback
                if (ic.ready === ic.loaded) {
                    if (ic.debug === true) {
                        console.log("ImageCache finished loading images.");
                        var keys = Object.keys(ic.cache).sort();
                        for (var i=0; i<keys.length; i++) {
                            var key = keys[i]
                            var msg = key + " " +
                                ic.startLoad[key] + " " +
                                ic.endLoad[key] + " " +
                                (ic.endLoad[key] - ic.startLoad[key]) +
                                "ms\n";
                            console.log(msg);
                        } // for i
                    } // if debug
                    if (typeof ic.onReady === "function") {
                        ((ic.onReady)());
                    } // if onReady set
                } // if all ready
            };
        })(this, name, img);
    } // loadImage()

} // class ImageCache
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

Perry;

// TileSet

// Cast an image as tiles

Perry.Client.TileSet = class {

} // class TileSet
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

Perry;

/*
Generate a sample TileSet image.
The TileSet image can be used as-is, or used as a template for custom images.
*/

Perry.Client.TileSetGenerator = class {

    constructor(width, height, tileWidth, tileHeight, labels) {
        this.width = width;
        this.height = height;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.canvas = document.getElementById("perry-tileset");
        if (this.canvas === null) {
            this.canvas = document.createElement("canvas");
            document.body.appendChild(this.canvas);
        } // if
        this.canvas.width  = tileWidth * width;
        this.canvas.height = tileHeight * height;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.save();
        this.ctx.fillStyle = "#3f3";
        this.ctx.fillStyle = "rgba(255,255,255,0.0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.font = '6pt Calibri';
        this.ctx.textAlign = "center";

        // 16 rows, 16 columns, 256 tiles total
        // Rows 0-7 are passable, 8-15 are blocking
        // 0-1: outdoor, passable ground
        // 2-3: outdoor, passable ground cover
        // 4-5: indoor, passable floor
        // 6-7: indoor, passable floor cover
        // 8-11: outdoor, blocking
        // 12-15: indoor, blocking

        // Outdoor, passable, ground
        // red dirt: 127 82 23
        // silver : 192 192 192
        // green: 00 128 00
        for (var j=0; j<=1; j++) {
            for (var i=0; i<width; i++) {
                var x = i * tileWidth;
                var y = j * tileHeight;
                var color;
                if (j==1) {
                    color = "rgb(" +
                        Math.floor(127 + (  0-127)*(i/15)) + "," +
                        Math.floor( 82 + (128- 82)*(i/15)) + "," +
                        Math.floor( 23 + (  0- 23)*(i/15)) + ")";
                }
                else {
                    color = "rgb(" +
                        Math.floor(192 + (127-192)*(i/15)) + "," +
                        Math.floor(192 + ( 82-192)*(i/15)) + "," +
                        Math.floor(192 + ( 23-192)*(i/15)) + ")";
                } // else
                this.drawFloor(x, y, color, "black");
                var msg = "GND-" + i + "-" + j;
                this.ctx.fillStyle = "black";
                this.ctx.fillText(msg,
                    x + (tileWidth/2),
                    y + (tileHeight*7/8) + 4);
            } // for i
        } // for j

        // Outdoor, passable, cover
        for (var j=2; j<=3; j++) {
            for (var i=0; i<width; i++) {
                var x = i * tileWidth;
                var y = j * tileHeight;
                this.drawFloor(x, y, "rgb(255,255,255,0)", "green");
                if (i < 8) {
                    this.drawFLWallLow(x, y, "rgb(255,255,255,0)", "green");
                    this.drawFRWallLow(x, y, "rgb(255,255,255,0)", "green");
                    this.drawCeilingLow(x, y, "rgb(255,255,255,0)", "green");
                }
                else if (i < 12) {
                    this.drawFLWallMid(x, y, "rgb(255,255,255,0)", "green");
                    this.drawFRWallMid(x, y, "rgb(255,255,255,0)", "green");
                    this.drawCeilingMid(x, y, "rgb(255,255,255,0)", "green");
                }
                else {
                    if (j & 1 === 1) {
                        this.drawBLWallHigh(x, y, "rgb(255,255,255,0)", "green");
                    } // if
                    else {
                        this.drawBRWallHigh(x, y, "rgb(255,255,255,0)", "green");
                    } // else
                } // else

                var msg = "GCVR-" + i + "-" + j;
                this.ctx.save();
                this.ctx.fillStyle = "green";
                this.ctx.fillText(msg,
                    x + (tileWidth/2),
                    y + (tileHeight*7/8) + 4);
                this.ctx.restore();
            } // for i
        } // for j

        // Indoor, passable, floor
        // BurlyWood: 222, 184, 135
        // rose gold: 236, 197, 192
        // lavender: 235, 221, 226
        // coffee: 111, 78, 55
        for (var j=4; j<=5; j++) {
            for (var i=0; i<width; i++) {
                var x = i * tileWidth;
                var y = j * tileHeight;
                var color;
                if (j==4) {
                    color = "rgb(" +
                        Math.floor(222 + (236-222)*(i/15)) + "," +
                        Math.floor(184 + (197-184)*(i/15)) + "," +
                        Math.floor(135 + (192-135)*(i/15)) + ")";
                }
                else {
                    color = "rgb(" +
                        Math.floor(236 + (111-236)*(i/15)) + "," +
                        Math.floor(197 + ( 78-197)*(i/15)) + "," +
                        Math.floor(192 + ( 55-192)*(i/15)) + ")";
                } // else
                this.drawFloor(x, y, color, "black");
                var msg = "FLR-" + i + "-" + j;
                this.ctx.fillStyle = "black";
                this.ctx.fillText(msg,
                    x + (tileWidth/2),
                    y + (tileHeight*7/8) + 4);
            } // for i
        } // for j

        // Indoor, passable, cover
        for (var j=6; j<=7; j++) {
            for (var i=0; i<width; i++) {
                var x = i * tileWidth;
                var y = j * tileHeight;
                this.drawFloor(x, y, "rgb(255,255,255,0)", "burlywood");
                if (i < 8) {
                    this.drawFLWallLow(x, y, "rgb(255,255,255,0)", "burlywood");
                    this.drawFRWallLow(x, y, "rgb(255,255,255,0)", "burlywood");
                    this.drawCeilingLow(x, y, "rgb(255,255,255,0)", "burlywood");
                }
                else if (i < 12) {
                    this.drawFLWallMid(x, y, "rgb(255,255,255,0)", "burlywood");
                    this.drawFRWallMid(x, y, "rgb(255,255,255,0)", "burlywood");
                    this.drawCeilingMid(x, y, "rgb(255,255,255,0)", "burlywood");
                }
                else {
                    if (j & 1 === 1) {
                        this.drawBLWallHigh(x, y, "rgb(255,255,255,0)", "burlywood");
                    } // if
                    else {
                        this.drawBRWallHigh(x, y, "rgb(255,255,255,0)", "burlywood");
                    } // else
                } // else
                var msg = "FCVR-" + i + "-" + j;
                this.ctx.save();
                this.ctx.fillStyle = "burlywood";
                this.ctx.fillText(msg,
                    x + (tileWidth/2),
                    y + (tileHeight*7/8) + 4);
                this.ctx.restore();
            } // for i
        } // for j

        // outdoor, blocking
        for (var j=8; j<=11; j++) {
            for (var i=0; i<width; i++) {
                var x = i * tileWidth;
                var y = j * tileHeight;
                this.drawFloor(x, y, "red", "black");
                if (j>=9 && i<8) {
                    this.drawFLWallLow(x, y, "gray", "black");
                    this.drawFRWallLow(x, y, "gray", "black");
                    this.drawCeilingLow(x, y, "gray", "black");
                } // if
                else if (j>=9 && i<12) {
                    this.drawFLWallMid(x, y, "gray", "black");
                    this.drawFRWallMid(x, y, "gray", "black");
                    this.drawCeilingMid(x, y, "gray", "black");
                } // if
                else if (j>=9) {
                    this.drawFLWallHigh(x, y, "gray", "black");
                    this.drawFRWallHigh(x, y, "gray", "black");
                    this.drawCeilingHigh(x, y, "gray", "black");
                } // else
                var msg = "GBLK-" + i + "-" + j;
                this.ctx.fillStyle = "black";
                this.ctx.fillText(msg,
                    x + (tileWidth/2),
                    y + (tileHeight*7/8) + 4);
            } // for i
        } // for j

        // indoor, blocking
        for (var j=12; j<=15; j++) {
            for (var i=0; i<width; i++) {
                var x = i * tileWidth;
                var y = j * tileHeight;
                this.drawFloor(x, y, "red", "black");
                if (j>=13 && i<8) {
                    this.drawFLWallLow(x, y, "burlywood", "black");
                    this.drawFRWallLow(x, y, "burlywood", "black");
                    this.drawCeilingLow(x, y, "burlywood", "black");
                } // if
                else if (j>=13 && i<12) {
                    this.drawFLWallMid(x, y, "burlywood", "black");
                    this.drawFRWallMid(x, y, "burlywood", "black");
                    this.drawCeilingMid(x, y, "burlywood", "black");
                } // if
                else if (j>=13) {
                    this.drawFLWallHigh(x, y, "burlywood", "black");
                    this.drawFRWallHigh(x, y, "burlywood", "black");
                    this.drawCeilingHigh(x, y, "burlywood", "black");
                } // else
                var msg = "FBLK-" + i + "-" + j;
                this.ctx.fillStyle = "black";
                this.ctx.fillText(msg,
                    x + (tileWidth/2),
                    y + (tileHeight*7/8) + 4);
            } // for i
        } // for j

        this.ctx.restore();
    } // constructor()

    /**
    Note: c1 === a2

    x       x+w
      (x+w/2)

        c4          y+h*(0/8)
    b4      d4      y+h*(1/8)
        a4          y+h*(2/8)
        c3
    b3      d3      y+h*(3/8)
        a3          y+h*(4/8)
        c2
    b2      d2      y+h*(5/8)
        a2          y+h*(6/8)
        c1
    b1      d1      y+h*(7/8)
        a1          y+h*(8/8)
    */
    getPoints(x, y) {
        var w = this.tileWidth;
        var h = this.tileHeight;
        return {
            a1: [x + (w / 2),   y + (h*(8/8))],
            b1: [x,             y + (h*(7/8))],
            c1: [x + (w / 2),   y + (h*(6/8))],
            d1: [x + (w) - 1,   y + (h*(7/8))],

            a2: [x + (w / 2),   y + (h*(6/8))],
            b2: [x,             y + (h*(5/8))],
            c2: [x + (w / 2),   y + (h*(4/8))],
            d2: [x + (w) - 1,   y + (h*(5/8))],

            a3: [x + (w / 2),   y + (h*(4/8))],
            b3: [x,             y + (h*(3/8))],
            c3: [x + (w / 2),   y + (h*(2/8))],
            d3: [x + (w) - 1,   y + (h*(3/8))],

            a4: [x + (w / 2),   y + (h*(2/8))],
            b4: [x,             y + (h*(1/8))],
            c4: [x + (w / 2),   y + (h*(0/8))],
            d4: [x + (w) - 1,   y + (h*(1/8))]
        };
    } // getPoints

    drawFloor(x, y, fill, stroke) {
        var p = this.getPoints(x, y);
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(p.a1[0], p.a1[1]);
        this.ctx.lineTo(p.b1[0], p.b1[1]);
        this.ctx.lineTo(p.c1[0], p.c1[1]);
        this.ctx.lineTo(p.d1[0], p.d1[1]);
        this.ctx.lineTo(p.a1[0], p.a1[1]);
        this.ctx.fillStyle = fill || "white";
        this.ctx.strokeStyle = stroke || "black";
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    } // drawFloor()

    // Front Left Wall Low
    drawFLWallLow(x, y, fill, stroke) {
        var p = this.getPoints(x, y);
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(p.a1[0], p.a1[1]);
        this.ctx.lineTo(p.b1[0], p.b1[1]);
        this.ctx.lineTo(p.b2[0], p.b2[1]);
        this.ctx.lineTo(p.a2[0], p.a2[1]);
        this.ctx.lineTo(p.a1[0], p.a1[1]);
        this.ctx.fillStyle = fill || "white";
        this.ctx.strokeStyle = stroke || "black";
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    } // drawFLWallLow()

    // Front Left Wall Mid
    drawFLWallMid(x, y, fill, stroke) {
        var p = this.getPoints(x, y);
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(p.a1[0], p.a1[1]);
        this.ctx.lineTo(p.b1[0], p.b1[1]);
        this.ctx.lineTo(p.b3[0], p.b3[1]);
        this.ctx.lineTo(p.a3[0], p.a3[1]);
        this.ctx.lineTo(p.a1[0], p.a1[1]);
        this.ctx.fillStyle = fill || "white";
        this.ctx.strokeStyle = stroke || "black";
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    } // drawFLWallMid()

    // Front Left Wall High
    drawFLWallHigh(x, y, fill, stroke) {
        var p = this.getPoints(x, y);
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(p.a1[0], p.a1[1]);
        this.ctx.lineTo(p.b1[0], p.b1[1]);
        this.ctx.lineTo(p.b4[0], p.b4[1]);
        this.ctx.lineTo(p.a4[0], p.a4[1]);
        this.ctx.lineTo(p.a1[0], p.a1[1]);
        this.ctx.fillStyle = fill || "white";
        this.ctx.strokeStyle = stroke || "black";
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    } // drawFLWallHigh()

    // Back Left Wall High
    drawBLWallHigh(x, y, fill, stroke) {
        var p = this.getPoints(x, y);
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(p.b1[0], p.b1[1]);
        this.ctx.lineTo(p.b4[0], p.b4[1]);
        this.ctx.lineTo(p.c4[0], p.c4[1]);
        this.ctx.lineTo(p.c1[0], p.c1[1]);
        this.ctx.lineTo(p.b1[0], p.b1[1]);
        this.ctx.fillStyle = fill || "white";
        this.ctx.strokeStyle = stroke || "black";
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    } // drawBLWallHigh()


    // Front Right Wall Low
    drawFRWallLow(x, y, fill, stroke) {
        var p = this.getPoints(x, y);
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(p.a1[0], p.a1[1]);
        this.ctx.lineTo(p.d1[0], p.d1[1]);
        this.ctx.lineTo(p.d2[0], p.d2[1]);
        this.ctx.lineTo(p.a2[0], p.a2[1]);
        this.ctx.lineTo(p.a1[0], p.a1[1]);
        this.ctx.fillStyle = fill || "white";
        this.ctx.strokeStyle = stroke || "black";
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    } // drawFLWallLow()

    // Front Right Wall Mid
    drawFRWallMid(x, y, fill, stroke) {
        var p = this.getPoints(x, y);
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(p.a1[0], p.a1[1]);
        this.ctx.lineTo(p.d1[0], p.d1[1]);
        this.ctx.lineTo(p.d3[0], p.d3[1]);
        this.ctx.lineTo(p.a3[0], p.a3[1]);
        this.ctx.lineTo(p.a1[0], p.a1[1]);
        this.ctx.fillStyle = fill || "white";
        this.ctx.strokeStyle = stroke || "black";
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    } // drawFLWallMid()

    // Front Right Wall High
    drawFRWallHigh(x, y, fill, stroke) {
        var p = this.getPoints(x, y);
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(p.a1[0], p.a1[1]);
        this.ctx.lineTo(p.d1[0], p.d1[1]);
        this.ctx.lineTo(p.d4[0], p.d4[1]);
        this.ctx.lineTo(p.a4[0], p.a4[1]);
        this.ctx.lineTo(p.a1[0], p.a1[1]);
        this.ctx.fillStyle = fill || "white";
        this.ctx.strokeStyle = stroke || "black";
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    } // drawFLWallHigh()

    // Back Right Wall High
    drawBRWallHigh(x, y, fill, stroke) {
        var p = this.getPoints(x, y);
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(p.c1[0], p.c1[1]);
        this.ctx.lineTo(p.c4[0], p.c4[1]);
        this.ctx.lineTo(p.d4[0], p.d4[1]);
        this.ctx.lineTo(p.d1[0], p.d1[1]);
        this.ctx.lineTo(p.c1[0], p.c1[1]);
        this.ctx.fillStyle = fill || "white";
        this.ctx.strokeStyle = stroke || "black";
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    } // drawBLWallHigh()

    drawCeilingLow(x, y, fill, stroke) {
        var p = this.getPoints(x, y);
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(p.a2[0], p.a2[1]);
        this.ctx.lineTo(p.b2[0], p.b2[1]);
        this.ctx.lineTo(p.c2[0], p.c2[1]);
        this.ctx.lineTo(p.d2[0], p.d2[1]);
        this.ctx.lineTo(p.a2[0], p.a2[1]);
        this.ctx.fillStyle = fill || "white";
        this.ctx.strokeStyle = stroke || "black";
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    } // drawCeilingLow()

    drawCeilingMid(x, y, fill, stroke) {
        var p = this.getPoints(x, y);
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(p.a3[0], p.a3[1]);
        this.ctx.lineTo(p.b3[0], p.b3[1]);
        this.ctx.lineTo(p.c3[0], p.c3[1]);
        this.ctx.lineTo(p.d3[0], p.d3[1]);
        this.ctx.lineTo(p.a3[0], p.a3[1]);
        this.ctx.fillStyle = fill || "white";
        this.ctx.strokeStyle = stroke || "black";
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    } // drawCeilingMid()

    drawCeilingHigh(x, y, fill, stroke) {
        var p = this.getPoints(x, y);
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(p.a4[0], p.a4[1]);
        this.ctx.lineTo(p.b4[0], p.b4[1]);
        this.ctx.lineTo(p.c4[0], p.c4[1]);
        this.ctx.lineTo(p.d4[0], p.d4[1]);
        this.ctx.lineTo(p.a4[0], p.a4[1]);
        this.ctx.fillStyle = fill || "white";
        this.ctx.strokeStyle = stroke || "black";
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    } // drawCeilingHigh()

} // class TileSetGenerator
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

Perry;


/**
* Today, WebDisplay.
* Tomorrow, Display, extended by CanvasDisplay and WebGlDisplay.
* The biggest issue right now is tight coupling between client and server.
* This class should have no direct knowledge of Perry.Server.Scene or
* Perry.Server.Agent.
*/
Perry.Client.WebDisplay = class {
    constructor() {
        var canvas;
        canvas = document.getElementById("perry-display");
        if (canvas === null) {
            canvas = document.createElement("perry-display");
            document.body.appendChild(canvas);
        } // if
        canvas.width  = document.documentElement.clientWidth * 0.95;
        canvas.height = document.documentElement.clientHeight * 0.95;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        // All events will be "touch" driven.
        canvas.addEventListener("touchstart", this.doTouch.bind(this), false);
        canvas.addEventListener("mousedown", this.doTouch.bind(this), false);
        // timing
        this.startTime = Date.now();
        this.lastUpdate = Date.now();
        this.tickCount = 0;
        // sizing
        this.width = canvas.width;
        this.height = canvas.height;
        this.tileWidth = 64;
        this.tileHeight = 32;
        // camera and mouse
        this.offsetX = this.width * Perry.random();
        this.offsetY = this.height * Perry.random();
        this.mouseX = 0;
        this.mouseY = 0;
        this.tileI = 0;
        this.tileJ = 0;
        // bindings
        this.scene = null;
        this.imageCache = null;
        // debug
        this.dX = 0.5 + Perry.random() * 2;
        this.dY = 0.5 + Perry.random() * 2;
        Perry.display = this;
    } // constructor

    ij2xy(i, j) {
        return {
            x: (this.scene.tileWidth / 2) * (i - j),
            y: (this.scene.tileHeight / 2) * (i + j)
        };
    } // ij2xy()

    xy2ij(x, y) {
        var xw = (x / (this.scene.tileWidth / 2));
        var yh = (y / (this.scene.tileHeight / 2));
        var i = 1 + xw + ((yh - xw) / 2);
        var j = 1 + (yh - xw) / 2;
        return {
            i: i,
            j: j
        };
    } // xy2ij()

    /**
    * DEPRECATED
    * We do not want a mouse move handler.
    * Events should all be "touch" driven."
    */
    mouseMove(evt) {
        var rect = this.canvas.getBoundingClientRect();
        this.mouseX = evt.clientX - rect.left;
        this.mouseY = evt.clientY - rect.top;
        var xw = ((this.mouseX - this.offsetX) / (this.scene.tileWidth / 2));
        var yh = ((this.mouseY - this.offsetY) / (this.scene.tileHeight / 2));
        this.tileI = 1 + xw + ((yh - xw) / 2);
        this.tileJ = 1 + (yh - xw) / 2;
    } // mouseMove()

    /**
    * Respond to a touch event on the display.
    */
    doTouch(evt) {
        var rect = this.canvas.getBoundingClientRect();
        this.mouseX = evt.clientX - rect.left;
        this.mouseY = evt.clientY - rect.top;
        var xw = ((this.mouseX - this.offsetX) / (this.scene.tileWidth / 2));
        var yh = ((this.mouseY - this.offsetY) / (this.scene.tileHeight / 2));
        this.tileI = Math.floor(1 + xw + ((yh - xw) / 2));
        this.tileI = Perry.clamp(this.tileI, 0, this.scene.width - 1);
        this.tileJ = Math.floor(1 + (yh - xw) / 2);
        this.tileJ = Perry.clamp(this.tileJ, 0, this.scene.height - 1);
        // TODO: SUPERHACK! FIXME
        // reaching into mysterious global variable for prototype and test
        agents[0].setTarget({i: this.tileI, j: this.tileJ}, 10);
    } // doTouch()

    drawScene(scene) {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.zLo = Math.floor(Math.max(0,
                (this.camera.position.i + this.camera.position.j) -
                (this.height / this.scene.tileHeight) - 2
        ));
        this.zHi = Math.floor(Math.min(this.scene.width + this.scene.height,
                (this.camera.position.i + this.camera.position.j) +
                (this.height / this.scene.tileHeight) + 4
        ));
        this.tdrawCnt = 0;
        this.tileCnt = 0;
        for (var z = this.zLo; z < this.zHi; z++) {
            this.dz = z - (this.camera.position.i + this.camera.position.j);
            this.qLo = - Math.floor(this.width / this.scene.tileWidth) - 3;
            this.qHi = Math.ceil(this.width / this.scene.tileWidth) + 3;
            for (var q=this.qLo; q < this.qHi; q++) {
                this.tileCnt++;
                var i = Math.ceil(this.camera.position.i + this.dz + q);
                var j = Math.floor(z - i);
                if ((i < 0) ||
                    (i >= this.scene.width) ||
                    (j < 0) ||
                    (j >= this.scene.height)) {
                    continue;
                } // if out of bounds
        // for (var i = this.iLo; i < this.iHi; i++) {
        //     for (var j = this.jLo; j < this.jHi; j++) {
                var x;
                var y;
                x = (this.scene.tileWidth / 2) * (i - j);
                y = (this.scene.tileHeight / 2) * (i + j);
                x += this.offsetX;
                y += this.offsetY;

                // draw tile
                var img = this.imageCache.cache["img/iso-64x64-outside.png"];
                var tile = scene.tiles[(i * scene.width) + j];
                if (tile) {
                    this.tdrawCnt++;
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, y);
                    this.ctx.lineTo(x-(this.scene.tileWidth/2),
                        y-(this.scene.tileHeight/2));
                    this.ctx.lineTo(x, y-this.scene.tileHeight);
                    this.ctx.lineTo(x+(this.scene.tileWidth/2),
                        y-(this.scene.tileHeight/2));
                    this.ctx.lineTo(x, y);
                    if (i+j === 0) {
                        this.ctx.fillStyle = "#c00";
                        this.ctx.fill();
                    } // if
                    else {
                        var color = "rgb(" +
                            ((i + j + i * j) % 255) + "," +
                            ((i + j + 3 * i * j) % 255) + "," +
                            (255 - (i + j + 5 * i * j) % 255) + ")"
                        switch (tile) {
                            case 1:
                                this.ctx.fillStyle = "#060";
                                this.ctx.fill();
                                break;
                            case 2:
                                this.ctx.fillStyle = "#090";
                                this.ctx.fill();
                                this.ctx.drawImage(
                                    img,
                                    0*64, 12*64,
                                    64, 64,
                                    x-(this.scene.tileWidth/2), y-64,
                                    64, 64
                                );
                                break;
                            case 3:
                                this.ctx.fillStyle = "#0c0";
                                this.ctx.fill();
                                this.ctx.drawImage(
                                    img,
                                    0*64, 11*64,
                                    64, 64,
                                    x-(this.scene.tileWidth/2), y-64,
                                    64, 64
                                );
                                break;
                            default:
                                this.ctx.fillStyle = "#0f0";
                                this.ctx.fill();
                                break;
                        } // switch tile
                    } // else
                } // if tile
                else {
                    this.ctx.drawImage(
                        img,
                        4*64, 8*64,
                        64, 64,
                        x-(this.scene.tileWidth/2), y-64,
                        64, 64
                    );
                } // if tile

            } // for q
            // Draw the agents in the scene
            if (this.agentZBuffer[z]) {
                for (var a=0; a<this.agentZBuffer[z].length; a++) {
                    var pos = this.ij2xy(
                        this.agentZBuffer[z][a].position.i,
                        this.agentZBuffer[z][a].position.j);
                    this.ctx.drawImage(
                        this.agentZBuffer[z][a].img,
                        pos.x - (this.agentZBuffer[z][a].img.width/2) + this.offsetX,
                        pos.y - (this.agentZBuffer[z][a].img.height) + this.offsetY);
                } // for a
            } // if
        } // for z
        this.ctx.restore();
    } // drawScene()

    tick() {
        // debug move camera around
        this.offsetX += this.dX;
        this.offsetY += this.dY;
        if ((this.offsetX > this.width) ||
            (this.offsetX < 0)) {
            this.dX = - this.dX;
        } // if
        if ((this.offsetY > this.height) ||
            (this.offsetY < 0)) {
            this.dY = - this.dY;
        } // if
        var pos = this.ij2xy(this.camera.position.i, this.camera.position.j);
        this.offsetX = (this.width / 2 - pos.x);
        this.offsetY = (this.height / 2 - pos.y);

        // Draw the scene
        if (this.scene) {
            // First, we need to bin the agents according to z-depth.
            // z = i + j, and represents closeness to the camera.
            // Since 0,0 is the furthest tile, bigger z is closer.
            // TODO: The agentZBuffer array should be maintained somewhere else and updated as needed.
            this.agentZBuffer = [];
            for (var a=0; a<this.scene.agents.length; a++) {
                var z = this.scene.agents[a].position.z;
                if (this.agentZBuffer[z]) {
                    this.agentZBuffer[z].push(this.scene.agents[a]);
                } // if
                else {
                    this.agentZBuffer[z] = [ this.scene.agents[a] ];
                } // else
            } // if
            this.drawScene(this.scene, this.agentZBuffer);
        } // if

        if (this.debug) {
            var msg;
            this.ctx.save();
            this.ctx.font = '10pt Calibri';
            this.ctx.fillStyle = 'white';
            // draw fps
            msg = "fps: " + this.fps();
            this.ctx.fillText(msg, 10, 14);
            // draw mouse position
            msg = "x: " + this.mouseX + " y: " + this.mouseY;
            this.ctx.fillText(msg, 10, 28);
            msg = "i: " + Math.floor(this.tileI) + " j: " + Math.floor(this.tileJ);
            this.ctx.fillText(msg, 10, 42);
            // draw bounds
            msg = "zLo: " + this.zLo + " zHi: " + this.zHi;
            this.ctx.fillText(msg, 200, 14);
            // draw tile stats
            msg = "tiles: " + this.tileCnt + " tdraws: " + this.tdrawCnt;
            this.ctx.fillText(msg, 200, 28);
            this.ctx.restore();
        } // if
        this.tickCount++;
    } // tick()

    fps() {
        var t = (Date.now() - this.startTime) / this.tickCount;
        return Math.floor(1000 / t);
    } // fps()

    freezeTest() {
        this.dX = 0;
        this.dY = 0;
        this.offsetX = this.width / 2;
        this.offsetY = this.height / 2;
    } // freezeTest()

} // class WebDisplay
