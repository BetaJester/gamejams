import { ImagesLoader, ImagesLoaderItem } from './../../Jam/ImagesLoader.js';
import { ImageSprite } from './../../Jam/ImageSprite.js';
import { Point } from './../../Jam/Point.js';
import { Thingy } from './../../Jam/Thingy.js';
import { SoundMultiChannel } from './../../Jam/SoundMultiChannel.js';
import { SoundLooping } from './../../Jam/SoundLooping.js';
import { State } from './../../Jam/State.js';
import { ColorBackground } from './../../Jam/ColorBackground.js';
import { Rectangle } from './../../Jam/Rectangle.js';
import { SplashScreen } from './../../Jam/SplashScreen.js';
import { Engine } from './../../Jam/Engine.js'; 

const IMAGE_LIST = [
    new ImagesLoaderItem('startupSplash.png'),
    new ImagesLoaderItem('shipBody.png'),
    new ImagesLoaderItem('shipGun.png'),
    new ImagesLoaderItem('shipJet.png'),
    new ImagesLoaderItem('enemy0.png')
];

// Tuning values.
const TUNING = {
    STARTUP_SPLASH: { IMAGE_NUMBER: 0},
    SHIP:           { X: 300,   Y: 300, IMAGE_NUMBER: 1, MOVE_SPEED: 1.5, GRAVITY_MAX: 0.3, GRAVITY_MIN: 0.01, PIXEL_GRAV_MAX: 5.0 },
    SHIP_GUN:       { X: 0,     Y: 0,   IMAGE_NUMBER: 2 },
    SHIP_JET:       { X: 0,     Y: 0,   IMAGE_NUMBER: 3 },
    ASTEROID:       { IMAGE_NUMBER: 4 },
};

const LEVEL_DATA = [
    { ASTEROID_COUNT: 10}
];


const Turning = {
    Left: -1,
    None: 0,
    Right: 1
};

class BoundedImageSprite extends ImageSprite {
    /** @param {Engine} engine */
    updateNow(engine) {
        super.updateNow(engine);
        if ((this.position.x <= 0 && this.speed.x < 0) || (this.position.x >= engine.canvas.width && this.speed.x > 0)) {
            this.speed.x *= -1;
            this.speed.x *= 0.9;
        }
        if ((this.position.y <= 0 && this.speed.y < 0) || (this.position.y >= engine.canvas.height && this.speed.y > 0)) {
            this.speed.y *= -1;
            this.speed.y *= 0.9;
        }
    }
}

class Ship extends BoundedImageSprite {
    
    constructor() {
        super(TUNING.SHIP.X,TUNING.SHIP.Y, IMAGE_LIST[TUNING.SHIP.IMAGE_NUMBER].image);

        this.isAccelerating = false;
        this.isFiring = false;
        this.turning = Turning.None;
        this.isUsingGravity = false;
        this.gravityAmount = TUNING.SHIP.GRAVITY_MAX;
    

        this.gun = new ImageSprite(TUNING.SHIP_GUN.X,TUNING.SHIP_GUN.Y,IMAGE_LIST[TUNING.SHIP_GUN.IMAGE_NUMBER].image);
        this.jet = new ImageSprite(TUNING.SHIP_JET.X,TUNING.SHIP_JET.Y,IMAGE_LIST[TUNING.SHIP_JET.IMAGE_NUMBER].image);
        //this.gravity = new ImageSprite(TUNING.SHIP_GRAVITY.X,TUNING.SHIP_GRAVITY.Y,IMAGE_LIST[TUNING.SHIP_GRAVITY.IMAGE_NUMBER].image);
        this.calculateCenter();
        this.gun.calculateCenter();
        this.jet.calculateCenter();
        //this.gravity.calculateCenter();

        this.jet.enabled = false;
        
        this.addChild(this.gun);
        this.addChild(this.jet);
        //this.addChild(this.gravity);
    }

    /** @param {Engine} engine */
    updateNow(engine) {
        super.updateNow(engine);
        // Maybe a cheap fix to just derotate it...
        this.gun.rotation.amount = Math.atan2(engine.input.MouseLocation.y - this.position.y, engine.input.MouseLocation.x - this.position.x) - this.rotation.amount;
        this.jet.enabled = this.isAccelerating;
        if (this.isAccelerating) {
            this.speed.x += Math.cos(this.rotation.amount) * TUNING.SHIP.MOVE_SPEED;
            this.speed.y += Math.sin(this.rotation.amount) * TUNING.SHIP.MOVE_SPEED;
        }
        this.rotation.amount += this.turning * TUNING.SHIP.MOVE_SPEED / engine.fps;
    }

    gunPosition() {
        let x = this.position.x + Math.cos(this.gun.rotation.amount + this.rotation.amount) * 12.7;
        let y = this.position.y + Math.sin(this.gun.rotation.amount + this.rotation.amount) * 12.7;
        return new Point(x,y);
    }

    /** @param {Engine} engine */
    drawNow(engine) {
        super.drawNow(engine);
        if (this.isUsingGravity) {
            engine.context.fillStyle = 'rgba(0,200,100,0.3)';
            //context.strokeStyle = 'rbga(0,0,255,0.3)';
            engine.context.beginPath();
            engine.context.arc(0,0,(TUNING.SHIP.GRAVITY_MAX-(TUNING.SHIP.GRAVITY_MAX-this.gravityAmount))*100,0,Math.PI*2);
            engine.context.fill();
            //context.stroke();
            //bjDrawCenteredBitmapWithRotation(context, this.x, this.y, this.shipGravityImage, this.rotation);
        }
    }
}

class Pixel {
    /**
     * Creates an instance of Pixel.
     * @param {PixelPile} pile 
     * @param {Point} position 
     * @param {number} red 
     * @param {number} green 
     * @param {number} blue 
     * @param {number} alpha 
     */
    constructor(pile, position, red, green, blue, alpha){
        this.speed = new Point(Math.random() * 2 - 1, Math.random() * 2 - 1);
        this.position = position;
        this.life = 100;
        pile.addPixel(this, `rgba(${red},${green},${blue},${alpha}`);
    }
}

class PixelPile extends Thingy {


    /** @param {Ship} ship */
    constructor(ship) {
        super();
        this.ship = ship;
        this.pixels = new Map();
        this.totalPixels = 0;
        this.absorbedPixels = 0;
        this.soundClaim = new SoundMultiChannel('audio/claim', 6);

    }

    /**
     * @param {Pixel} pixel 
     * @param {string} colorString 
     */
    addPixel(pixel, colorString) {

        if (!this.pixels.has(colorString)) {
            this.pixels.set(colorString, []);
        } else {
            let arr = this.pixels.get(colorString);
            if (arr) {
                arr.push(pixel);
            }
        }
        this.totalPixels++;
    }

    clearPixels() {
        this.pixels.clear();
    }

    /** @param {Engine} engine */
    update(engine) {

        for (let value of this.pixels.values()) {
            const moveSpeed = 5.0;
            let grav = this.ship.isUsingGravity;
            let gravMulti = this.ship.gravityAmount;
            let maxSpeed = TUNING.SHIP.PIXEL_GRAV_MAX;
            let sx = this.ship.position.x;
            let sy = this.ship.position.y;
            let ikill = [];
            let i = 0;
            for (let pix of value) {
                if ((pix.position.x <= 0 && pix.speed.x < 0) || (pix.position.x >= engine.canvas.width && pix.speed.x > 0)) {
                    pix.speed.x *= -1;
                    pix.speed.x *= 0.9;
                }
                if ((pix.position.y <= 0 && pix.speed.y < 0) || (pix.position.y >= engine.canvas.height && pix.speed.y > 0)) {
                    pix.speed.y *= -1;
                    pix.speed.y *= 0.9;
                }
                if (grav) {
                    let dx = sx - pix.position.x;
                    let dy = sy - pix.position.y;
                    if (Math.abs(dx) < 15 && Math.abs(dy) < 15) {
                        if (--pix.life <= 0) {
                            ikill.push(i);
                            this.absorbedPixels++;
                            this.soundClaim.play();
                        }
                    }
                    let angle = Math.atan2(dy, dx);
                    pix.speed.x += Math.cos(angle) * gravMulti;
                    pix.speed.y += Math.sin(angle) * gravMulti;
                    if (pix.speed.x > maxSpeed) pix.speed.x = maxSpeed;
                    if (pix.speed.y > maxSpeed) pix.speed.y = maxSpeed;
                    if (pix.speed.x < -maxSpeed) pix.speed.x = -maxSpeed;
                    if (pix.speed.y < -maxSpeed) pix.speed.y = -maxSpeed;
                }
                pix.position.x += moveSpeed * pix.speed.x / engine.fps;
                pix.position.y += moveSpeed * pix.speed.y / engine.fps;
                ++i;
            }
            // Reverse sort pixels to remove, must remove from end or indexes are worthless.
            ikill.sort((u,d) => u<d);
            for(let r of ikill) {
                value.splice(r,1);
                this.totalPixels--;
            }
        }
    }

    /** @param {Engine} engine */
    draw(engine) {
        for (let [key, value] of this.pixels) {
            engine.context.fillStyle = key;
            for (let pix of value) {
                engine.context.fillRect(pix.position.x,pix.position.y, 1,1);
            }
        }
    }
}

class LineCollision extends Point {
    /**
     * Creates an instance of LineCollision.
     * @param {number} x 
     * @param {number} y 
     * @param {boolean} isWall 
     */
    constructor(x, y, isWall) {
        super(x,y);
        this.isWall = isWall;
    }
}

class Asteroid extends BoundedImageSprite {

    /**
     * Creates an instance of Asteroid.
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        super(x,y, IMAGE_LIST[TUNING.ASTEROID.IMAGE_NUMBER].image);
        this.rotation.speed = (Math.random() - 0.5) * 0.5;
        this.speed.x = (Math.random() - 0.5) * 25;
        this.speed.y = (Math.random() - 0.5) * 25;
        this.calculateCenter();
    }

    // lineEnd will by unrotated by this function!
    /**
     * @param {PixelPile} pixelPile 
     * @param {Point} lineEnd 
     */
    hit(pixelPile, lineEnd) {
        // TODO: No magic numbers.
        const width = this.size.x;
        const height = this.size.y;
        let tempPixels = this.context.getImageData(0,0, width,height);
        let data = tempPixels.data;
        let i =(lineEnd.y*this.canvas.width+lineEnd.x)*4;
        // FIXME: use center or half, inconsistent.
        lineEnd.rotateAroundBy(new Point (width*0.5,height*0.5), this.rotation.amount);
        /*let tempPixel =*/ new Pixel(pixelPile,
                new Point(this.position.x+lineEnd.x-width*0.5,this.position.y+lineEnd.y-height*0.5),
                data[i+0],data[i+1],data[i+2],data[i+3]
            );
        data[i+3] = 0;
        this.context.putImageData(tempPixels, 0,0);
    }

    /**
     * @param {Point} origin 
     * @param {Point} end 
     * @returns {LineCollision} 
     */
    findLineEnd(origin, end) {
        
        // TODO: pass by value I mean cmon.
        origin = origin.copy();
        end = end.copy();
        origin.x = Math.floor(origin.x);
        origin.y = Math.floor(origin.y);
        end.x = Math.floor(end.x);
        end.y = Math.floor(end.y);
        
        let dx = Math.abs(end.x-origin.x);
        let dy = Math.abs(end.y-origin.y);
        let sx = (origin.x < end.x) ? 1 : -1;
        let sy = (origin.y < end.y) ? 1 : -1;
        let err = dx-dy;
        let entryWound = { x: false, y: false };
        //var ox = x0, oy = y0;

        let data = this.context.getImageData(0, 0, this.size.x, this.size.y).data;
        
        let wall = false;
    
        let sanityCheck = this.size.x * this.size.y * 2;

        // FIXME: Infinite loop :(
        while(true){
            if (--sanityCheck < 0) {
                //console.log('Sanity check failed...');
                wall = true;
                break;
            }
            // Has come in range horizontally.
            if (origin.x < this.size.x && origin.x >= 0) {
                entryWound.x = true;
            }
            // Has come in range vertically.
            if (origin.y < this.size.y && origin.y > 0) {
                entryWound.y = true;
            }
            // Gone out the other side horizontally.
            if (entryWound.x && (origin.x >= this.size.x || origin.x < 0)) {
                wall = true;
                break;
            }
            // Gone out the other side vertically.
            if (entryWound.y && (origin.y >= this.size.y || origin.y < 0)) {
                wall = true;
                break;
            }
            // Inside the context.
            if (entryWound.x && entryWound.y) {
                let i = ((origin.y*this.size.x)+(origin.x))*4;
                // TODO: No magic numbers!
                let c = data[i+3];//data[i+RED_BYTE] + data[i+GREEN_BYTE] + data[i+BLUE_BYTE];
                // Hit a valid pixel.
                if (c != 0) {
                    wall = false;
                    break;
                }
            }
            let e2 = err << 1;
            if (e2 >-dy){ err -= dy; origin.x += sx; }
            if (e2 < dx){ err += dx; origin.y += sy; }
        }
        
        return new LineCollision(origin.x,origin.y, wall);
     }
    
}

class AsteroidHit {
    /**
     * Creates an instance of AsteroidHit.
     * @param {Asteroid} asteroid 
     * @param {LineCollision} lineEnd 
     */
    constructor(asteroid, lineEnd) {
        this.asteroid = asteroid;
        this.lineEnd = lineEnd;
    }
}

class LevelState extends State {

    constructor() {
        super();
        /** @type {Array<Asteroid>} */
        this.asteroids = [];
        /** @type {ImageData} */
        this.background = null;
        /** @type {Ship} */
        this.ship = null;
        /** @type {PixelPile} */
        this.pixelPile = null;
        /** @type {SoundLooping} */
        this.soundLaser = new SoundLooping('audio/laser');
        this.levelNumber = 0;
    }   

    /** @param {Engine} engine */
    init(engine) {

        // TODO: Star field instead of blackish.
        engine.addChild(new ColorBackground('rgb(0,0,32)'));

        this.ship = new Ship();
        
        this.pixelPile = new PixelPile(this.ship);

        engine.addChild(this.ship);
        
        for (let i = 0; i < LEVEL_DATA[this.levelNumber].ASTEROID_COUNT; ++i) {
            let x = 0;
            let y = 0;
            do {
                x = Math.random() * engine.canvas.width;
                y = Math.random() * engine.canvas.height;
            } while (Math.sqrt(((this.ship.position.x - x) * (this.ship.position.x - x)) + ((this.ship.position.y - y) * (this.ship.position.y - y))) < 200);
            
            let asteroid = new Asteroid(x,y);
            this.asteroids.push(asteroid);
            engine.addChild(asteroid);
        }

        //this.hud = new HUD(engine);
        //engine.addChild(this.hud);

        engine.addChild(this.pixelPile);

        // Test via a getter in the options object to see if the passive property is accessed
        // Coutesy https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
        /*let supportsPassive = false;
        try {
            var opts = Object.defineProperty({}, 'passive', {
                get: function() {
                    supportsPassive = true;
                }
            });
            window.addEventListener("test", null as any, opts);
        } catch (e) {}*/

        // Use our detect's results. passive applied if supported, capture will be false either way.
        // FIXME: Without = warning on chrome, with = not working on edge... working is better for now.
        //engine.canvas.addEventListener('wheel', this.mouseWheel.bind(this), (supportsPassive ? { passive: true } : false) as any);
        engine.canvas.addEventListener('wheel', this.mouseWheel.bind(this));
        engine.debugList.push(() => 'Free Pixels: ' + this.pixelPile.totalPixels);
        engine.debugList.push(() => 'Absorbed Pixels: ' + this.pixelPile.absorbedPixels);

        this.initDone();
    }

    /** @param {WheelEvent} evt */
    mouseWheel(evt) {
        evt.preventDefault();
        this.ship.gravityAmount -= 0.01 * Math.sign(evt.deltaY);
        //console.log(evt.deltaY);
        if (this.ship.gravityAmount < TUNING.SHIP.GRAVITY_MIN) { 
            this.ship.gravityAmount = TUNING.SHIP.GRAVITY_MIN;
            //ship.usingGravity = false;
        }
        if (this.ship.gravityAmount > TUNING.SHIP.GRAVITY_MAX) this.ship.gravityAmount = TUNING.SHIP.GRAVITY_MAX;
        //if (gravity > 0) ship.usingGravity = true;
    }

    /** @param {Engine} engine */
    cycle(engine) {

        // TODO: HUD.

        let goPressed = engine.input.Key_W || engine.input.Key_Up;
        this.ship.isAccelerating = goPressed;

        this.ship.isUsingGravity = engine.input.Key_Space;

        if (engine.input.Key_A || engine.input.Key_Left) {
            this.ship.turning = Turning.Left;
        } else if (engine.input.Key_D || engine.input.Key_Right) {
            this.ship.turning = Turning.Right;
        } else {
            this.ship.turning = Turning.None;
        }
        this.ship.isFiring = engine.input.Button_Left;
        this.soundLaser.setIsPlaying(engine.input.Button_Left);

        if (this.ship.isFiring) {
            /** @type {LineCollision} */
            let lineEnd = null;
            // Sort asteroids by distance.
            /** @type {Array<Asteroid>} */
            let potentialAsteroids = this.asteroids.slice();
            /** @param {Point} one 
             * @param {Point} two
             * @returns {number}
            */
            var distance = function (one, two) {
                return Math.sqrt(((one.x - two.x) * (one.x - two.x)) + ((one.y - two.y) * (one.y - two.y)));
            };
            // Useless sort?
            potentialAsteroids.sort( (a,b) => distance(this.ship.position, a.position) < distance(this.ship.position, b.position) );
            
            // Slim possible asteroids down by box collision.
            // Create the laser... extend the line (Courtesy of https://stackoverflow.com/a/7741655)
            let laserEnd = engine.input.MouseLocation.copy();
            const laserLength = distance(this.ship.position, engine.input.MouseLocation);
            const multiplier = Math.max(engine.canvas.width, engine.canvas.height);
            laserEnd.x = laserEnd.x + (laserEnd.x - this.ship.position.x) / laserLength * multiplier;
            laserEnd.y = laserEnd.y + (laserEnd.y - this.ship.position.y) / laserLength * multiplier;

            for (let i = potentialAsteroids.length - 1; i >= 0; --i) { // In reverse so we can splice.
                let roid = potentialAsteroids[i];
                const max = Math.max(roid.size.x, roid.size.y);
                const width = max * 1.4;
                const height = max * 1.4;
                const y = roid.position.y - height/2;
                const x =  roid.position.x - width/2;
                let asteroidRect = new Rectangle(x,y, width,height);
                if (!asteroidRect.intersectsLine(this.ship.position, laserEnd)) {
                    potentialAsteroids.splice(i,1);
                }
            }

            // USED TO: Perform line find until one succeeds, or none.
            // NOW: Keep ANY hits for later comparison.
            /** @type {Array<AsteroidHit>} */
            let hits = [];
            for (let i = 0; i < potentialAsteroids.length; ++i) {
                
                // Un-rotate the origin around the asteroid.
                let roid = potentialAsteroids[i];
                let newShipLoc = this.ship.gunPosition();
                let newMouseLoc = engine.input.MouseLocation.copy();
                let newRoidLoc = roid.position.copy();
                newRoidLoc.x -= roid.size.x / 2;
                newRoidLoc.y -= roid.size.y / 2;
                newShipLoc.rotateAroundBy(roid.position, roid.rotation.amount*-1);
                newMouseLoc.rotateAroundBy(roid.position, roid.rotation.amount*-1);
                
                // Adjust for enemy centering. TODO: Use the center and not always half, or vice versa.
                newShipLoc.x -= newRoidLoc.x;
                newShipLoc.y -= newRoidLoc.y;
                newMouseLoc.x -= newRoidLoc.x;
                newMouseLoc.y -= newRoidLoc.y;

                // Find the pixel that would be hit, if any.
                lineEnd = roid.findLineEnd(newShipLoc, newMouseLoc);

                // Rotate the position back around the roid.
                //lineEnd.rotateAroundBy(newRoidLoc, roid.rotation.amount);

                // Move to the roid position.
                //lineEnd.x += roid.position.x;
                //lineEnd.y += roid.position.y;

                if (lineEnd != null && !lineEnd.isWall) {
                    hits.push(new AsteroidHit(roid, lineEnd));
                }
            }

            // FIXME: Repeated code, drawing in wrong part of loop.
            if (hits.length != 0) {
                hits.sort(
                    (a,b) =>   distance(this.ship.position, a.asteroid.position.plus(a.lineEnd.minus(a.asteroid.size.timesAmount(0.5)))) > distance(this.ship.position, b.asteroid.position.plus(b.lineEnd.minus(b.asteroid.size.timesAmount(0.5))))
                );
                hits[0].asteroid.hit(this.pixelPile, hits[0].lineEnd);
                this.soundLaser.setVolume(1.0);
                let pointyEnd = hits[0].lineEnd.plus(hits[0].asteroid.position).minus(hits[0].asteroid.size.timesAmount(0.5));
                let ctx = engine.context;
                ctx.strokeStyle = 'rgb(255,0,0)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(this.ship.gunPosition().x, this.ship.gunPosition().y);
                ctx.lineTo(pointyEnd.x, pointyEnd.y);
                ctx.stroke();
            } else {
                this.soundLaser.setVolume(0.3);
                let ctx  = engine.context;
                ctx.strokeStyle = 'rgb(255,0,0)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(this.ship.gunPosition().x, this.ship.gunPosition().y);
                ctx.lineTo(laserEnd.x, laserEnd.y);
                ctx.stroke();
            }

        }
    }

    /** @param {Engine} engine */
    finish(engine) {
        // Test via a getter in the options object to see if the passive property is accessed
        // Coutesy https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
        // FIXME: Without = warning on chrome, with = fail on edge.
        /*let supportsPassive = false;
        try {
            var opts = Object.defineProperty({}, 'passive', {
                get: function() {
                    supportsPassive = true;
                }
            });
            window.addEventListener("test", null, opts);
        } catch (e) {}
        engine.canvas.removeEventListener('wheel',this.mouseWheel.bind(this),(supportsPassive ? { passive: true } : false));*/
        engine.canvas.removeEventListener('wheel',this.mouseWheel.bind(this));
    }
}

class SplashState extends State {
    
    constructor() {
        super();
        /** @type {SplashScreen} */
        this.splash = null;
        /** @type {ImagesLoader} */
        this.imageLoader = null;
        this.done = false;
        this.loadingDots = "";
    }
    
    /** @param {Engine} engine */
    init(engine) {
        
        this.imageLoader = new ImagesLoader(IMAGE_LIST, 'images/');
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

/** @type {Engine} */
var game;

window.onload = function() {

    const DEBUG_STATUS = true;

    let splash = new SplashState();
    game = new Engine(document.getElementById('theCanvas'), splash, DEBUG_STATUS);
    game.go();
};