describe "Property", ->
		
	describe "CSSProperty", ->

		it "should set", ->
			
			frame = new Frame
			
			frame.x.should.equal 0
			frame.y.should.equal 0
			frame.z.should.equal 0
			
			frame.width.should.equal 0
			frame.height.should.equal 0

	describe "PropertyGroup", ->