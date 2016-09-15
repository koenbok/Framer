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

	it "should export rgb object", ->

		color = new Color(0, 255, 30)
		rgb = color.toRgb()

		rgb.r.should.equal 0
		rgb.g.should.equal 255
		rgb.b.should.equal 30

		color = new Color(0, 255, 30, .5)
		rgb = color.toRgb()

		rgb.r.should.equal 0
		rgb.g.should.equal 255
		rgb.b.should.equal 30
		rgb.a.should.equal .5

	it "should show export hsl string", ->

		hsla = "hsla(20, 100%, 60%, 0.7)"

		color = new Color(hsla)
		color.toHslString().should.eql hsla

	it "should lighten color", ->

		orange = new Color "orange"
		mix = orange.lighten(100)

		mix.r.should.equal 255
		mix.g.should.equal 255
		mix.b.should.equal 255

	describe "when changing the color", ->
		testModifyFunction = (f) ->
			it "with #{f}, it should not change the instance it is applied to", ->
				color = new Color(10, 20, 30, 1)
				first = color[f](10)
				second = color[f](10)
				first.isEqual(second).should.be.true

		for f in ["lighten", "brighten", "darken", "desaturate", "saturate", "grayscale"]
			testModifyFunction(f)

	it "should brighten color", ->

		orange = new Color "orange"
		mix = orange.brighten(10)

		mix.r.should.equal 255
		mix.g.should.equal 190
		mix.b.should.equal 25

	it "should darken color", ->

		red = new Color "red"
		mix = red.darken()

		mix.r.should.equal 204
		mix.g.should.equal 0
		mix.b.should.equal 0

	it "should grayscale color", ->

		red = new Color "red"
		mix = red.grayscale()

		mix.r.should.equal 127.5
		mix.g.should.equal 127.5
		mix.b.should.equal 127.5

	it "should saturate color", ->

		red = new Color "hsl(0, 50, 50)"
		mix = red.saturate(100)

		mix.toHsl().s.should.eql 1

	it "should desaturate color", ->

		green = new Color "hsl(120, 50, 50)"
		mix = green.desaturate(100)

		mix.toHsl().s.should.eql 0

	it "should make transparent", ->

		red = new Color "red"
		trans = red.transparent()

		trans.a.should.equal 0

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

	it "should be transparent when option is transparent", ->

		color = new Color "transparent"
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

		color = new Color 255, 0, 0, 0
		color2 = new Color 0, 255, 0, 1
		mix = Color.mix(color, color2, .5, true, "rgb")

		mix.r.should.equal 0
		mix.g.should.equal 255
		mix.b.should.equal 0
		mix.a.should.equal 0.5

	it "should mix with css format color strings", ->

		mix = Color.mix("red", "yellow")
		Color.isColorObject(mix).should.be.true

	it "should mix color if only one input is color", ->

		mix = Color.mix("red")
		Color.isColorObject(mix).should.be.true

		mix = Color.mix("redfjkdsajfalfa", "yellow")
		Color.isColorObject(mix).should.be.true

	it "should return css name if possible", ->

		aqua = "aqua"

		layer = new Layer
			backgroundColor: aqua

		layer.backgroundColor.toName().should.eql aqua

	it "should return false if not css name", ->

		color = new Color "#123456"
		color.toName().should.be.false

	it "should return random color", ->

		color = Color.random()
		Color.isColorObject(color).should.be.true

	it "should check if valid color or color Object", ->

		color = "red"
		Color.isColor(color).should.be.true

		color = new Color "red"
		Color.isColor(color).should.be.true

	it "should compare colors", ->

		red = new Color "red"
		red.isEqual("rgb(255,0,0)").should.be.true

		purple = new Color 128, 0, 128

		Color.equal("purple", purple).should.be.true

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
