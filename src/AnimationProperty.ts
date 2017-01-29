import {Layer} from "./Layer"
import {AnimationLoop} from "./AnimationLoop"
import {AnimationCurve} from "./AnimationCurve"


import {Color} from "./Color"


type AnimatablePropertyName = "x" | "y" | "width" | "height" | "backgroundColor" | 
    "minX" | "midX" | "maxX" | 
    "minY" | "midY" | "maxY"

type AnimatablePropertyType = number | Color

interface AnimatableProperties {
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


    constructor(loop: AnimationLoop, target: Layer, key: AnimatablePropertyName, from, to, curve: AnimationCurve, converter=null) {
        let checker: AnimatableProperties = {}
        checker[key] = to
    }


}
