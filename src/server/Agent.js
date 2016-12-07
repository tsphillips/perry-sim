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

/**
* Something that can interact with a scene.
*/
Perry.Agent = class extends Perry.Body {
    constructor(json) {
        if (typeof json === "string") {
            super(json);
        }
        else {
            super();
            this.i = 0;
            this.j = 0;
            this.img = null;
        } // else
    } // constructor()

    render(display) {
        if (typeof this.img === "object") {
            display.ctx.drawImage(this.img,
                this.position.i * 100,
                this.position.j * 100);
        } // if
    } // render()

    update(display) {
        // this.render(display);
        if (this.target) {
            this.moveTo();
        } // if
    } // update()
} // class Agent
