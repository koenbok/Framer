assert = require "assert"
simulate = require "simulate"

describe "SliderComponent", ->

	describe "Defaults", ->

		it "should set defaults", ->

			slider = new SliderComponent
			slider.min.should.equal 0
			slider.max.should.equal 1
			slider.value.should.equal 0

	describe "resizing", ->

		it "should not change the value", ->

			initialValue = 0.5

			slider = new SliderComponent
			slider.value = initialValue
			slider.width = 100
			slider.value.should.equal initialValue
