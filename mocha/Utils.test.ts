import {expect} from "chai"
import {Utils} from "Framer"

describe("Utils", () => {

	describe("orderedForEach", () => {

		it("should order", () => {
			const obj = {a: 1, b: 2, c: 3}
			let results: number[] = []
			const f = (key, value) => results.push(value)

			expect(Object.keys(obj)).to.eql(["a", "b", "c"])

			results = []
			Utils.orderedForEach(obj, [], f)
			expect(results).to.eql([1, 2, 3])

			results = []
			Utils.orderedForEach(obj, ["b", "c"], f)
			expect(results).to.eql([2, 3, 1])

			results = []
			Utils.orderedForEach(obj, ["c"], f)
			expect(results).to.eql([3, 1, 2])
		})
	})

})

