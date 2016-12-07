var Perry = Perry || {};

/**
* Something that exists.
*/
Perry.Entity = class {
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
