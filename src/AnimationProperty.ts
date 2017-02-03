import {Layer} from "./Layer"
import {AnimationLoop} from "./AnimationLoop"
import {AnimationCurve, AnimationCurveLinear} from "./AnimationCurve"


import {Color} from "./Color"




type AnimatablePropertyType = number | Color

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

type AnimatablePropertyName = "x" | "y" | "width" | "height" | "backgroundColor" |
	"minX" | "midX" | "maxX" |
	"minY" | "midY" | "maxY"

// export let PropertyMap: {[key in AnimatablePropertyList]: string };

// PropertyMap = {
//     x: "number",
//     y: "number",
//     width: "number",
//     height: "number",
//     backgroundColor: "color",
//     minX: "number",
//     midX: "number",
//     maxX: "number",
//     minY: "number",
//     midY: "number",
//     maxY: "number",
// }


export class AnimationProperty {

	private _target: Layer
	private _key: AnimatablePropertyName
	private _loop: AnimationLoop
	private _from: number
	private _to: number
	private _curve: AnimationCurve
	private _running = false
	private _time = 0

	constructor(loop: AnimationLoop, target: Layer, key: AnimatablePropertyName, from: AnimatablePropertyType, to: AnimatablePropertyType , curve: AnimationCurve, converter:null|Function=null) {

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
		this._loop.off("update", this._update)
	}

	private _update = (delta: number) => {

		this._target[this._key] = this._value(this._curve.value(this._time))
		
		if (this._curve.done(this._time)) {
			this.stop()
		}

		this._time += delta

	}

	private _value(value) {
		return value * (this._from + (this._to - this._from))
	}

}

