import {expect, assert} from "chai"
// import * as assert from "assert"
import {isolated} from "./TestUtils"
import {Layer, Framer, Utils, Context} from "Framer"

describe("General", () => {

	isolated.test("should reset well", (context, done) => {

		context.renderer.manual = true

		let layer = new Layer()
		context.renderer.render()
		// assert.equal(context.renderer.renderStructureCount, 1)
		// assert.equal(context.renderer.renderStyleCount, 0)
		assert.equal(context.renderer.element.children[0].childElementCount, 1)

		layer.width = 500
		context.renderer.render()
		// assert.equal(context.renderer.renderStructureCount, 1)
		// assert.equal(context.renderer.renderStyleCount, 1)
		assert.equal(context.renderer.element.children[0].childElementCount, 1)
		assert.equal(layer._element.style.width, "500px")

		context.reset()
		context.renderer.render()
		assert.equal(context.renderer.element.children[0].childElementCount, 0)

		layer = new Layer()
		context.renderer.render()
		assert.equal(context.renderer.element.children[0].childElementCount, 1)
		assert.equal(layer._element!.style.width, "200px")

		done()

	})


	isolated.test("should reset context", (context, done) => {

		context.renderer.manual = true
		let layer: Layer

		layer = new Layer({width: 500})
		context.renderer.render()
		assert.equal(context.renderer.element.children[0].childElementCount, 1)
		assert.equal(layer._element!.style.width, "500px")

		layer.width = 100
		context.renderer.render()
		assert.equal(context.renderer.element.children[0].childElementCount, 1)
		assert.equal(layer._element!.style.width, "100px")

		context.reset()

		layer = new Layer({width: 500})
		expect(layer._element).to.not.be.instanceof(HTMLElement)
		assert.deepEqual(context.layers, [layer])
		assert.equal(context, layer.context)
		assert.equal(context.renderer.hasDirtyStructure, true)
		assert.equal(context.renderer.hasDirtyStyleItems, true)

		context.renderer.render()
		assert.equal(context.renderer.hasDirtyStructure, false)
		assert.equal(context.renderer.hasDirtyStyleItems, false)

		assert.equal(context.renderer.element.children[0].childElementCount, 1)
		assert.equal(layer._element.style.width, "500px")

		done()

	})

	isolated.test("should diff structure", (context, done) => {

		context.renderer.manual = true

		const elementCount = document.body.children.length
		let layer = new Layer({width: 500})
		expect(layer._element).to.equal(undefined)

		context.renderer.render()
		expect(layer._element).instanceof(HTMLElement)
		let layerElement = layer._element

		context.reset()

		layer = new Layer()
		context.renderer.render()
		expect(layer._element).instanceof(HTMLElement)
		expect(layer._element).to.equal(layerElement)

		done()

	})

})