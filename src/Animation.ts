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

	constructor(layer: Layer, properties: AnimatableProperties, curve: AnimationCurve, loop= AnimationLoop.Default) {

		super()

		this._layer = layer
		this._curve = curve
		this._properties = properties
		this._loop = loop
	}

	readonly start = () => {

		// Is there anything to animate

		// Start a property animation for each one
		this._running = []
		this._finished = []


		for (let key in this._properties) {

			const animationProperty = new AnimationProperty(
				this._loop, this._layer, key as any,
				this._layer[key], this._properties[key], this._curve)

			this._running.push(animationProperty)

			animationProperty.once("PropertAnimationEnd", this._onAnimationPropertyEnd)
			animationProperty.start()
		}

	}

	readonly onStart = (fn: Function) => { this.on("AnimationStart", fn); return this }
	readonly onHalt = (fn: Function) => { this.on("AnimationHalt", fn); return this }
	readonly onStop = (fn: Function) => { this.on("AnimationStop", fn); return this }
	/** Call function when the animation is fully complete */
	readonly onEnd = (fn: Function) => { this.on("AnimationEnd", fn); return this }

	private _onAnimationPropertyEnd = (animationProperty: AnimationProperty) => {

		this._finished.push(animationProperty)

		if (this._running.length === this._finished.length) {
			this.emit("AnimationStop")
			this.emit("AnimationEnd")
		}
	}

	// private _update(delta)
}