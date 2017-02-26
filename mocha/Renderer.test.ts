import {expect, assert} from "chai"
import {isolated} from "./TestUtils"
import {Layer, Framer, Utils, Context} from "Framer"



describe("Renderer", () => {

	isolated.test("should mark dirty properties", (context, done) => {

		context.renderer.loop.pause = true

		const layer = new Layer()

		expect(context.renderer.counters.updateStructure).to.equal(1)
		expect(context.renderer.counters.updateKeyStyle).to.equal(0)
		expect(context.renderer.counters.updateCustomStyles).to.equal(0)
		expect(context.renderer.counters.renderStructure).to.equal(0)
		expect(context.renderer.counters.renderStyle).to.equal(0)
		expect(layer._element).to.be.undefined

		context.renderer.loop.next()
		expect(context.renderer.counters.updateStructure).to.equal(1)
		expect(context.renderer.counters.updateKeyStyle).to.equal(0)
		expect(context.renderer.counters.updateCustomStyles).to.equal(0)
		expect(context.renderer.counters.renderStructure).to.equal(1)
		expect(context.renderer.counters.renderStyle).to.equal(0)
		expect(layer._element).to.be.instanceof(HTMLElement)

		context.renderer.loop.next()
		expect(context.renderer.counters.updateStructure).to.equal(1)
		expect(context.renderer.counters.updateKeyStyle).to.equal(0)
		expect(context.renderer.counters.updateCustomStyles).to.equal(0)
		expect(context.renderer.counters.renderStructure).to.equal(1)
		expect(context.renderer.counters.renderStyle).to.equal(0)

		layer.x = 500

		context.renderer.loop.next()
		expect(context.renderer.counters.updateStructure).to.equal(1)
		expect(context.renderer.counters.updateKeyStyle).to.equal(1)
		expect(context.renderer.counters.updateCustomStyles).to.equal(0)
		expect(context.renderer.counters.renderStructure).to.equal(1)
		expect(context.renderer.counters.renderStyle).to.equal(1)

		layer.parent = new Layer()

		context.renderer.loop.next()
		expect(context.renderer.counters.updateStructure).to.equal(3)
		expect(context.renderer.counters.updateKeyStyle).to.equal(1)
		expect(context.renderer.counters.updateCustomStyles).to.equal(0)
		expect(context.renderer.counters.renderStructure).to.equal(2)
		expect(context.renderer.counters.renderStyle).to.equal(1)

		done()

	})

})