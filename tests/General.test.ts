import * as assert from "assert"
import {isolated, asyncError} from "./TestUtils"
import {Layer, Framer, Utils, Context} from "Framer"

isolated("should render a layer", (context, done) => {
	context.renderer.loop.on("finish", asyncError(done, () => {
		assert.equal(context.renderer.renderStructureCount, 1)
		assert.equal(context.renderer.renderStyleCount, 0)
		assert.equal(context.renderer.html, `<div data-reactroot=""><div style="position: absolute; width: 200px; height: 200px; background-color: rgba(255, 0, 0, 0.5);"></div></div>`)
		done()
	}))

	let layer = new Layer()
})

isolated("should render a layer with arguments", (context, done) => {
	context.renderer.loop.on("finish", asyncError(done, () => {
		assert.equal(context.renderer.renderStructureCount, 1)
		assert.equal(context.renderer.renderStyleCount, 0)
		assert.equal(context.renderer.html, `<div data-reactroot=""><div style="position: absolute; width: 500px; height: 200px; background-color: rgba(255, 0, 0, 0.5);"></div></div>`)
		done()
	}))

	let layer = new Layer({width: 500})
})

isolated("should reset well", (context, done) => {

	context.renderer.manual = true

	let layer = new Layer()
	context.renderer.render()
	assert.equal(context.renderer.renderStructureCount, 1)
	assert.equal(context.renderer.renderStyleCount, 0)
	assert.equal(context.renderer.html, `<div data-reactroot=""><div style="position: absolute; width: 200px; height: 200px; background-color: rgba(255, 0, 0, 0.5);"></div></div>`)

	layer.width = 500
	context.renderer.render()
	assert.equal(context.renderer.renderStructureCount, 1)
	assert.equal(context.renderer.renderStyleCount, 1)
	assert.equal(context.renderer.html, `<div data-reactroot=""><div style="position: absolute; width: 500px; height: 200px; background-color: rgba(255, 0, 0, 0.5);"></div></div>`)

	context.reset()
	context.renderer.render()
	assert.equal(context.renderer.renderStructureCount, 2)
	assert.equal(context.renderer.renderStyleCount, 1)
	assert.equal(context.renderer.html, `<div data-reactroot=""></div>`)

	layer = new Layer()
	context.renderer.render()
	assert.equal(context.renderer.renderStructureCount, 3)
	assert.equal(context.renderer.renderStyleCount, 1)
	assert.equal(context.renderer.html, `<div data-reactroot=""><div style="position: absolute; width: 200px; height: 200px; background-color: rgba(255, 0, 0, 0.5);"></div></div>`)

	done()

})


isolated("should reset wellssss", (context, done) => {

	context.renderer.manual = true

	let layer = new Layer()
	layer.width = 500
	context.renderer.render()

	context.reset()
	layer = new Layer()
	context.renderer.render()
	assert.equal(context.renderer.html, `<div data-reactroot=""><div style="position: absolute; width: 200px; height: 200px; background-color: rgba(255, 0, 0, 0.5);"></div></div>`)


	done()

})