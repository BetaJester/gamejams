import { Thingy } from './Thingy.js';
import { Point } from './Point.js';
import { Rotation } from './Rotation.js';

export class Sprite extends Thingy {

    /**
     * Creates an instance of Sprite.
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        super();
        this.speed = new Point(0,0);
        this.rotation = new Rotation(0,0);
        this.center = new Point(0,0);
        this.scale = new Point(1.0,1.0);
        this.enabled = true;
        this.position = new Point(x,y);
    }

    /** @param {Engine} engine */
    update(engine) {
        this.position.x += this.speed.x / engine.fps;
        this.position.y += this.speed.y / engine.fps;
        this.rotation.amount += this.rotation.speed / engine.fps;
        this.updateNow(engine);
        this.updateChildren(engine);
    }

    /** @param {Engine} engine */
    draw(engine) {
        if (this.enabled) {
            let c = engine.context;
            c.save();
            c.translate(this.position.x, this.position.y);
            c.rotate(this.rotation.amount);
            c.scale(this.scale.x, this.scale.y);
            this.drawNow(engine);
            this.drawChildren(engine);
            c.restore();
        }
    }

    /* eslint-disable no-unused-vars */

    /** @param {Engine} engine */
    drawNow(engine) {}

    /** @param {Engine} engine */
    updateNow(engine) {}

    /* eslint-enable no-unused-vars */
}