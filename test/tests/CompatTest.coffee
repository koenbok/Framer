describe "Compat", ->
	
	describe "Defaults", ->

		it "should create views", ->
			
			view = new View

			view.x.should.equal 0
			view.y.should.equal 0
			view.width.should.equal 100
			view.height.should.equal 100

		it "should set superview", ->
			
			viewA = new View
			viewB = new View

			viewB.superView = viewA
			viewB.superView.should.equal viewA
			viewB.superLayer.should.equal viewA

		it "should set superview on create", ->
			
			viewA = new View
			viewB = new View superView:viewA

			viewB.superView.should.equal viewA
			viewB.superLayer.should.equal viewA

		it "should create scrollview", ->
			
			view = new ScrollView
			view.scroll.should.equal true


		it "should create imageview", ->
			
			imagePath = "static/test.png"

			view = new ImageView image:imagePath
			view.image.should.equal imagePath

