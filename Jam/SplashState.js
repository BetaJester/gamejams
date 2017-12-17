import { State } from './State';
import { SplashScreen } from './SplashScreen';
import { ImagesLoader } from './ImagesLoader';

export class SplashState extends State {
    
    constructor(splashImageName, imageList, path) {
        super();
        /** @type {SplashScreen} */
        this.splash = null;
        /** @type {ImagesLoader} */
        this.imageLoader = null;
        //this.imageList = imageList;
        this.path = path;
        this.done = false;
        this.loadingDots = "";
        //this.splashImageName
    }
    
    /** @param {Engine} engine */
    init(engine) {
        
        this.imageLoader = new ImagesLoader(this.imageList, this.path);
        this.imageLoader.onDone = this.init2.bind(this, engine);
        this.imageLoader.beginLoading();
    }

    /** @param {Engine} engine */
    init2(engine) {
        this.splash = new SplashScreen(IMAGE_LIST[TUNING.STARTUP_SPLASH.IMAGE_NUMBER].image);
        engine.addChild(this.splash);
        this.done = true;
        super.initDone();
    }

    /** @param {Engine} engine */
    cycle(engine) {
        if (!this.done) {
            if (this.loadingDots.length < 100) {
                this.loadingDots += '.';
            } else {
                this.loadingDots = '';
            }
            engine.context.fillStyle = 'black';
            engine.context.font = 'Consolas 20px';
            let text = "Loading Images" + this.loadingDots;
            engine.context.fillText(text, 320, 450);
        }
        if (engine.input.Button_Left && this.done) {
            engine.setState(new LevelState());
        }
    }

    /** @param {Engine} engine */
    finish(engine) {
        super.finish(engine);
    }
}