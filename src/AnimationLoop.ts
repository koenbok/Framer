import {EventEmitter} from "EventEmitter"
import * as Utils from "Utils"

const performance = (window.performance || {
	offset: Date.now(),
	now: () => { return Date.now() - this.offset }
})

let raf

if (process.env.TEST) {
	raf = (f) => setTimeout(f, 0)
} else {
	raf = requestAnimationFrame
}

const time = () => performance.now() / 1000

export type AnimationLoopEventNames = "render" | "update" | "finish"
export type AnimationLoopDeltaCallback = (this: AnimationLoop, delta: number, loop: AnimationLoop) => void

let AnimationLoopTimeStep = 1 / 60
let AnimationLoopCounter = 0

export class AnimationLoop extends EventEmitter<AnimationLoopEventNames> {

	private _id = -1
	private _running = false
	private _counter = 0
	private _time = time()
	private _last = time()
	private _pause = false

	static get Default() {
		return DefaultAnimationLoop
	}

	static set TimeStep(value: number) {
		AnimationLoopTimeStep = value
	}

	static get TimeStep() {
		return AnimationLoopTimeStep
	}

	get running() {
		return this._running
	}

	get id() {
		return this._id
	}

	get pause() {
		return this._pause
	}

	set pause(value: boolean) {
		this._pause = value
	}

	constructor() {
		super()
		this._id = AnimationLoopCounter++
	}

	next(n= 1) {

		if (!this.pause) {
			throw Error("Loop is not paused")
		}

		for (let i = 0; i < n; i++) {
			this.tick()
		}
	}

	addEventListener(eventName: AnimationLoopEventNames, fn: Function, once: boolean, context: Object) {
		super.addEventListener(eventName, fn, once, this)

		if (eventName === "render" || eventName === "update") {
			if (this._running === false) {
				this._start()
			}
		}

	}

	private _start() {
		console.log("_start");
		this._running = true
		raf(this.tick)
	}

	private _stop() {
		console.log("_stop");
		this._running = false
	}

	private tick = () => {

		if (this._counter % 30 === 0) {
			console.log("tick", this._counter, 1 / (time() - this._last))
		}

		if (!this.pause) {
			if (
				this.countEventListeners("update") > 0 ||
				this.countEventListeners("render") > 0) {
				raf(this.tick)
			} else {
				this._stop()
			}
		}

		this.emit("update", AnimationLoopTimeStep, time() - this._time)
		this.emit("render", AnimationLoopTimeStep, time() - this._time)

		this._last = time()
		this._time = AnimationLoopTimeStep
		this._counter++

		this.emit("finish", AnimationLoopTimeStep, time() - this._time)
	}
}

export const DefaultAnimationLoop = new AnimationLoop()