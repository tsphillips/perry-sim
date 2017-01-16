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
            this.Math = {};
            this.Client = {};
            this.Server = {};
        } // constructor()

        // Random things
        random() {
            return Math.random();
        } // random()
        clamp(val, min, max) {
            return Math.max(min, Math.min(max, val));
        } // clamp()

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

        // LZW-compress a string
        // LGPL: http://stackoverflow.com/questions/294297/javascript-implementation-of-gzip?sort=newest
        lzw_encode(s) {
            var dict = {};
            var data = (s + "").split("");
            var out = [];
            var currChar;
            var phrase = data[0];
            var code = 256;
            for (var i=1; i<data.length; i++) {
                currChar=data[i];
                if (dict[phrase + currChar] != null) {
                    phrase += currChar;
                }
                else {
                    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                    dict[phrase + currChar] = code;
                    code++;
                    phrase=currChar;
                }
            }
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            for (var i=0; i<out.length; i++) {
                out[i] = String.fromCharCode(out[i]);
            }
            return out.join("");
        }

        // Decompress an LZW-encoded string
        // LGPL: http://stackoverflow.com/questions/294297/javascript-implementation-of-gzip?sort=newest
        lzw_decode(s) {
            var dict = {};
            var data = (s + "").split("");
            var currChar = data[0];
            var oldPhrase = currChar;
            var out = [currChar];
            var code = 256;
            var phrase;
            for (var i=1; i<data.length; i++) {
                var currCode = data[i].charCodeAt(0);
                if (currCode < 256) {
                    phrase = data[i];
                }
                else {
                   phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
                }
                out.push(phrase);
                currChar = phrase.charAt(0);
                dict[code] = oldPhrase + currChar;
                code++;
                oldPhrase = phrase;
            }
            return out.join("");
        }

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

Perry.Math = new class {
    constructor() {
        this._xorShiftState = [1, 2, 3, 4];
        this._xorShift128Min = 64000;
        this._xorShift128Max = 64000;
    } // constructor

    /**
    Four-state XOR Shift PRNG by George Marsaglia.
    All values assumed to be 32-bit.
    Pass a 4-element array as seed, if desired.
    Returns a pseudo-random 32-bit number.
    Adapted from:
    https://en.wikipedia.org/wiki/Xorshift#Example_implementation
    Warning: This function is not thread-safe.
    */
    xorShift128Seed(seed) {
        if (typeof seed === "undefined") {
            return Perry.Math._xorShiftState.slice();
        } // if
        if (seed.length !== 4) {
            throw ("Perry.Math.xorShift128Seed(): Illegal seed " + seed);
        } // if
        Perry.Math._xorShiftState = seed.slice();
    } // xorShift128Seed()

    xorShift128(seed) {
        // Javascript is supposed to treat integers as 32-bit,
        // but just in case we will modulo everything 2^32.
        if (seed) {
            this.xorShift128Seed(seed);
        } // if seed
        else if (typeof this._xorShiftState === "undefined") {
            this.xorShift128Seed([1, 2, 3, 4]);
        } // if state undefined
        var t = this._xorShiftState[3];
    	t ^= (t << 11) % 0x100000000;
    	t ^= (t >>> 8)  % 0x100000000; // logical shift
    	this._xorShiftState[3] = this._xorShiftState[2];
        this._xorShiftState[2] = this._xorShiftState[1];
        this._xorShiftState[1] = this._xorShiftState[0];
    	t ^= this._xorShiftState[0];
    	t ^= (this._xorShiftState[0] >>> 19) % 0x100000000; // logical shift
    	this._xorShiftState[0] = t;
        if (t < this._xorShift128Min) { this._xorShift128Min = t; }
        if (t > this._xorShift128Max) { this._xorShift128Max = t; }
    	return t;
    } // xorShift128()

    /**
    Common PRND functions.
    */
    seed(seed) {
        return Perry.Math.xorShift128Seed(seed);
    } // seed()

    random() {
        var x;
        x = Math.abs(this.xorShift128()) / 0x80000000;
        return x;
    } // random()

    /**
    Functions for testing PRNG.
    */
    checkRnd() {
        console.log("Checking PRNG. Please be patient...");
        var dist = [0, 0, 0, 0];
        var n = 64000000;
        for (var i=0; i<n; i++) {
            var x = this.random();
            if (x <= 0.25) {
                dist[0]++;
            } else if (x <= 0.50) {
                dist[1]++;
            } else if (x <= 0.75) {
                dist[2]++;
            } else {
                dist[3]++;
            } // else
        } // for i
        var result = [];
        result[0] = dist[0] / n;
        result[1] = dist[1] / n;
        result[2] = dist[2] / n;
        result[3] = dist[3] / n;
        console.log(result);
    } // checkRnd()
} // class instance Math
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
        this.position.z =
            Math.ceil(this.position.i) + Math.ceil(this.position.j);
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
        // var dTraveled = Math.sqrt(di * di + dj * dj);
        // var dToTarget = this.distance(this.target, this.position);
        var d1 = (di * di) + (dj * dj);
        var dtpi = (this.target.i - this.position.i);
        var dtpj = (this.target.j - this.position.j);
        var d2 = (dtpi * dtpi) + (dtpj * dtpj);
        if (d2 <= d1) {
            // snip the vector and stop motion
            this.position.i = this.target.i;
            this.position.j = this.target.j;
            this.stop();
        } // if
        else {
            this.position.i += di;
            this.position.j += dj;
            this.lastUpdate = Date.now();
        } // else
        this.position.z =
            Math.ceil(this.position.i) + Math.ceil(this.position.j);
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
                this.tiles[(i*this.width)+j] = Math.floor(Perry.random() * 5);
            } // for j
        } // for i
        this.tiles[0] = 1;
    } // fill()

} // class Scene
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
Content generator.
*/
Perry.Server.Generator = new class {
} // class instance Generator
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
Create a procedurally generated scene map (tile map).
*/
Perry.Server.SceneMapGenerator = class {
    constructor() {
    } // constructor()
} // class SceneMapGenerator
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
Generate a StoryArc.

At any point in the sim, the player is faced with the choice of what to do.
A StoryArc guides the player through a story, told as a series of choices.
This structure is meant to be a departure from the traditional video game quest mechanic.

Lots of random notes follow. Thus far I am pulling from various sources to
dance around the issue of procedurally generated plot. I think I can distill
some primitives from the notes so resultant plots (and their characters) do
not seem so formulaic or off-the-shelf.

A StoryArc has:
- characters
- locations
- props
- plot

Campbell (1949)
I. Departure
    1. The Call to Adventure
    2. Refusal of the Call
    3. Supernatural Aid
    4. Crossing the Threshold
    5. Belly of the Whale
II. Initiation
    6. The Road of Trials
    7. The Meeting with the Goddess
    8. Woman as Temptress
    9. Atonement with the Father
    10. Apotheosis
    11. The Ultimate Boon
III. Return
    12. Refusal of the Return
    13. The Magic Flight
    14. Rescue from Without
    15. The Crossing of the Return Threshold
    16. Master of Two Worlds
    17. Freedom to Live

David Adams Leeming (1981)
I. Departure
    1. Miraculous conception and birth
    2. Initiation of the hero-child
    3. Withdrawal from family or community for meditation and preparation
II. Initiation
    4. Trial and Quest
    5. Death
    6. Descent into the underworld
III. Return
    7. Resurrection and rebirth
    8. Ascension, apotheosis, and atonement

Phil Cousineau (1990)
I. Departure
    1. The Call to Adventure
II. Initiation
    2. The Road of Trials
    3. The Vision Quest
    4. The Meeting with the Goddess
    5. The Boon
III. Return
    6. The Magic Flight
    7.The Return Threshold
    8.The Master of Two Worlds

Christopher Vogler (2007)
I. Departure
    1. The Ordinary World
    2. The Call to Adventure
    3. Refusal of the Call
    4. Meeting with the Mentor
    5. Crossing the Threshold to the Special World
II. Initiation
    6. Tests, Allies and Enemies
    7. Approach to the Innermost Cave
    8. The Ordeal
    9. Reward
III. Return
    10. The Road Back
    11. The Resurrection
    12. Return with the Elixir

Christopher Booker (2004)
Meta-plot:
1. Anticiation Stage
2. Dream Stage
3. Frustration Stage
4. Nightmare Stage
5. Resolution

Story Plots
- Overcoming the Monster
- Rags to Riches
- The Quest
- Voyage and Return
- Comedy
- Tragedy
- Rebirth

Georges Polti
36 Dramatic Situations
1. Supplication
2. Deliverance
3. Crime pursued by vengence
4. Vengeance taken for kin upon kin
5. Pursuit
6. Disaster
7. Falling prey to cruelty/misfortune
8. Revolt
9. Daring Enterprise
10. Abduction
11. The enigma
12. Obtaining
13. Enmity of kin
14. Rivalry of kin
15. Murderous adultery
16. Madness
17. Fatal imprudence
18. Involuntary crimes of love
19. Slaying of kin unrecognized
20. Self-sacrifice for an ideal
21. Self-sacrifice for kin
22. All sacrificied for passion
23. Necessity of sacrificing loved ones
24. Rivalry of superior vs. inferior
25. Adultery
26. Crimes of love
27. Discovery of the dishonour of a loved one
28. Obstacles to love
29. An enemy loved
30. Ambition
31. Conflict with a god
32. Mistaken jealousy
33. Erroneous judgement
34. Remorse
35. Recovery of a lost one
36. Loss of loved ones


Characters
- round or flat
- regular, recurring, guest
- Role
    -- stock
    -- protagonist
    -- antagonist
    -- antihero
    -- foil

Stock Characters (Theophrastus)
- The Insincere Man
- The Flatterer
- The Garrulous Man
- The Boor
- The Complacent Man
- The Man without Moral Feeling
- The Talkative Man
- The Fabricator
- The Shamelessly Greedy Man
- The Pennypincher
- The Offensive Man
- The Hapless Man
- The Officious Man
- The Absent-Minded Man
- The Unsociable Man
- The Superstitious Man
- The Faultfinder
- The Suspicious Man
- The Repulsive Man
- The Unpleasant Man
- The Man of Petty Ambition
- The Stingy Man
- The Show-Off
- The Arrogant Man
- The Coward
- The Oligarchical Man
- The Late Learner
- The Slanderer
- The Lover of Bad Company
- The Basely Covetous Man

Stock Characters (assorted)
https://en.wikipedia.org/wiki/List_of_stock_characters
- Absent-minded professor
- Angry black woman
- Bad boy
- Battle-axe
- Black knight
- Boy next door
- Bug-eyed monster
- Cat lady
- Contender
- Crone
- Damsel in distress
- Dark lady
- Dark lord
- Eldery martial arts master
- Everyman
- Fall guy
- Farmer's daughter
- Femme fatal
- Final girl
- Gentleman thief
- Girl next door
- Grande dame
- Hag
- Harlequin
- Hooker with a heart of hold
- Hotshot
- Ingenue
- Jock (athlete)
- Knight-errant
- Little green men
- Loathely lady
- Lovers
- Mad scientist
- Magical negro
- Mammy archetype
- Manic Pixie Dream Girl
- Mary Sue
- Miles Gloriosus
- Mother's boy
- Nerd
- Noble savage
- Outlaw (stock character)
- Pantomime dame
- Petrushka
- Princesse lointaine
- Professor
- Redshirt
- Rightful kind
- Senex iratus
- Shrew
- Sinnekins
- Soubrette
- Southern belle
- Space Nazis
- Spear carrier
- Superhero
- Übermensch
- Supersoldier
- Supervillain
- Swashbuckler
- Tomboy
- Tortured artist
- Town drunk
- Tragic hero
- Tragic mulatto
- Vice
- Village idiot
- Villain
- Whisky priest
- White hunter
- Wise fool
- Wise old man
- Yokel
- Youxia

*/
Perry.Client.StoryArcGenerator = class {

    constructor() {
    } // constructor()

} // class StoryArcGenerator
