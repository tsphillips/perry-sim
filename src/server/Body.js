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
* Something that has a location in the world.
*/
Perry.Server.Body = class extends Perry.Server.Entity {
    constructor(json) {
        if (typeof json === "string") {
            super(json);
        } // if
        else {
            super();
            this.position    = {i:0, j:0}; // position, nominally meters
            this.target      = {i:0, j:0}; // target position
            this.velocity    = {di:0, dj:0}; // velocity, movement per second
            this.radius      = 0.5; // width = 1, height = 1
        } // else
    } // constructor()

    /**
    * Start the body moving toward a target.
    * @param t Target {i,j}
    * @param v Velocity (in m/s)
    */
    setTarget(t, v) {
        this.target = t;
        this.velocity = {
            di: (this.target.i - this.position.i),
            dj: (this.target.j - this.position.j)
        };
        // normalize the velocity to magnitude
        var m1 = Math.sqrt(
            (this.velocity.di * this.velocity.di) +
            (this.velocity.dj * this.velocity.dj)
        );
        if ((m1 * v) === 0) {
            this.velocity = {di:0, dj:0};
        } // if
        else {
            this.velocity = {
                di: (this.velocity.di / m1 * v),
                dj: (this.velocity.dj / m1 * v)
            };
        } // else
        this.lastUpdate = Date.now();
    } // setTarget()

    /**
    * Return distance between two points in 3-space.
    */
    distance(p1, p2) {
        var di = p1.i - p2.i;
        var dj = p1.j - p2.j;
        var d = Math.sqrt((di * di) + (dj * dj));
        return d;
    } // distance()

    distaceToTarget() {
        return distance(this.target, this.position);
    } // distanceToTarget()

    /**
    * Move according to velocity.
    */
    move() {
        var t = Date.now();
        var delta = ((t - this.lastUpdate) / 1000);
        this.position.i += this.velocity.di * delta;
        this.position.j += this.velocity.dj * delta;
        this.lastUpdate = t;
        return this.position;
    } // move()

    /**
    * Move toward target and stop when it arrives.
    */
    moveTo() {
        if (this.velocity.di === 0 &&
            this.velocity.dj === 0) {
            return;
        } // if

        var t = Date.now();
        var delta = ((t - this.lastUpdate) / 1000);
        var di = this.velocity.di * delta;
        var dj = this.velocity.dj * delta;
        var dTraveled = Math.sqrt(di * di + dj * dj);
        var dToTarget = this.distance(this.target, this.position);
        if (dToTarget <= dTraveled) {
            // snip the vector and stop motion
            this.position.i = this.target.i;
            this.position.j = this.target.j;
            this.stop();
        } // if
        else {
            this.position.i += di;
            this.position.j += dj;
            this.lastUpdate = t;
        } // else
        return this.position;
    } // moveTo()

    /**
    * Stop all motion.
    */
    stop() {
        this.target = {
            i: this.position.i,
            j: this.position.j
        };
        this.velocity = {
            di: 0,
            dj: 0
        };
        this.lastUpdate = Date.now();
    } // stop()
} // class Body
