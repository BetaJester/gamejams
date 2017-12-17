// Set automagically based on setupLoadImages.
// Based on code learned in https://www.udemy.com/how-to-program-games/ - seriously.

class ImagesLoaderItem {
    /** @param {string} fileName */
    constructor(fileName) {
        this.fileName = fileName;
        this.image = new Image();
    }
}

class ImagesLoader {

    /**
     * 
     * @param {Array<ImagesLoaderItem>} imageList 
     * @param {string} path 
     */
    constructor(imageList, path) {
        this.imageList = imageList;
        this.path = path;
        this._picsToLoad = 0;
        this.onDone = null;
    }

    _imageOnLoad() {
        this._picsToLoad--;
        if (this._picsToLoad == 0) {
            this.onDone();
        }
    }

    /** @param {ImagesLoaderItem} listItem */
    _beginLoadingImage(listItem) {
        listItem.image.onload = this._imageOnLoad.bind(this);
        listItem.image.src = this.path + listItem.fileName;
    }

    beginLoading() {
        this._picsToLoad = this.imageList.length;
        for (let listItem of this.imageList) {
            this._beginLoadingImage(listItem);
        }
        return this.imageList.length;
    }
}

class Thingy {

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

class Point {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /** @returns {Point} */
    copy() {
        return new Point(this.x, this.y);
    }

    // Courtesy of https://stackoverflow.com/a/2259502
    /**
     * 
     * @param {Point} origin 
     * @param {number} angle 
     */
    rotateAroundBy(origin, angle)
    {
        const s = Math.sin(angle);
        const c = Math.cos(angle);

        // translate point back to origin:
        this.x -= origin.x;
        this.y -= origin.y;

        // rotate point
        const xnew = this.x * c - this.y * s;
        const ynew = this.x * s + this.y * c;

        // translate point back:
        this.x = xnew + origin.x;
        this.y = ynew + origin.y;
    }

    /** @param {Point} rhs
     * @returns {Point}
     */
    plus(rhs) {
        return new Point(this.x + rhs.x, this.y + rhs.y);
    }

    /** @param {number} rhs
     * @returns {Point}
     */
    plusAmount(rhs) {
        return new Point(this.x + rhs, this.y + rhs);
    }
    
    /** @param {Point} rhs
     * @returns {Point}
     */
    times(rhs) {
        return new Point(this.x * rhs.x, this.y * rhs.y);
    }
    
    /** @param {number} rhs
     * @returns {Point}
     */
    timesAmount(rhs) {
        return new Point(this.x * rhs, this.y * rhs);
    }

    /** @param {Point} rhs
     * @returns {Point}
     */
    minus(rhs) {
        return new Point(this.x - rhs.x, this.y - rhs.y);
    }

    /** @param {number} rhs
     * @returns {Point}
     */
    minusAmount(rhs) {
        return new Point(this.x - rhs, this.y - rhs);
    }
}

class Rotation {
    /**
     * Creates an instance of Rotation.
     * @param {number} amount 
     * @param {number} speed 
     */
    constructor(amount, speed) {
        this.amount = amount;
        this.speed = speed;
    }
}

class Sprite extends Thingy {

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

class ImageSprite extends Sprite {

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

const SoundExtension = setFormat();

/** @returns {string} */
function setFormat() {
    return new Audio().canPlayType('audio/mp3') ? '.mp3' : '.ogg';
}

// Concept from Hands-On Intro to Game Programming-v5 p378.

class SoundMultiChannel {

    /**
     * Creates an instance of SoundMultiChannel.
     * @param {string} filename 
     * @param {number} [channelCount=2] 
     */
    constructor(filename, channelCount = 2) {
        this._filename = filename;
        this._channelCount = channelCount;
        this._channels = [];
        this._currentChannel = 0;
        for (let i = 0; i < channelCount; ++i) {
            this._channels.push(new Audio(filename+SoundExtension));
        }
    }

    play() {
        this._channels[this._currentChannel].currentTime = 0;
        this._channels[this._currentChannel].play();
        if (++this._currentChannel >= this._channelCount) {
            this._currentChannel = 0;
        }
    }
}

// Concept from Hands-On Intro to Game Programming-v5 p386.
class SoundLooping {
    
    /** @param {string} filename */
    constructor(filename) {
        this._channel = new Audio(filename+SoundExtension);
        this._channel.loop = true;
    }

    /** @param {boolean} isPlaying */
    setIsPlaying(isPlaying) {
        if (isPlaying) {
            this._channel.play();
        } else {
            this._channel.pause();
        }
    }

    /** @param {number} volume */
    setVolume(volume) {
        this._channel.volume = volume;
    }
}

class State {
    
    static get INIT() {return  0; }
    static get CYCLE() {return  1; }
    static get FINISH() {return  2; }

    constructor() {
        this.state = State.INIT;
    }
    
    /** @param {Engine} engine */
    doInit(engine) {
        this.init(engine);
    }

    /** @param {Engine} engine */
    doCycle(engine) {
        if (this.state == State.CYCLE) {
            this.cycle(engine);
        }
    }

    /** @param {Engine} engine */
    doFinish(engine) {
        if (this.state == State.CYCLE) {
            this.state = State.FINISH;
            this.finish(engine);
        }
    }

    initDone() {
        this.state = State.CYCLE;
    }

    /* eslint-disable no-unused-vars */

    /** @param {Engine} engine */
    init(engine) { this.initDone(); }
    /** @param {Engine} engine */
    cycle(engine) {}
    
    /* eslint-enable no-unused-vars */

    /** @param {Engine} engine */
    finish(engine) { engine.clearChildren(); }
}

class Background extends Thingy {
    constructor() {
        super();
    }
}

class ColorBackground extends Background {
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

class Rectangle {
    
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(x, y, width, height) {
        this.position = new Point(x,y);
        this.size = new Point(width, height);
    }

    /**
     * @param {Point} p1 
     * @param {Point} p2 
     * @returns {boolean} 
     */
    intersectsLine(p1, p2) {
        // Parts from https://stackoverflow.com/a/100165 which led to https://jsfiddle.net/77eej/2/ thanks to https://stackoverflow.com/users/1382949/urraka
        let minX = p1.x;
        let maxX = p2.x;
        
        if (p1.x > p2.x) {
            minX = p2.x;
            maxX = p1.x;
        }
        
        if (maxX > this.position.x + this.size.x)
            maxX = this.position.x + this.size.x;
        
        if (minX < this.position.x)
            minX = this.position.x;
        
        if (minX > maxX)
            return false;
        
        var minY = p1.y;
        var maxY = p2.y;
        
        var dx = p2.x - p1.x;
        
        if (Math.abs(dx) > 0.0000001) {
            var a = (p2.y - p1.y) / dx;
            var b = p1.y - a * p1.x;
            minY = a * minX + b;
            maxY = a * maxX + b;
        }
        
        if (minY > maxY) {
            var tmp = maxY;
            maxY = minY;
            minY = tmp;
        }
        
        if (maxY > this.position.y + this.size.y)
            maxY = this.position.y + this.size.y;
        
        if (minY < this.position.y)
            minY = this.position.y;
        
        if (minY > maxY)
            return false;
        
        return true;
    }
}

class SplashScreen extends Thingy {
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

const Button_Left = 0;
const Button_Right = 2;
const Button_Middle = 1;

const Key_Up = 38;
const Key_Down = 40;
const Key_Left = 37;
const Key_Right = 39;
const Key_W = 87;
const Key_A = 65;
const Key_S = 83;
const Key_D = 68;
const Key_Space = 32;

class InputStatus {
    constructor () {
        this.Key_Up = false;
        this.Key_Down = false;
        this.Key_Left = false;
        this.Key_Right = false;
        this.Key_W = false;
        this.Key_A = false;
        this.Key_S = false;
        this.Key_D = false;
        this.Key_Space = false;

        this.Button_Left = false;
        this.Button_Right = false;
        this.Button_Middle = false;
        this.Button_Back = false;
        this.Button_Forward = false;
    
        this.MouseLocation = new Point(0,0);
    }
}

/**
 * Sets parameter point to the current mouse position.
 * 
 * @export
 * @param {MouseEvent} ev 
 * @param {ClientRect} clientRect 
 * @param {Point} point 
 */
function calculateMousePosition(ev, clientRect, point) {
    point.x = ev.clientX - clientRect.left + document.documentElement.scrollLeft;
    point.y = ev.clientY - clientRect.top + document.documentElement.scrollTop;
}

class Engine extends Thingy {
    
    /** @param {function():string} cb */
    addDebugItem(cb) {
        this.debugList.push(cb);
    }

    /** @param {function():string} cb
     * @returns {boolean}
    */
    removeDebugItem(cb) {
        let i = this.debugList.indexOf(cb);
        if (i == -1) {
            return false;
        }
        this.debugList.splice(i, 1);
        return true;
    }

    /**
     * Creates an instance of Engine.
     * @param {HTMLCanvasElement} canvas 
     * @param {State} state 
     * @param {boolean} [debug=false] 
     */
    constructor(canvas, state, debug = false) {
        super();
        
        this.fps = 0;
        this.timeToDo = 0;
        this.lastUpdate = 0;
        /** @type {CanvasRenderingContext2D} */
        this.input = new InputStatus();

        this.canvas = canvas;
        this.state = state;
        this.debug = debug;

        this.debugList = [];

        this.context = canvas.getContext('2d');
        // Set up handlers.
        this.canvas.addEventListener('mousedown', this.mouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.mouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
        document.addEventListener('keydown', this.keyDown.bind(this));
        document.addEventListener('keyup', this.keyUp.bind(this));
    }

    /** @param {number} timeStamp */
    updateFps(timeStamp) {
        this.fps = 1/((timeStamp - this.lastUpdate)/1000);
        this.lastUpdate = timeStamp;
    }

    /** @param {State} state */
    setState(state) {
        if (this.state) {
            this.state.doFinish(this);
        }
        this.state = state;
        this.state.doInit(this);
    }

    /** @param {MouseEvent} ev */
    mouseDown(ev) {
        window.focus(); ev.preventDefault(); ev.stopPropagation(); 
        ev.preventDefault();
        switch(ev.button) {
            case Button_Left : this.input.Button_Left = true; break;
            case Button_Right : this.input.Button_Right = true; break;
            case Button_Middle : this.input.Button_Middle = true; break;
        }
    }
    /** @param {MouseEvent} ev */
    mouseUp(ev) {
        window.focus(); ev.preventDefault(); ev.stopPropagation(); 
        switch(ev.button) {
            case Button_Left : this.input.Button_Left = false; break;
            case Button_Right : this.input.Button_Right = false; break;
            case Button_Middle : this.input.Button_Middle = false; break;
        }
    }

    /** @param {MouseEvent} ev */
    mouseMove(ev) {
        calculateMousePosition(ev, this.canvas.getBoundingClientRect(), this.input.MouseLocation);
    }

    /** @param {KeyboardEvent} ev */
    keyDown(ev) {
        window.focus(); ev.preventDefault(); ev.stopPropagation(); 
        switch (ev.keyCode) {
            case Key_Up : this.input.Key_Up = true; break;
            case Key_Down : this.input.Key_Down = true; break;
            case Key_Left : this.input.Key_Left = true; break;
            case Key_Right : this.input.Key_Right = true; break;
            case Key_W : this.input.Key_W = true; break;
            case Key_A : this.input.Key_A = true; break;
            case Key_S : this.input.Key_S = true; break;
            case Key_D : this.input.Key_D = true; break;
            case Key_Space : this.input.Key_Space = true; break;
        }
    }
    
    /** @param {KeyboardEvent} ev */
    keyUp(ev) {
        window.focus(); ev.preventDefault(); ev.stopPropagation(); 
        switch (ev.keyCode) {
            case Key_Up : this.input.Key_Up = false; break;
            case Key_Down : this.input.Key_Down = false; break;
            case Key_Left : this.input.Key_Left = false; break;
            case Key_Right : this.input.Key_Right = false; break;
            case Key_W : this.input.Key_W = false; break;
            case Key_A : this.input.Key_A = false; break;
            case Key_S : this.input.Key_S = false; break;
            case Key_D : this.input.Key_D = false; break;
            case Key_Space : this.input.Key_Space = false; break;
        }
    }

    go() {
        this.setState(this.state); // Inits too.
        requestAnimationFrame(this.cycleRunner.bind(this));
    }

    /** @param {number} timeStamp */
    cycleRunner(timeStamp) {
        this.updateFps(timeStamp);
        let start = new Date();
        this.update(this);
        this.draw(this);
        this.state.doCycle(this);
        if (this.debug) {
            this.drawDebug();
        }
        requestAnimationFrame(this.cycleRunner.bind(this));
        this.timeToDo = new Date().valueOf() - start.valueOf();
    }

    drawDebug() {
        let y = 0;
        const x = 10;
        const yinc = 20;
        const color = 'cyan';
        let c = this.context;

        c.fillStyle = color;
        c.fillText('FPS: ' + this.fps.toPrecision(4).toString(), x, y += yinc);
        //c.fillText('Time: ' + this.timeToDo, x, y += yinc);
        for (let dbg of this.debugList) {
            c.fillText(dbg(), x, y += yinc);
        }
    }
}

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

/*class HUD extends Thingy {

    radgrad : CanvasGradient;
    image : HTMLImageElement;

    constructor(engine: Engine) {
        super();

        this.image = IMAGE_LIST[TUNING.HUD.IMAGE_NUMBER].image;

        /*let ctx : CanvasRenderingContext2D = engine.context;
        let center = new Point(engine.canvas.width/2, engine.canvas.height/2);
        // Some credit to https://stackoverflow.com/a/5476576
        this.radgrad = ctx.createRadialGradient(center.x,center.y,TUNING.WORLD.RADIUS,center.x,center.y,TUNING.WORLD.RADIUS + 5);
        this.radgrad.addColorStop(0, 'rgba(255,0,0,0)');
        this.radgrad.addColorStop(0.8, 'rgba(228,0,0,.9)');
        this.radgrad.addColorStop(1, 'rgba(228,0,0,1)');
        *//*
    }

    draw(engine : Engine) {

        engine.context.drawImage(this.image,0,0);

        /*engine.context.fillStyle = this.radgrad;
        engine.context.fillRect(0,0,engine.canvas.width-1,engine.canvas.height-1);
        *//*
    }
}*/

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
        let supportsPassive = false;
        try {
            var opts = Object.defineProperty({}, 'passive', {
                get: function() {
                    supportsPassive = true;
                }
            });
            window.addEventListener("test", null, opts);
        } catch (e) {}
        engine.canvas.removeEventListener('wheel',this.mouseWheel.bind(this),(supportsPassive ? { passive: true } : false));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi8uLi9KYW0vSW1hZ2VzTG9hZGVyLmpzIiwiLi4vLi4vSmFtL1RoaW5neS5qcyIsIi4uLy4uL0phbS9Qb2ludC5qcyIsIi4uLy4uL0phbS9Sb3RhdGlvbi5qcyIsIi4uLy4uL0phbS9TcHJpdGUuanMiLCIuLi8uLi9KYW0vSW1hZ2VTcHJpdGUuanMiLCIuLi8uLi9KYW0vU291bmRFeHRlbnNpb24uanMiLCIuLi8uLi9KYW0vU291bmRNdWx0aUNoYW5uZWwuanMiLCIuLi8uLi9KYW0vU291bmRMb29waW5nLmpzIiwiLi4vLi4vSmFtL1N0YXRlLmpzIiwiLi4vLi4vSmFtL0JhY2tncm91bmQuanMiLCIuLi8uLi9KYW0vQ29sb3JCYWNrZ3JvdW5kLmpzIiwiLi4vLi4vSmFtL1JlY3RhbmdsZS5qcyIsIi4uLy4uL0phbS9TcGxhc2hTY3JlZW4uanMiLCIuLi8uLi9KYW0vTW91c2UuanMiLCIuLi8uLi9KYW0vS2V5Ym9hcmQuanMiLCIuLi8uLi9KYW0vSW5wdXQuanMiLCIuLi8uLi9KYW0vRW5naW5lLmpzIiwiaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gU2V0IGF1dG9tYWdpY2FsbHkgYmFzZWQgb24gc2V0dXBMb2FkSW1hZ2VzLlxyXG4vLyBCYXNlZCBvbiBjb2RlIGxlYXJuZWQgaW4gaHR0cHM6Ly93d3cudWRlbXkuY29tL2hvdy10by1wcm9ncmFtLWdhbWVzLyAtIHNlcmlvdXNseS5cclxuXHJcbmV4cG9ydCBjbGFzcyBJbWFnZXNMb2FkZXJJdGVtIHtcclxuICAgIC8qKiBAcGFyYW0ge3N0cmluZ30gZmlsZU5hbWUgKi9cclxuICAgIGNvbnN0cnVjdG9yKGZpbGVOYW1lKSB7XHJcbiAgICAgICAgdGhpcy5maWxlTmFtZSA9IGZpbGVOYW1lO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEltYWdlc0xvYWRlciB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7QXJyYXk8SW1hZ2VzTG9hZGVySXRlbT59IGltYWdlTGlzdCBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihpbWFnZUxpc3QsIHBhdGgpIHtcclxuICAgICAgICB0aGlzLmltYWdlTGlzdCA9IGltYWdlTGlzdDtcclxuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gICAgICAgIHRoaXMuX3BpY3NUb0xvYWQgPSAwO1xyXG4gICAgICAgIHRoaXMub25Eb25lID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBfaW1hZ2VPbkxvYWQoKSB7XHJcbiAgICAgICAgdGhpcy5fcGljc1RvTG9hZC0tO1xyXG4gICAgICAgIGlmICh0aGlzLl9waWNzVG9Mb2FkID09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5vbkRvbmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7SW1hZ2VzTG9hZGVySXRlbX0gbGlzdEl0ZW0gKi9cclxuICAgIF9iZWdpbkxvYWRpbmdJbWFnZShsaXN0SXRlbSkge1xyXG4gICAgICAgIGxpc3RJdGVtLmltYWdlLm9ubG9hZCA9IHRoaXMuX2ltYWdlT25Mb2FkLmJpbmQodGhpcyk7XHJcbiAgICAgICAgbGlzdEl0ZW0uaW1hZ2Uuc3JjID0gdGhpcy5wYXRoICsgbGlzdEl0ZW0uZmlsZU5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgYmVnaW5Mb2FkaW5nKCkge1xyXG4gICAgICAgIHRoaXMuX3BpY3NUb0xvYWQgPSB0aGlzLmltYWdlTGlzdC5sZW5ndGg7XHJcbiAgICAgICAgZm9yIChsZXQgbGlzdEl0ZW0gb2YgdGhpcy5pbWFnZUxpc3QpIHtcclxuICAgICAgICAgICAgdGhpcy5fYmVnaW5Mb2FkaW5nSW1hZ2UobGlzdEl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZUxpc3QubGVuZ3RoO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFRoaW5neSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgLyoqIEB0eXBlIHtBcnJheTxUaGluZ3k+fSAqL1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtUaGluZ3l9IHRoaW5neSAqL1xyXG4gICAgYWRkQ2hpbGQodGhpbmd5KSB7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKHRoaW5neSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7VGhpbmd5fSB0aGluZ3kgXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICovXHJcbiAgICByZW1vdmVDaGlsZCh0aGluZ3kpIHtcclxuICAgICAgICBsZXQgaSA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZih0aGluZ3kpO1xyXG4gICAgICAgIGlmIChpID09IC0xKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJDaGlsZHJlbigpIHtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZSgwKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtFbmdpbmV9IGVuZ2luZSAqL1xyXG4gICAgdXBkYXRlKGVuZ2luZSkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ2hpbGRyZW4oZW5naW5lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtFbmdpbmV9IGVuZ2luZSAqL1xyXG4gICAgdXBkYXRlQ2hpbGRyZW4oZW5naW5lKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0udXBkYXRlKGVuZ2luZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge0VuZ2luZX0gZW5naW5lICovXHJcbiAgICBkcmF3KGVuZ2luZSkge1xyXG4gICAgICAgIHRoaXMuZHJhd0NoaWxkcmVuKGVuZ2luZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7RW5naW5lfSBlbmdpbmUgKi9cclxuICAgIGRyYXdDaGlsZHJlbihlbmdpbmUpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5kcmF3KGVuZ2luZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFBvaW50IHtcclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5KSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7UG9pbnR9ICovXHJcbiAgICBjb3B5KCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy54LCB0aGlzLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENvdXJ0ZXN5IG9mIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjU5NTAyXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtQb2ludH0gb3JpZ2luIFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIFxyXG4gICAgICovXHJcbiAgICByb3RhdGVBcm91bmRCeShvcmlnaW4sIGFuZ2xlKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZSk7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKGFuZ2xlKTtcclxuXHJcbiAgICAgICAgLy8gdHJhbnNsYXRlIHBvaW50IGJhY2sgdG8gb3JpZ2luOlxyXG4gICAgICAgIHRoaXMueCAtPSBvcmlnaW4ueDtcclxuICAgICAgICB0aGlzLnkgLT0gb3JpZ2luLnk7XHJcblxyXG4gICAgICAgIC8vIHJvdGF0ZSBwb2ludFxyXG4gICAgICAgIGNvbnN0IHhuZXcgPSB0aGlzLnggKiBjIC0gdGhpcy55ICogcztcclxuICAgICAgICBjb25zdCB5bmV3ID0gdGhpcy54ICogcyArIHRoaXMueSAqIGM7XHJcblxyXG4gICAgICAgIC8vIHRyYW5zbGF0ZSBwb2ludCBiYWNrOlxyXG4gICAgICAgIHRoaXMueCA9IHhuZXcgKyBvcmlnaW4ueDtcclxuICAgICAgICB0aGlzLnkgPSB5bmV3ICsgb3JpZ2luLnk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7UG9pbnR9IHJoc1xyXG4gICAgICogQHJldHVybnMge1BvaW50fVxyXG4gICAgICovXHJcbiAgICBwbHVzKHJocykge1xyXG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy54ICsgcmhzLngsIHRoaXMueSArIHJocy55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtudW1iZXJ9IHJoc1xyXG4gICAgICogQHJldHVybnMge1BvaW50fVxyXG4gICAgICovXHJcbiAgICBwbHVzQW1vdW50KHJocykge1xyXG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy54ICsgcmhzLCB0aGlzLnkgKyByaHMpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogQHBhcmFtIHtQb2ludH0gcmhzXHJcbiAgICAgKiBAcmV0dXJucyB7UG9pbnR9XHJcbiAgICAgKi9cclxuICAgIHRpbWVzKHJocykge1xyXG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy54ICogcmhzLngsIHRoaXMueSAqIHJocy55KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIEBwYXJhbSB7bnVtYmVyfSByaHNcclxuICAgICAqIEByZXR1cm5zIHtQb2ludH1cclxuICAgICAqL1xyXG4gICAgdGltZXNBbW91bnQocmhzKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnggKiByaHMsIHRoaXMueSAqIHJocyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7UG9pbnR9IHJoc1xyXG4gICAgICogQHJldHVybnMge1BvaW50fVxyXG4gICAgICovXHJcbiAgICBtaW51cyhyaHMpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCAtIHJocy54LCB0aGlzLnkgLSByaHMueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7bnVtYmVyfSByaHNcclxuICAgICAqIEByZXR1cm5zIHtQb2ludH1cclxuICAgICAqL1xyXG4gICAgbWludXNBbW91bnQocmhzKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnggLSByaHMsIHRoaXMueSAtIHJocyk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgUm90YXRpb24ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIFJvdGF0aW9uLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFtb3VudCBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZCBcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoYW1vdW50LCBzcGVlZCkge1xyXG4gICAgICAgIHRoaXMuYW1vdW50ID0gYW1vdW50O1xyXG4gICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFRoaW5neSB9IGZyb20gJy4vVGhpbmd5LmpzJztcclxuaW1wb3J0IHsgUG9pbnQgfSBmcm9tICcuL1BvaW50LmpzJztcclxuaW1wb3J0IHsgUm90YXRpb24gfSBmcm9tICcuL1JvdGF0aW9uLmpzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBTcHJpdGUgZXh0ZW5kcyBUaGluZ3kge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBTcHJpdGUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnNwZWVkID0gbmV3IFBvaW50KDAsMCk7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbiA9IG5ldyBSb3RhdGlvbigwLDApO1xyXG4gICAgICAgIHRoaXMuY2VudGVyID0gbmV3IFBvaW50KDAsMCk7XHJcbiAgICAgICAgdGhpcy5zY2FsZSA9IG5ldyBQb2ludCgxLjAsMS4wKTtcclxuICAgICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgUG9pbnQoeCx5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtFbmdpbmV9IGVuZ2luZSAqL1xyXG4gICAgdXBkYXRlKGVuZ2luZSkge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueCArPSB0aGlzLnNwZWVkLnggLyBlbmdpbmUuZnBzO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueSArPSB0aGlzLnNwZWVkLnkgLyBlbmdpbmUuZnBzO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24uYW1vdW50ICs9IHRoaXMucm90YXRpb24uc3BlZWQgLyBlbmdpbmUuZnBzO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTm93KGVuZ2luZSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDaGlsZHJlbihlbmdpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge0VuZ2luZX0gZW5naW5lICovXHJcbiAgICBkcmF3KGVuZ2luZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmVuYWJsZWQpIHtcclxuICAgICAgICAgICAgbGV0IGMgPSBlbmdpbmUuY29udGV4dDtcclxuICAgICAgICAgICAgYy5zYXZlKCk7XHJcbiAgICAgICAgICAgIGMudHJhbnNsYXRlKHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55KTtcclxuICAgICAgICAgICAgYy5yb3RhdGUodGhpcy5yb3RhdGlvbi5hbW91bnQpO1xyXG4gICAgICAgICAgICBjLnNjYWxlKHRoaXMuc2NhbGUueCwgdGhpcy5zY2FsZS55KTtcclxuICAgICAgICAgICAgdGhpcy5kcmF3Tm93KGVuZ2luZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0NoaWxkcmVuKGVuZ2luZSk7XHJcbiAgICAgICAgICAgIGMucmVzdG9yZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG5cclxuICAgIC8qKiBAcGFyYW0ge0VuZ2luZX0gZW5naW5lICovXHJcbiAgICBkcmF3Tm93KGVuZ2luZSkge31cclxuXHJcbiAgICAvKiogQHBhcmFtIHtFbmdpbmV9IGVuZ2luZSAqL1xyXG4gICAgdXBkYXRlTm93KGVuZ2luZSkge31cclxuXHJcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXHJcbn0iLCJpbXBvcnQgeyBTcHJpdGUgfSBmcm9tICcuL1Nwcml0ZS5qcyc7XHJcbmltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi9Qb2ludC5qcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgSW1hZ2VTcHJpdGUgZXh0ZW5kcyBTcHJpdGUge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBJbWFnZVNwcml0ZS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxJbWFnZUVsZW1lbnR9IGltYWdlIFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCBpbWFnZSkge1xyXG4gICAgICAgIHN1cGVyKHgseSk7XHJcbiAgICAgICAgLyoqIEB0eXBlIHtIVE1MQ2FudmFzRWxlbWVudH0gKi9cclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgdGhpcy5zaXplID0gbmV3IFBvaW50KGltYWdlLndpZHRoLCBpbWFnZS5oZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gaW1hZ2Uud2lkdGg7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5kcmF3SW1hZ2UoaW1hZ2UsIDAsMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7RW5naW5lfSBlbmdpbmUgKi9cclxuICAgIGRyYXdOb3coZW5naW5lKSB7XHJcbiAgICAgICAgZW5naW5lLmNvbnRleHQuZHJhd0ltYWdlKHRoaXMuY2FudmFzLCB0aGlzLmNlbnRlci54LCB0aGlzLmNlbnRlci55KTtcclxuICAgIH1cclxuXHJcbiAgICBjYWxjdWxhdGVDZW50ZXIoKSB7XHJcbiAgICAgICAgdGhpcy5jZW50ZXIueCA9IHRoaXMuc2l6ZS54ICogLTAuNTtcclxuICAgICAgICB0aGlzLmNlbnRlci55ID0gdGhpcy5zaXplLnkgKiAtMC41O1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNvbnN0IFNvdW5kRXh0ZW5zaW9uID0gc2V0Rm9ybWF0KCk7XG5cbi8qKiBAcmV0dXJucyB7c3RyaW5nfSAqL1xuZnVuY3Rpb24gc2V0Rm9ybWF0KCkge1xuICAgIHJldHVybiBuZXcgQXVkaW8oKS5jYW5QbGF5VHlwZSgnYXVkaW8vbXAzJykgPyAnLm1wMycgOiAnLm9nZyc7XG59XG4iLCJpbXBvcnQgeyBTb3VuZEV4dGVuc2lvbiB9IGZyb20gJy4vU291bmRFeHRlbnNpb24uanMnO1xyXG5cclxuLy8gQ29uY2VwdCBmcm9tIEhhbmRzLU9uIEludHJvIHRvIEdhbWUgUHJvZ3JhbW1pbmctdjUgcDM3OC5cclxuXHJcbmV4cG9ydCBjbGFzcyBTb3VuZE11bHRpQ2hhbm5lbCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIFNvdW5kTXVsdGlDaGFubmVsLlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVuYW1lIFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtjaGFubmVsQ291bnQ9Ml0gXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGZpbGVuYW1lLCBjaGFubmVsQ291bnQgPSAyKSB7XHJcbiAgICAgICAgdGhpcy5fZmlsZW5hbWUgPSBmaWxlbmFtZTtcclxuICAgICAgICB0aGlzLl9jaGFubmVsQ291bnQgPSBjaGFubmVsQ291bnQ7XHJcbiAgICAgICAgdGhpcy5fY2hhbm5lbHMgPSBbXTtcclxuICAgICAgICB0aGlzLl9jdXJyZW50Q2hhbm5lbCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFubmVsQ291bnQ7ICsraSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jaGFubmVscy5wdXNoKG5ldyBBdWRpbyhmaWxlbmFtZStTb3VuZEV4dGVuc2lvbikpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwbGF5KCkge1xyXG4gICAgICAgIHRoaXMuX2NoYW5uZWxzW3RoaXMuX2N1cnJlbnRDaGFubmVsXS5jdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgdGhpcy5fY2hhbm5lbHNbdGhpcy5fY3VycmVudENoYW5uZWxdLnBsYXkoKTtcclxuICAgICAgICBpZiAoKyt0aGlzLl9jdXJyZW50Q2hhbm5lbCA+PSB0aGlzLl9jaGFubmVsQ291bnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VycmVudENoYW5uZWwgPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IFNvdW5kRXh0ZW5zaW9uIH0gZnJvbSAnLi9Tb3VuZEV4dGVuc2lvbi5qcyc7XHJcblxyXG4vLyBDb25jZXB0IGZyb20gSGFuZHMtT24gSW50cm8gdG8gR2FtZSBQcm9ncmFtbWluZy12NSBwMzg2LlxyXG5leHBvcnQgY2xhc3MgU291bmRMb29waW5nIHtcclxuICAgIFxyXG4gICAgLyoqIEBwYXJhbSB7c3RyaW5nfSBmaWxlbmFtZSAqL1xyXG4gICAgY29uc3RydWN0b3IoZmlsZW5hbWUpIHtcclxuICAgICAgICB0aGlzLl9jaGFubmVsID0gbmV3IEF1ZGlvKGZpbGVuYW1lK1NvdW5kRXh0ZW5zaW9uKTtcclxuICAgICAgICB0aGlzLl9jaGFubmVsLmxvb3AgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2Jvb2xlYW59IGlzUGxheWluZyAqL1xyXG4gICAgc2V0SXNQbGF5aW5nKGlzUGxheWluZykge1xyXG4gICAgICAgIGlmIChpc1BsYXlpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2hhbm5lbC5wbGF5KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fY2hhbm5lbC5wYXVzZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtudW1iZXJ9IHZvbHVtZSAqL1xyXG4gICAgc2V0Vm9sdW1lKHZvbHVtZSkge1xyXG4gICAgICAgIHRoaXMuX2NoYW5uZWwudm9sdW1lID0gdm9sdW1lO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFN0YXRlIHtcclxuICAgIFxyXG4gICAgc3RhdGljIGdldCBJTklUKCkge3JldHVybiAgMDsgfVxyXG4gICAgc3RhdGljIGdldCBDWUNMRSgpIHtyZXR1cm4gIDE7IH1cclxuICAgIHN0YXRpYyBnZXQgRklOSVNIKCkge3JldHVybiAgMjsgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBTdGF0ZS5JTklUO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogQHBhcmFtIHtFbmdpbmV9IGVuZ2luZSAqL1xyXG4gICAgZG9Jbml0KGVuZ2luZSkge1xyXG4gICAgICAgIHRoaXMuaW5pdChlbmdpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge0VuZ2luZX0gZW5naW5lICovXHJcbiAgICBkb0N5Y2xlKGVuZ2luZSkge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09IFN0YXRlLkNZQ0xFKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3ljbGUoZW5naW5lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7RW5naW5lfSBlbmdpbmUgKi9cclxuICAgIGRvRmluaXNoKGVuZ2luZSkge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09IFN0YXRlLkNZQ0xFKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBTdGF0ZS5GSU5JU0g7XHJcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKGVuZ2luZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXREb25lKCkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBTdGF0ZS5DWUNMRTtcclxuICAgIH1cclxuXHJcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG5cclxuICAgIC8qKiBAcGFyYW0ge0VuZ2luZX0gZW5naW5lICovXHJcbiAgICBpbml0KGVuZ2luZSkgeyB0aGlzLmluaXREb25lKCk7IH1cclxuICAgIC8qKiBAcGFyYW0ge0VuZ2luZX0gZW5naW5lICovXHJcbiAgICBjeWNsZShlbmdpbmUpIHt9XHJcbiAgICBcclxuICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuXHJcbiAgICAvKiogQHBhcmFtIHtFbmdpbmV9IGVuZ2luZSAqL1xyXG4gICAgZmluaXNoKGVuZ2luZSkgeyBlbmdpbmUuY2xlYXJDaGlsZHJlbigpOyB9XHJcbn0iLCJpbXBvcnQgeyBUaGluZ3kgfSBmcm9tICcuL1RoaW5neS5qcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgQmFja2dyb3VuZCBleHRlbmRzIFRoaW5neSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQmFja2dyb3VuZCB9IGZyb20gJy4vQmFja2dyb3VuZC5qcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sb3JCYWNrZ3JvdW5kIGV4dGVuZHMgQmFja2dyb3VuZCB7XHJcbiAgICAvKiogQHBhcmFtIHtzdHJpbmd9IHN0eWxlICovXHJcbiAgICBjb25zdHJ1Y3RvcihzdHlsZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5zdHlsZSA9IHN0eWxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge0VuZ2luZX0gZW5naW5lICovXHJcbiAgICBkcmF3KGVuZ2luZSkge1xyXG4gICAgICAgIGVuZ2luZS5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuc3R5bGU7XHJcbiAgICAgICAgZW5naW5lLmNvbnRleHQuZmlsbFJlY3QoMCwwLCBlbmdpbmUuY2FudmFzLndpZHRoLGVuZ2luZS5jYW52YXMuaGVpZ2h0KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi9Qb2ludC5qcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVjdGFuZ2xlIHtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBQb2ludCh4LHkpO1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IG5ldyBQb2ludCh3aWR0aCwgaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7UG9pbnR9IHAxIFxyXG4gICAgICogQHBhcmFtIHtQb2ludH0gcDIgXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gXHJcbiAgICAgKi9cclxuICAgIGludGVyc2VjdHNMaW5lKHAxLCBwMikge1xyXG4gICAgICAgIC8vIFBhcnRzIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEwMDE2NSB3aGljaCBsZWQgdG8gaHR0cHM6Ly9qc2ZpZGRsZS5uZXQvNzdlZWovMi8gdGhhbmtzIHRvIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vdXNlcnMvMTM4Mjk0OS91cnJha2FcclxuICAgICAgICBsZXQgbWluWCA9IHAxLng7XHJcbiAgICAgICAgbGV0IG1heFggPSBwMi54O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChwMS54ID4gcDIueCkge1xyXG4gICAgICAgICAgICBtaW5YID0gcDIueDtcclxuICAgICAgICAgICAgbWF4WCA9IHAxLng7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChtYXhYID4gdGhpcy5wb3NpdGlvbi54ICsgdGhpcy5zaXplLngpXHJcbiAgICAgICAgICAgIG1heFggPSB0aGlzLnBvc2l0aW9uLnggKyB0aGlzLnNpemUueDtcclxuICAgICAgICBcclxuICAgICAgICBpZiAobWluWCA8IHRoaXMucG9zaXRpb24ueClcclxuICAgICAgICAgICAgbWluWCA9IHRoaXMucG9zaXRpb24ueDtcclxuICAgICAgICBcclxuICAgICAgICBpZiAobWluWCA+IG1heFgpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgbWluWSA9IHAxLnk7XHJcbiAgICAgICAgdmFyIG1heFkgPSBwMi55O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBkeCA9IHAyLnggLSBwMS54O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChNYXRoLmFicyhkeCkgPiAwLjAwMDAwMDEpIHtcclxuICAgICAgICAgICAgdmFyIGEgPSAocDIueSAtIHAxLnkpIC8gZHg7XHJcbiAgICAgICAgICAgIHZhciBiID0gcDEueSAtIGEgKiBwMS54O1xyXG4gICAgICAgICAgICBtaW5ZID0gYSAqIG1pblggKyBiO1xyXG4gICAgICAgICAgICBtYXhZID0gYSAqIG1heFggKyBiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAobWluWSA+IG1heFkpIHtcclxuICAgICAgICAgICAgdmFyIHRtcCA9IG1heFk7XHJcbiAgICAgICAgICAgIG1heFkgPSBtaW5ZO1xyXG4gICAgICAgICAgICBtaW5ZID0gdG1wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAobWF4WSA+IHRoaXMucG9zaXRpb24ueSArIHRoaXMuc2l6ZS55KVxyXG4gICAgICAgICAgICBtYXhZID0gdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5zaXplLnk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKG1pblkgPCB0aGlzLnBvc2l0aW9uLnkpXHJcbiAgICAgICAgICAgIG1pblkgPSB0aGlzLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKG1pblkgPiBtYXhZKVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgVGhpbmd5IH0gZnJvbSAnLi9UaGluZ3kuanMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNwbGFzaFNjcmVlbiBleHRlbmRzIFRoaW5neSB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgU3BsYXNoU2NyZWVuLlxyXG4gICAgICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBpbWFnZSBcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoaW1hZ2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UgPSBpbWFnZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtFbmdpbmV9IGVuZ2luZSAqL1xyXG4gICAgZHJhdyhlbmdpbmUpIHtcclxuICAgICAgICBlbmdpbmUuY29udGV4dC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgMCwgMCk7XHJcbiAgICAgICAgdGhpcy5kcmF3Q2hpbGRyZW4oZW5naW5lKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjb25zdCBCdXR0b25fTm9uZV9GbGFnID0gMDtcbmV4cG9ydCBjb25zdCBCdXR0b25fTGVmdF9GbGFnID0gMTtcbmV4cG9ydCBjb25zdCBCdXR0b25fUmlnaHRfRmxhZyA9IDI7XG5leHBvcnQgY29uc3QgQnV0dG9uX01pZGRsZV9GbGFnID0gNDtcbmV4cG9ydCBjb25zdCBCdXR0b25fQmFja19GbGFnID0gODtcbmV4cG9ydCBjb25zdCBCdXR0b25fRm9yd2FyZF9GbGFnID0gMTY7XG5leHBvcnQgY29uc3QgQnV0dG9uX0xlZnQgPSAwO1xuZXhwb3J0IGNvbnN0IEJ1dHRvbl9SaWdodCA9IDI7XG5leHBvcnQgY29uc3QgQnV0dG9uX01pZGRsZSA9IDE7XG5leHBvcnQgY29uc3QgQnV0dG9uX0JhY2sgPSAzO1xuZXhwb3J0IGNvbnN0IEJ1dHRvbl9Gb3J3YXJkID0gNDsiLCJleHBvcnQgY29uc3QgS2V5X1VwID0gMzg7XG5leHBvcnQgY29uc3QgS2V5X0Rvd24gPSA0MDtcbmV4cG9ydCBjb25zdCBLZXlfTGVmdCA9IDM3O1xuZXhwb3J0IGNvbnN0IEtleV9SaWdodCA9IDM5O1xuZXhwb3J0IGNvbnN0IEtleV9XID0gODc7XG5leHBvcnQgY29uc3QgS2V5X0EgPSA2NTtcbmV4cG9ydCBjb25zdCBLZXlfUyA9IDgzO1xuZXhwb3J0IGNvbnN0IEtleV9EID0gNjg7XG5leHBvcnQgY29uc3QgS2V5X1NwYWNlID0gMzI7IiwiaW1wb3J0ICogYXMgTW91c2UgZnJvbSAnLi9Nb3VzZS5qcyc7XHJcbmltcG9ydCAqIGFzIEtleWJvYXJkIGZyb20gJy4vS2V5Ym9hcmQuanMnO1xyXG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vUG9pbnQuanMnO1xyXG5cclxuY2xhc3MgSW5wdXRTdGF0dXMge1xyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHRoaXMuS2V5X1VwID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5LZXlfRG93biA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuS2V5X0xlZnQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLktleV9SaWdodCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuS2V5X1cgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLktleV9BID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5LZXlfUyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuS2V5X0QgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLktleV9TcGFjZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLkJ1dHRvbl9MZWZ0ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5CdXR0b25fUmlnaHQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLkJ1dHRvbl9NaWRkbGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLkJ1dHRvbl9CYWNrID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5CdXR0b25fRm9yd2FyZCA9IGZhbHNlO1xyXG4gICAgXHJcbiAgICAgICAgdGhpcy5Nb3VzZUxvY2F0aW9uID0gbmV3IFBvaW50KDAsMCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXRzIHBhcmFtZXRlciBwb2ludCB0byB0aGUgY3VycmVudCBtb3VzZSBwb3NpdGlvbi5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldiBcclxuICogQHBhcmFtIHtDbGllbnRSZWN0fSBjbGllbnRSZWN0IFxyXG4gKiBAcGFyYW0ge1BvaW50fSBwb2ludCBcclxuICovXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZU1vdXNlUG9zaXRpb24oZXYsIGNsaWVudFJlY3QsIHBvaW50KSB7XHJcbiAgICBwb2ludC54ID0gZXYuY2xpZW50WCAtIGNsaWVudFJlY3QubGVmdCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xyXG4gICAgcG9pbnQueSA9IGV2LmNsaWVudFkgLSBjbGllbnRSZWN0LnRvcCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XHJcbn1cclxuXHJcbmV4cG9ydCB7IElucHV0U3RhdHVzLCBjYWxjdWxhdGVNb3VzZVBvc2l0aW9uLCBNb3VzZSwgS2V5Ym9hcmQgfTsiLCJpbXBvcnQgeyBUaGluZ3kgfSBmcm9tICcuL1RoaW5neS5qcyc7XHJcbmltcG9ydCB7IE1vdXNlLCBLZXlib2FyZCwgSW5wdXRTdGF0dXMsIGNhbGN1bGF0ZU1vdXNlUG9zaXRpb24gfSBmcm9tICcuL0lucHV0LmpzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBFbmdpbmUgZXh0ZW5kcyBUaGluZ3kge1xyXG4gICAgXHJcbiAgICAvKiogQHBhcmFtIHtmdW5jdGlvbigpOnN0cmluZ30gY2IgKi9cclxuICAgIGFkZERlYnVnSXRlbShjYikge1xyXG4gICAgICAgIHRoaXMuZGVidWdMaXN0LnB1c2goY2IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2Z1bmN0aW9uKCk6c3RyaW5nfSBjYlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAqL1xyXG4gICAgcmVtb3ZlRGVidWdJdGVtKGNiKSB7XHJcbiAgICAgICAgbGV0IGkgPSB0aGlzLmRlYnVnTGlzdC5pbmRleE9mKGNiKTtcclxuICAgICAgICBpZiAoaSA9PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZGVidWdMaXN0LnNwbGljZShpLCAxKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgRW5naW5lLlxyXG4gICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudH0gY2FudmFzIFxyXG4gICAgICogQHBhcmFtIHtTdGF0ZX0gc3RhdGUgXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtkZWJ1Zz1mYWxzZV0gXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGNhbnZhcywgc3RhdGUsIGRlYnVnID0gZmFsc2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZnBzID0gMDtcclxuICAgICAgICB0aGlzLnRpbWVUb0RvID0gMDtcclxuICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSAwO1xyXG4gICAgICAgIC8qKiBAdHlwZSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSAqL1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBuZXcgSW5wdXRTdGF0dXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xyXG4gICAgICAgIHRoaXMuZGVidWcgPSBkZWJ1ZztcclxuXHJcbiAgICAgICAgdGhpcy5kZWJ1Z0xpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgLy8gU2V0IHVwIGhhbmRsZXJzLlxyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMubW91c2VEb3duLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm1vdXNlVXAuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5tb3VzZU1vdmUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMua2V5RG93bi5iaW5kKHRoaXMpKTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMua2V5VXAuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7bnVtYmVyfSB0aW1lU3RhbXAgKi9cclxuICAgIHVwZGF0ZUZwcyh0aW1lU3RhbXApIHtcclxuICAgICAgICB0aGlzLmZwcyA9IDEvKCh0aW1lU3RhbXAgLSB0aGlzLmxhc3RVcGRhdGUpLzEwMDApO1xyXG4gICAgICAgIHRoaXMubGFzdFVwZGF0ZSA9IHRpbWVTdGFtcDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtTdGF0ZX0gc3RhdGUgKi9cclxuICAgIHNldFN0YXRlKHN0YXRlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5kb0ZpbmlzaCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xyXG4gICAgICAgIHRoaXMuc3RhdGUuZG9Jbml0KHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ICovXHJcbiAgICBtb3VzZURvd24oZXYpIHtcclxuICAgICAgICB3aW5kb3cuZm9jdXMoKTsgZXYucHJldmVudERlZmF1bHQoKTsgZXYuc3RvcFByb3BhZ2F0aW9uKCk7IFxyXG4gICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgc3dpdGNoKGV2LmJ1dHRvbikge1xyXG4gICAgICAgICAgICBjYXNlIE1vdXNlLkJ1dHRvbl9MZWZ0IDogdGhpcy5pbnB1dC5CdXR0b25fTGVmdCA9IHRydWU7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIE1vdXNlLkJ1dHRvbl9SaWdodCA6IHRoaXMuaW5wdXQuQnV0dG9uX1JpZ2h0ID0gdHJ1ZTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgTW91c2UuQnV0dG9uX01pZGRsZSA6IHRoaXMuaW5wdXQuQnV0dG9uX01pZGRsZSA9IHRydWU7IGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ICovXHJcbiAgICBtb3VzZVVwKGV2KSB7XHJcbiAgICAgICAgd2luZG93LmZvY3VzKCk7IGV2LnByZXZlbnREZWZhdWx0KCk7IGV2LnN0b3BQcm9wYWdhdGlvbigpOyBcclxuICAgICAgICBzd2l0Y2goZXYuYnV0dG9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgTW91c2UuQnV0dG9uX0xlZnQgOiB0aGlzLmlucHV0LkJ1dHRvbl9MZWZ0ID0gZmFsc2U7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIE1vdXNlLkJ1dHRvbl9SaWdodCA6IHRoaXMuaW5wdXQuQnV0dG9uX1JpZ2h0ID0gZmFsc2U7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIE1vdXNlLkJ1dHRvbl9NaWRkbGUgOiB0aGlzLmlucHV0LkJ1dHRvbl9NaWRkbGUgPSBmYWxzZTsgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ICovXHJcbiAgICBtb3VzZU1vdmUoZXYpIHtcclxuICAgICAgICBjYWxjdWxhdGVNb3VzZVBvc2l0aW9uKGV2LCB0aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgdGhpcy5pbnB1dC5Nb3VzZUxvY2F0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldiAqL1xyXG4gICAga2V5RG93bihldikge1xyXG4gICAgICAgIHdpbmRvdy5mb2N1cygpOyBldi5wcmV2ZW50RGVmYXVsdCgpOyBldi5zdG9wUHJvcGFnYXRpb24oKTsgXHJcbiAgICAgICAgc3dpdGNoIChldi5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgS2V5Ym9hcmQuS2V5X1VwIDogdGhpcy5pbnB1dC5LZXlfVXAgPSB0cnVlOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBLZXlib2FyZC5LZXlfRG93biA6IHRoaXMuaW5wdXQuS2V5X0Rvd24gPSB0cnVlOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBLZXlib2FyZC5LZXlfTGVmdCA6IHRoaXMuaW5wdXQuS2V5X0xlZnQgPSB0cnVlOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBLZXlib2FyZC5LZXlfUmlnaHQgOiB0aGlzLmlucHV0LktleV9SaWdodCA9IHRydWU7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEtleWJvYXJkLktleV9XIDogdGhpcy5pbnB1dC5LZXlfVyA9IHRydWU7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEtleWJvYXJkLktleV9BIDogdGhpcy5pbnB1dC5LZXlfQSA9IHRydWU7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEtleWJvYXJkLktleV9TIDogdGhpcy5pbnB1dC5LZXlfUyA9IHRydWU7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEtleWJvYXJkLktleV9EIDogdGhpcy5pbnB1dC5LZXlfRCA9IHRydWU7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEtleWJvYXJkLktleV9TcGFjZSA6IHRoaXMuaW5wdXQuS2V5X1NwYWNlID0gdHJ1ZTsgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldiAqL1xyXG4gICAga2V5VXAoZXYpIHtcclxuICAgICAgICB3aW5kb3cuZm9jdXMoKTsgZXYucHJldmVudERlZmF1bHQoKTsgZXYuc3RvcFByb3BhZ2F0aW9uKCk7IFxyXG4gICAgICAgIHN3aXRjaCAoZXYua2V5Q29kZSkge1xyXG4gICAgICAgICAgICBjYXNlIEtleWJvYXJkLktleV9VcCA6IHRoaXMuaW5wdXQuS2V5X1VwID0gZmFsc2U7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEtleWJvYXJkLktleV9Eb3duIDogdGhpcy5pbnB1dC5LZXlfRG93biA9IGZhbHNlOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBLZXlib2FyZC5LZXlfTGVmdCA6IHRoaXMuaW5wdXQuS2V5X0xlZnQgPSBmYWxzZTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgS2V5Ym9hcmQuS2V5X1JpZ2h0IDogdGhpcy5pbnB1dC5LZXlfUmlnaHQgPSBmYWxzZTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgS2V5Ym9hcmQuS2V5X1cgOiB0aGlzLmlucHV0LktleV9XID0gZmFsc2U7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEtleWJvYXJkLktleV9BIDogdGhpcy5pbnB1dC5LZXlfQSA9IGZhbHNlOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBLZXlib2FyZC5LZXlfUyA6IHRoaXMuaW5wdXQuS2V5X1MgPSBmYWxzZTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgS2V5Ym9hcmQuS2V5X0QgOiB0aGlzLmlucHV0LktleV9EID0gZmFsc2U7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEtleWJvYXJkLktleV9TcGFjZSA6IHRoaXMuaW5wdXQuS2V5X1NwYWNlID0gZmFsc2U7IGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnbygpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUpOyAvLyBJbml0cyB0b28uXHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuY3ljbGVSdW5uZXIuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7bnVtYmVyfSB0aW1lU3RhbXAgKi9cclxuICAgIGN5Y2xlUnVubmVyKHRpbWVTdGFtcCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlRnBzKHRpbWVTdGFtcCk7XHJcbiAgICAgICAgbGV0IHN0YXJ0ID0gbmV3IERhdGUoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSh0aGlzKTtcclxuICAgICAgICB0aGlzLmRyYXcodGhpcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5kb0N5Y2xlKHRoaXMpO1xyXG4gICAgICAgIGlmICh0aGlzLmRlYnVnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0RlYnVnKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmN5Y2xlUnVubmVyLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMudGltZVRvRG8gPSBuZXcgRGF0ZSgpLnZhbHVlT2YoKSAtIHN0YXJ0LnZhbHVlT2YoKTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3RGVidWcoKSB7XHJcbiAgICAgICAgbGV0IHkgPSAwO1xyXG4gICAgICAgIGNvbnN0IHggPSAxMDtcclxuICAgICAgICBjb25zdCB5aW5jID0gMjA7XHJcbiAgICAgICAgY29uc3QgY29sb3IgPSAnY3lhbic7XHJcbiAgICAgICAgbGV0IGMgPSB0aGlzLmNvbnRleHQ7XHJcblxyXG4gICAgICAgIGMuZmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICAgICAgYy5maWxsVGV4dCgnRlBTOiAnICsgdGhpcy5mcHMudG9QcmVjaXNpb24oNCkudG9TdHJpbmcoKSwgeCwgeSArPSB5aW5jKTtcclxuICAgICAgICAvL2MuZmlsbFRleHQoJ1RpbWU6ICcgKyB0aGlzLnRpbWVUb0RvLCB4LCB5ICs9IHlpbmMpO1xyXG4gICAgICAgIGZvciAobGV0IGRiZyBvZiB0aGlzLmRlYnVnTGlzdCkge1xyXG4gICAgICAgICAgICBjLmZpbGxUZXh0KGRiZygpLCB4LCB5ICs9IHlpbmMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IEltYWdlc0xvYWRlciwgSW1hZ2VzTG9hZGVySXRlbSB9IGZyb20gJy4vLi4vLi4vSmFtL0ltYWdlc0xvYWRlci5qcyc7XHJcbmltcG9ydCB7IEltYWdlU3ByaXRlIH0gZnJvbSAnLi8uLi8uLi9KYW0vSW1hZ2VTcHJpdGUuanMnO1xyXG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vLi4vLi4vSmFtL1BvaW50LmpzJztcclxuaW1wb3J0IHsgVGhpbmd5IH0gZnJvbSAnLi8uLi8uLi9KYW0vVGhpbmd5LmpzJztcclxuaW1wb3J0IHsgU291bmRNdWx0aUNoYW5uZWwgfSBmcm9tICcuLy4uLy4uL0phbS9Tb3VuZE11bHRpQ2hhbm5lbC5qcyc7XHJcbmltcG9ydCB7IFNvdW5kTG9vcGluZyB9IGZyb20gJy4vLi4vLi4vSmFtL1NvdW5kTG9vcGluZy5qcyc7XHJcbmltcG9ydCB7IFN0YXRlIH0gZnJvbSAnLi8uLi8uLi9KYW0vU3RhdGUuanMnO1xyXG5pbXBvcnQgeyBDb2xvckJhY2tncm91bmQgfSBmcm9tICcuLy4uLy4uL0phbS9Db2xvckJhY2tncm91bmQuanMnO1xyXG5pbXBvcnQgeyBSZWN0YW5nbGUgfSBmcm9tICcuLy4uLy4uL0phbS9SZWN0YW5nbGUuanMnO1xyXG5pbXBvcnQgeyBTcGxhc2hTY3JlZW4gfSBmcm9tICcuLy4uLy4uL0phbS9TcGxhc2hTY3JlZW4uanMnO1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tICcuLy4uLy4uL0phbS9FbmdpbmUuanMnOyBcclxuXHJcbmNvbnN0IElNQUdFX0xJU1QgPSBbXHJcbiAgICBuZXcgSW1hZ2VzTG9hZGVySXRlbSgnc3RhcnR1cFNwbGFzaC5wbmcnKSxcclxuICAgIG5ldyBJbWFnZXNMb2FkZXJJdGVtKCdzaGlwQm9keS5wbmcnKSxcclxuICAgIG5ldyBJbWFnZXNMb2FkZXJJdGVtKCdzaGlwR3VuLnBuZycpLFxyXG4gICAgbmV3IEltYWdlc0xvYWRlckl0ZW0oJ3NoaXBKZXQucG5nJyksXHJcbiAgICBuZXcgSW1hZ2VzTG9hZGVySXRlbSgnZW5lbXkwLnBuZycpXHJcbl07XHJcblxyXG4vLyBUdW5pbmcgdmFsdWVzLlxyXG5jb25zdCBUVU5JTkcgPSB7XHJcbiAgICBTVEFSVFVQX1NQTEFTSDogeyBJTUFHRV9OVU1CRVI6IDB9LFxyXG4gICAgU0hJUDogICAgICAgICAgIHsgWDogMzAwLCAgIFk6IDMwMCwgSU1BR0VfTlVNQkVSOiAxLCBNT1ZFX1NQRUVEOiAxLjUsIEdSQVZJVFlfTUFYOiAwLjMsIEdSQVZJVFlfTUlOOiAwLjAxLCBQSVhFTF9HUkFWX01BWDogNS4wIH0sXHJcbiAgICBTSElQX0dVTjogICAgICAgeyBYOiAwLCAgICAgWTogMCwgICBJTUFHRV9OVU1CRVI6IDIgfSxcclxuICAgIFNISVBfSkVUOiAgICAgICB7IFg6IDAsICAgICBZOiAwLCAgIElNQUdFX05VTUJFUjogMyB9LFxyXG4gICAgQVNURVJPSUQ6ICAgICAgIHsgSU1BR0VfTlVNQkVSOiA0IH0sXHJcbn07XHJcblxyXG5jb25zdCBMRVZFTF9EQVRBID0gW1xyXG4gICAgeyBBU1RFUk9JRF9DT1VOVDogMTB9XHJcbl07XHJcblxyXG5cclxuY29uc3QgVHVybmluZyA9IHtcclxuICAgIExlZnQ6IC0xLFxyXG4gICAgTm9uZTogMCxcclxuICAgIFJpZ2h0OiAxXHJcbn07XHJcblxyXG5jbGFzcyBCb3VuZGVkSW1hZ2VTcHJpdGUgZXh0ZW5kcyBJbWFnZVNwcml0ZSB7XHJcbiAgICAvKiogQHBhcmFtIHtFbmdpbmV9IGVuZ2luZSAqL1xyXG4gICAgdXBkYXRlTm93KGVuZ2luZSkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZU5vdyhlbmdpbmUpO1xyXG4gICAgICAgIGlmICgodGhpcy5wb3NpdGlvbi54IDw9IDAgJiYgdGhpcy5zcGVlZC54IDwgMCkgfHwgKHRoaXMucG9zaXRpb24ueCA+PSBlbmdpbmUuY2FudmFzLndpZHRoICYmIHRoaXMuc3BlZWQueCA+IDApKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3BlZWQueCAqPSAtMTtcclxuICAgICAgICAgICAgdGhpcy5zcGVlZC54ICo9IDAuOTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCh0aGlzLnBvc2l0aW9uLnkgPD0gMCAmJiB0aGlzLnNwZWVkLnkgPCAwKSB8fCAodGhpcy5wb3NpdGlvbi55ID49IGVuZ2luZS5jYW52YXMuaGVpZ2h0ICYmIHRoaXMuc3BlZWQueSA+IDApKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3BlZWQueSAqPSAtMTtcclxuICAgICAgICAgICAgdGhpcy5zcGVlZC55ICo9IDAuOTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFNoaXAgZXh0ZW5kcyBCb3VuZGVkSW1hZ2VTcHJpdGUge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihUVU5JTkcuU0hJUC5YLFRVTklORy5TSElQLlksIElNQUdFX0xJU1RbVFVOSU5HLlNISVAuSU1BR0VfTlVNQkVSXS5pbWFnZSk7XHJcblxyXG4gICAgICAgIHRoaXMuaXNBY2NlbGVyYXRpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmlzRmlyaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy50dXJuaW5nID0gVHVybmluZy5Ob25lO1xyXG4gICAgICAgIHRoaXMuaXNVc2luZ0dyYXZpdHkgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmdyYXZpdHlBbW91bnQgPSBUVU5JTkcuU0hJUC5HUkFWSVRZX01BWDtcclxuICAgIFxyXG5cclxuICAgICAgICB0aGlzLmd1biA9IG5ldyBJbWFnZVNwcml0ZShUVU5JTkcuU0hJUF9HVU4uWCxUVU5JTkcuU0hJUF9HVU4uWSxJTUFHRV9MSVNUW1RVTklORy5TSElQX0dVTi5JTUFHRV9OVU1CRVJdLmltYWdlKTtcclxuICAgICAgICB0aGlzLmpldCA9IG5ldyBJbWFnZVNwcml0ZShUVU5JTkcuU0hJUF9KRVQuWCxUVU5JTkcuU0hJUF9KRVQuWSxJTUFHRV9MSVNUW1RVTklORy5TSElQX0pFVC5JTUFHRV9OVU1CRVJdLmltYWdlKTtcclxuICAgICAgICAvL3RoaXMuZ3Jhdml0eSA9IG5ldyBJbWFnZVNwcml0ZShUVU5JTkcuU0hJUF9HUkFWSVRZLlgsVFVOSU5HLlNISVBfR1JBVklUWS5ZLElNQUdFX0xJU1RbVFVOSU5HLlNISVBfR1JBVklUWS5JTUFHRV9OVU1CRVJdLmltYWdlKTtcclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZUNlbnRlcigpO1xyXG4gICAgICAgIHRoaXMuZ3VuLmNhbGN1bGF0ZUNlbnRlcigpO1xyXG4gICAgICAgIHRoaXMuamV0LmNhbGN1bGF0ZUNlbnRlcigpO1xyXG4gICAgICAgIC8vdGhpcy5ncmF2aXR5LmNhbGN1bGF0ZUNlbnRlcigpO1xyXG5cclxuICAgICAgICB0aGlzLmpldC5lbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmd1bik7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmpldCk7XHJcbiAgICAgICAgLy90aGlzLmFkZENoaWxkKHRoaXMuZ3Jhdml0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7RW5naW5lfSBlbmdpbmUgKi9cclxuICAgIHVwZGF0ZU5vdyhlbmdpbmUpIHtcclxuICAgICAgICBzdXBlci51cGRhdGVOb3coZW5naW5lKTtcclxuICAgICAgICAvLyBNYXliZSBhIGNoZWFwIGZpeCB0byBqdXN0IGRlcm90YXRlIGl0Li4uXHJcbiAgICAgICAgdGhpcy5ndW4ucm90YXRpb24uYW1vdW50ID0gTWF0aC5hdGFuMihlbmdpbmUuaW5wdXQuTW91c2VMb2NhdGlvbi55IC0gdGhpcy5wb3NpdGlvbi55LCBlbmdpbmUuaW5wdXQuTW91c2VMb2NhdGlvbi54IC0gdGhpcy5wb3NpdGlvbi54KSAtIHRoaXMucm90YXRpb24uYW1vdW50O1xyXG4gICAgICAgIHRoaXMuamV0LmVuYWJsZWQgPSB0aGlzLmlzQWNjZWxlcmF0aW5nO1xyXG4gICAgICAgIGlmICh0aGlzLmlzQWNjZWxlcmF0aW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3BlZWQueCArPSBNYXRoLmNvcyh0aGlzLnJvdGF0aW9uLmFtb3VudCkgKiBUVU5JTkcuU0hJUC5NT1ZFX1NQRUVEO1xyXG4gICAgICAgICAgICB0aGlzLnNwZWVkLnkgKz0gTWF0aC5zaW4odGhpcy5yb3RhdGlvbi5hbW91bnQpICogVFVOSU5HLlNISVAuTU9WRV9TUEVFRDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbi5hbW91bnQgKz0gdGhpcy50dXJuaW5nICogVFVOSU5HLlNISVAuTU9WRV9TUEVFRCAvIGVuZ2luZS5mcHM7XHJcbiAgICB9XHJcblxyXG4gICAgZ3VuUG9zaXRpb24oKSB7XHJcbiAgICAgICAgbGV0IHggPSB0aGlzLnBvc2l0aW9uLnggKyBNYXRoLmNvcyh0aGlzLmd1bi5yb3RhdGlvbi5hbW91bnQgKyB0aGlzLnJvdGF0aW9uLmFtb3VudCkgKiAxMi43O1xyXG4gICAgICAgIGxldCB5ID0gdGhpcy5wb3NpdGlvbi55ICsgTWF0aC5zaW4odGhpcy5ndW4ucm90YXRpb24uYW1vdW50ICsgdGhpcy5yb3RhdGlvbi5hbW91bnQpICogMTIuNztcclxuICAgICAgICByZXR1cm4gbmV3IFBvaW50KHgseSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7RW5naW5lfSBlbmdpbmUgKi9cclxuICAgIGRyYXdOb3coZW5naW5lKSB7XHJcbiAgICAgICAgc3VwZXIuZHJhd05vdyhlbmdpbmUpO1xyXG4gICAgICAgIGlmICh0aGlzLmlzVXNpbmdHcmF2aXR5KSB7XHJcbiAgICAgICAgICAgIGVuZ2luZS5jb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDAsMjAwLDEwMCwwLjMpJztcclxuICAgICAgICAgICAgLy9jb250ZXh0LnN0cm9rZVN0eWxlID0gJ3JiZ2EoMCwwLDI1NSwwLjMpJztcclxuICAgICAgICAgICAgZW5naW5lLmNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGVuZ2luZS5jb250ZXh0LmFyYygwLDAsKFRVTklORy5TSElQLkdSQVZJVFlfTUFYLShUVU5JTkcuU0hJUC5HUkFWSVRZX01BWC10aGlzLmdyYXZpdHlBbW91bnQpKSoxMDAsMCxNYXRoLlBJKjIpO1xyXG4gICAgICAgICAgICBlbmdpbmUuY29udGV4dC5maWxsKCk7XHJcbiAgICAgICAgICAgIC8vY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICAgICAgLy9iakRyYXdDZW50ZXJlZEJpdG1hcFdpdGhSb3RhdGlvbihjb250ZXh0LCB0aGlzLngsIHRoaXMueSwgdGhpcy5zaGlwR3Jhdml0eUltYWdlLCB0aGlzLnJvdGF0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFBpeGVsIHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBQaXhlbC5cclxuICAgICAqIEBwYXJhbSB7UGl4ZWxQaWxlfSBwaWxlIFxyXG4gICAgICogQHBhcmFtIHtQb2ludH0gcG9zaXRpb24gXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVkIFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGdyZWVuIFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJsdWUgXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGEgXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHBpbGUsIHBvc2l0aW9uLCByZWQsIGdyZWVuLCBibHVlLCBhbHBoYSl7XHJcbiAgICAgICAgdGhpcy5zcGVlZCA9IG5ldyBQb2ludChNYXRoLnJhbmRvbSgpICogMiAtIDEsIE1hdGgucmFuZG9tKCkgKiAyIC0gMSk7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgICAgIHRoaXMubGlmZSA9IDEwMDtcclxuICAgICAgICBwaWxlLmFkZFBpeGVsKHRoaXMsIGByZ2JhKCR7cmVkfSwke2dyZWVufSwke2JsdWV9LCR7YWxwaGF9YCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFBpeGVsUGlsZSBleHRlbmRzIFRoaW5neSB7XHJcblxyXG5cclxuICAgIC8qKiBAcGFyYW0ge1NoaXB9IHNoaXAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHNoaXApIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuc2hpcCA9IHNoaXA7XHJcbiAgICAgICAgdGhpcy5waXhlbHMgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy50b3RhbFBpeGVscyA9IDA7XHJcbiAgICAgICAgdGhpcy5hYnNvcmJlZFBpeGVscyA9IDA7XHJcbiAgICAgICAgdGhpcy5zb3VuZENsYWltID0gbmV3IFNvdW5kTXVsdGlDaGFubmVsKCdhdWRpby9jbGFpbScsIDYpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7UGl4ZWx9IHBpeGVsIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yU3RyaW5nIFxyXG4gICAgICovXHJcbiAgICBhZGRQaXhlbChwaXhlbCwgY29sb3JTdHJpbmcpIHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnBpeGVscy5oYXMoY29sb3JTdHJpbmcpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGl4ZWxzLnNldChjb2xvclN0cmluZywgW10pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBhcnIgPSB0aGlzLnBpeGVscy5nZXQoY29sb3JTdHJpbmcpO1xyXG4gICAgICAgICAgICBpZiAoYXJyKSB7XHJcbiAgICAgICAgICAgICAgICBhcnIucHVzaChwaXhlbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50b3RhbFBpeGVscysrO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyUGl4ZWxzKCkge1xyXG4gICAgICAgIHRoaXMucGl4ZWxzLmNsZWFyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7RW5naW5lfSBlbmdpbmUgKi9cclxuICAgIHVwZGF0ZShlbmdpbmUpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgdmFsdWUgb2YgdGhpcy5waXhlbHMudmFsdWVzKCkpIHtcclxuICAgICAgICAgICAgY29uc3QgbW92ZVNwZWVkID0gNS4wO1xyXG4gICAgICAgICAgICBsZXQgZ3JhdiA9IHRoaXMuc2hpcC5pc1VzaW5nR3Jhdml0eTtcclxuICAgICAgICAgICAgbGV0IGdyYXZNdWx0aSA9IHRoaXMuc2hpcC5ncmF2aXR5QW1vdW50O1xyXG4gICAgICAgICAgICBsZXQgbWF4U3BlZWQgPSBUVU5JTkcuU0hJUC5QSVhFTF9HUkFWX01BWDtcclxuICAgICAgICAgICAgbGV0IHN4ID0gdGhpcy5zaGlwLnBvc2l0aW9uLng7XHJcbiAgICAgICAgICAgIGxldCBzeSA9IHRoaXMuc2hpcC5wb3NpdGlvbi55O1xyXG4gICAgICAgICAgICBsZXQgaWtpbGwgPSBbXTtcclxuICAgICAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBwaXggb2YgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICgocGl4LnBvc2l0aW9uLnggPD0gMCAmJiBwaXguc3BlZWQueCA8IDApIHx8IChwaXgucG9zaXRpb24ueCA+PSBlbmdpbmUuY2FudmFzLndpZHRoICYmIHBpeC5zcGVlZC54ID4gMCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwaXguc3BlZWQueCAqPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICBwaXguc3BlZWQueCAqPSAwLjk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoKHBpeC5wb3NpdGlvbi55IDw9IDAgJiYgcGl4LnNwZWVkLnkgPCAwKSB8fCAocGl4LnBvc2l0aW9uLnkgPj0gZW5naW5lLmNhbnZhcy5oZWlnaHQgJiYgcGl4LnNwZWVkLnkgPiAwKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBpeC5zcGVlZC55ICo9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIHBpeC5zcGVlZC55ICo9IDAuOTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChncmF2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGR4ID0gc3ggLSBwaXgucG9zaXRpb24ueDtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZHkgPSBzeSAtIHBpeC5wb3NpdGlvbi55O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhkeCkgPCAxNSAmJiBNYXRoLmFicyhkeSkgPCAxNSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoLS1waXgubGlmZSA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpa2lsbC5wdXNoKGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hYnNvcmJlZFBpeGVscysrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VuZENsYWltLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsZXQgYW5nbGUgPSBNYXRoLmF0YW4yKGR5LCBkeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGl4LnNwZWVkLnggKz0gTWF0aC5jb3MoYW5nbGUpICogZ3Jhdk11bHRpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBpeC5zcGVlZC55ICs9IE1hdGguc2luKGFuZ2xlKSAqIGdyYXZNdWx0aTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGl4LnNwZWVkLnggPiBtYXhTcGVlZCkgcGl4LnNwZWVkLnggPSBtYXhTcGVlZDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGl4LnNwZWVkLnkgPiBtYXhTcGVlZCkgcGl4LnNwZWVkLnkgPSBtYXhTcGVlZDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGl4LnNwZWVkLnggPCAtbWF4U3BlZWQpIHBpeC5zcGVlZC54ID0gLW1heFNwZWVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwaXguc3BlZWQueSA8IC1tYXhTcGVlZCkgcGl4LnNwZWVkLnkgPSAtbWF4U3BlZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwaXgucG9zaXRpb24ueCArPSBtb3ZlU3BlZWQgKiBwaXguc3BlZWQueCAvIGVuZ2luZS5mcHM7XHJcbiAgICAgICAgICAgICAgICBwaXgucG9zaXRpb24ueSArPSBtb3ZlU3BlZWQgKiBwaXguc3BlZWQueSAvIGVuZ2luZS5mcHM7XHJcbiAgICAgICAgICAgICAgICArK2k7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gUmV2ZXJzZSBzb3J0IHBpeGVscyB0byByZW1vdmUsIG11c3QgcmVtb3ZlIGZyb20gZW5kIG9yIGluZGV4ZXMgYXJlIHdvcnRobGVzcy5cclxuICAgICAgICAgICAgaWtpbGwuc29ydCgodSxkKSA9PiB1PGQpO1xyXG4gICAgICAgICAgICBmb3IobGV0IHIgb2YgaWtpbGwpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlLnNwbGljZShyLDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbFBpeGVscy0tO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge0VuZ2luZX0gZW5naW5lICovXHJcbiAgICBkcmF3KGVuZ2luZSkge1xyXG4gICAgICAgIGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiB0aGlzLnBpeGVscykge1xyXG4gICAgICAgICAgICBlbmdpbmUuY29udGV4dC5maWxsU3R5bGUgPSBrZXk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHBpeCBvZiB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgZW5naW5lLmNvbnRleHQuZmlsbFJlY3QocGl4LnBvc2l0aW9uLngscGl4LnBvc2l0aW9uLnksIDEsMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIExpbmVDb2xsaXNpb24gZXh0ZW5kcyBQb2ludCB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgTGluZUNvbGxpc2lvbi5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzV2FsbCBcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoeCwgeSwgaXNXYWxsKSB7XHJcbiAgICAgICAgc3VwZXIoeCx5KTtcclxuICAgICAgICB0aGlzLmlzV2FsbCA9IGlzV2FsbDtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQXN0ZXJvaWQgZXh0ZW5kcyBCb3VuZGVkSW1hZ2VTcHJpdGUge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBBc3Rlcm9pZC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHgsIHkpIHtcclxuICAgICAgICBzdXBlcih4LHksIElNQUdFX0xJU1RbVFVOSU5HLkFTVEVST0lELklNQUdFX05VTUJFUl0uaW1hZ2UpO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24uc3BlZWQgPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAwLjU7XHJcbiAgICAgICAgdGhpcy5zcGVlZC54ID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMjU7XHJcbiAgICAgICAgdGhpcy5zcGVlZC55ID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMjU7XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVDZW50ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBsaW5lRW5kIHdpbGwgYnkgdW5yb3RhdGVkIGJ5IHRoaXMgZnVuY3Rpb24hXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7UGl4ZWxQaWxlfSBwaXhlbFBpbGUgXHJcbiAgICAgKiBAcGFyYW0ge1BvaW50fSBsaW5lRW5kIFxyXG4gICAgICovXHJcbiAgICBoaXQocGl4ZWxQaWxlLCBsaW5lRW5kKSB7XHJcbiAgICAgICAgLy8gVE9ETzogTm8gbWFnaWMgbnVtYmVycy5cclxuICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuc2l6ZS54O1xyXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuc2l6ZS55O1xyXG4gICAgICAgIGxldCB0ZW1wUGl4ZWxzID0gdGhpcy5jb250ZXh0LmdldEltYWdlRGF0YSgwLDAsIHdpZHRoLGhlaWdodCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB0ZW1wUGl4ZWxzLmRhdGE7XHJcbiAgICAgICAgbGV0IGkgPShsaW5lRW5kLnkqdGhpcy5jYW52YXMud2lkdGgrbGluZUVuZC54KSo0O1xyXG4gICAgICAgIC8vIEZJWE1FOiB1c2UgY2VudGVyIG9yIGhhbGYsIGluY29uc2lzdGVudC5cclxuICAgICAgICBsaW5lRW5kLnJvdGF0ZUFyb3VuZEJ5KG5ldyBQb2ludCAod2lkdGgqMC41LGhlaWdodCowLjUpLCB0aGlzLnJvdGF0aW9uLmFtb3VudCk7XHJcbiAgICAgICAgLypsZXQgdGVtcFBpeGVsID0qLyBuZXcgUGl4ZWwocGl4ZWxQaWxlLFxyXG4gICAgICAgICAgICAgICAgbmV3IFBvaW50KHRoaXMucG9zaXRpb24ueCtsaW5lRW5kLngtd2lkdGgqMC41LHRoaXMucG9zaXRpb24ueStsaW5lRW5kLnktaGVpZ2h0KjAuNSksXHJcbiAgICAgICAgICAgICAgICBkYXRhW2krMF0sZGF0YVtpKzFdLGRhdGFbaSsyXSxkYXRhW2krM11cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICBkYXRhW2krM10gPSAwO1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5wdXRJbWFnZURhdGEodGVtcFBpeGVscywgMCwwKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7UG9pbnR9IG9yaWdpbiBcclxuICAgICAqIEBwYXJhbSB7UG9pbnR9IGVuZCBcclxuICAgICAqIEByZXR1cm5zIHtMaW5lQ29sbGlzaW9ufSBcclxuICAgICAqL1xyXG4gICAgZmluZExpbmVFbmQob3JpZ2luLCBlbmQpIHtcclxuICAgICAgICBcclxuICAgICAgICAvLyBUT0RPOiBwYXNzIGJ5IHZhbHVlIEkgbWVhbiBjbW9uLlxyXG4gICAgICAgIG9yaWdpbiA9IG9yaWdpbi5jb3B5KCk7XHJcbiAgICAgICAgZW5kID0gZW5kLmNvcHkoKTtcclxuICAgICAgICBvcmlnaW4ueCA9IE1hdGguZmxvb3Iob3JpZ2luLngpO1xyXG4gICAgICAgIG9yaWdpbi55ID0gTWF0aC5mbG9vcihvcmlnaW4ueSk7XHJcbiAgICAgICAgZW5kLnggPSBNYXRoLmZsb29yKGVuZC54KTtcclxuICAgICAgICBlbmQueSA9IE1hdGguZmxvb3IoZW5kLnkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBkeCA9IE1hdGguYWJzKGVuZC54LW9yaWdpbi54KTtcclxuICAgICAgICBsZXQgZHkgPSBNYXRoLmFicyhlbmQueS1vcmlnaW4ueSk7XHJcbiAgICAgICAgbGV0IHN4ID0gKG9yaWdpbi54IDwgZW5kLngpID8gMSA6IC0xO1xyXG4gICAgICAgIGxldCBzeSA9IChvcmlnaW4ueSA8IGVuZC55KSA/IDEgOiAtMTtcclxuICAgICAgICBsZXQgZXJyID0gZHgtZHk7XHJcbiAgICAgICAgbGV0IGVudHJ5V291bmQgPSB7IHg6IGZhbHNlLCB5OiBmYWxzZSB9O1xyXG4gICAgICAgIC8vdmFyIG94ID0geDAsIG95ID0geTA7XHJcblxyXG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5jb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCB0aGlzLnNpemUueCwgdGhpcy5zaXplLnkpLmRhdGE7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHdhbGwgPSBmYWxzZTtcclxuICAgIFxyXG4gICAgICAgIGxldCBzYW5pdHlDaGVjayA9IHRoaXMuc2l6ZS54ICogdGhpcy5zaXplLnkgKiAyO1xyXG5cclxuICAgICAgICAvLyBGSVhNRTogSW5maW5pdGUgbG9vcCA6KFxyXG4gICAgICAgIHdoaWxlKHRydWUpe1xyXG4gICAgICAgICAgICBpZiAoLS1zYW5pdHlDaGVjayA8IDApIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ1Nhbml0eSBjaGVjayBmYWlsZWQuLi4nKTtcclxuICAgICAgICAgICAgICAgIHdhbGwgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gSGFzIGNvbWUgaW4gcmFuZ2UgaG9yaXpvbnRhbGx5LlxyXG4gICAgICAgICAgICBpZiAob3JpZ2luLnggPCB0aGlzLnNpemUueCAmJiBvcmlnaW4ueCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBlbnRyeVdvdW5kLnggPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIEhhcyBjb21lIGluIHJhbmdlIHZlcnRpY2FsbHkuXHJcbiAgICAgICAgICAgIGlmIChvcmlnaW4ueSA8IHRoaXMuc2l6ZS55ICYmIG9yaWdpbi55ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgZW50cnlXb3VuZC55ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBHb25lIG91dCB0aGUgb3RoZXIgc2lkZSBob3Jpem9udGFsbHkuXHJcbiAgICAgICAgICAgIGlmIChlbnRyeVdvdW5kLnggJiYgKG9yaWdpbi54ID49IHRoaXMuc2l6ZS54IHx8IG9yaWdpbi54IDwgMCkpIHtcclxuICAgICAgICAgICAgICAgIHdhbGwgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gR29uZSBvdXQgdGhlIG90aGVyIHNpZGUgdmVydGljYWxseS5cclxuICAgICAgICAgICAgaWYgKGVudHJ5V291bmQueSAmJiAob3JpZ2luLnkgPj0gdGhpcy5zaXplLnkgfHwgb3JpZ2luLnkgPCAwKSkge1xyXG4gICAgICAgICAgICAgICAgd2FsbCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBJbnNpZGUgdGhlIGNvbnRleHQuXHJcbiAgICAgICAgICAgIGlmIChlbnRyeVdvdW5kLnggJiYgZW50cnlXb3VuZC55KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaSA9ICgob3JpZ2luLnkqdGhpcy5zaXplLngpKyhvcmlnaW4ueCkpKjQ7XHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBObyBtYWdpYyBudW1iZXJzIVxyXG4gICAgICAgICAgICAgICAgbGV0IGMgPSBkYXRhW2krM107Ly9kYXRhW2krUkVEX0JZVEVdICsgZGF0YVtpK0dSRUVOX0JZVEVdICsgZGF0YVtpK0JMVUVfQllURV07XHJcbiAgICAgICAgICAgICAgICAvLyBIaXQgYSB2YWxpZCBwaXhlbC5cclxuICAgICAgICAgICAgICAgIGlmIChjICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB3YWxsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGUyID0gZXJyIDw8IDE7XHJcbiAgICAgICAgICAgIGlmIChlMiA+LWR5KXsgZXJyIC09IGR5OyBvcmlnaW4ueCArPSBzeDsgfVxyXG4gICAgICAgICAgICBpZiAoZTIgPCBkeCl7IGVyciArPSBkeDsgb3JpZ2luLnkgKz0gc3k7IH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5lQ29sbGlzaW9uKG9yaWdpbi54LG9yaWdpbi55LCB3YWxsKTtcclxuICAgICB9XHJcbiAgICBcclxufVxyXG5cclxuLypjbGFzcyBIVUQgZXh0ZW5kcyBUaGluZ3kge1xyXG5cclxuICAgIHJhZGdyYWQgOiBDYW52YXNHcmFkaWVudDtcclxuICAgIGltYWdlIDogSFRNTEltYWdlRWxlbWVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlbmdpbmU6IEVuZ2luZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuaW1hZ2UgPSBJTUFHRV9MSVNUW1RVTklORy5IVUQuSU1BR0VfTlVNQkVSXS5pbWFnZTtcclxuXHJcbiAgICAgICAgLypsZXQgY3R4IDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gZW5naW5lLmNvbnRleHQ7XHJcbiAgICAgICAgbGV0IGNlbnRlciA9IG5ldyBQb2ludChlbmdpbmUuY2FudmFzLndpZHRoLzIsIGVuZ2luZS5jYW52YXMuaGVpZ2h0LzIpO1xyXG4gICAgICAgIC8vIFNvbWUgY3JlZGl0IHRvIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81NDc2NTc2XHJcbiAgICAgICAgdGhpcy5yYWRncmFkID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KGNlbnRlci54LGNlbnRlci55LFRVTklORy5XT1JMRC5SQURJVVMsY2VudGVyLngsY2VudGVyLnksVFVOSU5HLldPUkxELlJBRElVUyArIDUpO1xyXG4gICAgICAgIHRoaXMucmFkZ3JhZC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMjU1LDAsMCwwKScpO1xyXG4gICAgICAgIHRoaXMucmFkZ3JhZC5hZGRDb2xvclN0b3AoMC44LCAncmdiYSgyMjgsMCwwLC45KScpO1xyXG4gICAgICAgIHRoaXMucmFkZ3JhZC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMjI4LDAsMCwxKScpO1xyXG4gICAgICAgICovLypcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGVuZ2luZSA6IEVuZ2luZSkge1xyXG5cclxuICAgICAgICBlbmdpbmUuY29udGV4dC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwwLDApO1xyXG5cclxuICAgICAgICAvKmVuZ2luZS5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMucmFkZ3JhZDtcclxuICAgICAgICBlbmdpbmUuY29udGV4dC5maWxsUmVjdCgwLDAsZW5naW5lLmNhbnZhcy53aWR0aC0xLGVuZ2luZS5jYW52YXMuaGVpZ2h0LTEpO1xyXG4gICAgICAgICovLypcclxuICAgIH1cclxufSovXHJcblxyXG5jbGFzcyBBc3Rlcm9pZEhpdCB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgQXN0ZXJvaWRIaXQuXHJcbiAgICAgKiBAcGFyYW0ge0FzdGVyb2lkfSBhc3Rlcm9pZCBcclxuICAgICAqIEBwYXJhbSB7TGluZUNvbGxpc2lvbn0gbGluZUVuZCBcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoYXN0ZXJvaWQsIGxpbmVFbmQpIHtcclxuICAgICAgICB0aGlzLmFzdGVyb2lkID0gYXN0ZXJvaWQ7XHJcbiAgICAgICAgdGhpcy5saW5lRW5kID0gbGluZUVuZDtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgTGV2ZWxTdGF0ZSBleHRlbmRzIFN0YXRlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8qKiBAdHlwZSB7QXJyYXk8QXN0ZXJvaWQ+fSAqL1xyXG4gICAgICAgIHRoaXMuYXN0ZXJvaWRzID0gW107XHJcbiAgICAgICAgLyoqIEB0eXBlIHtJbWFnZURhdGF9ICovXHJcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gbnVsbDtcclxuICAgICAgICAvKiogQHR5cGUge1NoaXB9ICovXHJcbiAgICAgICAgdGhpcy5zaGlwID0gbnVsbDtcclxuICAgICAgICAvKiogQHR5cGUge1BpeGVsUGlsZX0gKi9cclxuICAgICAgICB0aGlzLnBpeGVsUGlsZSA9IG51bGw7XHJcbiAgICAgICAgLyoqIEB0eXBlIHtTb3VuZExvb3Bpbmd9ICovXHJcbiAgICAgICAgdGhpcy5zb3VuZExhc2VyID0gbmV3IFNvdW5kTG9vcGluZygnYXVkaW8vbGFzZXInKTtcclxuICAgICAgICB0aGlzLmxldmVsTnVtYmVyID0gMDtcclxuICAgIH0gICBcclxuXHJcbiAgICAvKiogQHBhcmFtIHtFbmdpbmV9IGVuZ2luZSAqL1xyXG4gICAgaW5pdChlbmdpbmUpIHtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogU3RhciBmaWVsZCBpbnN0ZWFkIG9mIGJsYWNraXNoLlxyXG4gICAgICAgIGVuZ2luZS5hZGRDaGlsZChuZXcgQ29sb3JCYWNrZ3JvdW5kKCdyZ2IoMCwwLDMyKScpKTtcclxuXHJcbiAgICAgICAgdGhpcy5zaGlwID0gbmV3IFNoaXAoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnBpeGVsUGlsZSA9IG5ldyBQaXhlbFBpbGUodGhpcy5zaGlwKTtcclxuXHJcbiAgICAgICAgZW5naW5lLmFkZENoaWxkKHRoaXMuc2hpcCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBMRVZFTF9EQVRBW3RoaXMubGV2ZWxOdW1iZXJdLkFTVEVST0lEX0NPVU5UOyArK2kpIHtcclxuICAgICAgICAgICAgbGV0IHggPSAwO1xyXG4gICAgICAgICAgICBsZXQgeSA9IDA7XHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIHggPSBNYXRoLnJhbmRvbSgpICogZW5naW5lLmNhbnZhcy53aWR0aDtcclxuICAgICAgICAgICAgICAgIHkgPSBNYXRoLnJhbmRvbSgpICogZW5naW5lLmNhbnZhcy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH0gd2hpbGUgKE1hdGguc3FydCgoKHRoaXMuc2hpcC5wb3NpdGlvbi54IC0geCkgKiAodGhpcy5zaGlwLnBvc2l0aW9uLnggLSB4KSkgKyAoKHRoaXMuc2hpcC5wb3NpdGlvbi55IC0geSkgKiAodGhpcy5zaGlwLnBvc2l0aW9uLnkgLSB5KSkpIDwgMjAwKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBhc3Rlcm9pZCA9IG5ldyBBc3Rlcm9pZCh4LHkpO1xyXG4gICAgICAgICAgICB0aGlzLmFzdGVyb2lkcy5wdXNoKGFzdGVyb2lkKTtcclxuICAgICAgICAgICAgZW5naW5lLmFkZENoaWxkKGFzdGVyb2lkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vdGhpcy5odWQgPSBuZXcgSFVEKGVuZ2luZSk7XHJcbiAgICAgICAgLy9lbmdpbmUuYWRkQ2hpbGQodGhpcy5odWQpO1xyXG5cclxuICAgICAgICBlbmdpbmUuYWRkQ2hpbGQodGhpcy5waXhlbFBpbGUpO1xyXG5cclxuICAgICAgICAvLyBUZXN0IHZpYSBhIGdldHRlciBpbiB0aGUgb3B0aW9ucyBvYmplY3QgdG8gc2VlIGlmIHRoZSBwYXNzaXZlIHByb3BlcnR5IGlzIGFjY2Vzc2VkXHJcbiAgICAgICAgLy8gQ291dGVzeSBodHRwczovL2dpdGh1Yi5jb20vV0lDRy9FdmVudExpc3RlbmVyT3B0aW9ucy9ibG9iL2doLXBhZ2VzL2V4cGxhaW5lci5tZFxyXG4gICAgICAgIC8qbGV0IHN1cHBvcnRzUGFzc2l2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBvcHRzID0gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAncGFzc2l2ZScsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VwcG9ydHNQYXNzaXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidGVzdFwiLCBudWxsIGFzIGFueSwgb3B0cyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge30qL1xyXG5cclxuICAgICAgICAvLyBVc2Ugb3VyIGRldGVjdCdzIHJlc3VsdHMuIHBhc3NpdmUgYXBwbGllZCBpZiBzdXBwb3J0ZWQsIGNhcHR1cmUgd2lsbCBiZSBmYWxzZSBlaXRoZXIgd2F5LlxyXG4gICAgICAgIC8vZW5naW5lLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMubW91c2VXaGVlbC5iaW5kKHRoaXMpLCAoc3VwcG9ydHNQYXNzaXZlID8geyBwYXNzaXZlOiB0cnVlIH0gOiBmYWxzZSkgYXMgYW55KTtcclxuICAgICAgICBlbmdpbmUuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5tb3VzZVdoZWVsLmJpbmQodGhpcykpO1xyXG4gICAgICAgIGVuZ2luZS5kZWJ1Z0xpc3QucHVzaCgoKSA9PiAnRnJlZSBQaXhlbHM6ICcgKyB0aGlzLnBpeGVsUGlsZS50b3RhbFBpeGVscyk7XHJcbiAgICAgICAgZW5naW5lLmRlYnVnTGlzdC5wdXNoKCgpID0+ICdBYnNvcmJlZCBQaXhlbHM6ICcgKyB0aGlzLnBpeGVsUGlsZS5hYnNvcmJlZFBpeGVscyk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdERvbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtXaGVlbEV2ZW50fSBldnQgKi9cclxuICAgIG1vdXNlV2hlZWwoZXZ0KSB7XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5zaGlwLmdyYXZpdHlBbW91bnQgLT0gMC4wMSAqIE1hdGguc2lnbihldnQuZGVsdGFZKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGV2dC5kZWx0YVkpO1xyXG4gICAgICAgIGlmICh0aGlzLnNoaXAuZ3Jhdml0eUFtb3VudCA8IFRVTklORy5TSElQLkdSQVZJVFlfTUlOKSB7IFxyXG4gICAgICAgICAgICB0aGlzLnNoaXAuZ3Jhdml0eUFtb3VudCA9IFRVTklORy5TSElQLkdSQVZJVFlfTUlOO1xyXG4gICAgICAgICAgICAvL3NoaXAudXNpbmdHcmF2aXR5ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnNoaXAuZ3Jhdml0eUFtb3VudCA+IFRVTklORy5TSElQLkdSQVZJVFlfTUFYKSB0aGlzLnNoaXAuZ3Jhdml0eUFtb3VudCA9IFRVTklORy5TSElQLkdSQVZJVFlfTUFYO1xyXG4gICAgICAgIC8vaWYgKGdyYXZpdHkgPiAwKSBzaGlwLnVzaW5nR3Jhdml0eSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7RW5naW5lfSBlbmdpbmUgKi9cclxuICAgIGN5Y2xlKGVuZ2luZSkge1xyXG5cclxuICAgICAgICAvLyBUT0RPOiBIVUQuXHJcblxyXG4gICAgICAgIGxldCBnb1ByZXNzZWQgPSBlbmdpbmUuaW5wdXQuS2V5X1cgfHwgZW5naW5lLmlucHV0LktleV9VcDtcclxuICAgICAgICB0aGlzLnNoaXAuaXNBY2NlbGVyYXRpbmcgPSBnb1ByZXNzZWQ7XHJcblxyXG4gICAgICAgIHRoaXMuc2hpcC5pc1VzaW5nR3Jhdml0eSA9IGVuZ2luZS5pbnB1dC5LZXlfU3BhY2U7XHJcblxyXG4gICAgICAgIGlmIChlbmdpbmUuaW5wdXQuS2V5X0EgfHwgZW5naW5lLmlucHV0LktleV9MZWZ0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hpcC50dXJuaW5nID0gVHVybmluZy5MZWZ0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZW5naW5lLmlucHV0LktleV9EIHx8IGVuZ2luZS5pbnB1dC5LZXlfUmlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy5zaGlwLnR1cm5pbmcgPSBUdXJuaW5nLlJpZ2h0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hpcC50dXJuaW5nID0gVHVybmluZy5Ob25lO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNoaXAuaXNGaXJpbmcgPSBlbmdpbmUuaW5wdXQuQnV0dG9uX0xlZnQ7XHJcbiAgICAgICAgdGhpcy5zb3VuZExhc2VyLnNldElzUGxheWluZyhlbmdpbmUuaW5wdXQuQnV0dG9uX0xlZnQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zaGlwLmlzRmlyaW5nKSB7XHJcbiAgICAgICAgICAgIC8qKiBAdHlwZSB7TGluZUNvbGxpc2lvbn0gKi9cclxuICAgICAgICAgICAgbGV0IGxpbmVFbmQgPSBudWxsO1xyXG4gICAgICAgICAgICAvLyBTb3J0IGFzdGVyb2lkcyBieSBkaXN0YW5jZS5cclxuICAgICAgICAgICAgLyoqIEB0eXBlIHtBcnJheTxBc3Rlcm9pZD59ICovXHJcbiAgICAgICAgICAgIGxldCBwb3RlbnRpYWxBc3Rlcm9pZHMgPSB0aGlzLmFzdGVyb2lkcy5zbGljZSgpO1xyXG4gICAgICAgICAgICAvKiogQHBhcmFtIHtQb2ludH0gb25lIFxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1BvaW50fSB0d29cclxuICAgICAgICAgICAgICogQHJldHVybnMge251bWJlcn1cclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gZnVuY3Rpb24gKG9uZSwgdHdvKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KCgob25lLnggLSB0d28ueCkgKiAob25lLnggLSB0d28ueCkpICsgKChvbmUueSAtIHR3by55KSAqIChvbmUueSAtIHR3by55KSkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvLyBVc2VsZXNzIHNvcnQ/XHJcbiAgICAgICAgICAgIHBvdGVudGlhbEFzdGVyb2lkcy5zb3J0KCAoYSxiKSA9PiBkaXN0YW5jZSh0aGlzLnNoaXAucG9zaXRpb24sIGEucG9zaXRpb24pIDwgZGlzdGFuY2UodGhpcy5zaGlwLnBvc2l0aW9uLCBiLnBvc2l0aW9uKSApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gU2xpbSBwb3NzaWJsZSBhc3Rlcm9pZHMgZG93biBieSBib3ggY29sbGlzaW9uLlxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGxhc2VyLi4uIGV4dGVuZCB0aGUgbGluZSAoQ291cnRlc3kgb2YgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc3NDE2NTUpXHJcbiAgICAgICAgICAgIGxldCBsYXNlckVuZCA9IGVuZ2luZS5pbnB1dC5Nb3VzZUxvY2F0aW9uLmNvcHkoKTtcclxuICAgICAgICAgICAgY29uc3QgbGFzZXJMZW5ndGggPSBkaXN0YW5jZSh0aGlzLnNoaXAucG9zaXRpb24sIGVuZ2luZS5pbnB1dC5Nb3VzZUxvY2F0aW9uKTtcclxuICAgICAgICAgICAgY29uc3QgbXVsdGlwbGllciA9IE1hdGgubWF4KGVuZ2luZS5jYW52YXMud2lkdGgsIGVuZ2luZS5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICAgICAgbGFzZXJFbmQueCA9IGxhc2VyRW5kLnggKyAobGFzZXJFbmQueCAtIHRoaXMuc2hpcC5wb3NpdGlvbi54KSAvIGxhc2VyTGVuZ3RoICogbXVsdGlwbGllcjtcclxuICAgICAgICAgICAgbGFzZXJFbmQueSA9IGxhc2VyRW5kLnkgKyAobGFzZXJFbmQueSAtIHRoaXMuc2hpcC5wb3NpdGlvbi55KSAvIGxhc2VyTGVuZ3RoICogbXVsdGlwbGllcjtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBwb3RlbnRpYWxBc3Rlcm9pZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHsgLy8gSW4gcmV2ZXJzZSBzbyB3ZSBjYW4gc3BsaWNlLlxyXG4gICAgICAgICAgICAgICAgbGV0IHJvaWQgPSBwb3RlbnRpYWxBc3Rlcm9pZHNbaV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXggPSBNYXRoLm1heChyb2lkLnNpemUueCwgcm9pZC5zaXplLnkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgd2lkdGggPSBtYXggKiAxLjQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoZWlnaHQgPSBtYXggKiAxLjQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gcm9pZC5wb3NpdGlvbi55IC0gaGVpZ2h0LzI7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gIHJvaWQucG9zaXRpb24ueCAtIHdpZHRoLzI7XHJcbiAgICAgICAgICAgICAgICBsZXQgYXN0ZXJvaWRSZWN0ID0gbmV3IFJlY3RhbmdsZSh4LHksIHdpZHRoLGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWFzdGVyb2lkUmVjdC5pbnRlcnNlY3RzTGluZSh0aGlzLnNoaXAucG9zaXRpb24sIGxhc2VyRW5kKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvdGVudGlhbEFzdGVyb2lkcy5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gVVNFRCBUTzogUGVyZm9ybSBsaW5lIGZpbmQgdW50aWwgb25lIHN1Y2NlZWRzLCBvciBub25lLlxyXG4gICAgICAgICAgICAvLyBOT1c6IEtlZXAgQU5ZIGhpdHMgZm9yIGxhdGVyIGNvbXBhcmlzb24uXHJcbiAgICAgICAgICAgIC8qKiBAdHlwZSB7QXJyYXk8QXN0ZXJvaWRIaXQ+fSAqL1xyXG4gICAgICAgICAgICBsZXQgaGl0cyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvdGVudGlhbEFzdGVyb2lkcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBVbi1yb3RhdGUgdGhlIG9yaWdpbiBhcm91bmQgdGhlIGFzdGVyb2lkLlxyXG4gICAgICAgICAgICAgICAgbGV0IHJvaWQgPSBwb3RlbnRpYWxBc3Rlcm9pZHNbaV07XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3U2hpcExvYyA9IHRoaXMuc2hpcC5ndW5Qb3NpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld01vdXNlTG9jID0gZW5naW5lLmlucHV0Lk1vdXNlTG9jYXRpb24uY29weSgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld1JvaWRMb2MgPSByb2lkLnBvc2l0aW9uLmNvcHkoKTtcclxuICAgICAgICAgICAgICAgIG5ld1JvaWRMb2MueCAtPSByb2lkLnNpemUueCAvIDI7XHJcbiAgICAgICAgICAgICAgICBuZXdSb2lkTG9jLnkgLT0gcm9pZC5zaXplLnkgLyAyO1xyXG4gICAgICAgICAgICAgICAgbmV3U2hpcExvYy5yb3RhdGVBcm91bmRCeShyb2lkLnBvc2l0aW9uLCByb2lkLnJvdGF0aW9uLmFtb3VudCotMSk7XHJcbiAgICAgICAgICAgICAgICBuZXdNb3VzZUxvYy5yb3RhdGVBcm91bmRCeShyb2lkLnBvc2l0aW9uLCByb2lkLnJvdGF0aW9uLmFtb3VudCotMSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIEFkanVzdCBmb3IgZW5lbXkgY2VudGVyaW5nLiBUT0RPOiBVc2UgdGhlIGNlbnRlciBhbmQgbm90IGFsd2F5cyBoYWxmLCBvciB2aWNlIHZlcnNhLlxyXG4gICAgICAgICAgICAgICAgbmV3U2hpcExvYy54IC09IG5ld1JvaWRMb2MueDtcclxuICAgICAgICAgICAgICAgIG5ld1NoaXBMb2MueSAtPSBuZXdSb2lkTG9jLnk7XHJcbiAgICAgICAgICAgICAgICBuZXdNb3VzZUxvYy54IC09IG5ld1JvaWRMb2MueDtcclxuICAgICAgICAgICAgICAgIG5ld01vdXNlTG9jLnkgLT0gbmV3Um9pZExvYy55O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEZpbmQgdGhlIHBpeGVsIHRoYXQgd291bGQgYmUgaGl0LCBpZiBhbnkuXHJcbiAgICAgICAgICAgICAgICBsaW5lRW5kID0gcm9pZC5maW5kTGluZUVuZChuZXdTaGlwTG9jLCBuZXdNb3VzZUxvYyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUm90YXRlIHRoZSBwb3NpdGlvbiBiYWNrIGFyb3VuZCB0aGUgcm9pZC5cclxuICAgICAgICAgICAgICAgIC8vbGluZUVuZC5yb3RhdGVBcm91bmRCeShuZXdSb2lkTG9jLCByb2lkLnJvdGF0aW9uLmFtb3VudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTW92ZSB0byB0aGUgcm9pZCBwb3NpdGlvbi5cclxuICAgICAgICAgICAgICAgIC8vbGluZUVuZC54ICs9IHJvaWQucG9zaXRpb24ueDtcclxuICAgICAgICAgICAgICAgIC8vbGluZUVuZC55ICs9IHJvaWQucG9zaXRpb24ueTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobGluZUVuZCAhPSBudWxsICYmICFsaW5lRW5kLmlzV2FsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhpdHMucHVzaChuZXcgQXN0ZXJvaWRIaXQocm9pZCwgbGluZUVuZCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBGSVhNRTogUmVwZWF0ZWQgY29kZSwgZHJhd2luZyBpbiB3cm9uZyBwYXJ0IG9mIGxvb3AuXHJcbiAgICAgICAgICAgIGlmIChoaXRzLmxlbmd0aCAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICBoaXRzLnNvcnQoXHJcbiAgICAgICAgICAgICAgICAgICAgKGEsYikgPT4gICBkaXN0YW5jZSh0aGlzLnNoaXAucG9zaXRpb24sIGEuYXN0ZXJvaWQucG9zaXRpb24ucGx1cyhhLmxpbmVFbmQubWludXMoYS5hc3Rlcm9pZC5zaXplLnRpbWVzQW1vdW50KDAuNSkpKSkgPiBkaXN0YW5jZSh0aGlzLnNoaXAucG9zaXRpb24sIGIuYXN0ZXJvaWQucG9zaXRpb24ucGx1cyhiLmxpbmVFbmQubWludXMoYi5hc3Rlcm9pZC5zaXplLnRpbWVzQW1vdW50KDAuNSkpKSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBoaXRzWzBdLmFzdGVyb2lkLmhpdCh0aGlzLnBpeGVsUGlsZSwgaGl0c1swXS5saW5lRW5kKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc291bmRMYXNlci5zZXRWb2x1bWUoMS4wKTtcclxuICAgICAgICAgICAgICAgIGxldCBwb2ludHlFbmQgPSBoaXRzWzBdLmxpbmVFbmQucGx1cyhoaXRzWzBdLmFzdGVyb2lkLnBvc2l0aW9uKS5taW51cyhoaXRzWzBdLmFzdGVyb2lkLnNpemUudGltZXNBbW91bnQoMC41KSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3R4ID0gZW5naW5lLmNvbnRleHQ7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiKDI1NSwwLDApJztcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAxO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyh0aGlzLnNoaXAuZ3VuUG9zaXRpb24oKS54LCB0aGlzLnNoaXAuZ3VuUG9zaXRpb24oKS55KTtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8ocG9pbnR5RW5kLngsIHBvaW50eUVuZC55KTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc291bmRMYXNlci5zZXRWb2x1bWUoMC4zKTtcclxuICAgICAgICAgICAgICAgIGxldCBjdHggID0gZW5naW5lLmNvbnRleHQ7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiKDI1NSwwLDApJztcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAxO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyh0aGlzLnNoaXAuZ3VuUG9zaXRpb24oKS54LCB0aGlzLnNoaXAuZ3VuUG9zaXRpb24oKS55KTtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8obGFzZXJFbmQueCwgbGFzZXJFbmQueSk7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge0VuZ2luZX0gZW5naW5lICovXHJcbiAgICBmaW5pc2goZW5naW5lKSB7XHJcbiAgICAgICAgLy8gVGVzdCB2aWEgYSBnZXR0ZXIgaW4gdGhlIG9wdGlvbnMgb2JqZWN0IHRvIHNlZSBpZiB0aGUgcGFzc2l2ZSBwcm9wZXJ0eSBpcyBhY2Nlc3NlZFxyXG4gICAgICAgIC8vIENvdXRlc3kgaHR0cHM6Ly9naXRodWIuY29tL1dJQ0cvRXZlbnRMaXN0ZW5lck9wdGlvbnMvYmxvYi9naC1wYWdlcy9leHBsYWluZXIubWRcclxuICAgICAgICBsZXQgc3VwcG9ydHNQYXNzaXZlID0gZmFsc2U7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIG9wdHMgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdwYXNzaXZlJywge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdXBwb3J0c1Bhc3NpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0ZXN0XCIsIG51bGwsIG9wdHMpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XHJcbiAgICAgICAgZW5naW5lLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCd3aGVlbCcsdGhpcy5tb3VzZVdoZWVsLmJpbmQodGhpcyksKHN1cHBvcnRzUGFzc2l2ZSA/IHsgcGFzc2l2ZTogdHJ1ZSB9IDogZmFsc2UpKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgU3BsYXNoU3RhdGUgZXh0ZW5kcyBTdGF0ZSB7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLyoqIEB0eXBlIHtTcGxhc2hTY3JlZW59ICovXHJcbiAgICAgICAgdGhpcy5zcGxhc2ggPSBudWxsO1xyXG4gICAgICAgIC8qKiBAdHlwZSB7SW1hZ2VzTG9hZGVyfSAqL1xyXG4gICAgICAgIHRoaXMuaW1hZ2VMb2FkZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubG9hZGluZ0RvdHMgPSBcIlwiO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogQHBhcmFtIHtFbmdpbmV9IGVuZ2luZSAqL1xyXG4gICAgaW5pdChlbmdpbmUpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmltYWdlTG9hZGVyID0gbmV3IEltYWdlc0xvYWRlcihJTUFHRV9MSVNULCAnaW1hZ2VzLycpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2VMb2FkZXIub25Eb25lID0gdGhpcy5pbml0Mi5iaW5kKHRoaXMsIGVuZ2luZSk7XHJcbiAgICAgICAgdGhpcy5pbWFnZUxvYWRlci5iZWdpbkxvYWRpbmcoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7RW5naW5lfSBlbmdpbmUgKi9cclxuICAgIGluaXQyKGVuZ2luZSkge1xyXG4gICAgICAgIHRoaXMuc3BsYXNoID0gbmV3IFNwbGFzaFNjcmVlbihJTUFHRV9MSVNUW1RVTklORy5TVEFSVFVQX1NQTEFTSC5JTUFHRV9OVU1CRVJdLmltYWdlKTtcclxuICAgICAgICBlbmdpbmUuYWRkQ2hpbGQodGhpcy5zcGxhc2gpO1xyXG4gICAgICAgIHRoaXMuZG9uZSA9IHRydWU7XHJcbiAgICAgICAgc3VwZXIuaW5pdERvbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtFbmdpbmV9IGVuZ2luZSAqL1xyXG4gICAgY3ljbGUoZW5naW5lKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRvbmUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubG9hZGluZ0RvdHMubGVuZ3RoIDwgMTAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRpbmdEb3RzICs9ICcuJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZ0RvdHMgPSAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbmdpbmUuY29udGV4dC5maWxsU3R5bGUgPSAnYmxhY2snO1xyXG4gICAgICAgICAgICBlbmdpbmUuY29udGV4dC5mb250ID0gJ0NvbnNvbGFzIDIwcHgnO1xyXG4gICAgICAgICAgICBsZXQgdGV4dCA9IFwiTG9hZGluZyBJbWFnZXNcIiArIHRoaXMubG9hZGluZ0RvdHM7XHJcbiAgICAgICAgICAgIGVuZ2luZS5jb250ZXh0LmZpbGxUZXh0KHRleHQsIDMyMCwgNDUwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVuZ2luZS5pbnB1dC5CdXR0b25fTGVmdCAmJiB0aGlzLmRvbmUpIHtcclxuICAgICAgICAgICAgZW5naW5lLnNldFN0YXRlKG5ldyBMZXZlbFN0YXRlKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtFbmdpbmV9IGVuZ2luZSAqL1xyXG4gICAgZmluaXNoKGVuZ2luZSkge1xyXG4gICAgICAgIHN1cGVyLmZpbmlzaChlbmdpbmUpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKiogQHR5cGUge0VuZ2luZX0gKi9cclxudmFyIGdhbWU7XHJcblxyXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgY29uc3QgREVCVUdfU1RBVFVTID0gdHJ1ZTtcclxuXHJcbiAgICBsZXQgc3BsYXNoID0gbmV3IFNwbGFzaFN0YXRlKCk7XHJcbiAgICBnYW1lID0gbmV3IEVuZ2luZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGhlQ2FudmFzJyksIHNwbGFzaCwgREVCVUdfU1RBVFVTKTtcclxuICAgIGdhbWUuZ28oKTtcclxufTsiXSwibmFtZXMiOlsiTW91c2UuQnV0dG9uX0xlZnQiLCJNb3VzZS5CdXR0b25fUmlnaHQiLCJNb3VzZS5CdXR0b25fTWlkZGxlIiwiS2V5Ym9hcmQuS2V5X1VwIiwiS2V5Ym9hcmQuS2V5X0Rvd24iLCJLZXlib2FyZC5LZXlfTGVmdCIsIktleWJvYXJkLktleV9SaWdodCIsIktleWJvYXJkLktleV9XIiwiS2V5Ym9hcmQuS2V5X0EiLCJLZXlib2FyZC5LZXlfUyIsIktleWJvYXJkLktleV9EIiwiS2V5Ym9hcmQuS2V5X1NwYWNlIl0sIm1hcHBpbmdzIjoi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
