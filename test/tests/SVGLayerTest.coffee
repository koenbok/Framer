
describe "SVGLayer", ->
	describe "gradients", ->
		it "should generate unique gradient id per instance", ->
			a = new SVGLayer
				gradient: new Gradient

			b = new SVGLayer
				gradient: new Gradient

			a._elementGradientSVG.innerHTML.should.not.be.equal b._elementGradientSVG.innerHTML
