import {EventEmitter} from "events"

const time = () => window.performance.now()

export class AnimationLoop extends EventEmitter {

    private counter = 0
    private time = time()

    constructor() {
        super()
        this.start()
    }

    start() {
        this.tick()
    }

    addEventListener = (event: string | symbol, listener: Function) => {
        super.addListener(event, listener)
        this.start()
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