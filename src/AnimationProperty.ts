import {EventEmitter} from "EventEmitter"
import {Layer} from "Layer"
import {AnimationLoop} from "AnimationLoop"
import {AnimationCurve} from "AnimationCurve"


import {Color} from "./Color"

type AnimatablePropertyType = number | Color

type PropertyAnimationEventTypes =
	"PropertyAnimationStart" |
	"PropertAnimationStop" |
	"PropertAnimationHalt" |
	"PropertAnimationEnd"

export interface AnimatableProperties {
	x?: number
	y?: number
	width?: number,
	height?: number,
	backgroundColor?: string | Color
	minX?: number
	midX?: number
	maxX?: number
	minY?: number
	midY?: number
	maxY?: number
}

type AnimatablePropertyName = keyof AnimatableProperties

export class AnimationProperty extends EventEmitter<PropertyAnimationEventTypes> {

	private _target: Layer
	private _key: AnimatablePropertyName
	private _loop: AnimationLoop
	private _from: number
	private _to: number
	private _curve: AnimationCurve
	private _running = false
	private _time = 0

	constructor(
		loop: AnimationLoop,
		target: Layer,
		key: AnimatablePropertyName,
		from: AnimatablePropertyType,
		to: AnimatablePropertyType ,
		curve: AnimationCurve,
		converter: null|Function= null) {

		super()

		this._target = target
		this._key = key
		this._loop = loop
		this._from = from as number
		this._to = to as number
		this._curve = curve

	}

	get running() {
		return this._running
	}

	get from() {
		return this._from
	}

	get to() {
		return this._to
	}

	start() {
		if (this.running === true) { return }
		this._running = true
		this._start()
	}

	stop() {
		if (this.running === false) { return }
		this._stop()
		this._running = false
	}

	private _start() {
		this._loop.on("update", this._update)
	}

	private _stop() {
		this.emit("PropertAnimationStop")
		this._loop.off("update", this._update)
	}

	private _end() {
		this._stop()
		this.emit("PropertAnimationEnd")
	}

	private _update = (delta: number) => {

		// console.log("_update", this._time);
		// console.log(this._loop.countEventListeners("render"), this._loop.countEventListeners("update"))


		this._target[this._key] = this._value(this._curve.value(this._time))

		if (this._curve.done(this._time)) {
			this._end()
		}

		this._time += delta

	}

	private _value(value) {
		return value * (this._from + (this._to - this._from))
	}

}

