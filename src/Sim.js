/*
Copyright (c)2017 Thomas S. Phillips.

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
Perry Sim
This class is the main simulation.
An instance can spawn entities.
A simulation consists of:
    * a seed of four, 32-bit signed integers
    * a lattice of Zone entities
    * a topology
    * attributes

The topology describes the interconnectedness of the Zone entities.
The topology has:
    * left hand jump distance
    * right hand jump distance
    * left hand degree
    * right hand degree
*/
Perry.Sim = Perry.Sim || class {
    constructor() {
        this.seed = [1, 2, 3, 4];
        this.topology = {
            leftDegree:     1,
            rightDegree:    1,
            leftJump:       -1,
            rightJump:      1
        };
        this.generator = null;
        Perry.Math.seed(this.seed);
    } // constructor

    spawn(type, seed, uuid) {
        if (seed) {
            if (typeof seed === "string") {
                seed = Perry.Math.glyph2Int(seed);
            } // if
        } // if seed
        var e = new Perry.Server.Entity(type, seed, uuid);
        e.sim = this;
        if (type === "Zone") {
            for (var i = 0; i < this.topology.leftDegree; i++) {
                e.connections.push([
                    "Zone",
                    Perry.Math.nextSeed(seed, this.topology.leftJump),
                    null
                ]);
            } // for i
            for (var i = 0; i < this.topology.rightDegree; i++) {
                e.connections.push([
                    "Zone",
                    Perry.Math.nextSeed(seed, this.topology.rightJump),
                    null
                ]);
            } // for i
        } // if Zone
        if (this.generator) {
            this.generator.formEntity(e);
        } // if
        return e;
    } // spawn()
} // class Sim
