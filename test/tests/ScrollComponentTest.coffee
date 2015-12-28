
describe "ScrollComponent", ->

	it "should apply constructor options", ->

		instance = new ScrollComponent (scrollHorizontal: false)
		instance.scrollHorizontal.should.be.false

	it "should keep scrollHorizontal value on copy", ->

		instance = new ScrollComponent (scrollHorizontal: false)
		instance.scrollHorizontal.should.be.false

		copy = instance.copy()
		copy.scrollHorizontal.should.be.false

	describe "wrap", ->

		it "should use the wrapped layer as content layer when there are sublayers", ->

			layerA = new Layer frame:Screen.frame
			layerB = new Layer superLayer:layerA

			scroll = ScrollComponent.wrap(layerA)
			scroll.content.should.equal layerA

		it "should use the wrapped layer as content if there are no sublayers", ->

			layerA = new Layer frame:Screen.frame

			scroll = ScrollComponent.wrap(layerA)
			scroll.content.subLayers[0].should.equal layerA

		it "should copy the name and image", ->

			layerA = new Layer frame:Screen.frame, name:"Koen", image:"../static/test.png"
			layerB = new Layer superLayer:layerA

			scroll = ScrollComponent.wrap(layerA)

			scroll.name.should.equal "Koen"
			scroll.image.should.equal "../static/test.png"

			scroll.content.should.equal layerA
			scroll.content.name.should.equal "content"
			scroll.content.image.should.equal ""

		it "should correct the scroll frame", ->

			frame = Screen.frame
			frame.width += 100
			frame.height += 100

			layerA = new Layer frame:frame

			scroll = ScrollComponent.wrap(layerA)
			scroll.width.should.equal Screen.width
			scroll.height.should.equal Screen.height

		it "should correct the scroll frame with sublayers", ->

			frame = Screen.frame
			frame.width += 100
			frame.height += 100

			layerA = new Layer frame:frame
			layerB = new Layer superLayer:layerA

			scroll = ScrollComponent.wrap(layerA)
			scroll.width.should.equal Screen.width
			scroll.height.should.equal Screen.height
