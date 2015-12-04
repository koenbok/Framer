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

	it "should mix colors with HUSL by default", ->

		orange = new Color "orange"
		yellow = new Color "yellow"
		mix = orange.mix(yellow, .5)

		g = Math.floor(mix.g)
		b = Math.floor(mix.b)

		mix.r.should.equal 255
		g.should.equal 210
		b.should.equal 67

	it "should mix colors with HSL", ->

		blue = new Color "blue"
		yellow = new Color "yellow"
		mix = blue.mix(yellow, .5, true, "hsl")

		b = Math.floor(mix.b)

		mix.r.should.equal 0
		mix.g.should.equal 255
		b.should.equal 127

	it "should mix colors with RGB", ->
		
		red = new Color "red"
		yellow = new Color "yellow"
		orange = red.mix(yellow, .5, true, "rgb")

		orange.r.should.equal 255
		orange.g.should.equal 127.5
		orange.b.should.equal 0

	it "should match hue values if one of colors is transparent", ->

		red = new Color "red"
		whiteTransparent = new Color "rgba(255, 255, 255, 0)"
		mix = red.mix(whiteTransparent, .5, true, "hsl")

		mix.r.should.equal 255
		mix.g.should.equal 0
		mix.b.should.equal 0
		mix.a.should.equal 0.5

	it "should match hue values if one of colors is gray", ->

		blue = new Color "blue"
		white = new Color "hsl(200, 100, 100)"
		mix = blue.mix(white, .5, true, "hsl")

		blue.toHsl().h.should.eql mix.toHsl().h

	it "should return css name if possible", ->

		aqua = "aqua"

		layer = new Layer
			backgroundColor: aqua

		layer.backgroundColor.toName().should.eql aqua

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
