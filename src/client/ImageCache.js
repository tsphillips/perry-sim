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

var Perry = Perry || {};

/**
* An ImageCache object will load images in the background and invoke
* callbacks when the images are ready.
*
* Set the onReady field to a callback function that will be invoked once all images are ready.
*/
Perry.ImageCache = class {
    constructor() {
        this.cache     = {};    // images are stored here
        this.callbacks = {};    // a callback for each image
        this.startLoad = {};    // time load started
        this.endLoad   = {};    // time load ended
        this.loaded    = 0;     // how many images are loaded
        this.ready     = 0;     // how many images are ready
        this.onReady   = null;  // callback when all images ready
    } // constructor()

    /**
    * @param name The URI to the image, or an array of URIs.
    * @param callback An optional callback function to invoke when the image is ready.
    */
    loadImage(nameOrArray, callback) {
        // Function takes a single URI or an array of URIs
        if (Array.isArray(nameOrArray)) {
            for (var i=0; i<nameOrArray.length; i++) {
                this.loadImage(nameOrArray[i], callback);
            } // for i
            return;
        } // if
        var name = nameOrArray;
        if (typeof this.cache[name] !== "undefined") {
            return;
        } // if
        this.cache[name] = "loading " + name;
        this.callbacks[name] = callback;
        this.startLoad[name] = Date.now();
        this.loaded++;
        var img = new Image();
        img.src = name;
        img.onload = (function(ic, name, img) {
            return function() {
                if (ic.debug === true) {
                    console.log("loading " + name);
                } // if
                ic.cache[name] = img;
                ic.endLoad[name] = Date.now();
                ic.ready++;
                if (typeof ic.callbacks[name] === "function") {
                    ((ic.callbacks[name])());
                } // if specific callback
                if (ic.ready === ic.loaded) {
                    if (ic.debug === true) {
                        console.log("ImageCache finished loading images.");
                        var keys = Object.keys(ic.cache).sort();
                        for (var i=0; i<keys.length; i++) {
                            var key = keys[i]
                            var msg = key + " " +
                                ic.startLoad[key] + " " +
                                ic.endLoad[key] + " " +
                                (ic.endLoad[key] - ic.startLoad[key]) +
                                "ms\n";
                            console.log(msg);
                        } // for i
                    } // if debug
                    if (typeof ic.onReady === "function") {
                        ((ic.onReady)());
                    } // if onReady set
                } // if all ready
            };
        })(this, name, img);
    } // loadImage()

} // class ImageCache
