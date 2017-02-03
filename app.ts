import * as _ from "lodash"

import {Layer, Framer, Context, Loop, Utils} from "Framer"

import {Linear} from "AnimationCurve"



const run = () => {

	Context.Default.reset()

	let layers = Utils.range(100).map(() => {
		return new Layer({
			x: Math.round(Math.random() * 500),
			y: Math.round(Math.random() * 500)})
	})

	setTimeout(() => {
		layers.forEach((layer) => {
			layer.backgroundColor = Utils.randomColor(0.5)
		})
	}, 1000)



}


// const run = () => {

// 	console.log("run");

// 	Context.Default.reset()

// 	let layer = new Layer()
// 	console.log(layer.backgroundColor);


// 	setTimeout(() => {
// 		layer.backgroundColor = Utils.randomColor(0.5)
// 	}, 1000)

// }

// run()
// setInterval(run, 2000)

// let layer = new Layer()


// Loop.addEventListener("update", () => {
//     layer.x += 0.1
// })

// Loop.addEventListener("render", () => {
//     render(Framer.Context.Default)
// })

import {AnimationLoop} from "./src/AnimationLoop"
import {AnimationProperty} from "./src/AnimationProperty"
import {AnimationCurveLinear} from "./src/AnimationCurve"

let layerC = new Layer()

layerC.animate({x: 500, options: {curve: Linear(200)}})