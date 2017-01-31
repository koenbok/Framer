import {Layer} from "./Layer"
import {AnimationLoop} from "./AnimationLoop"
import {AnimationCurve} from "./AnimationCurve"


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

	private _layer: Layer
	private _key: AnimatablePropertyName
	private _loop: AnimationLoop
    private _from: AnimatablePropertyType
    private _to: AnimatablePropertyType
    private _curve: AnimationCurve
    private _running = false

    constructor(loop: AnimationLoop, layer: Layer, key: AnimatablePropertyName, from: AnimatablePropertyType, to: AnimatablePropertyType , curve: AnimationCurve, converter:null|Function=null) {

        this._layer = layer
        this._key = key
        this._loop = loop
        this._from = from
        this._to = to
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
    }

    stop() {}

    private _start() {
        this._loop.on("update", this._update)
    }

    private _stop() {}

    private _update(delta: number) {
        console.log("_update", delta);

    }

}

