assert = require "assert"

describe "NavComponent", ->

	it "shoulddddddd", ->

		nav = new NavComponent size: 100
		cardA = new Layer size: 100
		cardB = new Layer size: 100

		nav.show(cardA)
		nav.back()

