import * as utils from "Utils"
import {BaseClass} from "BaseClass"
import {Context} from "Context"
import {Color} from "Color"
import {AnimationLoop} from "AnimationLoop"
import {AnimationCurve} from "AnimationCurve"
import {AnimationKey} from "AnimationKey"
import {LayerCallbackHandler} from "Layer"

export interface AnimationTargetInterface {
	emit: Function
}

export type AnimationEventTypes =
	"AnimationStart" |
	"AnimationStop" |
	"AnimationHalt" |
	"AnimationEnd"

export type AnimationValueType = number | Color

export class Animation<AnimationTarget extends AnimationTargetInterface, AnimationTargetKeys> extends BaseClass<AnimationEventTypes> {

	private _context: Context
	private _target: AnimationTarget
	private _curve: AnimationCurve
	private _keys: AnimationTargetKeys
	// private _loop: AnimationLoop
	private _running: AnimationKey<AnimationTarget, AnimationTargetKeys>[] = []
	private _finished: AnimationKey<AnimationTarget, AnimationTargetKeys>[] = []

	constructor(
		context: Context,
		target: AnimationTarget,
		keys: AnimationTargetKeys,
		curve: AnimationCurve,
		loop: AnimationLoop | null= null
	) {

		super()

		this._context = context
		this._target = target
		this._curve = curve
		this._keys = keys
	}

	get target() {
		return this._target
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

	onStart(fn: LayerCallbackHandler) { this.on("AnimationStart", fn); return this }
	onHalt(fn: LayerCallbackHandler) { this.on("AnimationHalt", fn); return this }
	onStop(fn: LayerCallbackHandler) { this.on("AnimationStop", fn); return this }
	/** Call function when the animation is fully complete */
	onEnd(fn: LayerCallbackHandler) { this.on("AnimationEnd", fn); return this }

	emit(eventName: AnimationEventTypes, ...args: any[]) {
		super.emit(eventName, ...args)
		this._target.emit(eventName, args)
	}

	private _reset() {
		this._running = []
		this._finished = []
	}

	private _start(): boolean {

		// TODO: Delay, Repeat

		const animations = this._context.animationsForTarget(this._target)

		// Stop all other animations with conflicting keys
		for (let animation of animations) {
			for (let key in this._keys) {
				if (animation._keys.hasOwnProperty(key)) {
					animation.stop()
					continue
				}
			}
		}

		this._reset()

		for (let key in this._keys) {

			let a: AnimationValueType = (this._target as any)[key]
			let b: AnimationValueType = (this._keys as any)[key]

			if (a === b) {
				continue
			}

			const animationKey = new AnimationKey<AnimationTarget, AnimationTargetKeys>(
				this._context.renderer.loop,
				this._target,
				key, a, b,
				this._curve
			)

			this._running.push(animationKey)

			animationKey.once("AnimationKeyEnd", this._onKeyAnimationEnd)
			animationKey.start()
		}

		let started = this._running.length > 0

		if (this.running) {
			this._context._animations.add(this)
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

		this._context._animations.remove(this)

		this.emit("AnimationStop")
		this._reset()
	}

	private _onKeyAnimationEnd = (animationKey: AnimationKey<AnimationTarget, AnimationTargetKeys>) => {

		this._finished.push(animationKey)

		if (!this.running) {
			this._stop()
			this.emit("AnimationEnd")
		}
	}

}