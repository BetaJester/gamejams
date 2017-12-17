export class Point {
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