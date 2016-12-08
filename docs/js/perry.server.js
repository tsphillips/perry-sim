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
* An engine that queues functions for invocation.
*
* Be sure the function has `this` bound correctly.
* For example,
* engine.queueFunction(Date.now() + 1000, obj.func.bind(obj)
*/
Perry.Server.FunctionEngine = class {

    constructor() {
        this.debug = false;
        this.queue = []; // List of [time,function] pairs.
        this.resolution = 1000; // smallest time (in ms) between ticks
        this.intervalId = null; // used to start and stop interval
        this.startTime = 0;     // time engine was last started
        this.stopTime = 0;      // time engine was last stopped
        this.tickTime = 0;      // time of last tick
        this.tickCount = 0;     // how many ticks have been processed
        this.functionCount = 0; // how many functions have been invoked
    } // constructor()

    /**
    * Start the function engine.
    *
    * @throws Exception if attempt to start a running engine.
    */
    start() {
        if (this.intervalId === null) {
            this.intervalId = setInterval(this.tick.bind(this), this.resolution);
        } // if engine is not yet started
        else {
            throw "Attempt to start the engine, but it is already running.";
        } // else engine is already started
        this.startTime = Date.now();
        return true;
    }

    /**
    * Stop the function engine.
    *
    * @throws Exception if attempt to stop a stopped engine.
    */
    stop() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
        } // if engine is not yet started
        else {
            throw "Attempt to stop the engine, but it is not running.";
        } // else engine is already started
        this.stopTime = Date.now();
        return true;
    }

    /**
    * Set the minimum time between ticks.
    *
    * @param t Time (in ms) between ticks.
    */
    setResolution(t) {
        this.resolution = t;
        if (this.intervalId !== null) {
            this.stop();
            this.start();
        } // if engine is running
        return t;
    }

    /**
    * Queue a function for invocation at a given time.
    *
    * @param t What time to invoke the function.
    * @param f The function to invoke.
    */
    queueEvent(t, f) {
        // use q.splice(ndx, 0, f)
        this.queue.push(f);
        return false;
    }

    /**
    * Remove a function from the queue.
    */
    dequeueEvent(id) {
        return false;
    }

    /**
    * Execute one tick of the engine.
    */
    tick() {
        if (this.debug) {
            console.log("Tick:" + new Date());
        } // if debug
        this.tickCount++;
        this.tickTime = Date.now();
        return true;
    } // tick()

} // FunctionEngine()
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
* Something that exists.
*/
Perry.Server.Entity = class {
    constructor(json) {
        if (typeof json === "string") {
            Object.assign(this, JSON.parse(json));
        } // if
        else {
            this.lastUpdate = Date.now();
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

Perry.Server.Scene = class {
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
