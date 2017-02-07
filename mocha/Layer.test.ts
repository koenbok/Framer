import {expect} from "chai"
import {isolated} from "./TestUtils"

import {Layer, Linear} from "Framer"



describe("Layer", () => {

	isolated("should animate a layer", (context, done) => {
		const layer = new Layer()

		layer.animate({x: 100}, Linear(1))
			.onEnd(done)
			.onStart(() => console.log("hello"))

	})
})

