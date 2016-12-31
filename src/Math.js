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

Perry.Math = {
    min: 64000,
    max: 64000,

    /**
    Four-state XOR Shift PRNG by George Marsaglia.
    All values assumed to be 32-bit.
    Pass a 4-element array as seed, if desired.
    Returns a pseudo-random 32-bit number.
    Adapted from https://en.wikipedia.org/wiki/Xorshift#Example_implementation.
    Warning: This function is not thread-safe.
    */
    xorShift128: function(seed) {
        // Javascript is supposed to treat integers as 32-bit,
        // but just in case we will modulo everything 2^32.
        var Math = Perry.Math || {};
        if (seed) {
            Math._xorShiftState = seed;
        } // if seed
        else if (typeof Math._xorShiftState === "undefined") {
            Math._xorShiftState = [1, 2, 3, 4];
        } // if state undefined
        var t = Math._xorShiftState[3];
    	t ^= (t << 11) % 0x100000000;
    	t ^= (t >>> 8)  % 0x100000000; // logical shift
    	Math._xorShiftState[3] = Math._xorShiftState[2];
        Math._xorShiftState[2] = Math._xorShiftState[1];
        Math._xorShiftState[1] = Math._xorShiftState[0];
    	t ^= Math._xorShiftState[0];
    	t ^= (Math._xorShiftState[0] >>> 19) % 0x100000000; // logical shift
    	Math._xorShiftState[0] = t;
        if (t < Math.min) { Math.min = t; }
        if (t > Math.max) { Math.max = t; }
    	return t;
    } // xorShift128()
    ,
    random: function() {
        var x;
        x = Math.abs(Perry.Math.xorShift128()) / 0x80000000;
        return x;
    } // random()
    ,
    checkRnd: function() {
        var dist = [0, 0, 0, 0];
        var n = 64000000;
        for (var i=0; i<n; i++) {
            var x = Perry.Math.random();
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
        return result;
    } // checkRnd()
} // structure Math
