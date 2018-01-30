{expect} = require "chai"

describe "SVGPath", ->
	svg = null
	path = null
	beforeEach ->
		svg = new SVGLayer
			x: 123
			y: 456
			svg: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M 100 50 C 100 77.614 77.614 100 50 100 C 22.386 100 0 77.614 0 50 C 0 22.386 22.386 0 50 0" id="path" name="path" fill="transparent" stroke="#0AF"></path></svg>'
		path = svg.elements.path

	afterEach ->
		svg.destroy()

	describe "pointAtFraction", ->

		it "should get the beginning", ->
			point = path.pointAtFraction(0)
			point.x.should.be.closeTo 100, 0.01
			point.y.should.be.closeTo 50, 0.01

		it "should get the end", ->
			point = path.pointAtFraction(1)
			point.x.should.be.closeTo 50, 0.01
			point.y.should.be.closeTo 0, 0.01

		it "should get a fraction", ->
			point = path.pointAtFraction(1/3)
			point.x.should.be.closeTo 50, 0.01
			point.y.should.be.closeTo 100, 0.01
			point = path.pointAtFraction(2/3)
			point.x.should.be.closeTo 0, 0.01
			point.y.should.be.closeTo 50, 0.01

	describe "storkeDasharray", ->
		it "should work when the dashArray is an empty string", ->
			layer = new SVGLayer
				svg: """<svg><path stroke-dasharray="" stroke-dashoffset="" id='test' name='path' d='M 0 0 L 100 200'/>"""
				stroke: '#000'
			layer.elements.test.strokeDasharray.should.eql []
			expect(layer.elements.test.strokeDashoffset).to.be.null

	describe "strokeLength", ->
		it "0", ->
			path.strokeLength = 0
			path.strokeStart.should.equal 0
			path.strokeEnd.should.equal 0
			path.strokeDasharray.should.eql [0, path.length]
			path.strokeFraction.should.equal 0
			expect(path.strokeDashoffset).to.be.null

		it "length", ->
			path.strokeLength = path.length
			path.strokeStart.should.equal 0
			path.strokeEnd.should.equal path.length
			path.strokeDasharray.should.eql []
			path.strokeFraction.should.equal 1
			expect(path.strokeDashoffset).to.be.null

		it "100", ->
			path.strokeLength = 100
			path.strokeStart.should.equal 0
			path.strokeEnd.should.equal 100
			path.strokeFraction.should.equal 100/path.length
			path.strokeDasharray.should.eql [100, path.length - 100]
			expect(path.strokeDashoffset).to.be.null

	describe "strokeFraction", ->
		it "0", ->
			path.strokeFraction = 0
			path.strokeStart.should.equal 0
			path.strokeEnd.should.equal 0
			path.strokeLength.should.equal 0
			path.strokeDasharray.should.eql [0, path.length]
			expect(path.strokeDashoffset).to.be.null

		it "1", ->
			path.strokeFraction = 1
			path.strokeStart.should.equal 0
			path.strokeEnd.should.equal path.length
			path.strokeLength.should.equal path.length
			path.strokeDasharray.should.eql []
			expect(path.strokeDashoffset).to.be.null

		it "0.5", ->
			path.strokeFraction = 0.5
			path.strokeStart.should.equal 0
			path.strokeEnd.should.equal path.length / 2
			path.strokeLength.should.equal path.length / 2
			path.strokeDasharray.should.eql [path.length/2]
			expect(path.strokeDashoffset).to.be.null

	describe "strokeStart", ->
		it "0", ->
			path.strokeStart = 0
			path.strokeEnd.should.equal path.length
			path.strokeLength.should.equal path.length
			path.strokeDasharray.should.eql []
			expect(path.strokeDashoffset).to.be.null

		it "1", ->
			path.strokeStart = path.length
			path.strokeEnd.should.equal path.length
			path.strokeLength.should.equal 0
			path.strokeDasharray.should.eql [0, path.length]
			expect(path.strokeDashoffset).to.be.null

		it "0.5", ->
			path.strokeStart = path.length / 2
			path.strokeEnd.should.equal path.length
			path.strokeLength.should.equal path.length / 2
			path.strokeDasharray.should.eql [0, path.length/2, path.length/2]
			expect(path.strokeDashoffset).to.be.null

		it "with end", ->
			path.strokeStart = 50
			path.strokeEnd = 200
			path.strokeLength.should.equal 150
			path.strokeDasharray.should.eql [0, 50, 150, path.length - 200]
			expect(path.strokeDashoffset).to.be.null

		it "with end before start", ->
			path.strokeStart = 200
			path.strokeEnd = 50
			path.strokeLength.should.equal path.length - 200 + 50
			path.strokeDasharray.should.eql [50, 150, path.length - 200, 0]
			expect(path.strokeDashoffset).to.be.null

		it "with reversed end before start", ->
			path.strokeEnd = 50
			path.strokeStart = 200
			path.strokeLength.should.equal path.length - 200 + 50
			path.strokeDasharray.should.eql [50, 150, path.length - 200, 0]
			expect(path.strokeDashoffset).to.be.null


	describe "strokeEnd", ->
		it "0", ->
			path.strokeEnd = 0
			path.strokeLength.should.equal 0
			path.strokeDasharray.should.eql [0, path.length]
			expect(path.strokeDashoffset).to.be.null

		it "1", ->
			path.strokeEnd = path.length
			path.strokeLength.should.equal path.length
			path.strokeDasharray.should.eql []
			expect(path.strokeDashoffset).to.be.null

		it "0.5", ->
			path.strokeEnd = path.length / 2
			path.strokeLength.should.equal path.length / 2
			path.strokeDasharray.should.eql [path.length/2]
			expect(path.strokeDashoffset).to.be.null

	describe "positioning", ->
		it "should proxy the transform property to the SVGLayer if that is it's direct parent", ->
			path.x.should.equal 123
			path.y.should.equal 456
			path.x = 23
			path.y = 17
			path.x.should.equal 23
			path.y.should.equal 17
			svg.x.should.equal 0
			svg.y.should.equal 0
			svg._element.style.webkitTransform.should.equal "translate3d(23px, 17px, 0px) scale3d(1, 1, 1) skew(0deg, 0deg) skewX(0deg) skewY(0deg) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px)"
