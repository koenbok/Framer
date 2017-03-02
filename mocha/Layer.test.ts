import {expect} from "chai"
import {isolated} from "./Testutils"

import {Layer, Curve, utils} from "Framer"

describe("Layer", () => {

	isolated.test("should set key on create", (context, done) => {
		const layer = new Layer({x: 500})
		expect(layer.x).to.equal(500)
		done()
	})

	isolated.test("should set point", (context, done) => {
		const layer = new Layer({point: {x: 500, y: 500}})
		expect(layer.x).to.equal(500)
		expect(layer.y).to.equal(500)
		done()
	})

	isolated.test("should override point if x is set", (context, done) => {
		const layer = new Layer({point: {x: 500, y: 500}, x: 200})
		expect(layer.x).to.equal(200)
		expect(layer.y).to.equal(500)
		done()
	})

	isolated.test("should set key after create", (context, done) => {
		const layer = new Layer()
		layer.x = 500
		expect(layer.x).to.equal(500)
		done()
	})

	isolated.test("should not emit on creation", (context, done) => {
		const layer = new Layer()
		let count = 0
		layer.onChange("x", e => {
			count++

		})
		expect(count).to.equal(0)
		done()
	})

	isolated.test("should emit change event", (context, done) => {
		const layer = new Layer()
		layer.onChange("x", e => {
			expect(layer.x).to.equal(500)
			done()
		})
		layer.x = 500
	})

	isolated.test("should not emit change event on same value", (context, done) => {
		let counter = 0
		const layer = new Layer()
		layer.onChange("x", e => counter++)

		layer.x = 500
		layer.x = 500
		layer.x = 500
		layer.x = 500

		expect(layer.x).to.equal(500)
		expect(counter).to.equal(1)

		done()
	})

	isolated.test("should have start event", (context, done) => {

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

	isolated.test("should list animations", (context, done) => {

		const layer = new Layer()
		const animation = layer.animate({x: 100}, Curve.linear(0.1))
			.onStart(e => expect(layer.animations).to.eql([animation]))
			.onStop(e => expect(layer.animations).to.eql([]))
			.onEnd(e => expect(layer.animations).to.eql([]))
			.onEnd(done)

		expect(layer.animations).to.eql([animation])
	})

	isolated.test("should cancel animations on same key", (context, done) => {

		const layer = new Layer()
		const animationA = layer.animate({x: 100}, Curve.linear(0.1))
		const animationB = layer.animate({x: 100}, Curve.linear(0.1))

		expect(animationA.running).to.be.false
		expect(animationB.running).to.be.true
		expect(layer.animations).to.eql([animationB])
		done()
	})

	isolated.test("should not cancel animations on a different key", (context, done) => {

		const layer = new Layer()
		const animationA = layer.animate({x: 100}, Curve.linear(0.1))
		const animationB = layer.animate({y: 100}, Curve.linear(0.1))

		expect(animationA.running).to.be.true
		expect(animationB.running).to.be.true
		expect(layer.animations).to.eql([animationA, animationB])
		done()
	})

	isolated.test("should move between values", (context, done) => {

		const layer = new Layer({x: 100})
		const animationA = layer.animate({x: 200}, Curve.linear(0.1)).onEnd(done)

		context.renderer.loop.on("finish", () => {
			expect(layer.x >= 100).to.be.true
			expect(layer.x <= 200).to.be.true
		})
	})


	isolated.test("should recieve animation events", (context, done) => {

		let events: string[] = []

		const layer = new Layer()

		layer.animate({x: 100}, Curve.linear(0.1))
		layer.onAnimationStart(e => events.push("AnimationStart"))
		layer.onAnimationStop(e => events.push("AnimationStop"))
		layer.onAnimationEnd(e => events.push("AnimationEnd"))

		layer.onAnimationEnd(e => {
			expect(events).to.eql([
				"AnimationStart",
				"AnimationStop",
				"AnimationEnd"])
			done()
		})
	})

	isolated.test("should not ignore events when dom event added", (context, done) => {

		const layer = new Layer()
		expect(layer.ignoreEvents).to.be.true

		layer.onClick(event => {})
		expect(layer.ignoreEvents).to.be.false
		done()
	})
})

