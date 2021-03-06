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
