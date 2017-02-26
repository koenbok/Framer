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

	describe("validEvent", () => {

		it("should work on click", () => {
			expect(Utils.dom.validEvent("div", "click")).to.be.true
		})

		it("should not work on random", () => {
			expect(Utils.dom.validEvent("div", "dkjdhkhd")).to.be.false
		})

		it("should not work on change events", () => {
			expect(Utils.dom.validEvent("div", "change:x")).to.be.false
		})

		it("should work on animation events", () => {
			expect(Utils.dom.validEvent("div", "animationstart")).to.be.false
		})

		it("should not work on touch events", () => {
			expect(Utils.dom.validEvent("div", "touchstart")).to.be.false
		})

	})

})

