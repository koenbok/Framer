describe "Animation", ->
	
	describe "Animations", ->

		it "should animate", (callback) ->
			
			view = new View()
			
			animation = view.animate
				properties: {x:500}
			
			animation.on "end", ->
				view.x.should.equal 500
				callback()
		
		it "should cancel", (callback) ->

			view = new View()
			
			animation = view.animate
				properties: {x:200}
				time: 2000
			
			utils.delay 1000, ->
				animation.stop()
				view.x.should.be.within(90, 110)
				callback()
