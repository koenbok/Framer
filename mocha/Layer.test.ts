import {expect} from "chai"
import {isolated} from "./TestUtils"

import {Layer, Linear, Utils} from "Framer"



describe("Layer", () => {

	isolated("should animate a layer", (context, done) => {
		const layer = new Layer()

		layer.animate({x: 100}, Linear(0.2))
			.onEnd(() => {
				Utils.delay(0.1, () => {
					expect(context.renderer.loop.running).to.be.false
					// expect(context.renderer.loop.countEventListeners("render")).to.equal(0)
					// expect(context.renderer.loop.countEventListeners("render")).to.equal(0)
					done()
				})
			})


	})
})

