import {assert} from "chai"
// import * as assert from "assert"
import {isolated, asyncError} from "./TestUtils"
import {Layer, Framer, Utils, Context} from "Framer"



isolated("should reset well", (context, done) => {

	context.renderer.manual = true

	let layer = new Layer()
	context.renderer.render()
	// assert.equal(context.renderer.renderStructureCount, 1)
	// assert.equal(context.renderer.renderStyleCount, 0)
	assert.equal(context.renderer.html, `<div data-reactroot=""><div style="position: absolute; width: 200px; height: 200px; background-color: rgba(255, 0, 0, 0.5);"></div></div>`)

	layer.width = 500
	context.renderer.render()
	// assert.equal(context.renderer.renderStructureCount, 1)
	// assert.equal(context.renderer.renderStyleCount, 1)
	assert.equal(context.renderer.html, `<div data-reactroot=""><div style="position: absolute; width: 500px; height: 200px; background-color: rgba(255, 0, 0, 0.5);"></div></div>`)

	context.reset()
	context.renderer.render()
	// assert.equal(context.renderer.renderStructureCount, 2)
	// assert.equal(context.renderer.renderStyleCount, 1)
	assert.equal(context.renderer.html, `<div data-reactroot=""></div>`)

	layer = new Layer()
	context.renderer.render()
	// assert.equal(context.renderer.renderStructureCount, 3)
	// assert.equal(context.renderer.renderStyleCount, 1)
	assert.equal(context.renderer.html, `<div data-reactroot=""><div style="position: absolute; width: 200px; height: 200px; background-color: rgba(255, 0, 0, 0.5);"></div></div>`)

	done()

})


isolated("should reset context", (context, done) => {

	context.renderer.manual = true
	let layer: Layer

	layer = new Layer({width: 500})
	context.renderer.render()
	assert.equal(context.renderer.html, `<div data-reactroot=""><div style="position: absolute; width: 500px; height: 200px; background-color: rgba(255, 0, 0, 0.5);"></div></div>`)

	layer.width = 100
	context.renderer.render()
	assert.equal(context.renderer.html, `<div data-reactroot=""><div style="position: absolute; width: 100px; height: 200px; background-color: rgba(255, 0, 0, 0.5);"></div></div>`)


	context.reset()

	layer = new Layer({width: 500})
	assert.deepEqual(context.layers, [layer])
	assert.equal(context, layer.context)
	assert.equal(context.renderer.dirtyStyle, true)

	context.renderer.render()
	assert.equal(context.renderer.html, `<div data-reactroot=""><div style="position: absolute; width: 500px; height: 200px; background-color: rgba(255, 0, 0, 0.5);"></div></div>`)

	done()

})

isolated("should reset context", (context, done) => {

	context.renderer.manual = true

	const elementCount = document.body.children.length
	let layer


	assert.equal(document.body.children.length, elementCount)

	layer = new Layer({width: 500})
	context.renderer.render()

	assert.equal(document.body.children.length, elementCount)
	// assert.equal(context.renderer.html, `<div data-reactroot=""><div style="position: absolute; width: 500px; height: 200px; background-color: rgba(255, 0, 0, 0.5);"></div></div>`)

	layer.width = 100
	context.renderer.render()
	assert.equal(document.body.children.length, elementCount)
	assert.equal(context.renderer.html, `<div data-reactroot=""><div style="position: absolute; width: 100px; height: 200px; background-color: rgba(255, 0, 0, 0.5);"></div></div>`)

	context.reset()
	context.renderer.render()
	context.renderer.render()
	assert.equal(document.body.children.length, elementCount)
	expect(context.children.length).toEqual(0)
	console.log(document.body.innerHTML);
	
	expect(context.renderer.html).toEqual(`<div data-reactroot=""></div>`)
	

	done()

})

isolated("should diff structure", (context, done) => {

	context.renderer.manual = true

	const elementCount = document.body.children.length
	let layer = new Layer({width: 500})
	expect(layer._element).toBeUndefined()

	context.renderer.render()
	expect(layer._element).toBeInstanceOf(HTMLElement)
	let layerElement = layer._element

	context.reset()

	layer = new Layer()
	context.renderer.render()
	expect(layer._element).toBeInstanceOf(HTMLElement)
	expect(layer._element).toBe(layerElement)

	done()

})