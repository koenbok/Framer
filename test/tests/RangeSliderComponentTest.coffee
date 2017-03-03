assert = require "assert"
simulate = require "simulate"

describe "RangeSliderComponent", ->

	describe "Defaults", ->

		it "should set defaults", ->

			slider = new RangeSliderComponent
			slider.min.should.equal 0
			slider.max.should.equal 1
			slider.minValue.should.equal 0
			slider.maxValue.should.equal 0.5

	describe "resizing", ->

		it "should not change the value", ->

			initialMinValue = 0
			initialMaxValue = 0.5

			slider = new RangeSliderComponent
			slider.minValue = initialMinValue
			slider.maxValue = initialMaxValue
			slider.width = 100
			slider.minValue.should.equal initialMinValue
			slider.maxValue.should.equal initialMaxValue
