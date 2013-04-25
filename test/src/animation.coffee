# describe "Animation", ->
# 
# 	AnimatableMatrixProperties = (new Animation view:null).AnimatableMatrixProperties
# 	AnimationTime = 200
# 	
# 	createView = ->
# 		view = new View
# 
# 	describe "Spring", ->
# 		
# 		it "should have the good time", ->
# 			view = createView()
# 			
# 			animation = new Animation
# 				view: view
# 				properties: {opacity:0}
# 				curve: "spring(100,10,1000)"
# 			
# 			animation.start()
# 			
# 			# animation.curveValues.length.should.equal \
# 			# 	parseInt(animation.totalTime * animation.precision)
# 
# 			animation.curveValues.length.should.equal \
# 				(animation.totalTime / 1000) * animation.precision
# 
# 
# 	describe "Bezier", ->
# 				
# 		it "should have the good time", ->
# 			view = createView()
# 			
# 			animation = new Animation
# 				view: view
# 				properties: {opacity:0}
# 				time: 100
# 				curve: "linear"
# 			
# 			animation.start()
# 			
# 			console.log "animation.curveValues", animation.curveValues
# 			
# 			animation.totalTime.should.equal animation.time
# 			animation.curveValues.length.should.equal \
# 				(animation.time / 1000) * animation.precision
# 		
# 		
# 		AnimatableMatrixProperties.map (p) ->
# 			
# 			# Todo: Z is weird. I'll have to figure this out later
# 			if p in ["z"]
# 				return
# 			
# 			it "should animate #{p}", (callback) ->
# 		
# 					view = createView()
# 				
# 					properties = {}
# 					properties[p] = 20
# 		
# 					animation = view.animate
# 						properties: properties
# 						time: AnimationTime
# 		
# 					animation.on "end", ->
# 						view.visible = false
# 						view[p].should.equal 20
# 					
# 						callback()
# 		
# 			it "should cancel #{p}", (callback) ->
# 	
# 				view = createView()
# 	
# 				properties = {}
# 				properties[p] = 20
# 	
# 				animation = new Animation
# 					view: view
# 					properties: properties
# 					time: AnimationTime
# 					curve: "linear"
# 					# debug: true
# 	
# 				utils.delay AnimationTime/2.0, ->
# 					animation.stop()
# 					view.visible = false
# 					view[p].should.be.within(5, 15)
# 					callback()
# 				
# 				animation.start()