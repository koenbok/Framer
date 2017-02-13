import {expect, assert} from "chai"
// import * as assert from "assert"
import {isolated} from "./TestUtils"
import {Layer, Framer, Utils, Context} from "Framer"

const expectCounts = (context: Context, a, b, c, d) => {
	expect(context.renderer.updateStructureCount).to.equal(a)
	expect(context.renderer.updateStyleCount).to.equal(b)
	expect(context.renderer.renderStructureCount).to.equal(c)
	expect(context.renderer.renderStyleCount).to.equal(d)
}


describe("Renderer", () => {

	isolated.test("should mark dirty properties", (context, done) => {

		context.renderer.loop.pause = true

		const layer = new Layer()
		expect(context.renderer.updateStyleCount).to.equal(5)
		expect(context.renderer.updateStructureCount).to.equal(1)
		expect(context.renderer.renderStyleCount).to.equal(0)
		expect(context.renderer.renderStructureCount).to.equal(0)
		expect(layer._element).to.be.undefined

		context.renderer.loop.next()
		expect(context.renderer.updateStyleCount).to.equal(5)
		expect(context.renderer.updateStructureCount).to.equal(1)
		expect(context.renderer.renderStyleCount).to.equal(1)
		expect(context.renderer.renderStructureCount).to.equal(1)
		expect(layer._element).to.be.instanceof(HTMLElement)

		context.renderer.loop.next()
		expect(context.renderer.updateStyleCount).to.equal(5)
		expect(context.renderer.updateStructureCount).to.equal(1)
		expect(context.renderer.renderStyleCount).to.equal(1)
		expect(context.renderer.renderStructureCount).to.equal(1)

		layer.x = 500

		context.renderer.loop.next()
		expect(context.renderer.updateStyleCount).to.equal(6)
		expect(context.renderer.updateStructureCount).to.equal(1)
		expect(context.renderer.renderStyleCount).to.equal(2)
		expect(context.renderer.renderStructureCount).to.equal(1)

		layer.parent = new Layer()

		context.renderer.loop.next()
		expect(context.renderer.updateStyleCount).to.equal(11)
		expect(context.renderer.updateStructureCount).to.equal(3)
		expect(context.renderer.renderStyleCount).to.equal(3)
		expect(context.renderer.renderStructureCount).to.equal(2)

		done()

	})

})