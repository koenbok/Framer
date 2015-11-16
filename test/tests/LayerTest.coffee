assert = require "assert"

simulate = require "simulate"

describe "Layer", ->

	# afterEach ->
	# 	Utils.clearAll()

	# beforeEach ->
	# 	Framer.Utils.reset()

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
			layer.style.webkitTransform.should.equal "translate3d(100px, 50px, 0px) scale(1) scale3d(1, 1, 1) skew(0deg, 0deg) skewX(0deg) skewY(0deg) rotateX(0deg) rotateY(0deg) rotateZ(0deg)"
			
		it "should set scale", ->
			
			layer = new Layer

			layer.scaleX = 100
			layer.scaleY = 100
			layer.scaleZ = 100

			# layer.style.webkitTransform.should.equal "matrix(1, 0, 0, 1, 100, 50)"
			layer.style.webkitTransform.should.equal "translate3d(0px, 0px, 0px) scale(1) scale3d(100, 100, 100) skew(0deg, 0deg) skewX(0deg) skewY(0deg) rotateX(0deg) rotateY(0deg) rotateZ(0deg)"

		it "should set origin", ->
			superLayer = new Layer
				perspective: 100

			layer = new Layer

			layer.style.webkitTransformOrigin.should.equal "50% 50% 0px"

			layer.superLayer = superLayer

			layer.originX = 0.1
			layer.originY = 0.2

			layer.style.webkitTransformOrigin.should.equal "10% 20% 0px"

			layer.originX = 0.5
			layer.originY = 0.5
			layer.originZ = 0

			layer.style.webkitTransformOrigin.should.equal "50% 50% -100px"

			layer = new Layer
				originZ: 0.75
				originY: 0
				superLayer: superLayer
			layer.style.webkitTransformOrigin.should.equal "50% 0% 50px"

		it "should set local image", ->
	
			prefix = "../"
			imagePath = "static/test.png"
			fullPath = prefix + imagePath
			layer = new Layer

			layer.image = fullPath
			layer.image.should.equal fullPath

			layer.style["background-image"].indexOf(imagePath).should.not.equal(-1)
			layer.style["background-image"].indexOf("file://").should.not.equal(-1)
			layer.style["background-image"].indexOf("?nocache=").should.not.equal(-1)

			#layer.computedStyle()["background-size"].should.equal "cover"
			#layer.computedStyle()["background-repeat"].should.equal "no-repeat"

			image = layer.props.image
			layer.props.image.should.equal fullPath

		it "should set image", ->
			imagePath = "../static/test.png"
			layer = new Layer image:imagePath
			layer.image.should.equal imagePath

		it "should unset image with null", ->
			layer = new Layer image:"../static/test.png"
			layer.image = null
			layer.image.should.equal ""

		it "should unset image with empty string", ->
			layer = new Layer image:"../static/test.png"
			layer.image = ""
			layer.image.should.equal ""

		it "should test image property type", ->
			f = ->
				layer = new Layer
				layer.image = {}
			f.should.throw()

		it "should set name on create", ->
			layer = new Layer name:"Test"
			layer.name.should.equal "Test"
			layer._element.getAttribute("name").should.equal "Test"

		it "should set name after create", ->
			layer = new Layer
			layer.name = "Test"
			layer.name.should.equal "Test"
			layer._element.getAttribute("name").should.equal "Test"

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

			layer.scroll = false
			layer.scroll.should.equal false
			layer.style["overflow"].should.equal "hidden"

		it "should set scroll from properties", ->

			layer = new Layer
			layer.props = {scroll:false}
			layer.scroll.should.equal false
			layer.props = {scroll:true}
			layer.scroll.should.equal true

		it "should set scrollHorizontal", ->
			
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

		it "should check value type", ->

			f = ->
				layer = new Layer
				layer.x = "hello"
			f.should.throw()

		it "should set borderRadius", ->

			testBorderRadius = (layer, value) ->

				if layer.style["border-top-left-radius"] is "#{value}"
					layer.style["border-top-left-radius"].should.equal "#{value}"
					layer.style["border-top-right-radius"].should.equal "#{value}"
					layer.style["border-bottom-left-radius"].should.equal "#{value}"
					layer.style["border-bottom-right-radius"].should.equal "#{value}"
				else
					layer.style["border-top-left-radius"].should.equal "#{value} #{value}"
					layer.style["border-top-right-radius"].should.equal "#{value} #{value}"
					layer.style["border-bottom-left-radius"].should.equal "#{value} #{value}"
					layer.style["border-bottom-right-radius"].should.equal "#{value} #{value}"

			layer = new Layer

			layer.borderRadius = 10
			layer.borderRadius.should.equal 10

			testBorderRadius(layer, "10px")

			layer.borderRadius = "50%"
			layer.borderRadius.should.equal "50%"

			testBorderRadius(layer, "50%")


		it "should set perspective", ->

			layer = new Layer
			layer.perspective = 500

			layer.style["-webkit-perspective"].should.equal("500")

		it "should set rotation", ->

			layer = new Layer
				rotationX: 200
				rotationY: 200
				rotationZ: 200

			layer.rotationX.should.equal(200)
			layer.rotationY.should.equal(200)
			layer.rotationZ.should.equal(200)

		it "should proxy rotation", ->

			layer = new Layer

			layer.rotation = 200
			layer.rotation.should.equal(200)
			layer.rotationZ.should.equal(200)

			layer.rotationZ = 100
			layer.rotation.should.equal(100)
			layer.rotationZ.should.equal(100)



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

	describe "Shadow Properties", ->

		it "should set nothing on defaults", ->
			
			layer = new Layer
			layer.style.boxShadow.should.equal ""

		it "should set the shadow", ->
			
			layer = new Layer

			layer.shadowX = 10
			layer.shadowY = 10
			layer.shadowBlur = 10
			layer.shadowSpread = 10

			layer.shadowX.should.equal 10
			layer.shadowY.should.equal 10
			layer.shadowBlur.should.equal 10
			layer.shadowSpread.should.equal 10

			layer.style.boxShadow.should.equal ""

			# Only after we set a color a shadow should be drawn
			layer.shadowColor = "red"
			layer.shadowColor.should.equal "red"
			
			layer.style.boxShadow.should.equal "red 10px 10px 10px 10px"

			# Only after we set a color a shadow should be drawn
			layer.shadowColor = null
			layer.style.boxShadow.should.equal ""

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

		it "should listen to multiple events", ->

			layer = new Layer()

			count = 0
			handler = -> count++

			layer.on "click", "tap", handler

			layer.emit "click"
			layer.emit "tap"

			count.should.equal 2

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


		it "should modify the event scope for once", (callback) ->

			myLayer = new Layer()

			myLayer.once "click", (event, layer) ->
				@id.should.equal myLayer.id
				layer.id.should.equal myLayer.id
				callback()

			simulate.click myLayer._element

		it "should remove events", ->

			layer = new Layer
			
			clickCount = 0

			handler = ->
				clickCount++

			layer.on "test", handler

			layer.emit "test"
			clickCount.should.equal 1

			layer.off "test", handler

			layer.emit "test"
			clickCount.should.equal 1


		it "should only run an event once", ->
			
			layerA = new Layer
			count = 0

			layerA.once "hello", (layer) ->
				count++
				layerA.should.equal layer

			for i in [0..10]
				layerA.emit("hello")

			count.should.equal 1

		it "should modify scope for draggable events", (callback) ->
			
			layerA = new Layer
			layerA.draggable.enabled = true
			layerA.on "test", (args...) ->
				@id.should.equal(layerA.id)
				callback()

			layerA.draggable.emit("test", {})


	describe "Hierarchy", ->
		
		it "should insert in dom", ->
			
			layer = new Layer
			
			assert.equal layer._element.parentNode.id, "FramerContextRoot-Default"
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

			assert.equal layerB._element.parentNode.id, "FramerContextRoot-Default"
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

		it "should set at creation", ->

			layer = new Layer index:666
			layer.index.should.equal 666

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

		it "should get a sublayers by name", ->

			layerA = new Layer
			layerB = new Layer name:"B", superLayer:layerA
			layerC = new Layer name:"C", superLayer:layerA
			layerD = new Layer name:"C", superLayer:layerA

			layerA.subLayersByName("B").should.eql [layerB]
			layerA.subLayersByName("C").should.eql [layerC, layerD]

		it "should get a siblinglayer by name", ->

			layerA = new Layer
			layerB = new Layer name:"B", superLayer:layerA
			layerC = new Layer name:"C", superLayer:layerA
			layerD = new Layer name:"C", superLayer:layerA

			layerB.siblingLayersByName("C").should.eql [layerC, layerD]
			layerD.siblingLayersByName("B").should.eql [layerB]

		it "should get a superlayers", ->
			layerA = new Layer
			layerB = new Layer superLayer:layerA
			layerC = new Layer superLayer:layerB
			layerC.superLayers().should.eql [layerB, layerA]


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

		it "should get and set canvasFrame", ->
			
			layerA = new Layer x:100, y:100, width:100, height:100
			layerB = new Layer x:300, y:300, width:100, height:100, superLayer:layerA

			assert.equal layerB.canvasFrame.x, 400
			assert.equal layerB.canvasFrame.y, 400

			layerB.canvasFrame = {x:1000, y:1000}

			assert.equal layerB.canvasFrame.x, 1000
			assert.equal layerB.canvasFrame.y, 1000

			assert.equal layerB.x, 900
			assert.equal layerB.y, 900

			layerB.superLayer = null
			assert.equal layerB.canvasFrame.x, 900
			assert.equal layerB.canvasFrame.y, 900

		it "should calculate scale", ->
			layerA = new Layer scale:0.9
			layerB = new Layer scale:0.8, superLayer:layerA
			layerB.screenScaleX().should.equal 0.9 * 0.8
			layerB.screenScaleY().should.equal 0.9 * 0.8

		it "should calculate scaled frame", ->
			layerA = new Layer x:100, width:500, height:900, scale:0.5
			layerA.scaledFrame().should.eql {"x":225,"y":225,"width":250,"height":450}

		it "should calculate scaled screen frame", ->
			
			layerA = new Layer x:100, width:500, height:900, scale:0.5
			layerB = new Layer y:50, width:600, height:600, scale:0.8, superLayer:layerA
			layerC = new Layer y:-60, width:800, height:700, scale:1.2, superLayer:layerB

			layerA.screenScaledFrame().should.eql {"x":225,"y":225,"width":250,"height":450}
			layerB.screenScaledFrame().should.eql {"x":255,"y":280,"width":240,"height":240}
			layerC.screenScaledFrame().should.eql {"x":223,"y":228,"width":384,"height":336}

	describe "Center", ->

		it "should center", ->
			layerA = new Layer width:200, height:200
			layerB = new Layer width:100, height:100, superLayer:layerA
			layerB.center()

			assert.equal layerB.x, 50
			assert.equal layerB.y, 50

		it "should center with offset", ->
			layerA = new Layer width:200, height:200
			layerB = new Layer width:100, height:100, superLayer:layerA
			layerB.centerX(50)
			layerB.centerY(50)

			assert.equal layerB.x, 100
			assert.equal layerB.y, 100

		it "should center return layer", ->
			layerA = new Layer width:200, height:200
			layerA.center().should.equal layerA
			layerA.centerX().should.equal layerA
			layerA.centerY().should.equal layerA

		it "should center pixel align", ->
			layerA = new Layer width:200, height:200
			layerB = new Layer width:111, height:111, superLayer:layerA
			layerB.center().pixelAlign()

			assert.equal layerB.x, 44
			assert.equal layerB.y, 44


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

			(layer in Framer.CurrentContext.getLayers()).should.be.false
			assert.equal layer._element.parentNode, null

		it "should set text", ->

			layer = new Layer
			layer.html = "Hello"

			layer._element.childNodes[0].should.equal layer._elementHTML
			layer._elementHTML.innerHTML.should.equal "Hello"
			layer.ignoreEvents.should.equal true

		it "should not effect subLayers", ->

			layer = new Layer
			layer.html = "Hello"
			subLayer = new Layer superLayer: layer

			subLayer._element.offsetTop.should.equal 0

		it "should set interactive html and allow pointer events", ->

			tags = ["input", "select", "textarea", "option"]

			html = ""

			for tag in tags
				html += "<#{tag}></#{tag}>"

			layer = new Layer
			layer.html = html

			for tag in tags
				element = layer.querySelectorAll(tag)[0]
				style = window.getComputedStyle(element)
				style["pointer-events"].should.equal "auto"
				# style["-webkit-user-select"].should.equal "auto"


		it "should work with querySelectorAll", ->

			layer = new Layer
			layer.html = "<input type='button' id='hello'>"

			inputElements = layer.querySelectorAll("input")
			inputElements.length.should.equal 1

			inputElement = _.first(inputElements)
			inputElement.getAttribute("id").should.equal "hello"

	describe "Force 2D", ->

		it "should switch to 2d rendering", ->

			layer = new Layer

			layer.style.webkitTransform.should.equal "translate3d(0px, 0px, 0px) scale(1) scale3d(1, 1, 1) skew(0deg, 0deg) skewX(0deg) skewY(0deg) rotateX(0deg) rotateY(0deg) rotateZ(0deg)"

			layer.force2d = true

			layer.style.webkitTransform.should.equal "translate(0px, 0px) scale(1) skew(0deg, 0deg) rotate(0deg)"

	describe "Copy", ->

		it "copied Layer should hold set props", ->

			X = 100
			Y = 200
			IMAGE = '../static/test.png'
			BORDERRADIUS = 20

			layer = new Layer
				x:X
				y:Y
				image:IMAGE

			layer.borderRadius = BORDERRADIUS

			layer.x.should.eql X
			layer.y.should.eql Y
			layer.image.should.eql IMAGE
			layer.borderRadius.should.eql BORDERRADIUS

			copy = layer.copy()

			copy.x.should.eql X
			copy.y.should.eql Y
			copy.image.should.eql IMAGE
			copy.borderRadius.should.eql BORDERRADIUS

		it "copied Layer should have defaults", ->

			layer = new Layer
			copy = layer.copy()

			copy.width.should.equal 100
			copy.height.should.equal 100

		# it "copied layer should copy styles", ->

		# 	layer = new Layer
		# 	layer.style.backgroundColor = "yellow"

		# 	layer2 = layer.copy()
		# 	layer2.style.backgroundColor.should.equal "yellow"




