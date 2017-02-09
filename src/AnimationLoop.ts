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

let AnimationLoopTimeStep = 1 / 60
let AnimationLoopCounter = 0

export class AnimationLoop extends EventEmitter<AnimationLoopEventNames> {

	private _id = -1
	private _running = false
	private _counter = 0
	private _time = time()

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

	constructor() {
		super()
		this._id = AnimationLoopCounter++
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

		// console.log("AnimationLoop.tick", this.id, this._counter, this.eventListeners());

		if (this.countEventListeners("update") > 0 || this.countEventListeners("render") > 0) {
			raf(this.tick)
		} else {
			this._stop()
		}

		this.emit("update", AnimationLoopTimeStep, time() - this._time)
		this.emit("render", AnimationLoopTimeStep, time() - this._time)

		this._time = AnimationLoopTimeStep
		this._counter++

		this.emit("finish", AnimationLoopTimeStep, time() - this._time)
	}
}

export const DefaultAnimationLoop = new AnimationLoop()