
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
				html: "<?xml version=\"1.0\"?><svg xmlns=\"http:\/\/www.w3.org\/2000\/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-toggle-right\"><rect x=\"1\" y=\"5\" width=\"22\" height=\"14\" rx=\"7\" ry=\"7\"><\/rect><circle cx=\"16\" cy=\"12\" r=\"3\"><\/circle><\/svg>",
				htmlIntrinsicSize:
					height: 24
					width: 24
				height: 24

			b = a.copy()
			a.htmlIntrinsicSize.should.eql b.htmlIntrinsicSize
