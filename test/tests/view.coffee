describe "View", ->
	
	createView = -> 
		view = new View width:100, height:100
		
	describe "Geometry", ->

		it "should set x", ->
			view = createView()
			view.x = 100
			view.x.should.equal 100

		it "should set y", ->
			view = createView()
			view.y = 100
			view.y.should.equal 100

		it "should set width", ->
			view = createView()
			view.width = 10
			view.width.should.equal 10

		it "should set height", ->
			view = createView()
			view.height = 10
			view.height.should.equal 10

		it "should set maxX", ->
			view = createView()
			view.maxX = 300
			view.minX.should.equal 200
			view.midX.should.equal 250
			view.maxX.should.equal 300
	
		it "should set maxY", ->
			view = createView()
			view.maxY = 300
			view.minY.should.equal 200
			view.midY.should.equal 250
			view.maxY.should.equal 300
	
		it "should set frame", ->
			view = createView()
			frame = {x:200, y:200, width:200, height:200}
			view.frame = frame
			# view.frame.should.eql frame
			view.x.should.equal frame.x
			view.y.should.equal frame.y
			view.width.should.equal frame.width
			view.height.should.equal frame.height

		it "should set frame to 0", ->
			view = createView()
			frame = {x:200, y:200, width:0, height:0}
			view.frame = frame
			# view.frame.should.eql frame
			view.x.should.equal frame.x
			view.y.should.equal frame.y
			view.width.should.equal frame.width
			view.height.should.equal frame.height

		it "should merge view with frame", -> 
			view = createView()
			frameB = {x:200, y:200, width:200, height:200}
			frameTest = view.merge(frameB)
			frameTest.x.should.equal 0
			frameTest.y.should.equal 0
			frameTest.width.should.equal 400
			frameTest.height.should.equal 400
			viewB = new View width:500, height:500
			frameTest = viewB.merge(frameB)
			frameTest.x.should.equal 0
			frameTest.y.should.equal 0
			frameTest.width.should.equal 500
			frameTest.height.should.equal 500
			frameC = {x:-30, y:-40, width:200, height:200}
			frameTest = viewB.merge(frameC)
			frameTest.x.should.equal -30
			frameTest.y.should.equal -40
			frameTest.width.should.equal 530
			frameTest.height.should.equal 540
		
		it "should have default values", ->
			
			view = new View()
			
			view.x.should.equal 0
			view.y.should.equal 0
			view.width.should.equal Framer.config.defaultViewWidth
			view.height.should.equal Framer.config.defaultViewHeight

		it "should set frame", ->
			frame = {x: 200, y: 200, width: 200, height: 200}
			view = new View {frame}
			view.x.should.equal frame.x
			view.y.should.equal frame.y
			view.width.should.equal frame.width
			view.height.should.equal frame.height

	describe "Visual", ->
		
		["scaleX", "scaleY", "scaleZ"].map (p) ->
			it "should set #{p}", ->
				view = createView()
				view["#{p}"] = 2
				view["#{p}"].should.equal 2
		
		it "should set scale", ->
			view = createView()
			view.scale = 3
			view.scale.should.equal 3
			view.scaleX.should.equal 3
			view.scaleY.should.equal 3
			view.scaleZ.should.equal 1 # Should this also be 3?

		it "should set visible", ->
			view = createView()
			view.visible = false
			view.visible.should.equal false

	describe "Rotation", ->
	
		["rotationX", "rotationY", "rotationZ"].map (p) ->
			it "should set #{p}", ->
				view = createView()
				view[p] = 10
				view[p].should.equal 10
	
		it "should set rotation", ->
			view = createView()
			view.rotation = 200
			view.rotation.should.equal 200
			view.rotationX.should.equal 0
			view.rotationY.should.equal 0
			view.rotationZ.should.equal 200
	
	describe "Hierarchy", ->
		
		it "should insert in dom", ->
			view = createView()
			(view.superView is null).should.equal true
			(view._element.parentNode isnt null).should.equal true
		
		it "should add subview", ->
			viewA = createView()
			viewB = createView()
			
			viewB.superView = viewA
			
			viewB.superView.should.equal viewA
			viewA.subViews.should.contain viewB

		it "should remove subview", ->
			viewA = createView()
			viewB = createView()
			
			viewB.superView = viewA
			
			viewB.superView.should.equal viewA
			viewA.subViews.should.contain viewB
			
			viewB.superView = null

			# viewB.superView.should.equal null # Shoulda woulda coulda
			viewA.subViews.should.eql []

		it "should have sbiling views with a superview", ->
			
			viewA = new View width:100, height:100
			viewB = new View width:100, height:100, superView:viewA
			viewC = new View width:100, height:100, superView:viewA
			viewD = new View width:100, height:100, superView:viewA
			
			viewB.siblingViews.should.eql [viewC, viewD]
			

	describe "Layering", ->

		it "should change index", ->
			view = createView()
			view.index = 666
			
			view.index.should.equal 666

		it "should have an index", ->
			viewA = new View width:100, height:100
			viewB = new View width:100, height:100, superView:viewA
			viewC = new View width:100, height:100, superView:viewA
			viewD = new View width:100, height:100, superView:viewA
			
			viewA.subViews.should.eql [viewB, viewC, viewD]
			
			viewB.index.should.equal = 0
			viewC.index.should.equal = 1
			viewD.index.should.equal = 2
			
			viewD.sendToBack()

			viewB.index.should.equal = 0
			viewC.index.should.equal = 1
			viewD.index.should.equal = -1
			
			viewB.bringToFront()

			viewB.index.should.equal = 2
			viewC.index.should.equal = 1
			viewD.index.should.equal = -1
			
			
		
	describe "Styling", ->
	
	describe "HTML", ->
		
		it "should allow classes to be added", ->
			view = createView()
			classA = view.class 
			view.addClass("foo")
			view.addClass("bar")
			view.class.should.equal "#{classA} foo bar"
	
		it "should allow classes to be removed", ->
			view = createView()
			classA = view.class 
			view.addClass('foo')
			view.addClass('bar')
			view.removeClass('bar')
			view.class.should.equal "#{classA} foo"
	
	describe "Filters", ->
		
		for filterName in ["blur", "brightness", "saturate", "hueRotate", "contrast",
			"invert", "grayscale", "sepia"]
			view = createView()
			view[filterName] = 10
			view[filterName].should.equal 10


