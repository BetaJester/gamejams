import { Thingy } from './Thingy.js';

export class SplashScreen extends Thingy {
    /**
     * Creates an instance of SplashScreen.
     * @param {HTMLImageElement} image 
     */
    constructor(image) {
        super();
        this.image = image;
    }

    /** @param {Engine} engine */
    draw(engine) {
        engine.context.drawImage(this.image, 0, 0);
        this.drawChildren(engine);
    }
}