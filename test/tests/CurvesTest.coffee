assert = require "assert"

animatorEquals = (actual, expected) ->
	actualAnimator = actual()
	expectedAnimator = expected()
	actualAnimator.constructor.should.eql expectedAnimator.constructor
	actualAnimator.options.should.eql expectedAnimator.options

describe "Curves", ->
	describe "fromString", ->
		it "should parse Spring", ->
			Framer.Curves.fromString("Spring").should.equal Framer.Curves.Spring
		it "should parse Spring()", ->
			animatorEquals(Framer.Curves.fromString("Spring()"), Framer.Curves.Spring())
		it "should parse Spring(damping: 0.2)", ->
			animatorEquals(Framer.Curves.fromString("Spring(damping: 0.2)"), Framer.Curves.Spring(damping: 0.2))
		it "should parse Spring(mass:2,damping:0.2)", ->
			animatorEquals(Framer.Curves.fromString("Spring(mass:2,damping:0.2)"), Framer.Curves.Spring(mass: 2, damping: 0.2))
		it "should parse Spring( 10, 20)", ->
			animatorEquals(Framer.Curves.fromString("Spring( 10, 20)"), Framer.Curves.Spring( 10, 20))
		it "should parse Spring(10, 20)", ->
			animatorEquals(Framer.Curves.fromString("Spring(10, 20)"), Framer.Curves.Spring(10, 20))
		it "should parse Spring(tension: 10, friction: 20, velocity: 20)", ->
			animatorEquals(Framer.Curves.fromString("Spring(tension: 10, friction: 20, velocity: 20)"), Framer.Curves.Spring(tension: 10, friction: 20, velocity: 20))
		it "should parse Spring(tension: 10)", ->
			animatorEquals(Framer.Curves.fromString("Spring(tension: 10)"), Framer.Curves.Spring(tension: 10))
		it "should parse Spring({tension: 10})", ->
			animatorEquals(Framer.Curves.fromString("Spring({tension: 10})"), Framer.Curves.Spring(tension: 10))
		it "should parse Spring(  {     tension: 10\n\tfriction: 30   }   )", ->
			animatorEquals(Framer.Curves.fromString("Spring(  {     tension: 10\n\tfriction: 30   }   )"), Framer.Curves.Spring(tension: 10, friction: 30))
		it "should parse Bezier.linear", ->
			animatorEquals(Framer.Curves.fromString("Bezier.linear"), Framer.Curves.Bezier.linear)
		it "should parse depricated springs", ->
			animatorEquals(Framer.Curves.fromString("spring(200, 30, 0)"), Framer.Curves.Spring(tension: 200, friction: 30, velocity: 0))
