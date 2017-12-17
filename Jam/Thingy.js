export class Thingy {

    constructor() {
        /** @type {Array<Thingy>} */
        this.children = [];
    }

    /** @param {Thingy} thingy */
    addChild(thingy) {
        this.children.push(thingy);
    }

    /** @param {Thingy} thingy 
     * @returns {boolean}
    */
    removeChild(thingy) {
        let i = this.children.indexOf(thingy);
        if (i == -1) {
            return false;
        }
        this.children.splice(i, 1);
        return true;
    }

    clearChildren() {
        this.children.splice(0);
    }

    /** @param {Engine} engine */
    update(engine) {
        this.updateChildren(engine);
    }

    /** @param {Engine} engine */
    updateChildren(engine) {
        for (let i = 0; i < this.children.length; ++i) {
            this.children[i].update(engine);
        }
    }

    /** @param {Engine} engine */
    draw(engine) {
        this.drawChildren(engine);
    }

    /** @param {Engine} engine */
    drawChildren(engine) {
        for (let i = 0; i < this.children.length; ++i) {
            this.children[i].draw(engine);
        }
    }
}