import {EventEmitter} from "EventEmitter"
import {Layer} from "Layer"
import {AnimationTargetInterface} from "Animation"
import {AnimationLoop} from "AnimationLoop"
import {AnimationCurve} from "AnimationCurve"
import {Color} from "Color"

export type AnimatableKeyType = number | Color

export type AnimationKeyEventTypes =
	"AnimationKeyStart" |
	"AnimationKeyStop" |
	"AnimationKeyHalt" |
	"AnimationKeyEnd"

export class AnimationKey<TargetType extends AnimationTargetInterface, AnimationTargetKeys, AnimationCallbackHandler> extends EventEmitter<AnimationKeyEventTypes, AnimationCallbackHandler> {

	private _target: TargetType
	private _key: keyof AnimationTargetKeys
	private _loop: AnimationLoop
	private _from: number
	private _to: number
	private _curve: AnimationCurve
	private _running = false
	private _time = 0

	constructor(
		loop: AnimationLoop,
		target: TargetType,
		key: keyof AnimationTargetKeys,
		from: AnimatableKeyType,
		to: AnimatableKeyType,
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
		this.emit("AnimationKeyStop")
		this._loop.off("update", this._update)
	}

	private _end() {
		this._stop()
		this.emit("AnimationKeyEnd")
	}

	private _update = (delta: number) => {

		this._time += delta

		const target = this._target as any

		target[this._key] = this._value(
			this._curve.value(this._time))

		// When we reach the end we stop the animation and
		// set it to the exact end value.
		if (this._curve.done(this._time)) {
			target[this._key] = this._to
			this._end()
		} else {
			target[this._key] = this._value(
			this._curve.value(this._time))
		}

	}

	private _value(value: number) {
		return this._from + (value * (this._to - this._from))
	}

}

