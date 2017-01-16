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
