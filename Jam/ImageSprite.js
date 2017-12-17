import { Sprite } from './Sprite.js';
import { Point } from './Point.js';

export class ImageSprite extends Sprite {

    /**
     * Creates an instance of ImageSprite.
     * @param {number} x 
     * @param {number} y 
     * @param {HTMLImageElement} image 
     */
    constructor(x, y, image) {
        super(x,y);
        /** @type {HTMLCanvasElement} */
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.size = new Point(image.width, image.height);
        this.canvas.width = image.width;
        this.canvas.height = image.height;
        this.context.drawImage(image, 0,0);
    }

    /** @param {Engine} engine */
    drawNow(engine) {
        engine.context.drawImage(this.canvas, this.center.x, this.center.y);
    }

    calculateCenter() {
        this.center.x = this.size.x * -0.5;
        this.center.y = this.size.y * -0.5;
    }
}