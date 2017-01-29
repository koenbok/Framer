import * as _ from "lodash"

import {Layer, Framer, Context, Loop} from "./src/Framer"

import {render} from "./src/render/react/ReactRenderer"


let layer = new Layer()

let layerB = new Layer()

layer.x = 400

// setTimeout(() => { 
//     layerB.y = 200
//     layerB.backgroundColor = "blue"

// }, 1000)


const range = n => Array.from({length: n}, (value, key) => key)

const run = () => {
    Context.Default.reset()

    for (let i in range(10)) {
        let layer = new Layer({
            x: Math.round(Math.random()) * 500, 
            y: Math.round(Math.random() * 500)})

        setTimeout(() => {
            layer.backgroundColor = "blue"
        }, 1000)
        
    }

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

