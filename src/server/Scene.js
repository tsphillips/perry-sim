var Perry = Perry || {};

Perry.Scene = class {
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
