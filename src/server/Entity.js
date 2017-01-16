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
    constructor(type, seed, uuid) {
        this.lastUpdate = Date.now();

        this.type = type || "Void";
        if (seed) {
            this.seed = seed;
            Perry.Math.Seed(seed);
        } else {
            this.seed = Perry.Math.seed();
        } // if-else
        if (uuid) {
            this.uuid = uuid;
        } else {
            this.uuid = this.generateUuid();
        } // if-else

        this.sim = Perry.Sim;
        this.zone = null;
        this.scene = null;

        // Consider entities containing entities
        this.attr = {};
        // Entities are connected to each other.
        // A connection is a pair: [UUID, SEED]
        this.connections = [];
        // Entities can contain entities.
        // A contained entity is a pair: [UUID, SEED]
        this.contents = [];

        // Procedural generation
        // At this point, use Perry.Server.Generator to generate content.
    } // constructor()

    ///////////////////////////////////////////////////////
    // Serialization Methods

    toJson() {
        return JSON.stringify(this);
    } // toJson()

    load(json) {
        Object.assign(this, JSON.parse(json));
        return this;
    } // load()

    ///////////////////////////////////////////////////////
    // Generation Methods

    // Generate a UUID
    // TODO: rewrite this UUID snippet; it is too arcane
    // uuid snippet from:
    // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#2117523
    generateUuid() {
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
            function(c) {
                var r = Perry.Math.random() * 16 | 0,
                    v =
                        (c == 'x') ?
                            r :
                            (r & 0x3 | 0x8);
                return v.toString(16);
            });
        return uuid;
    } // uuid()

    // Reset the PRNG.
    reset() {
        Perry.Math.xorShift128Seed(this.seed);
    } // reset()

    addConnection(type) {
        var uuid = this.generateUuid();
        var seed = Perry.Math.seed();
        var tuple = [ type || this.type, seed, uuid ];
        this.connections.push(tuple);
        return tuple;
    } // addConnection()

    addContent(type) {
        var uuid = this.generateUuid();
        var seed = Perry.Math.seed();
        var tuple = [ type || "Void", seed, uuid ];
        this.contents.push(tuple);
        return tuple;
    } // addContent()

    /////////////////////////////////////////////////////////////////
    // Debugging
    print() {
        console.log("ENTITY: " + this.type + " [" + this.seed + "] " + this.uuid);
        console.log("  LAST UPDATE: " + this.lastUpdate);
        console.log("  CONNECTIONS");
        for (var i=0; i<this.connections.length; i++) {
            console.log("    " +
                this.connections[i][0] +
                " [" + this.connections[i][1] + "] " +
                this.connections[i][2]
            );
        } // for i
        console.log("  CONTENTS");
        for (var i=0; i<this.contents.length; i++) {
            console.log("    " +
                this.contents[i][0] +
                " [" + this.contents[i][1] + "] " +
                this.contents[i][2]
            );
        } // for i
    } // print()

} // class Entity
