import {EventEmitter} from "EventEmitter"
import {AnimationLoop} from "AnimationLoop"
import {AnimatableProperties} from "AnimationProperty"
import {Layer} from "Layer"


type AnimationEventTypes = "start" | "stop" | "end"

export class Animation extends EventEmitter<AnimationEventTypes> {

	private _layer: Layer
	private _properties: AnimatableProperties
	private _loop: AnimationLoop

	constructor(layer: Layer, properties: AnimatableProperties, loop=AnimationLoop.Default) {
		super()

		this._layer = layer
		this._properties = properties
	}

	start() {

		// Is there anything to animate

		// Start a property animation for each one

		//

		// this._loop.on("update", this._update)
	}

	// private _update(delta)
}