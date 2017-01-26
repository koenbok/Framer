import * as assert from "assert"

import {Collection} from "../Collection"

interface Layer {
	id: number|string
}

it("should add and remove", () => {

	let layers = new Collection<Layer>()
	let layerA: Layer = {id: 0}

	layerA.id = layers.add(layerA)
	assert.equal(layerA.id, 1)
	assert.equal(layers.getId(layerA), 1)
	assert.equal(layers.count, 1)
	assert.equal(layers.get(1), layerA)
	assert.equal(layers.contains(layerA), true)

	layers.remove(layerA)
	assert.equal(layers.count, 0)
	assert.equal(layers.get(1), undefined)
	assert.equal(layers.getId(layerA), -1)
	assert.equal(layers.contains(layerA), false)
})
