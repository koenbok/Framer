import * as Utils from "Utils"
import {EventEmitter} from "EventEmitter"
import {AnimationLoop} from "AnimationLoop"
import {AnimationCurve} from "AnimationCurve"
import {AnimatableProperties, AnimationProperty} from "AnimationProperty"
import {Layer} from "Layer"

export type AnimationEventTypes =
	"AnimationStart" |
	"AnimationStop" |
	"AnimationHalt" |
	"AnimationEnd"

export class Animation extends EventEmitter<AnimationEventTypes> {

	private _layer: Layer
	private _curve: AnimationCurve
	private _properties: AnimatableProperties
	private _loop: AnimationLoop
	private _running: AnimationProperty[] = []
	private _finished: AnimationProperty[] = []

	constructor(
		layer: Layer,
		properties: AnimatableProperties,
		curve: AnimationCurve,
		loop= AnimationLoop.Default
	) {

		super()

		this._layer = layer
		this._curve = curve
		this._properties = properties
		this._loop = loop
	}

	/** Start this animation. */
	readonly start = () => {

		// Is there anything to animate
		if (!Object.keys(this._properties).length) {
			return false
		}

		return this._start()
	}

	/** Stop this animation. */
	readonly stop = () => {

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

	readonly onStart = (fn: Function) => { this.on("AnimationStart", fn); return this }
	readonly onHalt = (fn: Function) => { this.on("AnimationHalt", fn); return this }
	readonly onStop = (fn: Function) => { this.on("AnimationStop", fn); return this }
	/** Call function when the animation is fully complete */
	readonly onEnd = (fn: Function) => { this.on("AnimationEnd", fn); return this }

	private _reset  = () => {
		this._running = []
		this._finished = []
	}

	private _start = (): boolean => {

		// Stop all other animations with conflicting properties
		for (let animation of this._layer.animations) {
			for (let key in this._properties) {
				if (animation._properties.hasOwnProperty(key)) {
					animation.stop()
					continue
				}
			}
		}

		this._reset()

		for (let key in this._properties) {

			let a = this._layer[key]
			let b = this._properties[key]

			if (a === b) {
				continue
			}

			const animationProperty = new AnimationProperty(
				this._loop,
				this._layer,
				key as any, a, b,
				this._curve
			)

			this._running.push(animationProperty)

			animationProperty.once("PropertAnimationEnd", this._onAnimationPropertyEnd)
			animationProperty.start()
		}

		let started = this._running.length > 0

		if (this.running) {
			this._layer._animations.add(this)
			Utils.delay(0, () => this.emit("AnimationStart"))
		}

		return started
	}

	private _halt = () => {
		this.emit("AnimationHalt")
	}

	private _stop = () => {

		for (let animationProperty of this._running) {
			animationProperty.stop()
		}

		this._layer._animations.remove(this)

		this.emit("AnimationStop")
		this._reset()
	}

	private _onAnimationPropertyEnd = (animationProperty: AnimationProperty) => {

		this._finished.push(animationProperty)

		if (!this.running) {
			this._stop()
			this.emit("AnimationEnd")
		}
	}

}