import * as utils from "utils"
import {BaseClass} from "BaseClass"
import {AnimationLoop} from "AnimationLoop"
import {AnimationCurve} from "AnimationCurve"
import {AnimatableKeys, AnimationKey} from "AnimationKey"
import {Layer} from "Layer"

export type AnimationEventTypes =
	"AnimationStart" |
	"AnimationStop" |
	"AnimationHalt" |
	"AnimationEnd"

export class Animation extends BaseClass<AnimationEventTypes> {

	private _layer: Layer
	private _curve: AnimationCurve
	private _keys: AnimatableKeys
	private _loop: AnimationLoop
	private _running: AnimationKey[] = []
	private _finished: AnimationKey[] = []

	constructor(
		layer: Layer,
		keys: AnimatableKeys,
		curve: AnimationCurve,
		loop: AnimationLoop | null= null
	) {

		super()

		this._layer = layer
		this._curve = curve
		this._keys = keys
		this._loop = loop || this._layer.context.renderer.loop
	}

	/** Start this animation. */
	start() {

		// Is there anything to animate
		if (!Object.keys(this._keys).length) {
			return false
		}

		return this._start()
	}

	/** Stop this animation. */
	stop() {

		if (!this.running) {
			return
		}

		this._halt()
		this._stop()
	}

	/** Is this animation currently running. */
	get running() {
		return this._running.length > 0 && (this._running.length !== this._finished.length)
	}

	onStart(fn: Function) { this.on("AnimationStart", fn); return this }
	onHalt(fn: Function) { this.on("AnimationHalt", fn); return this }
	onStop(fn: Function) { this.on("AnimationStop", fn); return this }
	/** Call function when the animation is fully complete */
	onEnd(fn: Function) { this.on("AnimationEnd", fn); return this }

	emit(eventName: AnimationEventTypes, ...args: any[]) {
		super.emit(eventName, ...args)
		this._layer.emit(eventName, args)
	}

	private _reset() {
		this._running = []
		this._finished = []
	}

	private _start(): boolean {

		// TODO: Delay, Repeat

		// Stop all other animations with conflicting keys
		for (let animation of this._layer.animations) {
			for (let key in this._keys) {
				if (animation._keys.hasOwnProperty(key)) {
					animation.stop()
					continue
				}
			}
		}

		this._reset()

		for (let key in this._keys) {

			let a = this._layer[key]
			let b = this._keys[key]

			if (a === b) {
				continue
			}

			const animationKey = new AnimationKey(
				this._loop,
				this._layer,
				key as any, a, b,
				this._curve
			)

			this._running.push(animationKey)

			animationKey.once("AnimationKeyEnd", this._onKeyAnimationEnd)
			animationKey.start()
		}

		let started = this._running.length > 0

		if (this.running) {
			this._layer._animations.add(this)
			utils.delay(0, () => this.emit("AnimationStart"))
		}

		return started
	}

	private _halt() {
		this.emit("AnimationHalt")
	}

	private _stop() {

		for (let animationKey of this._running) {
			animationKey.stop()
		}

		this._layer._animations.remove(this)

		this.emit("AnimationStop")
		this._reset()
	}

	private _onKeyAnimationEnd = (animationKey: AnimationKey) => {

		this._finished.push(animationKey)

		if (!this.running) {
			this._stop()
			this.emit("AnimationEnd")
		}
	}

}