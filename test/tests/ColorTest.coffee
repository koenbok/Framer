describe "Color", ->

	it "should allow rgb input", ->

		r = 140
		g = 200
		b = 20

		color = new Color
			r: r
			g: g
			b: b

		color.r.should.equal r
		color.g.should.equal g
		color.b.should.equal b

	it "should be transparent when constructor option is null", ->
					
		color = new Color null
		color.a.should.equal 0

	it "hex input should be same as hex output", ->

		hexColor = "#28affa"
		color = new Color hexColor
		color.toHexString().should.eql hexColor

	it "should clamp constructor options", ->

		color = new Color
			r: -10
			g: 300
			b: 30
			a: 2

		color.r.should.equal 0
		color.g.should.equal 255
		color.b.should.equal 30
		color.a.should.equal 1
