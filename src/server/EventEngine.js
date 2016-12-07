var Perry = Perry || {};

/**
* An engine that queues functions for invocation.
*
* Be sure the function has `this` bound correctly.
* For example,
* engine.queueFunction(Date.now() + 1000, obj.func.bind(obj)
*/
Perry.FunctionEngine = class {

    constructor() {
        this.debug = false;
        this.queue = []; // List of [time,function] pairs.
        this.resolution = 1000; // smallest time (in ms) between ticks
        this.intervalId = null; // used to start and stop interval
        this.startTime = 0;     // time engine was last started
        this.stopTime = 0;      // time engine was last stopped
        this.tickTime = 0;      // time of last tick
        this.tickCount = 0;     // how many ticks have been processed
        this.functionCount = 0; // how many functions have been invoked
    } // constructor()

    /**
    * Start the function engine.
    *
    * @throws Exception if attempt to start a running engine.
    */
    start() {
        if (this.intervalId === null) {
            this.intervalId = setInterval(this.tick.bind(this), this.resolution);
        } // if engine is not yet started
        else {
            throw "Attempt to start the engine, but it is already running.";
        } // else engine is already started
        this.startTime = Date.now();
        return true;
    }

    /**
    * Stop the function engine.
    *
    * @throws Exception if attempt to stop a stopped engine.
    */
    stop() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
        } // if engine is not yet started
        else {
            throw "Attempt to stop the engine, but it is not running.";
        } // else engine is already started
        this.stopTime = Date.now();
        return true;
    }

    /**
    * Set the minimum time between ticks.
    *
    * @param t Time (in ms) between ticks.
    */
    setResolution(t) {
        this.resolution = t;
        if (this.intervalId !== null) {
            this.stop();
            this.start();
        } // if engine is running
        return t;
    }

    /**
    * Queue a function for invocation at a given time.
    *
    * @param t What time to invoke the function.
    * @param f The function to invoke.
    */
    queueEvent(t, f) {
        // use q.splice(ndx, 0, f)
        this.queue.push(f);
        return false;
    }

    /**
    * Remove a function from the queue.
    */
    dequeueEvent(id) {
        return false;
    }

    /**
    * Execute one tick of the engine.
    */
    tick() {
        if (this.debug) {
            console.log("Tick:" + new Date());
        } // if debug
        this.tickCount++;
        this.tickTime = Date.now();
        return true;
    } // tick()

} // FunctionEngine()
