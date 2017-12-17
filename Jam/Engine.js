import { Thingy } from './Thingy.js';
import { Mouse, Keyboard, InputStatus, calculateMousePosition } from './Input.js';

export class Engine extends Thingy {
    
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
            case Mouse.Button_Left : this.input.Button_Left = true; break;
            case Mouse.Button_Right : this.input.Button_Right = true; break;
            case Mouse.Button_Middle : this.input.Button_Middle = true; break;
        }
    }
    /** @param {MouseEvent} ev */
    mouseUp(ev) {
        window.focus(); ev.preventDefault(); ev.stopPropagation(); 
        switch(ev.button) {
            case Mouse.Button_Left : this.input.Button_Left = false; break;
            case Mouse.Button_Right : this.input.Button_Right = false; break;
            case Mouse.Button_Middle : this.input.Button_Middle = false; break;
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
            case Keyboard.Key_Up : this.input.Key_Up = true; break;
            case Keyboard.Key_Down : this.input.Key_Down = true; break;
            case Keyboard.Key_Left : this.input.Key_Left = true; break;
            case Keyboard.Key_Right : this.input.Key_Right = true; break;
            case Keyboard.Key_W : this.input.Key_W = true; break;
            case Keyboard.Key_A : this.input.Key_A = true; break;
            case Keyboard.Key_S : this.input.Key_S = true; break;
            case Keyboard.Key_D : this.input.Key_D = true; break;
            case Keyboard.Key_Space : this.input.Key_Space = true; break;
        }
    }
    
    /** @param {KeyboardEvent} ev */
    keyUp(ev) {
        window.focus(); ev.preventDefault(); ev.stopPropagation(); 
        switch (ev.keyCode) {
            case Keyboard.Key_Up : this.input.Key_Up = false; break;
            case Keyboard.Key_Down : this.input.Key_Down = false; break;
            case Keyboard.Key_Left : this.input.Key_Left = false; break;
            case Keyboard.Key_Right : this.input.Key_Right = false; break;
            case Keyboard.Key_W : this.input.Key_W = false; break;
            case Keyboard.Key_A : this.input.Key_A = false; break;
            case Keyboard.Key_S : this.input.Key_S = false; break;
            case Keyboard.Key_D : this.input.Key_D = false; break;
            case Keyboard.Key_Space : this.input.Key_Space = false; break;
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