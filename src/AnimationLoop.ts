import {EventEmitter} from "EventEmitter"
import * as raf from "raf"
import * as utils from "utils"

const performance = (window.performance || {
	offset: Date.now(),
	now: function now() { return Date.now() - this.offset }
})

const time = () => performance.now() / 1000

type AnimationLoopEventNames = "render" | "update" | "finish"
type AnimationLoopDeltaCallback = (this: AnimationLoop, delta: number, loop: AnimationLoop) => void

let AnimationLoopCounter = 0

export class AnimationLoop extends EventEmitter<AnimationLoopEventNames> {

	private _id = -1
	private _running = false
	private _counter = 0
	private _time = time()

	static get Default() {
		return DefaultAnimationLoop
	}

	get running() {
		return this._running
	}

	get id() {
		return this._id
	}

	constructor() {
		super()
		this._id = AnimationLoopCounter++
	}

	on(eventName: AnimationLoopEventNames, handler: Function, once=false) {

		super.on(eventName, handler, once)

		if (eventName === "render" || eventName === "update") {
			if (this._running === false) {
				this._start()
			}
		}

	}

	private _start() {
		this._running = true
		raf(this.tick)
	}

	private _stop() {
		this._running = false
	}

	private tick = () => {

		if (this.countEventListeners("update") > 0 || this.countEventListeners("render") > 0) {
			raf(this.tick)
		} else {
			this._stop()
		}

		this.emit("update", time() - this._time)
		this.emit("render", time() - this._time)

		this._time = time()
		this._counter++

		this.emit("finish", time() - this._time)
	}
}

export const DefaultAnimationLoop = new AnimationLoop()