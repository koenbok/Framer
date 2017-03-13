import * as _ from "lodash"
import {expect, assert} from "chai"

import {Events} from "Framer"

describe("Collection", () => {
	it("should have the right event names", () => {

		const ignore = ["dblclick"]

		for (let key in Events) {
			if (ignore.indexOf(Events[key]) !== -1) { continue }
			expect(key.toLowerCase()).to.equal(Events[key])
		}
	})
})