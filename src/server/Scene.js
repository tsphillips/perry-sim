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

var Perry = Perry || {};

Perry.Scene = class {
    constructor() {
        this.name = "Empty Scene";
        this.width = 32; // default
        this.height = 32; // default
        this.tileWidth = 64;
        this.tileHeight = 32;
        this.tiles = [];
        this.layer1 = [];
        this.layer2 = [];
        this.type = "default";
        this.environment = "default";
        this.entities = [];
        this.agents = [];
    } // constructor()

    fill() {
        for (var i = 0; i < this.height;  i++) {
            for (var j = 0; j < this.width ; j++) {
                this.tiles[(i*this.width)+j] = Math.floor(Math.random() * 5);
            } // for j
        } // for i
        this.tiles[0] = 1;
    } // fill()

} // class Scene
