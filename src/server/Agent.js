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
* Something that can interact with a scene.
*/
Perry.Server.Agent = class extends Perry.Server.Body {
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

    update(display) {
        // this.render(display);
        if (this.target) {
            this.moveTo();
        } // if
    } // update()
} // class Agent
