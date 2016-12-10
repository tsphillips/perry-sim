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
