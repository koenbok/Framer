import * as assert from "assert"
import * as utils from "Utils"
import {isolated} from "./TestUtils"
import {Layer} from "Layer"
import {Linear} from "AnimationCurve"


it("should have defaults", () => {

	let layer = new Layer()

	assert.equal(layer.x, 0)
	assert.equal(layer.y, 0)
	assert.equal(layer.width, 200)
	assert.equal(layer.height, 200)
})

it("should take defaults", () => {

	let layer = new Layer({x: 500, y: 500})

	assert.equal(layer.x, 500)
	assert.equal(layer.y, 500)
})

it("should set dirty", () => {

	let layer = new Layer()

	layer.x = 500
	layer.y = 500

	assert.equal(layer.isDirty(), true)
	assert.deepEqual(layer.dirtyValues(), {x: 500, y: 500})

})

it("should flush", () => {

	let layer = new Layer()

	layer.x = 500
	layer.y = 500

	assert.equal(layer.isDirty(), true)
	assert.deepEqual(layer.dirtyValues(), {x: 500, y: 500})

	layer.flush()

	assert.equal(layer.isDirty(), false)
	assert.deepEqual(layer.dirtyValues(), {})

})

it("should set parent", () => {

	let layerA = new Layer()
	let layerB = new Layer()

	assert.equal(layerA.parent, null)

	layerA.parent = layerB
	assert.equal(layerA.parent, layerB)
	assert.deepEqual(layerB.children, [layerA])

})

isolated("should animate", (context, done) => {

	let count = 0

	context.renderer.loop.on("finish", () => {
		console.log(count, layerA.x);
		count++



	})

	let layerA = new Layer()

	layerA.animate({x: 100}, Linear(1), () => {
		done()
	})




})