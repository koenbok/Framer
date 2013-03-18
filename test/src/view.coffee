describe "View", ->
	
	view = new View()

	describe "Geometry", ->

		it "should set x", ->
			view.x = 100
			view.x.should.equal 100

		it "should set y", ->
			view.y = 100
			view.y.should.equal 100

		it "should set width", ->
			view.width = 100
			view.width.should.equal 100

		it "should set height", ->
			view.height = 100
			view.height.should.equal 100

		it "should set maxX", ->
			view.maxX = 300
			view.minX.should.equal 200
			view.midX.should.equal 250
			view.maxX.should.equal 300

		it "should set maxY", ->
			view.maxY = 300
			view.minY.should.equal 200
			view.midY.should.equal 250
			view.maxY.should.equal 300

		it "should set frame", ->
			frame = {x:200, y:200, width:200, height:200}
			view.frame = frame
			# view.frame.should.eql frame
			view.x.should.equal frame.x
			view.y.should.equal frame.y
			view.width.should.equal frame.width
			view.height.should.equal frame.height
	
	describe "Hierarchy", ->
		
	describe "Layering", ->
		
	describe "Styling", ->

	describe "HTML", ->
		it "should allow classes to be added", ->
			view = new View()
			classA = view.class 
			view.addClass("foo")
			view.addClass("bar")
			view.class.should.equal "#{classA} foo bar"

		it "should allow classes to be removed", ->
			view = new View()
			classA = view.class 
			view.addClass('foo')
			view.addClass('bar')
			view.removeClass('bar')
			view.class.should.equal "#{classA} foo"


