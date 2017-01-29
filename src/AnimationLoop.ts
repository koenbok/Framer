import {EventEmitter} from "events"

const time = () => window.performance.now()

export class AnimationLoop extends EventEmitter {

    private counter = 0
    private time = time()

    static get Default() {
        return DefaultAnimationLoop
    }

    constructor() {
        super()
        this.start()
    }

    start() {
        window.requestAnimationFrame(this.tick)
    }

    // addEventListener = (event: string | symbol, listener: Function) => {
    //     super.addListener(event, listener)
    //     this.start()
    // }

    // on: () => {}

    addListener(event: string | symbol, listener: Function) {
        super.addListener(event, listener)
        this.start()
        return this
    }

    on(event: string | symbol, listener: Function) {
        super.on(event, listener)
        this.start()
        return this
    }

    once(event: string | symbol, listener: Function) {
        super.once(event, listener)
        this.start()
        return this
    }

    private tick = () => {

        this.emit("update", this, time() - this.time)
        this.emit("render", this, time() - this.time)

        this.time = time()
        this.counter++
        
        if (this.listenerCount("update") > 0 || this.listenerCount("render") > 0) {
            window.requestAnimationFrame(this.tick)
        }
    }
}

export const DefaultAnimationLoop = new AnimationLoop()