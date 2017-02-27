import {expect, assert} from "chai"
// import * as assert from "assert"
import {isolated} from "./Testutils"
import {Layer, Context, utils} from "Framer"

describe("Context", () => {

	isolated.test("should store context", (context, done) => {

		const contextA = new Context("testA")
		const contextB = new Context("testB")

		const layerA = new Layer()

		Context.Current = contextA
		const layerB = new Layer()

		Context.Current = contextB
		const layerC = new Layer()

		expect(layerA.context).to.equal(context)
		expect(layerB.context).to.equal(contextA)
		expect(layerC.context).to.equal(contextB)

		contextA.destroy()
		contextB.destroy()

		done()
	})

	isolated.test("should list children", (context, done) => {

		context.renderer.manual = true

		expect(context.layers.length).to.equal(0)
		expect(context.children.length).to.equal(0)

		const layerA = new Layer()

		expect(context.layers.length).to.equal(1)
		expect(context.children.length).to.equal(1)

		const layerB = new Layer()

		expect(context.layers.length).to.equal(2)
		expect(context.children.length).to.equal(2)

		layerB.parent = layerA

		expect(context.layers.length).to.equal(2)
		expect(context.children.length).to.equal(1)

		const layerC = new Layer({parent: layerA})

		expect(context.layers.length).to.equal(3)
		expect(context.children.length).to.equal(1)

		layerC.parent = null

		expect(context.layers.length).to.equal(3)
		expect(context.children.length).to.equal(2)

		done()
	})

	isolated.test("should use pixelRatio", (context, done) => {

		context.renderer.manual = true
		const layer = new Layer({width: 500})

		context.pixelRatio = 1
		context.renderer.render()
		expect(layer._element.style.width).to.equal("500px")

		context.pixelRatio = 2
		context.renderer.render()
		expect(layer._element.style.width).to.equal("1000px")

		done()
	})

// 	it.only("should reset well", (done) => {

// 		const ctx = new Context("print")
// 		const height = 200

// 		ctx.run(() => {

// 			const background = new Layer({
// 				x: 0,
// 				y: window.innerHeight - height,
// 				width: window.innerWidth,
// 				height: height,
// 				backgroundColor: "blue"
// 			})

// 			background.styles = {
// 				border: "10px solid orange"
// 			}
// 		})

// 		done()

// 	})
// })


// const ctx = new Context("print")
// const height = 200

// ctx.run(() => {

// 	const background = new Layer({
// 		x: 0,
// 		y: window.innerHeight - height,
// 		width: window.innerWidth,
// 		height: height,
// 		backgroundColor: "blue"
// 	})

// 	background.styles = {
// 		border: "10px solid orange"
// 	}
})