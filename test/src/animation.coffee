describe "Animation", ->

	AnimatableMatrixProperties = (new Animation view:null).AnimatableMatrixProperties
	AnimationTime = 1500
	
	createView = ->
		view = new View

	describe "Spring", ->
		
		it "should have the good time", ->
			view = createView()
			
			animation = new Animation
				view: view
				properties: {opacity:0}
				curve: "spring(100,10,1000)"
			
			animation.curveValues.length.should.equal \
				parseInt(animation.totalTime * animation.precision)


	describe "Bezier", ->
				
		it "should have the good time", ->
			view = createView()
			
			animation = new Animation
				view: view
				properties: {opacity:0}
				time: 100
				curve: "linear"
			
			animation.totalTime.should.equal animation.time / 1000
			animation.curveValues.length.should.equal \
				parseInt(animation.time / animation.precision)
		
		
		AnimatableMatrixProperties.map (p) ->
			
			it "should animate #{p}", (callback) ->
		
					view = createView()
				
					properties = {}
					properties[p] = 20
		
					animation = view.animate
						properties: properties
						time: AnimationTime
		
					animation.on "end", ->
						view.visible = false
						view[p].should.equal 20
					
						callback()
		
			it "should cancel #{p}", (callback) ->
	
				view = createView()
	
				properties = {}
				properties[p] = 20
	
				animation = new Animation
					view: view
					properties: properties
					time: AnimationTime
					curve: "linear"
	
				utils.delay AnimationTime/2.0, ->
					animation.stop()
					view.visible = false
					view[p].should.be.within(9, 11)
					callback()
				
				animation.start()