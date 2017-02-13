import {expect} from "chai"
import {isolated} from "./TestUtils"

import {Layer, Curve, Utils} from "Framer"


describe("Layer", () => {

	isolated("should have start event", (context, done) => {

		let events: string[] = []

		const layer = new Layer()
		const animation = layer.animate({x: 100}, Curve.linear(0.1))
			.onStart(e => events.push("AnimationStart"))
			.onStop(e => events.push("AnimationStop"))
			.onEnd(e => events.push("AnimationEnd"))
			.onEnd(e => {
				expect(events).to.eql([
					"AnimationStart",
					"AnimationStop",
					"AnimationEnd"])
				done()
			})
	})

	isolated("should list animations", (context, done) => {

		const layer = new Layer()
		const animation = layer.animate({x: 100}, Curve.linear(0.1))
			.onStart(e => expect(layer.animations).to.eql([animation]))
			.onStop(e => expect(layer.animations).to.eql([]))
			.onEnd(e => expect(layer.animations).to.eql([]))
			.onEnd(done)

		expect(layer.animations).to.eql([animation])
	})

	isolated("should cancel animations on same property", (context, done) => {

		const layer = new Layer()
		const animationA = layer.animate({x: 100}, Curve.linear(0.1))
		const animationB = layer.animate({x: 100}, Curve.linear(0.1))

		expect(animationA.running).to.be.false
		expect(animationB.running).to.be.true
		expect(layer.animations).to.eql([animationB])
		done()
	})

})

