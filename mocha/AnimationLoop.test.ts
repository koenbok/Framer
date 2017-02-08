import {expect} from "chai"

import {AnimationLoop} from "AnimationLoop"
// import {Utils} from "Framer"

// it("should stop", (done) => {

// 	const loop = new AnimationLoop()
// 	const frameCount = 10
// 	let count = 0

// 	const onFinish = () => {

// 		loop.removeEventListeners("render")

// 		try {
// 			expect(count).toBe(frameCount + 1)
// 		} catch (error) {
// 			done.fail(error)
// 		}

// 		done()
// 	}

// 	const onRender = () => {
// 		try {
// 			expect(loop.running).toBeTruthy()
// 			expect(count).toBeLessThanOrEqual(frameCount)
// 		} catch (error) {
// 			done.fail(error)
// 		}

// 		if (count == frameCount) {
// 			loop.on("finish", onFinish)
// 		}

// 		count++
// 	}

// 	loop.on("render", onRender)

// })

// it("should emit finish", (done) => {

// 	const loop = new AnimationLoop()
// 	let count = 0
// 	const f = () => count++

// 	loop.on("finish", () => { done() })
// 	loop.on("render", f)

// })

// it("should emit in the right order", (done) => {

// 	const loop = new AnimationLoop()
// 	let names: string[] = []

// 	loop.on("update", () => { names.push("update") })
// 	loop.on("render", () => { names.push("render") })
// 	loop.on("finish", () => {
// 		names.push("finish")
// 		assert.deepEqual(names, ["update", "render", "finish"])
// 		done()
// 	})
// })

// it("should emit finish after", (done) => {

// 	const loop = new AnimationLoop()

// 	loop.once("render", () => {
// 		loop.on("finish", () => {
// 			done()
// 		})
// 	})
// })

// it("should start", (done) => {

// 	const loop = new AnimationLoop()
// 	let count = 0
// 	const f = () => count++

// 	loop.on("finish", () => {
// 		done()
// 	})

// 	expect(loop.running).toBeFalsy()


// 	loop.schedule("render", f)
// 	expect(loop.running).toBeTruthy()

// })

it("should schedule", () => {

	const loop = new AnimationLoop()
	let count = 0
	const f = () => count++

	loop.schedule("render", f)
	loop.schedule("render", f)
	loop.schedule("render", f)

	expect(loop.countEventListeners("render")).to.equal(1)

	loop.emit("render")
	loop.emit("render")

	expect(count).to.equal(1)
})
