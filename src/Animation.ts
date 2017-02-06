import {EventEmitter} from "EventEmitter"
import {AnimationLoop} from "AnimationLoop"
import {AnimationCurve} from "AnimationCurve"
import {AnimatableProperties, AnimationProperty} from "AnimationProperty"
import {Layer} from "Layer"


type AnimationEventTypes = "start" | "stop" | "end"

export class Animation extends EventEmitter<AnimationEventTypes> {

	private _layer: Layer
	private _curve: AnimationCurve
	private _properties: AnimatableProperties
	private _loop: AnimationLoop
	private _running: AnimationProperty[] = []
	private _finished: AnimationProperty[] = []
	private _finishedCallback?: Function

	constructor(layer: Layer, properties: AnimatableProperties, curve: AnimationCurve, finishedCallback?: Function, loop=AnimationLoop.Default) {
		super()

		this._layer = layer
		this._curve = curve
		this._properties = properties
		this._loop = loop
		this._finishedCallback = finishedCallback
	}

	start() {



		// Is there anything to animate

		// Start a property animation for each one
		this._running = []
		this._finished = []


		for (let key in this._properties) {

			const animationProperty = new AnimationProperty(
				this._loop, this._layer, key as any,
				this._layer[key], this._properties[key], this._curve,
				this._onAnimationPropertyFinished)

			this._running.push(animationProperty)

			animationProperty.start()
		}

		//

		// this._loop.on("update", this._update)
	}

	private _onAnimationPropertyFinished(animationProperty: AnimationProperty) {
		this._finished.push(animationProperty)

		if (this._finishedCallback) {
			if (this._running.length === this._finished.length) {
				this._finishedCallback()
			}
		}
	}

	// private _update(delta)
}