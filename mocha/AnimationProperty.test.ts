import {expect} from "chai"
import {isolated} from "./TestUtils"

import {Layer} from "Layer"
import {Curve} from "Curve"
import {AnimationProperty} from "AnimationProperty"

describe("AnimationProperty", () => {

	isolated.test("it should set the right value", (context, done) => {

		context.renderer.loop.pause = true

		const layer = new Layer()
		const ap = new AnimationProperty(
			context.renderer.loop, layer, "x",
			100, 160, Curve.linear(1))

		expect(ap.running).to.be.false
		ap.start()
		expect(ap.running).to.be.true

		context.renderer.loop.next()
		expect(layer.x).to.be.closeTo(101, 0.001)

		context.renderer.loop.next()
		expect(layer.x).to.be.closeTo(102, 0.001)

		context.renderer.loop.next(57)
		expect(layer.x).to.be.closeTo(159, 0.001)

		context.renderer.loop.next() // Done
		expect(layer.x).to.equal(160)

		done()

	})

})