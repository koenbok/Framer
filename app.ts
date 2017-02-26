

import {Layer, Framer, Context, Utils, Curve} from "Framer"



const run = () => {

	Context.Default.reset()

	let layers = Utils.range(100).map(() => {
		return new Layer({
			x: Math.round(Math.random() * 200),
			y: Math.round(Math.random() * 200)})
	})

	setTimeout(() => {
		layers.forEach((layer) => {
			layer.backgroundColor = Utils.randomColor(0.5)
			layer.animate({x: 0, y: 0})
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



// const layer = new Layer()

// const animation = layer.animate({x: 400}, Curve.springrk4(100, 10))

// animation.on("AnimationStart", () => console.log("AnimationStart"))




// layerC.animate({x: 50, y: 50, options: {curve: Linear(1)}})



let layer = new Layer()


