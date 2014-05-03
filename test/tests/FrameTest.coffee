describe "Frame", ->
		
	describe "Defaults", ->

		it "should set defaults", ->

			frame = new Frame

			frame.x.should.equal 0
			frame.y.should.equal 0
			frame.width.should.equal 0
			frame.height.should.equal 0

		it "should set on create", ->

			frame = new Frame x:100, y:100, width:100, height:100

			frame.x.should.equal 100
			frame.y.should.equal 100
			frame.width.should.equal 100
			frame.height.should.equal 100


		it "should set minX", ->
			frame = new Frame minX:200, y:100, width:100, height:100
			frame.x.should.equal 200

		it "should set midX", ->
			frame = new Frame midX:200, y:100, width:100, height:100
			frame.x.should.equal 150

		it "should set maxX", ->
			frame = new Frame maxX:200, y:100, width:100, height:100
			frame.x.should.equal 100


		it "should set minY", ->
			frame = new Frame x:100, minY:200, width:100, height:100
			frame.y.should.equal 200

		it "should set midY", ->
			frame = new Frame x:100, midY:200, width:100, height:100
			frame.y.should.equal 150

		it "should set maxY", ->
			frame = new Frame x:100, maxY:200, width:100, height:100
			frame.y.should.equal 100


