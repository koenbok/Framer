import * as assert from "assert"

import {Layer, Framer, Context, Loop, Utils, Renderer} from "Framer"


const run = (f: (context: Context) => void) => {
	const context = new Context(new Renderer(new AnimationLoop()))
}

describe("renderer", () => {

	const expectRenderCount = (structure: number, style: number) => {
		assert.equal(Context.Current.renderer.renderStructureCount, structure)
		assert.equal(Context.Current.renderer.renderStyleCount, style)
	}

	it("is fake", () => {

	})

	it("should render a layer", (done) => {


		Loop.on("render", () => {

			console.log("render");


		})

		Loop.on("finish", () => {

			expectRenderCount(1, 0)
			done()

		})

		let layer = new Layer()
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

})