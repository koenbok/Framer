import * as assert from "assert"

import {EventEmitter} from "EventEmitter"

const counter = () => {
	let count = 0
	return {
		value: () => count,
		add: () => count++
	}
} 


it("should emit", () => {

	let em = new EventEmitter<"test">()
	const count = counter()

	em.on("test", count.add)

	em.emit("test")
	assert.equal(count.value(), 1)

	em.emit("test")
	assert.equal(count.value(), 2)

	em.emit("test")
	assert.equal(count.value(), 3)
})

it("should once", () => {

	let em = new EventEmitter<"test">()
	const count = counter()

	em.once("test", count.add)

	em.emit("test")
	assert.equal(count.value(), 1)

	em.emit("test")
	assert.equal(count.value(), 1)

	em.emit("test")
	assert.equal(count.value(), 1)
})

it("should schuedlue", () => {

	let em = new EventEmitter<"test">()
	const count = counter()

	em.schedule("test", count.add)
	em.schedule("test", count.add)
	em.schedule("test", count.add)
	em.schedule("test", count.add)

	em.emit("test")
	assert.equal(count.value(), 1)

})