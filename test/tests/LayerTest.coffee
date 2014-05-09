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

		it "should set default background color", ->
			
			Framer.Defaults =
				Layer:
					backgroundColor: "red"
					
			layer = new Layer()
			
			layer.style.backgroundColor.should.equal "red"
			#layer.backgroundColor.should.equal "red"


			Framer.resetDefaults()
		

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

		# it "should handle background color with image", ->
			
		# 	# We want the background color to be there until an images
		# 	# is set UNLESS we set another backgroundColor explicitly

		# 	imagePath = "static/test.png"	

		# 	layer = new Layer image:imagePath
		# 	layer.backgroundColor.should.equal ""

		# 	layer = new Layer
		# 	layer.image = imagePath
		# 	layer.backgroundColor.should.equal ""

		# 	layer = new Layer backgroundColor:"rgba(255,0,0,1)"
		# 	layer.image = imagePath
		# 	layer.backgroundColor = "rgba(255,0,0,1)"
		# 	layer.backgroundColor.should.not.equal ""

		# 	layer = new Layer backgroundColor:"red"
		# 	layer.image = imagePath
		# 	layer.backgroundColor.should.equal "red"

		# 	layer = new Layer
		# 	layer.backgroundColor = "red"
		# 	layer.image = imagePath
		# 	layer.backgroundColor.should.equal "red"


		it "should set visible", ->
			
			layer = new Layer

			layer.visible.should.equal true
			layer.style["display"].should.equal "block"

			layer.visible = false
			layer.visible.should.equal false
			layer.style["display"].should.equal "none"

		it "should set clip", ->
			
			layer = new Layer

			layer.clip.should.equal true
			layer.style["overflow"].should.equal "hidden"

			layer.clip = false
			layer.scroll.should.equal false
			layer.style["overflow"].should.equal "visible"

		it "should set scroll", ->
			
			layer = new Layer

			layer.scroll.should.equal false
			layer.style["overflow"].should.equal "hidden"

			layer.scroll = true
			layer.scroll.should.equal true
			layer.style["overflow"].should.equal "scroll"
			layer.ignoreEvents.should.equal false

		it "should set scrollX", ->
			
			layer = new Layer

			layer.scroll.should.equal false
			layer.style["overflow"].should.equal "hidden"
			layer.ignoreEvents.should.equal true

			layer.scroll = true
			layer.scroll.should.equal true
			layer.style["overflow"].should.equal "scroll"
			layer.ignoreEvents.should.equal false

		it "should set style properties on create", ->

			layer = new Layer backgroundColor: "red"
			layer.backgroundColor.should.equal "red"
			layer.style["backgroundColor"].should.equal "red"


	describe "Filter Properties", ->

		it "should set nothing on defaults", ->
			
			layer = new Layer
			layer.style.webkitFilter.should.equal ""

		it "should set only the filter that is non default", ->
			
			layer = new Layer

			layer.blur = 10
			layer.blur.should.equal 10
			layer.style.webkitFilter.should.equal "blur(10px)"

			layer.contrast = 50
			layer.contrast.should.equal 50
			layer.style.webkitFilter.should.equal "blur(10px) contrast(50%)"

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

		it "should check superLayer", ->

			f = -> layer = new Layer superLayer:1
			f.should.throw()

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

		it "should list super layers", ->

			layerA = new Layer
			layerB = new Layer superLayer:layerA
			layerC = new Layer superLayer:layerB

			assert.deepEqual layerC.superLayers(), [layerB, layerA]


			

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

			layer = new Layer frame:{x:111, y:222, width:333, height:444}

			assert.equal layer.x, 111
			assert.equal layer.y, 222
			assert.equal layer.width, 333
			assert.equal layer.height, 444

		it "should set after create", ->

			layer = new Layer 
			layer.frame = {x:111, y:222, width:333, height:444}

			assert.equal layer.x, 111
			assert.equal layer.y, 222
			assert.equal layer.width, 333
			assert.equal layer.height, 444

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

	describe "CSS", ->

		it "classList should work", ->

			layer = new Layer
			layer.classList.add "test"

			assert.equal layer.classList.contains("test"), true
			assert.equal layer._element.classList.contains("test"), true

	describe "DOM", ->

		it "should destroy", ->

			layer = new Layer
			layer.destroy()

			Layer.Layers().should.not.contain layer
			assert.equal layer._element.parentNode, null

		it "should set text", ->

			layer = new Layer
			layer.html = "Hello"

			layer._element.childNodes[0].should.equal layer._elementHTML
			layer._elementHTML.innerHTML.should.equal "Hello"
			layer.ignoreEvents.should.equal true

		it "should set other html", ->

			layer = new Layer
			layer.html = "<input type=\"button\">"

			layer._element.childNodes[0].should.equal layer._elementHTML
			layer._elementHTML.innerHTML.should.equal "<input type=\"button\">"
			layer.ignoreEvents.should.equal false





