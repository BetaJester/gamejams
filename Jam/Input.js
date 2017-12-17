import * as Mouse from './Mouse.js';
import * as Keyboard from './Keyboard.js';
import { Point } from './Point.js';

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

export { InputStatus, calculateMousePosition, Mouse, Keyboard };