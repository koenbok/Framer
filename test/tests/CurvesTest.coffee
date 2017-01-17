assert = require "assert"

animatorEquals = (actual, expected) ->
	actualAnimator = actual()
	expectedAnimator = expected()
	actualAnimator.constructor.should.eql expectedAnimator.constructor
	actualAnimator.options.should.eql expectedAnimator.options

describe "Curves", ->
	describe "fromFunction", ->
		it "should parse Spring", ->
			Framer.Curves.fromFunction("Spring").should.equal Framer.Curves.Spring
		it "should parse Spring()", ->
			animatorEquals(Framer.Curves.fromFunction("Spring()"), Framer.Curves.Spring())
		it "should parse Spring(damping: 0.2)", ->
			animatorEquals(Framer.Curves.fromFunction("Spring(damping: 0.2)"), Framer.Curves.Spring(damping: 0.2))
		it "should parse Spring(mass:2,damping:0.2)", ->
			animatorEquals(Framer.Curves.fromFunction("Spring(mass:2,damping:0.2)"), Framer.Curves.Spring(mass: 2, damping: 0.2))
		it "should parse Spring( 10, 20)", ->
			animatorEquals(Framer.Curves.fromFunction("Spring( 10, 20)"), Framer.Curves.Spring( 10, 20))
		it "should parse Spring(10, 20)", ->
			animatorEquals(Framer.Curves.fromFunction("Spring(10, 20)"), Framer.Curves.Spring(10, 20))
		it "should parse Spring(tension: 10, friction: 20, velocity: 20)", ->
			animatorEquals(Framer.Curves.fromFunction("Spring(tension: 10, friction: 20, velocity: 20)"), Framer.Curves.Spring(tension: 10, friction: 20, velocity: 20))
		it "should parse Spring(tension: 10)", ->
			animatorEquals(Framer.Curves.fromFunction("Spring(tension: 10)"), Framer.Curves.Spring(tension: 10))
		it "should parse Bezier.linear", ->
			animatorEquals(Framer.Curves.fromFunction("Bezier.linear"), Framer.Curves.Bezier.linear)
		it "should fail on non-spring functions", ->
			assert.equal Framer.Curves.fromFunction("spring(200, 30, 0)"), null
