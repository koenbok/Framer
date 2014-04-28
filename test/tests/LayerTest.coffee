describe "Layer", ->

	describe "Defaults", ->

		it "should set defaults", ->
			
			Framer.Defaults =
				Layer:
					width: 200
					height: 200
					
			layer = new Layer()
			
			layer.width.should.equal 200
			layer.height.should.equal 200

			Framer.resetDefaults()

			layer = new Layer()
			
			layer.width.should.equal 100
			layer.height.should.equal 100
		

		it "should set defaults with override", ->
			
			layer = new Layer x:50, y:50
			layer.x.should.equal 50
			layer.x.should.equal 50



	describe "Properties", ->

		it "should set defaults", ->
			
			layer = new Layer()
			
			layer.x.should.equal 0
			layer.y.should.equal 0
			layer.z.should.equal 0
			
			layer.width.should.equal 100
			layer.height.should.equal 100

		it "should set width", ->
			
			layer = new Layer width:200

			layer.width.should.equal 200
			layer.style.width.should.equal "200px"

		it "should set x and y", ->
			
			layer = new Layer
			
			layer.x = 100
			layer.x.should.equal 100
			layer.y = 50
			layer.y.should.equal 50
			
			# layer.style.webkitTransform.should.equal "matrix(1, 0, 0, 1, 100, 0)"
			layer.style.webkitTransform.should.equal "translate3d(100px, 50px, 0px) scale(1) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg)"
			
		it "should set scale", ->
			
			layer = new Layer

			layer.scaleX = 100
			layer.scaleY = 100
			layer.scaleZ = 100

			# layer.style.webkitTransform.should.equal "matrix(1, 0, 0, 1, 100, 50)"
			layer.style.webkitTransform.should.equal "translate3d(0px, 0px, 0px) scale(1) scale3d(100, 100, 100) rotateX(0deg) rotateY(0deg) rotateZ(0deg)"

		it "should set origin", ->
			
			layer = new Layer

			layer.originX = 0.1
			layer.originY = 0.2

			layer.style.webkitTransformOrigin.should.equal "10% 20%"

			layer.originX = 0.5
			layer.originY = 0.5

			layer.style.webkitTransformOrigin.should.equal "50% 50%"

		it "should set local image", ->
	
			imagePath = "static/test.png"			
			layer = new Layer

			layer.image = imagePath
			layer.image.should.equal imagePath

			layer.style["background-image"].should.contain imagePath
			# layer.style["background-image"].should.contain "file://"
			# layer.style["background-image"].should.contain "?nocache="

			layer.style["background-size"].should.equal "cover"
			layer.style["background-repeat"].should.equal "no-repeat"

			layer.properties.image.should.equal imagePath



