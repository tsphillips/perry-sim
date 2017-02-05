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

Perry.Math = Perry.Math || new class {
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

    /**
    An adiabetic function to rotate the seed by a given delta.
    Useful for generating predetermined topology of Zone entities.
    */
    nextSeed(seed, delta) {
        var s1 = seed.slice();
        s1[0] += delta;
        if (Math.abs(s1[0]) !== Math.abs(seed[0])) {
            s1[1] += delta;
            if (Math.abs(s1[1]) !== Math.abs(seed[1])) {
                s1[2] += delta;
                if (Math.abs(s1[2]) !== Math.abs(seed[2])) {
                    s1[3] += delta;
                    if (Math.abs(s1[3]) !== Math.abs(seed[3])) {
                        s1[0] += delta;
                    } // if
                } // if
            } // if
        } // if
        return s1;
    } // nextSeed()

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

    /**
    Each 8 bits is the form of: 111 22 333
    111 is a 3-bit coding for a consonant.
    22 is a 2-bit coding for a vowel.
    333 is a 3-bit coding for a consonant.
    */
    byte2Glyph(x) {
        var result = "";
        var k = 'BDGHKMSZ';
        var v = 'AEIY';
        result += k[0x7 & (x >>> 5)];
        result += v[0x3 & (x >>> 3)];
        result += k[0x7 & (x >>> 0)];
        return result;
    } // byte2Glyph()

    /**
    Turn a glyph into a byte.
    */
    glyph2Byte(g) {
        var result = 0;
        var k = 'BDGHKMSZ';
        var v = 'AEIY';
        result |= (k.indexOf(g[0].toUpperCase()) << 5);
        result |= (v.indexOf(g[1].toUpperCase()) << 3);
        result |= (k.indexOf(g[2].toUpperCase()) << 0);
        return result;
    } // glyph2Byte()

    /**
    Convert a 32-bit integer array to a glyph.
    For example,
    int2Glyph([1, 0, -1, 1000]);
    TODO: This would be happier with joins.
    */
    int2Glyph(x) {
        var result = "";
        for (var i = 0; i < x.length; i++) {
            var b1 = 0xff & (x[i] >>> 24);
            var b2 = 0xff & (x[i] >>> 16);
            var b3 = 0xff & (x[i] >>>  8);
            var b4 = 0xff & (x[i] >>>  0);
            result += this.byte2Glyph(b1);
            result += "-";
            result += this.byte2Glyph(b2);
            result += "-";
            result += this.byte2Glyph(b3);
            result += "-";
            result += this.byte2Glyph(b4);
            if (i < (x.length-1)) {
                result += ":";
            } // if
        } // for i
        return result;
    } // num2Glyph()

    /**
    Turn a glyph string into an array of integers.
    */
    glyph2Int(g) {
        var result = [];
        var x = 0;
        var t = g.split(/\b\s+|-|:/);
        var i = 0;
        while (i < t.length) {
            var j = this.glyph2Byte(t[i]);
            var s = (24 - (8 * (i % 4)));
            x |= j << (24 - (8 * (i % 4)));
            i++;
            if ((i % 4) === 0) {
                result.push(x);
                x = 0;
            } // if
        } // while
        return result;
    } // glyph2Int()

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
    } // lzw_encode()

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
    } // lzw_decode()

} // class instance Math
