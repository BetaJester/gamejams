import { Background } from './Background.js';

export class ColorBackground extends Background {
    /** @param {string} style */
    constructor(style) {
        super();
        this.style = style;
    }

    /** @param {Engine} engine */
    draw(engine) {
        engine.context.fillStyle = this.style;
        engine.context.fillRect(0,0, engine.canvas.width,engine.canvas.height);
    }
}