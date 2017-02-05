import * as assert from "assert"

import {AnimationLoop} from "AnimationLoop"
import {Utils} from "Framer"


it("should tick", (done) => {

	let loop = new AnimationLoop()
	let count = 0
	const frames = 10

	const handler = () => {
		count++

		assert.equal(count <= frames, true)

		if (count < frames) {
			assert.equal(loop.countEventListeners("render"), 1)
		}

		if (count === frames) {

			loop.off("render", handler)
			assert.equal(loop.countEventListeners("render"), 0)

			loop.once("finish", () => {
				assert.equal(loop.running, false)
				assert.equal(loop.countEventListeners("render"), 0)
				done()
			});
		}
	}

	loop.on("render", handler)
})

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

// it("should start", (done) => {

//     let loop = new AnimationLoop()
//     let count = 0
//     const f = () => count++

//     loop.on("render", () => {
//         assert.equal(loop.running, false)
//         done()
//     })

//     assert.equal(loop.running, false)
//     loop.schedule("render", f)
//     assert.equal(loop.running, true)
// })

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
