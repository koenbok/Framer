import * as assert from "assert"

import {Layer} from "../Layer"


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
