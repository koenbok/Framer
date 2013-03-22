describe "View", ->
	
	# topView = new View width:300, height:300
	# topView.style =
	# 	position: "fixed"
	# 	top: "10px"
	# 	right: "10px"
	# topView.clip = true
	
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
	
	describe "Scale", ->
		
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
			
	describe "Rotation", ->
	
		["rotateX", "rotateY", "rotateZ"].map (p) ->
			it "should set #{p}", ->
				view = createView()
				view[p] = 10
				view[p].should.equal 10
	
		it "should set rotate", ->
			view = createView()
			view.rotate = 200
			view.rotate.should.equal 200
			view.rotateX.should.equal 0
			view.rotateY.should.equal 0
			view.rotateZ.should.equal 200
	
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
			

	describe "Layering", ->
		
	describe "Styling", ->
	
	describe "HTML", ->
		
		it "should allow classes to be added", ->
			view = createView()
			view = new View()
			classA = view.class 
			view.addClass("foo")
			view.addClass("bar")
			view.class.should.equal "#{classA} foo bar"
	
		it "should allow classes to be removed", ->
			view = createView()
			view = new View()
			classA = view.class 
			view.addClass('foo')
			view.addClass('bar')
			view.removeClass('bar')
			view.class.should.equal "#{classA} foo"


