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

		Orange = new Color "orange"
		Yellow = new Color "yellow"
		Mix = Orange.mix(Yellow, .5)

		g = Math.floor(Mix.g)
		b = Math.floor(Mix.b)

		Mix.r.should.equal 255
		g.should.equal 210
		b.should.equal 67

	it "should mix colors with HSL", ->

		Blue = new Color "blue"
		Yellow = new Color "yellow"
		Mix = Blue.mix(Yellow, .5, true, "hsl")

		b = Math.floor(Mix.b)

		Mix.r.should.equal 0
		Mix.g.should.equal 255
		b.should.equal 127

	it "should mix colors with RGB", ->
		
		Red = new Color "red"
		Yellow = new Color "yellow"
		Orange = Red.mix(Yellow, .5, true, "rgb")

		Orange.r.should.equal 255
		Orange.g.should.equal 127.5
		Orange.b.should.equal 0

	it "should match hue values if one of colors is transparent", ->

		Red = new Color "red"
		WhiteTransparent = new Color "rgba(255, 255, 255, 0)"
		Mix = Red.mix(WhiteTransparent, .5, true, "hsl")

		Mix.r.should.equal 255
		Mix.g.should.equal 0
		Mix.b.should.equal 0
		Mix.a.should.equal 0.5

	it "should match hue values if one of colors is gray", ->

		Blue = new Color "blue"
		White = new Color "hsl(200, 100, 100)"
		Mix = Blue.mix(White, .5, true, "hsl")

		Blue.toHsl().h.should.eql Mix.toHsl().h

	it "should return css name if possible", ->

		Aqua = "aqua"

		layer = new Layer
			backgroundColor: Aqua

		layer.backgroundColor.toName().should.eql Aqua

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
