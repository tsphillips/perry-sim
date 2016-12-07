var Perry = Perry || {};

/**
* Something that can interact with a scene.
*/
Perry.Agent = class extends Perry.Body {
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

    render(display) {
        if (typeof this.img === "object") {
            display.ctx.drawImage(this.img,
                this.position.i * 100,
                this.position.j * 100);
        } // if
    } // render()

    update(display) {
        // this.render(display);
        if (this.target) {
            this.moveTo();
        } // if
    } // update()
} // class Agent
