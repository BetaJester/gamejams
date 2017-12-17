import { Point } from './Point.js';

export class Rectangle {
    
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
