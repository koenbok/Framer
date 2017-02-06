import * as assert from "assert"

import {AnimationLoop} from "AnimationLoop"
import {Utils} from "Framer"

it("should emit finish", (done) => {

	let loop = new AnimationLoop()
	let count = 0
	const f = () => count++

	loop.on("finish", () => { done() })
	loop.on("render", f)

})

it("should emit in the right order", (done) => {

	let loop = new AnimationLoop()
	let names: string[] = []

	loop.on("update", () => { names.push("update") })
	loop.on("render", () => { names.push("render") })
	loop.on("finish", () => {
		names.push("finish")
		assert.deepEqual(names, ["update", "render", "finish"])
		done()
	})
})

it("should emit finish after", (done) => {

	let loop = new AnimationLoop()

	loop.once("render", () => {
		loop.on("finish", () => {
			done()
		})
	})
})

it("should start", (done) => {

	let loop = new AnimationLoop()
	let count = 0
	const f = () => count++

	loop.on("finish", () => {
		done()
	})

	expect(loop.running).toBeFalsy()


	loop.schedule("render", f)
	expect(loop.running).toBeTruthy()

})

it("should schedule", () => {

	let loop = new AnimationLoop()
	let count = 0
	const f = () => count++

	loop.schedule("render", f)
	loop.schedule("render", f)
	loop.schedule("render", f)

	assert.equal(loop.countEventListeners("render"), 1)

	loop.emit("render")
	loop.emit("render")

	assert.equal(count, 1)
})
