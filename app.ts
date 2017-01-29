import * as _ from "lodash"

import {Layer, Framer, Context, Loop} from "Framer"

import {render} from "./src/render/react/ReactRenderer"


let layer = new Layer()

let layerB = new Layer()

layer.x = 400

// setTimeout(() => { 
//     layerB.y = 200
//     layerB.backgroundColor = "blue"

// }, 1000)


const range = n => Array.from({length: n}, (value, key) => key)
const value = () => Math.round(Math.random() * 255)
const randomColor = (alpha=1) => `rgba(${value()}, ${value()}, ${value()}, ${alpha})`

const run = () => {
    Context.Default.reset()

    let layers = range(100).map(() => {
        return new Layer({
            x: Math.round(Math.random() * 500), 
            y: Math.round(Math.random() * 500)})
    })

    setTimeout(() => {
        layers.forEach((layer) => {
            layer.backgroundColor = randomColor(0.5)
        })
    }, 1000)



}

run()
setInterval(run, 2000)

// let layer = new Layer()


// Loop.addEventListener("update", () => {
//     layer.x += 0.1
// })

// Loop.addEventListener("render", () => {
//     render(Framer.Context.Default)
// })


import {AnimationProperty} from "./src/AnimationProperty"
import {AnimationCurve} from "./src/AnimationCurve"

