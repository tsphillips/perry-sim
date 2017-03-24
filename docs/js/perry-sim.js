(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("perry-sim", [], factory);
	else if(typeof exports === 'object')
		exports["perry-sim"] = factory();
	else
		root["perry-sim"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Entity = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
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

var _PSMath = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var Entity = exports.Entity = function () {
    function Entity(type, seed, uuid) {
        _classCallCheck(this, Entity);

        this.lastUpdate = Date.now();

        this.type = type || "Void";
        if (seed) {
            if (typeof seed === "string") {
                this.seed = _PSMath.PSMath.glyph2Int(seed);
            } else {
                this.seed = seed;
            } // if-else
            _PSMath.PSMath.seed(seed);
        } else {
            this.seed = _PSMath.PSMath.seed();
        } // if-else
        if (uuid) {
            this.uuid = uuid;
        } else {
            this.uuid = this.generateUuid();
        } // if-else

        this.sim = null;
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

    _createClass(Entity, [{
        key: "toJson",
        value: function toJson() {
            return JSON.stringify(this, function (key, value) {
                if (key === 'perry') {
                    return undefined;
                } else {
                    return value;
                } // if-else
            });
        } // toJson()

    }, {
        key: "fromJson",
        value: function fromJson(json) {
            Object.assign(this, JSON.parse(json));
            return this;
        } // fromJson()

    }, {
        key: "toString",
        value: function toString() {
            return _PSMath.PSMath.lzw_encode(this.toJson());
        } // toString()

    }, {
        key: "fromString",
        value: function fromString(s, perry) {
            var obj = this.fromJson(_PSMath.PSMath.lzw_decode(s));
            obj.perry = perry;
        } // fromString()

        ///////////////////////////////////////////////////////
        // Generation Methods

        // Generate a UUID
        // TODO: rewrite this UUID snippet; it is too arcane
        // uuid snippet from:
        // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#2117523

    }, {
        key: "generateUuid",
        value: function generateUuid() {
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = _PSMath.PSMath.random() * 16 | 0,
                    v = c == 'x' ? r : r & 0x3 | 0x8;
                return v.toString(16);
            });
            return uuid;
        } // uuid()

        // Reset the PRNG.

    }, {
        key: "reset",
        value: function reset() {
            _PSMath.PSMath.xorShift128Seed(this.seed);
        } // reset()

    }, {
        key: "addConnection",
        value: function addConnection(type) {
            var uuid = this.generateUuid();
            var seed = _PSMath.PSMath.seed();
            var tuple = [type || this.type, seed, uuid];
            this.connections.push(tuple);
            return tuple;
        } // addConnection()

    }, {
        key: "addContent",
        value: function addContent(type) {
            var uuid = this.generateUuid();
            var seed = _PSMath.PSMath.seed();
            var tuple = [type || "Void", seed, uuid];
            this.contents.push(tuple);
            return tuple;
        } // addContent()

        /////////////////////////////////////////////////////////////////
        // Debugging

    }, {
        key: "print",
        value: function print() {
            console.log("ENTITY:");
            console.log("   |TYPE: " + this.type);
            console.log("   |SEED: " + _PSMath.PSMath.int2Glyph(this.seed));
            console.log("   |UUID: " + this.uuid);
            console.log("   |LAST UPDATE: " + new Date(this.lastUpdate));
            console.log("   +CONNECTIONS");
            for (var i = 0; i < this.connections.length; i++) {
                console.log("       |" + this.connections[i][0] + " " + _PSMath.PSMath.int2Glyph(this.connections[i][1]) + " " + this.connections[i][2]);
            } // for i
            console.log("   +CONTENTS");
            for (var i = 0; i < this.contents.length; i++) {
                console.log("       |" + this.contents[i][0] + " " + _PSMath.PSMath.int2Glyph(this.contents[i][1]) + " " + this.contents[i][2]);
            } // for i
        } // print()

    }]);

    return Entity;
}(); // class Entity

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Perry = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     Copyright (C)2017 Thomas S. Phillips.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
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

var _Entity = __webpack_require__(0);

var _World = __webpack_require__(3);

var _Zone = __webpack_require__(5);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Perry = exports.Perry = new (function () {
    function _class() {
        _classCallCheck(this, _class);

        this.type = 'Perry';
        this.name = 'Perry Sim, virtual world simulator.';
        this.objects = {};
    } // constructor()

    _createClass(_class, [{
        key: 'init',
        value: function init() {
            this.world = this.create('World');
            this.world.init();
        }
    }, {
        key: 'create',
        value: function create(type) {
            var obj = undefined;
            switch (type) {
                case 'Entity':
                    {
                        obj = new _Entity.Entity();
                        break;
                    }
                case 'World':
                    {
                        obj = new _World.World();
                        break;
                    }
                case 'Zone':
                    {
                        obj = new _Zone.Zone();
                        break;
                    }
            } // switch
            if (typeof obj === 'undefined') {
                return undefined;
            } // if
            obj.perry = this;
            this.objects[obj.uuid] = obj;
            return obj;
        } // create()

    }]);

    return _class;
}())(); // class Perry

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var PSMath = new (function () {
    function _class() {
        _classCallCheck(this, _class);

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


    _createClass(_class, [{
        key: "xorShift128Seed",
        value: function xorShift128Seed(seed) {
            if (typeof seed === "undefined") {
                return this._xorShiftState.slice();
            } // if
            if (seed.length !== 4) {
                throw "PSMath.xorShift128Seed(): Illegal seed " + seed;
            } // if
            this._xorShiftState = seed.slice();
        } // xorShift128Seed()

    }, {
        key: "xorShift128",
        value: function xorShift128(seed) {
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
            t ^= (t >>> 8) % 0x100000000; // logical shift
            this._xorShiftState[3] = this._xorShiftState[2];
            this._xorShiftState[2] = this._xorShiftState[1];
            this._xorShiftState[1] = this._xorShiftState[0];
            t ^= this._xorShiftState[0];
            t ^= (this._xorShiftState[0] >>> 19) % 0x100000000; // logical shift
            this._xorShiftState[0] = t;
            if (t < this._xorShift128Min) {
                this._xorShift128Min = t;
            }
            if (t > this._xorShift128Max) {
                this._xorShift128Max = t;
            }
            return t;
        } // xorShift128()

        /**
        Common PRND functions.
        */

    }, {
        key: "seed",
        value: function seed(_seed) {
            return this.xorShift128Seed(_seed);
        } // seed()

        /**
        An adiabetic function to rotate the seed by a given delta.
        Useful for generating predetermined topology of Zone entities.
        */

    }, {
        key: "nextSeed",
        value: function nextSeed(seed, delta) {
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

    }, {
        key: "random",
        value: function random() {
            var x;
            x = Math.abs(this.xorShift128()) / 0x80000000;
            return x;
        } // random()

        /**
        Functions for testing PRNG.
        */

    }, {
        key: "checkRnd",
        value: function checkRnd() {
            console.log("Checking PRNG. Please be patient...");
            var dist = [0, 0, 0, 0];
            var n = 64000000;
            for (var i = 0; i < n; i++) {
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

    }, {
        key: "byte2Glyph",
        value: function byte2Glyph(x) {
            var result = "";
            var k = 'BDGHKMSZ';
            var v = 'AEIY';
            result += k[0x7 & x >>> 5];
            result += v[0x3 & x >>> 3];
            result += k[0x7 & x >>> 0];
            return result;
        } // byte2Glyph()

        /**
        Turn a glyph into a byte.
        */

    }, {
        key: "glyph2Byte",
        value: function glyph2Byte(g) {
            var result = 0;
            var k = 'BDGHKMSZ';
            var v = 'AEIY';
            result |= k.indexOf(g[0].toUpperCase()) << 5;
            result |= v.indexOf(g[1].toUpperCase()) << 3;
            result |= k.indexOf(g[2].toUpperCase()) << 0;
            return result;
        } // glyph2Byte()

        /**
        Convert a 32-bit integer array to a glyph.
        For example,
        int2Glyph([1, 0, -1, 1000]);
        TODO: This would be happier with joins.
        */

    }, {
        key: "int2Glyph",
        value: function int2Glyph(x) {
            var result = "";
            for (var i = 0; i < x.length; i++) {
                var b1 = 0xff & x[i] >>> 24;
                var b2 = 0xff & x[i] >>> 16;
                var b3 = 0xff & x[i] >>> 8;
                var b4 = 0xff & x[i] >>> 0;
                result += this.byte2Glyph(b1);
                result += "-";
                result += this.byte2Glyph(b2);
                result += "-";
                result += this.byte2Glyph(b3);
                result += "-";
                result += this.byte2Glyph(b4);
                if (i < x.length - 1) {
                    result += ":";
                } // if
            } // for i
            return result;
        } // num2Glyph()

        /**
        Turn a glyph string into an array of integers.
        */

    }, {
        key: "glyph2Int",
        value: function glyph2Int(g) {
            var result = [];
            var x = 0;
            var t = g.split(/\b\s+|-|:/);
            var i = 0;
            while (i < t.length) {
                var j = this.glyph2Byte(t[i]);
                var s = 24 - 8 * (i % 4);
                x |= j << 24 - 8 * (i % 4);
                i++;
                if (i % 4 === 0) {
                    result.push(x);
                    x = 0;
                } // if
            } // while
            return result;
        } // glyph2Int()

        // LZW-compress a string
        // LGPL: http://stackoverflow.com/questions/294297/javascript-implementation-of-gzip?sort=newest

    }, {
        key: "lzw_encode",
        value: function lzw_encode(s) {
            var dict = {};
            var data = (s + "").split("");
            var out = [];
            var currChar;
            var phrase = data[0];
            var code = 256;
            for (var i = 1; i < data.length; i++) {
                currChar = data[i];
                if (dict[phrase + currChar] != null) {
                    phrase += currChar;
                } else {
                    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                    dict[phrase + currChar] = code;
                    code++;
                    phrase = currChar;
                }
            }
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            for (var i = 0; i < out.length; i++) {
                out[i] = String.fromCharCode(out[i]);
            }
            return out.join("");
        } // lzw_encode()

        // Decompress an LZW-encoded string
        // LGPL: http://stackoverflow.com/questions/294297/javascript-implementation-of-gzip?sort=newest

    }, {
        key: "lzw_decode",
        value: function lzw_decode(s) {
            var dict = {};
            var data = (s + "").split("");
            var currChar = data[0];
            var oldPhrase = currChar;
            var out = [currChar];
            var code = 256;
            var phrase;
            for (var i = 1; i < data.length; i++) {
                var currCode = data[i].charCodeAt(0);
                if (currCode < 256) {
                    phrase = data[i];
                } else {
                    phrase = dict[currCode] ? dict[currCode] : oldPhrase + currChar;
                }
                out.push(phrase);
                currChar = phrase.charAt(0);
                dict[code] = oldPhrase + currChar;
                code++;
                oldPhrase = phrase;
            }
            return out.join("");
        } // lzw_decode()

    }, {
        key: "clamp",
        value: function clamp(val, min, max) {
            return Math.max(min, Math.min(max, val));
        } // clamp()

    }]);

    return _class;
}())(); // class instance Math

exports.PSMath = PSMath;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.World = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Entity2 = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
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

/**
A virtual world.
*/
var World = exports.World = function (_Entity) {
    _inherits(World, _Entity);

    function World() {
        _classCallCheck(this, World);

        var _this = _possibleConstructorReturn(this, (World.__proto__ || Object.getPrototypeOf(World)).call(this));

        _this.type = 'World';
        _this.class = World;
        _this.name = 'Default World';
        return _this;
    }

    _createClass(World, [{
        key: 'init',
        value: function init() {
            this.addContent('Zone');
        }
    }]);

    return World;
}(_Entity2.Entity); // class World

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Perry = __webpack_require__(1);

window.Perry = _Perry.Perry; /*
                             Copyright (C)2017 Thomas S. Phillips.
                             
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

/*
This file is the main entry into the perry-sim library.
We grab the main Perry object and make it accessible to the world
via the main window object.
*/

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Zone = undefined;

var _Entity2 = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               Copyright (C)2017 Thomas S. Phillips.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
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

/**
A partition of a World.
*/
var Zone = exports.Zone = function (_Entity) {
    _inherits(Zone, _Entity);

    function Zone() {
        _classCallCheck(this, Zone);

        var _this = _possibleConstructorReturn(this, (Zone.__proto__ || Object.getPrototypeOf(Zone)).call(this));

        _this.type = 'Zone';
        _this.class = Zone;
        _this.name = 'Default Scene';
        return _this;
    } // constructor()


    return Zone;
}(_Entity2.Entity);

; // class Zone

/***/ })
/******/ ]);
});