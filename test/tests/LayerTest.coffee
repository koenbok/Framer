assert = require "assert"

simulate = require "simulate"

describe "Layer", ->

	# afterEach ->
	# 	Utils.clearAll()

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

		it "should set image", ->
	
			imagePath = "static/test.png"	

			layer = new Layer y:0, \
				x:0, y:0,
				width:100, height:100,
				image:imagePath

			layer.image.should.equal imagePath


	describe "Events", ->

		it "should set pointer events", ->

			layer = new Layer()

			layer.ignoreEvents = false
			layer.style["pointerEvents"].should.equal "auto"

			layer.ignoreEvents = true
			layer.style["pointerEvents"].should.equal "none"

		it "should not listen to events by default", ->
			
			layer = new Layer()
			layer.ignoreEvents.should.equal true
			layer.style["pointerEvents"].should.equal "none"

		it "should not listen to events until a listener is added", ->
			
			layer = new Layer()
			layer.ignoreEvents.should.equal true

			layer.on Events.Click, ->
				console.log "hello"

			layer.ignoreEvents.should.equal false

		it "should modify the event scope", (callback) ->

			myLayer = new Layer()

			myLayer.on "click", (event, layer) ->
				@id.should.equal myLayer.id
				layer.id.should.equal myLayer.id
				callback()

			simulate.click myLayer._element

	describe "Hierarchy", ->
		
		it "should insert in dom", ->
			
			layer = new Layer
			
			assert.equal layer._element.parentNode.id, "FramerRoot"
			assert.equal layer.superLayer, null

		it "should add sublayer", ->
			
			layerA = new Layer
			layerB = new Layer superLayer:layerA
			
			assert.equal layerB._element.parentNode, layerA._element
			assert.equal layerB.superLayer, layerA

		it "should remove sublayer", ->

			layerA = new Layer
			layerB = new Layer superLayer:layerA

			layerB.superLayer = null

			assert.equal layerB._element.parentNode.id, "FramerRoot"
			assert.equal layerB.superLayer, null

		it "should list sublayers", ->

			layerA = new Layer
			layerB = new Layer superLayer:layerA
			layerC = new Layer superLayer:layerA

			assert.deepEqual layerA.subLayers, [layerB, layerC]

			layerB.superLayer = null
			assert.equal layerA.subLayers.length, 1
			assert.deepEqual layerA.subLayers, [layerC]

			layerC.superLayer = null
			assert.deepEqual layerA.subLayers, []

		it "should list sibling root layers", ->

			layerA = new Layer
			layerB = new Layer
			layerC = new Layer

			assert layerB in layerA.siblingLayers, true
			assert layerC in layerA.siblingLayers, true

		it "should list sibling layers", ->

			layerA = new Layer
			layerB = new Layer superLayer:layerA
			layerC = new Layer superLayer:layerA

			assert.deepEqual layerB.siblingLayers, [layerC]
			assert.deepEqual layerC.siblingLayers, [layerB]
			

	describe "Layering", ->

		it "should change index", ->

			layer = new Layer
			layer.index = 666
			layer.index.should.equal 666

		it "should be in front for root", ->

			layerA = new Layer
			layerB = new Layer

			assert.equal layerB.index, layerA.index + 1

		it "should be in front", ->

			layerA = new Layer
			layerB = new Layer superLayer:layerA
			layerC = new Layer superLayer:layerA

			assert.equal layerB.index, 1
			assert.equal layerC.index, 2

		it "should send back and front", ->

			layerA = new Layer
			layerB = new Layer superLayer:layerA
			layerC = new Layer superLayer:layerA

			layerC.sendToBack()

			assert.equal layerB.index,  1
			assert.equal layerC.index, -1

			layerC.bringToFront()

			assert.equal layerB.index,  1
			assert.equal layerC.index,  2

		it "should place in front", ->

			layerA = new Layer
			layerB = new Layer superLayer:layerA # 1
			layerC = new Layer superLayer:layerA # 2
			layerD = new Layer superLayer:layerA # 3

			layerB.placeBefore layerC

			assert.equal layerB.index, 2
			assert.equal layerC.index, 1
			assert.equal layerD.index, 3

		it "should place behind", ->

			layerA = new Layer
			layerB = new Layer superLayer:layerA # 1
			layerC = new Layer superLayer:layerA # 2
			layerD = new Layer superLayer:layerA # 3

			layerC.placeBehind layerB

			# TODO: Still something fishy here, but it works

			assert.equal layerB.index, 2
			assert.equal layerC.index, 1
			assert.equal layerD.index, 4

	describe "Frame", ->

		it "should set on create", ->

			layer = new Layer frame:{x:100, y:100, width:20, height:20}

			assert.equal layer.x, 100
			assert.equal layer.x, 100
			assert.equal layer.width, 20
			assert.equal layer.height, 20

		it "should set after create", ->

			layer = new Layer 
			layer = {x:100, y:100, width:20, height:20}

			assert.equal layer.x, 100
			assert.equal layer.x, 100
			assert.equal layer.width, 20
			assert.equal layer.height, 20

		it "should set minX on creation", ->
			layer = new Layer minX:200, y:100, width:100, height:100
			layer.x.should.equal 200

		it "should set midX on creation", ->
			layer = new Layer midX:200, y:100, width:100, height:100
			layer.x.should.equal 150

		it "should set maxX on creation", ->
			layer = new Layer maxX:200, y:100, width:100, height:100
			layer.x.should.equal 100

		it "should set minY on creation", ->
			layer = new Layer x:100, minY:200, width:100, height:100
			layer.y.should.equal 200

		it "should set midY on creation", ->
			layer = new Layer x:100, midY:200, width:100, height:100
			layer.y.should.equal 150

		it "should set maxY on creation", ->
			layer = new Layer x:100, maxY:200, width:100, height:100
			layer.y.should.equal 100


		it "should set minX", ->
			layer = new Layer y:100, width:100, height:100
			layer.minX = 200
			layer.x.should.equal 200

		it "should set midX", ->
			layer = new Layer y:100, width:100, height:100
			layer.midX = 200
			layer.x.should.equal 150

		it "should set maxX", ->
			layer = new Layer y:100, width:100, height:100
			layer.maxX = 200
			layer.x.should.equal 100

		it "should set minY", ->
			layer = new Layer x:100, width:100, height:100
			layer.minY = 200
			layer.y.should.equal 200

		it "should set midY", ->
			layer = new Layer x:100, width:100, height:100
			layer.midY = 200
			layer.y.should.equal 150

		it "should set maxY", ->
			layer = new Layer x:100, width:100, height:100
			layer.maxY = 200
			layer.y.should.equal 100



