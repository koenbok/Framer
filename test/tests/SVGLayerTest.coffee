{expect} = require "chai"

svgString = "<svg xmlns=\"http:\/\/www.w3.org\/2000\/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-toggle-right\"><rect x=\"1\" y=\"5\" width=\"22\" height=\"14\" rx=\"7\" ry=\"7\"><\/rect><circle cx=\"16\" cy=\"12\" r=\"3\"><\/circle><\/svg>"
describe "SVGLayer", ->
	describe "gradients", ->
		it "should generate unique gradient id per instance", ->
			a = new SVGLayer
				gradient: new Gradient

			b = new SVGLayer
				gradient: new Gradient

			a._elementGradientSVG.innerHTML.should.not.be.equal b._elementGradientSVG.innerHTML

	describe "copying", ->
		it "should copy the html intrinsic size", ->
			a = new SVGLayer
				width: 24
				html: svgString
				htmlIntrinsicSize:
					height: 24
					width: 24
				height: 24

			b = a.copy()
			a.htmlIntrinsicSize.should.eql b.htmlIntrinsicSize

	describe "initializing", ->
		it "should set clip to true by default", ->
			a = new SVGLayer
			a.clip.should.be.false
			a._element.style.overflow.should.equal("visible")

		it "should allow for overriding the clip property", ->
			a = new SVGLayer
				clip: true
			a.clip.should.be.true
			a._element.style.overflow.should.equal("hidden")

	describe "svg", ->
		describe "getter", ->
			it "should return the SVG node", ->
				layer = new SVGLayer
					html: svgString
				layer.svg.should.be.an.instanceof(SVGElement)
			it "should return null if the layer doesn't contain a svg node", ->
				layer = new SVGLayer
					html: "<div>hallo</div>"
				expect(layer.svg).to.be.null

		describe "setter", ->
			it "should the html when a string is set", ->
				layer = new SVGLayer
					svg: svgString
				layer.html.should.equal svgString

			it "should set an svg node if an SVG element is provided", ->
				layer = new SVGLayer
					svg: svgString

				layer2 = new SVGLayer

				layer2.svg = layer.svg
				layer2.html.should.equal svgString


			it "should remove all children when setting an svg node", ->
				layer = new SVGLayer
					svg: svgString

				layer2 = new SVGLayer
					svg: svgString

				layer2.svg = layer.svg
				layer2.html.should.equal svgString

			it "should not clone the node if the provided node has no parent", ->
				svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
				svg.setAttribute('style', 'border: 1px solid black')
				svg.setAttribute('width', '600')
				svg.setAttribute('height', '250')
				svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink")
				layer2 = new SVGLayer
				layer2.svg = svg
				expect(layer2.svg is svg).to.be.true
				layer2.html.should.equal '<svg style="border: 1px solid black" width="600" height="250" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>'


			it "should clone the node if the provided svg element already has a parent", ->
				layer = new SVGLayer
					svg: svgString
				layer2 = new SVGLayer
				svg = layer.svg
				layer2.svg = svg
				expect(layer2.svg is svg).to.be.false
				layer.html.should.equal svgString
				layer2.html.should.equal svgString
