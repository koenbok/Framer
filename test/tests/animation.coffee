describe "Animation", ->

	AnimatableMatrixProperties = (new Animation view:null).AnimatableMatrixProperties
	AnimatableCSSProperties = (new Animation view:null).AnimatableCSSProperties 
	AnimatableFilterProperties = (new Animation view:null).AnimatableFilterProperties
	AnimationTime = 200
	
	halfway = (a, b) ->
		a + ((b - a) / 2)
		
	createView = ->
		view = new View

	describe "Spring", ->
		
		it "should have the good time", ->
			view = createView()
			
			animation = new Animation
				view: view
				properties: {opacity:0}
				curve: "spring(100,10,1000)"
			
			animation.start()
			
			# animation.curveValues.length.should.equal \
			# 	parseInt(animation.totalTime * animation.precision)

			animation.curveValues.length.should.equal \
				(animation.totalTime / 1000) * animation.precision


	describe "Bezier", ->
				
		it "should have the good time", ->
			view = createView()
			
			animation = new Animation
				view: view
				properties: {opacity:0}
				time: 100
				curve: "linear"
			
			animation.start()
			
			animation.totalTime.should.equal animation.time
			animation.curveValues.length.should.equal \
				(animation.time / 1000) * animation.precision
		
		testProperties = []
		testProperties = _.union testProperties, AnimatableMatrixProperties
		# testProperties = _.union testProperties, _.keys AnimatableCSSProperties
		
		# These don't work well in chrome. There seems to be an issue with animating
		# css filter properties for now.
		# testProperties = _.union testProperties, _.keys AnimatableFilterProperties
		
		console.log "testProperties", testProperties 
		
		testProperties.map (p) ->
			
			# Todo: Z is weird. I'll have to figure this out later
			if p in ["z"]
				return
			
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
					# debug: true
	
				utils.delay AnimationTime/2.0, ->
					animation.stop()
					view.visible = false
					view[p].should.be.within(5, 15)
					callback()
				
				animation.start()
	
	
	describe "Reverse", ->
		
		it "should reverse upfront", (callback) ->
			
			view = createView()
			view.frame = {width:100, height:100, x:100, y:100}
			
			animationA = new Animation
				view: view
				properties: {x:200}
				time: 500
				curve: "linear"
			
			animationB = animationA.reverse()
			
			animationA.start()
			
			utils.delay animationA.totalTime / 2.0, ->
				
				view.animateStop()
				view.x.should.be.within(140, 160)
				
				animationB.start()
				animationB.on "end", ->
					
					view.x.should.equal 100
					callback()

		it "should reverse afterwards", (callback) ->
			
			view = createView()
			view.frame = {width:100, height:100, x:100, y:100}
			
			animationA = new Animation
				view: view
				properties: {x:200}
				time: 250
				curve: "linear"
			
			animationA.start()
			
			utils.delay animationA.totalTime / 2.0, ->
				
				view.animateStop()
				
				halfwayX = halfway 100, 200
				
				view.x.should.be.within(halfwayX * 0.8, halfwayX * 1.2)
				
				animationB = animationA.reverse()
				
				animationB.start()
				animationB.on "end", ->
					
					view.x.should.equal 100
					callback()
				

		
		