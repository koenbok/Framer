import * as assert from "assert"
import {isolated} from "./TestUtils"
import {Layer, Framer, Utils} from "Framer"

isolated("should render a layer", (context, done) => {
	context.renderer.loop.on("finish", () => {
		try {
			assert.equal(context.renderer.renderStructureCount, 1)
			assert.equal(context.renderer.renderStyleCount, 0)
			assert.equal(context.renderer.html, `<div data-reactroot=""><div style="position: absolute; width: 200px; height: 200px; background-color: rgba(255, 0, 0, 0.5);"></div></div>`)
			done()
		} catch(e) {
			done(e)
		}
	})

	let layer = new Layer({width: 500})
})

isolated("should render with arguments", (context, done) => {
	context.renderer.loop.on("finish", () => {
		try {
			assert.equal(context.renderer.renderStructureCount, 1)
			assert.equal(context.renderer.renderStyleCount, 0)
			assert.equal(context.renderer.html, `<div data-reactroot=""><div style="position: absolute; width: 200px; height: 200px; background-color: rgba(255, 0, 0, 0.5);"></div></div>`)
			done()
		} catch(e) {
			done(e)
		}
	})

	let layer = new Layer({width: 500})
	layer.width = 500
})


//     let layer = new Layer()

// })

// it("should render a layer with property", (done) => {

//     Loop.once("render", () => {
//         expectRenderCount(1, 0)
//         done()
//     })

//     let layer = new Layer({x: 500})

// })

// it.only("should render a layer with property after", (done) => {

//     let count = 0

//     Loop.on("render", () => {

//         console.log("count", count);


//         count++

//         console.log("count", count);

//         if (count == 1) {
//             expectRenderCount(1, 0)
//             layer.x = 500
//         }

//         if (count == 2) {
//             expectRenderCount(1, 1)
//             done()
//         }

//     })

//     let layer = new Layer()
//     layer.x = 100

// })

