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
Something that exists.
Anything that should persist should extend Entity.
This class needs:
- UUID
- auto-serializable / deserializable
- auto-compressible
- auto-sync between client and server (is this truth or a shadow?)
- know where it is in the world (zone/scene)
*/
Perry.Server.Entity = class {
    constructor(json) {
        if (typeof json === "string") {
            Object.assign(this, JSON.parse(json));
        } // if
        else {
            this.lastUpdate = Date.now();
            // uuid snippet from:
            // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#2117523
            this.uuid =
            'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
                function(c) {
                    var r = Perry.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
            this.attr = {};
        } // else
    } // constructor()

    toJson() {
        return JSON.stringify(this);
    } // toJson()

    load(json) {
        Object.assign(this, JSON.parse(json));
        return this;
    } // load()
} // class Entity
