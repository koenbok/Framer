import {expect, assert} from "chai"
// import * as assert from "assert"
import {isolated} from "./Testutils"
import {Layer, utils} from "Framer"

describe("Context", () => {

	isolated.test("should use pixelRatio", (context, done) => {

		context.renderer.manual = true
		const layer = new Layer({width: 500})

		context.pixelRatio = 1
		context.renderer.render()
		expect(layer._element.style.width).to.equal("500px")

		context.pixelRatio = 2
		context.renderer.render()
		expect(layer._element.style.width).to.equal("1000px")

		done()
	})

// 	it.only("should reset well", (done) => {

// 		const ctx = new Context("print")
// 		const height = 200

// 		ctx.run(() => {

// 			const background = new Layer({
// 				x: 0,
// 				y: window.innerHeight - height,
// 				width: window.innerWidth,
// 				height: height,
// 				backgroundColor: "blue"
// 			})

// 			background.styles = {
// 				border: "10px solid orange"
// 			}
// 		})

// 		done()

// 	})
// })


// const ctx = new Context("print")
// const height = 200

// ctx.run(() => {

// 	const background = new Layer({
// 		x: 0,
// 		y: window.innerHeight - height,
// 		width: window.innerWidth,
// 		height: height,
// 		backgroundColor: "blue"
// 	})

// 	background.styles = {
// 		border: "10px solid orange"
// 	}
})