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

	const em = new EventEmitter<"test">()
	const count = counter()

	em.on("test", count.add)

	em.emit("test")
	assert.equal(count.value(), 1)

	em.emit("test")
	assert.equal(count.value(), 2)

	em.emit("test")
	assert.equal(count.value(), 3)
})

it("should remove by handler", () => {

	const em = new EventEmitter<"testA" | "testB">()
	const countA = counter()
	const countB = counter()

	em.on("testA", countA.add)
	em.on("testB", countB.add)

	em.emit("testA")
	em.emit("testB")
	assert.equal(countA.value(), 1)
	assert.equal(countB.value(), 1)

	em.removeEventListeners("testA", countA.add)

	em.emit("testA")
	em.emit("testB")
	assert.equal(countA.value(), 1)
	assert.equal(countB.value(), 2)

})


it("should remove by name", () => {

	const em = new EventEmitter<"testA" | "testB">()
	const countA = counter()
	const countB = counter()

	em.on("testA", countA.add)
	em.on("testB", countB.add)

	em.emit("testA")
	em.emit("testB")
	assert.equal(countA.value(), 1)
	assert.equal(countB.value(), 1)

	em.removeEventListeners("testA")

	em.emit("testA")
	em.emit("testB")
	assert.equal(countA.value(), 1)
	assert.equal(countB.value(), 2)

})


it("should remove all", () => {

	const em = new EventEmitter<"testA" | "testB">()
	const countA = counter()
	const countB = counter()

	em.on("testA", countA.add)
	em.on("testB", countB.add)

	em.emit("testA")
	em.emit("testB")
	assert.equal(countA.value(), 1)
	assert.equal(countB.value(), 1)

	em.removeEventListeners()

	em.emit("testA")
	em.emit("testB")
	assert.equal(countA.value(), 1)
	assert.equal(countB.value(), 1)

})

it("should once", () => {

	const em = new EventEmitter<"test">()
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

	const em = new EventEmitter<"test">()
	const count = counter()

	assert.equal(em.schedule("test", count.add), true)
	assert.equal(em.schedule("test", count.add), false)
	assert.equal(em.schedule("test", count.add), false)

	em.emit("test")
	assert.equal(count.value(), 1)

})

it("should wrap", () => {

	let wrapCounter = 0

	class EventEmitterTest<EventName> extends EventEmitter<EventName> {
		wrapEventListener(eventName: EventName, handler: Function) {
			return () => {
				wrapCounter++
				handler()
			}
		}
	}

	const em = new EventEmitterTest<"test">()
	const count = counter()

	em.on("test", count.add)

	em.emit("test")
	assert.equal(count.value(), 1)
	assert.equal(wrapCounter, 1)

	em.emit("test")
	assert.equal(count.value(), 2)
	assert.equal(wrapCounter, 2)

	em.removeEventListeners("test", count.add)

	em.emit("test")
	assert.equal(count.value(), 2)
	assert.equal(wrapCounter, 2)

})