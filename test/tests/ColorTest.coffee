describe "Color", ->

	it "should allow rgb input as object", ->

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

	it "should allow rgb input as numbers", ->

		color = new Color(0, 255, 0, 1)

		color.r.should.equal 0
		color.g.should.equal 255
		color.b.should.equal 0

	it "should allow rgba string in css format", ->

		color = new Color "rgba(255, 0, 0, 1)"
		color.r.should.equal 255

	it "should allow hsl string in css format", ->

		color = new Color "hsla(0, 0, 100, 0.5)"
		color.r.should.equal 255
		color.g.should.equal 255
		color.b.should.equal 255
		color.a.should.equal 0.5

	it "should allow hsl string in css format with % for saturation and lightness", ->

		color = new Color "hsla(0, 0%, 100%, 0.5)"
		color.r.should.equal 255
		color.g.should.equal 255
		color.b.should.equal 255
		color.a.should.equal 0.5

	it "should be transparent when constructor option is null", ->
					
		color = new Color null
		color.a.should.equal 0

	it "hex input should be same as hex output", ->

		hexColor = "#28affa"
		color = new Color hexColor
		color.toHexString().should.eql hexColor

	it "should mix colors", ->
		
		Red = new Color "red"
		Yellow = new Color "yellow"
		Orange = Red.mix(Yellow, .5, true, "rgb")

		Orange.r.should.equal 255
		Orange.g.should.equal 127.5
		Orange.b.should.equal 0

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
