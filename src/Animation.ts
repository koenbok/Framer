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
	private _animationProperties: AnimationProperty[] = []

	constructor(layer: Layer, properties: AnimatableProperties, curve: AnimationCurve, loop=AnimationLoop.Default) {
		super()

		this._layer = layer
		this._curve = curve
		this._properties = properties
		this._loop = loop
	}

	start() {



		// Is there anything to animate

		// Start a property animation for each one



		for (let key in this._properties) {
			
			const animationProperty = new AnimationProperty(
				this._loop, this._layer, key as any, 
				this._layer[key], this._properties[key], this._curve)
			
			this._animationProperties.push(animationProperty)

			animationProperty.start()
		}

		//

		// this._loop.on("update", this._update)
	}

	// private _update(delta)
}