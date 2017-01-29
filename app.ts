import * as _ from "lodash"

import {Layer, Framer, Loop} from "./src/Framer"

import {render} from "./src/render/react/ReactRenderer"


let layer = new Layer()

let layerB = new Layer()

console.log(layer);



Loop.addEventListener("update", () => {
    layer.x += 0.1
})

Loop.addEventListener("render", () => {
    render(Framer.Context.Default)
})


import {AnimationProperty} from "./src/AnimationProperty"
import {AnimationCurve} from "./src/AnimationCurve"

let p = new AnimationProperty(Loop, layer, "x", 0, 100, new AnimationCurve())