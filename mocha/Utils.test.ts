import {expect} from "chai"
import {utils, Layer} from "Framer"

describe("utils", () => {

	describe("orderedForEach", () => {

		it("should order", () => {
			const obj = {a: 1, b: 2, c: 3}
			let results: number[] = []
			const f = (key: string, value: any) => results.push(value)

			expect(Object.keys(obj)).to.eql(["a", "b", "c"])

			results = []
			utils.orderedForEach(obj, [], f)
			expect(results).to.eql([1, 2, 3])

			results = []
			utils.orderedForEach(obj, ["b", "c"], f)
			expect(results).to.eql([2, 3, 1])

			results = []
			utils.orderedForEach(obj, ["c"], f)
			expect(results).to.eql([3, 1, 2])
		})
	})

	describe("dom.validEvent", () => {

		it("should work on click", () => {
			expect(utils.dom.validEvent("div", "click")).to.be.true
		})

		it("should not work on random", () => {
			expect(utils.dom.validEvent("div", "dkjdhkhd")).to.be.false
		})

		it("should not work on change events", () => {
			expect(utils.dom.validEvent("div", "change:x")).to.be.false
		})

		it("should work on animation events", () => {
			expect(utils.dom.validEvent("div", "animationstart")).to.be.false
		})

		it("should not work on touch events", () => {
			expect(utils.dom.validEvent("div", "touchstart")).to.be.false
		})

	})

	describe("dom.getDOMEventKeys", () => {

		it("should be empty on default", () => {
			const layer = new Layer()
			expect(utils.events.interactiveEvents(layer.eventNames())).to.eql([])
		})

		it("should work for click but not change", () => {
			const layer = new Layer()
			layer.onClick((event: Event) => {})
			layer.onChange("x", (event: Event) => {})
			expect(utils.events.interactiveEvents(layer.eventNames())).to.eql(["click"])
		})

		it("should work for touch on desktop", () => {
			const layer = new Layer()
			layer.on("touchend" as any, () => {})
			expect(utils.events.interactiveEvents(layer.eventNames())).to.eql([])
		})

		it("should work for tap", () => {
			const layer = new Layer()
			layer.on("tap" as any, () => {})
			expect(utils.events.interactiveEvents(layer.eventNames())).to.eql(["tap"])
		})

		it("should not work for animation events", () => {
			const layer = new Layer()
			layer.on("animationstart" as any, () => {})
			expect(utils.events.interactiveEvents(layer.eventNames())).to.eql([])
		})

	})

})

