import {expect} from "chai"
import {print, utils, Layer, Curve, Context} from "Framer"


const rnd = () => Math.round(Math.random() * 800)
const run = () => {

	Context.Default.reset()

	let layers = utils.range(100).map(() => {
		return new Layer({
			x: rnd(),
			y: rnd()
		})
	})

	setTimeout(() => {
		layers.forEach((layer) => {
			layer.backgroundColor = utils.randomColor(0.5)
			layer.animate({x: rnd(), y: rnd()}, Curve.springrk4(100, 50))
		})
	}, 1000)



}


// const run = () => {

// 	console.log("run");

// 	Context.Default.reset()

// 	let layer = new Layer()
// 	console.log(layer.backgroundColor);


// 	setTimeout(() => {
// 		layer.backgroundColor = utils.randomColor(0.5)
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



// let layerC = new Layer()

// layerC.onClick(event => {
// 	layerC.animate({x: 200}, Curve.springrk4(300, 10))
// 		.onEnd(event => {layerC.x = 0})
// })

// layerC.on("change:x", event => {
// 	if (layerC.x === 0) {
// 		debugger
// 	}
// })



// let layer = new Layer({width: 300})

// // layer.onClick((event) => {
// // 	layer.animate({y: 500}, Curve.springrk4())
// // })


// layer.animate({y: 500}, Curve.linear(10))
// 	.onEnd(event => layer.y = 0)
// 	.onEnd(event => layer.y = 0)

// const randomPoint = () => {
// 	return {
// 		x: Math.random() * 500,
// 		y: Math.random() * 500
// 	}
// }

// for (let i in utils.range(0, 100)) {

// 	let layer = new Layer(randomPoint())

// 	layer.animate(randomPoint(), Curve.linear(10))
// }

let layer = new Layer({x: 100, y: 100})

