
describe "ScrollComponent", ->

	it "should have the right size", ->

		scroll = new ScrollComponent
			size: 300

		scroll.frame.should.eql {x:0, y:0, width:300, height:300}
		scroll.content.frame.should.eql {x:0, y:0, width:300, height:300}

	it "should have the right content frame with align", ->

		scroll = new ScrollComponent
			size: 300

		layer = new Layer
			parent: scroll.content
			size: 100
			point: Align.center

		scroll.content.frame.should.eql {x:0, y:0, width:300, height:300}
		layer.frame.should.eql {x:100, y:100, width:100, height:100}

	it "should apply constructor options", ->

		instance = new ScrollComponent(scrollHorizontal: false)
		instance.scrollHorizontal.should.be.false

	it "should keep scrollHorizontal value on copy", ->

		instance = new ScrollComponent(scrollHorizontal: false)
		instance.scrollHorizontal.should.be.false

		copy = instance.copy()
		copy.scrollHorizontal.should.be.false
	describe "Events", ->
		describe "scolling with mousEvents", ->
			it "should work", ->
				scroll = new ScrollComponent size: 200
				new Layer
					width: 400
					height: 400
					parent: scroll.content
				scroll.mouseWheelEnabled = true
				scroll.emit(Events.MouseWheel, {wheelDeltaX: -75, wheelDeltaY: -150})
				scroll.content.x.should.equal -75
				scroll.content.y.should.equal -150

			it "should respect scrollHorizontal = false", ->
				scroll = new ScrollComponent size: 200
				new Layer
					width: 400
					height: 400
					parent: scroll.content
				scroll.mouseWheelEnabled = true
				scroll.scrollHorizontal = false
				scroll.emit(Events.MouseWheel, {wheelDeltaX: -75, wheelDeltaY: -150})
				scroll.content.x.should.equal 0
				scroll.content.y.should.equal -150

			it "should respect scrollVertial = false", ->
				scroll = new ScrollComponent size: 200
				new Layer
					width: 400
					height: 400
					parent: scroll.content
				scroll.mouseWheelEnabled = true
				scroll.scrollVertical = false
				scroll.emit(Events.MouseWheel, {wheelDeltaX: -75, wheelDeltaY: -150})
				scroll.content.x.should.equal -75
				scroll.content.y.should.equal 0

			it "should fire move events", (done) ->
				scroll = new ScrollComponent size: 200
				new Layer
					width: 400
					height: 400
					parent: scroll.content
				scroll.mouseWheelEnabled = true
				scroll.on Events.Move, (event) ->
					event.x.should.equal -75
					event.y.should.equal -150
					done()
				scroll.emit(Events.MouseWheel, {wheelDeltaX: -75, wheelDeltaY: -150})

		describe "PageComponent", ->
			it "should fire scroll events", (done) ->
				page = new PageComponent
					width: 100
					height: 100
				page.addPage(new Layer)
				page.addPage(new Layer)
				page.once Events.Scroll, ->
					done()
				page.snapToNextPage()

		it "should fire move events when moving a layer programmatically", (done) ->
			scroll = new ScrollComponent
				width: 20
				height: 20
			layer = new Layer parent: scroll.content
			doneCalled = false
			scroll.on Events.Move, ->
				done() if not doneCalled
				doneCalled = true
			scroll.scrollToPoint({x: 50, y: 50})


	describe "wrap", ->

		it "should use the wrapped layer as content layer when there are children", ->

			layerA = new Layer frame:Screen.frame
			layerB = new Layer superLayer:layerA

			scroll = ScrollComponent.wrap(layerA)
			scroll.content.should.equal layerA

		it "should use the wrapped layer as content if there are no children", ->

			layerA = new Layer frame:Screen.frame

			scroll = ScrollComponent.wrap(layerA)
			scroll.content.children[0].should.equal layerA

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

		it "should correct the scroll frame with children", ->

			frame = Screen.frame
			frame.width += 100
			frame.height += 100

			layerA = new Layer frame:frame
			layerB = new Layer superLayer:layerA

			scroll = ScrollComponent.wrap(layerA)
			scroll.width.should.equal Screen.width
			scroll.height.should.equal Screen.height

		it "should work with null backgroundColor", ->

			layerA = new Layer
			layerB = new Layer superLayer:layerA

			delete layerA._properties.backgroundColor
			scroll = ScrollComponent.wrap(layerA)

		it "should throw a warning on no layer", ->
			f = -> ScrollComponent.wrap()
			f.should.throw()

		it "should set content clip to true", ->
			scroll = new ScrollComponent()
			scroll.content.clip.should.equal true

		it "should set the name of the constructor to __framerInstanceInfo", ->
			aap = new Layer
			aap.__framerInstanceInfo = {name: "aap"}
			bla = new Layer
				parent: aap
			scroll = ScrollComponent.wrap(aap)
			scroll.__framerInstanceInfo.name.should.equal "ScrollComponent"

		it "should not copy over framerInstanceInfo to name", ->
			aap = new Layer
			aap.__framerInstanceInfo = {name: "aap"}
			bla = new Layer
				parent: aap
			scroll = ScrollComponent.wrap(aap)
			scroll.name.should.equal ""


		it "should set the right content size for added pages by constructor", ->

			# Constructors depend on different things for size, align and parent. Sometimes
			# these dependencies can get messed up when adding something to a ScrollComponent
			# this a was a case sent in by one of our users: http://share.framerjs.com/mn3ffub6u81i/

			allImgCont = []
			imgWrapW = 801
			imgWrapGut = 200
			numImg = 2

			page = new PageComponent
				width: 400, height: 400
				scrollVertical: false
				contentInset: {top: 267, right: imgWrapGut}

			for i in [1..numImg]
				imgWrapper = new Layer
					width: page.width - imgWrapGut, height: imgWrapW
					borderRadius: 8
					x: (page.width + 32) * i
					parent: page.content

			page.contentFrame().width.should.equal 1064
