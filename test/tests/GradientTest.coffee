describe "Gradient", ->

	it "should allow input as object", ->

		start = "red"
		end = "orange"
		angle = 20

		gradient = new Gradient
			start: start
			end: end
			angle: angle

		gradient.start.isEqual(start).should.be.true
		gradient.end.isEqual(end).should.be.true
		gradient.angle.should.equal angle

	it "should compare for equality", ->

		gradient = new Gradient
			angle: 360
			start: "red"
		equalGradient = new Gradient
			angle: 0
			start: "red"
		Gradient.equal(gradient, equalGradient).should.be.true

		unequalGradient = new Gradient
			angle: 90
		unequalGradient.isEqual(gradient).should.be.false

	it "should mix gradients", ->

		colorA = "red"
		colorB = "yellow"
		gradientA = new Gradient
			start: colorA
		gradientB = new Gradient
			start: colorB
			angle: 90
		mixed = gradientA.mix(gradientB)
		mixed.angle.should.equal 45
		mixed.start.isEqual(Color.mix(colorA, colorB)).should.be.true

	it "should take the shortest route when animating to a new angle", ->

		gradientA = new Gradient
			angle: 0
		gradientB = new Gradient
			angle: 405
		mixed = Gradient.mix(gradientA, gradientB, 1)
		mixed.angle.should.equal 45
