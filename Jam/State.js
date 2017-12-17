export class State {
    
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