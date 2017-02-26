import {expect, assert} from "chai"
// import * as assert from "assert"
import {isolated} from "./Testutils"
import {Layer, utils} from "Framer"

// describe("Context", () => {


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
// })