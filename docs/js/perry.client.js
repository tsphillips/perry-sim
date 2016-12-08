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
            this.Client = {};
            this.Server = {};
        } // constructor()

        // Random things
        random() {
            return Math.random();
        } // random()

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
        canvas.addEventListener('mousemove', this.mouseMove.bind(this), false);
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

    mouseMove(evt) {
        var rect = this.canvas.getBoundingClientRect();
        this.mouseX = evt.clientX - rect.left;
        this.mouseY = evt.clientY - rect.top;
        // x = (tileWidth / 2) * (i - j)
        // y = (tileHeight / 2) * (i + j)
        var xw = ((this.mouseX - this.offsetX) / (this.scene.tileWidth / 2));
        var yh = ((this.mouseY - this.offsetY) / (this.scene.tileHeight / 2));
        this.tileI = 1 + xw + ((yh - xw) / 2);
        this.tileJ = 1 + (yh - xw) / 2;
        // x = w * (i-j) ; x/w = i-j ; i = (x/w)+j
        // y = h * (i+j) ; y/h = i+j ; i = (y/h)-j
        // (x/w)+j = (y/h)-j ; 2*j = (y/h) - (x/w) ; j = ((y/h) - (x/w)) / 2
        // i = (x/w) + (((y/h) - (x/w)) / 2)
    } // mouseMove()

    drawScene(scene) {
        // 5 is 1/2 height
        // 10 is 1/2 width
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // this.iLo = Math.floor(Math.max(0,
        //     this.camera.position.i - (this.width / this.scene.tileWidth) - 10));
        // this.iHi = Math.floor(Math.min(this.scene.width,
        //     this.camera.position.i + (this.width / this.scene.tileWidth) + 10));
        // this.jLo = Math.floor(Math.max(0,
        //     this.camera.position.j - (this.width / this.scene.tileWidth) - 10));
        // this.jHi = Math.floor(Math.min(this.scene.width,
        //     this.camera.position.j + (this.width / this.scene.tileWidth) + 10));

        this.zLo = Math.max(0,
                (this.camera.position.i + this.camera.position.j) -
                (this.height / this.scene.tileHeight) - 2
        );
        this.zHi = Math.min(this.scene.width + this.scene.height,
                (this.camera.position.i + this.camera.position.j) +
                (this.height / this.scene.tileHeight) + 4
        );
        this.tdrawCnt = 0;
        this.tileCnt = 0;
        for (var z = this.zLo; z < this.zHi; z++) {
            this.dz = z - (this.camera.position.i + this.camera.position.j);
            this.qLo = - Math.floor(this.width / this.scene.tileWidth) - 3;
            this.qHi = Math.floor(this.width / this.scene.tileWidth) + 3;
            for (var q=this.qLo; q < this.qHi; q++) {
                this.tileCnt++;
                var i = Math.floor(this.camera.position.i + this.dz + q);
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
                        4*64, 3*64,
                        64, 64,
                        x-(this.scene.tileWidth/2), y-64,
                        64, 64
                    );
                } // if tile

            } // for j
        } // for i
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
        // this.offsetX = this.width / 2 - pos.x;
        // this.offsetY = this.height / 2 - pos.y;
        // console.log(this.offsetY - (this.height / 2 - pos.y));
        this.offsetX = (this.width / 2 - pos.x);
        this.offsetY = (this.height / 2 - pos.y);

        // Draw the scene
        if (this.scene) {
            this.drawScene(this.scene);
            if (this.scene.agents) {
                for (var x=0; x<this.scene.agents.length; x++) {
                    if (typeof agents[x].img === "object") {
                        var pos = this.ij2xy(
                            agents[x].position.i,
                            agents[x].position.j);
                        this.ctx.drawImage(
                            agents[x].img,
                            pos.x - (agents[x].img.width/2) + this.offsetX,
                            pos.y - (agents[x].img.height) + this.offsetY);
                    } // if
                } // for i
            } // if
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
            // msg = "iLo: " + this.iLo + " iHi: " + this.iHi;
            // this.ctx.fillText(msg, 200, 14);
            // msg = "jLo: " + this.jLo + " jHi: " + this.jHi;
            // this.ctx.fillText(msg, 200, 28);
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