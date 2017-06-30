assert = require "assert"
{expect} = require "chai"
simulate = require "simulate"

describe "Layer", ->

	# afterEach ->
	# 	Utils.clearAll()

	# beforeEach ->
	# 	Framer.Utils.reset()

	describe "Defaults", ->

		it "should reset nested defaults", ->
			Framer.Defaults.DeviceComponent.animationOptions.curve = "spring"
			Framer.resetDefaults()
			Framer.Defaults.DeviceComponent.animationOptions.curve.should.equal "ease-in-out"

		it "should reset width and height to their previous values", ->
			previousWidth = Framer.Defaults.Layer.width
			previousHeight = Framer.Defaults.Layer.height
			Framer.Defaults.Layer.width = 123
			Framer.Defaults.Layer.height = 123
			Framer.resetDefaults()
			Framer.Defaults.Layer.width.should.equal previousWidth
			Framer.Defaults.Layer.height.should.equal previousHeight

		it "should set defaults", ->
			width = Utils.randomNumber(0, 400)
			height = Utils.randomNumber(0, 400)
			Framer.Defaults =
				Layer:
					width: width
					height: height

			layer = new Layer()

			layer.width.should.equal width
			layer.height.should.equal height

			Framer.resetDefaults()

			layer = new Layer()
			layer.width.should.equal 100
			layer.height.should.equal 100

		it "should set default background color", ->

			# if the default background color is not set the content layer of scrollcomponent is not hidden when layers are added
			layer = new Layer()

			Color.equal(layer.backgroundColor, Framer.Defaults.Layer.backgroundColor).should.be.true

			Framer.Defaults =
				Layer:
					backgroundColor: "red"

			layer = new Layer()

			layer.style.backgroundColor.should.equal new Color("red").toString()

			Framer.resetDefaults()

		it "should set defaults with override", ->

			layer = new Layer x: 50, y: 60
			layer.x.should.equal 50
			layer.y.should.equal 60

		it "should have default animationOptions", ->
			layer = new Layer
			layer.animationOptions.should.eql {}

	describe "Properties", ->

		it "should set defaults", ->

			layer = new Layer()

			layer.x.should.equal 0
			layer.y.should.equal 0
			layer.z.should.equal 0

			layer.width.should.equal 100
			layer.height.should.equal 100

		it "should set width", ->

			layer = new Layer width: 200

			layer.width.should.equal 200
			layer.style.width.should.equal "200px"

		it "should set x not to scientific notation", ->

			n = 0.000000000000002
			n.toString().should.equal("2e-15")

			layer = new Layer
			layer.x = n
			layer.y = 100
			layer.style.webkitTransform.should.equal "translate3d(0px, 100px, 0px) scale3d(1, 1, 1) skew(0deg, 0deg) skewX(0deg) skewY(0deg) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px)"


		it "should set x, y and z to really small values", ->

			layer = new Layer
			layer.x = 10
			layer.y = 10
			layer.z = 10
			layer.x = 1e-5
			layer.y = 1e-6
			layer.z = 1e-7
			layer.x.should.equal 1e-5
			layer.y.should.equal 1e-6
			layer.z.should.equal 1e-7

			# layer.style.webkitTransform.should.equal "matrix(1, 0, 0, 1, 100, 0)"
			layer.style.webkitTransform.should.equal "translate3d(0.00001px, 0.000001px, 0px) scale3d(1, 1, 1) skew(0deg, 0deg) skewX(0deg) skewY(0deg) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px)"

		it "should handle scientific notation in scaleX, Y and Z", ->

			layer = new Layer
			layer.scaleX = 2
			layer.scaleY = 2
			layer.scaleZ = 3
			layer.scaleX = 1e-7
			layer.scaleY = 1e-8
			layer.scaleZ = 1e-9
			layer.scale = 1e-10
			layer.scaleX.should.equal 1e-7
			layer.scaleY.should.equal 1e-8
			layer.scaleZ.should.equal 1e-9
			layer.scale.should.equal 1e-10

			# layer.style.webkitTransform.should.equal "matrix(1, 0, 0, 1, 100, 0)"
			layer.style.webkitTransform.should.equal "translate3d(0px, 0px, 0px) scale3d(0, 0, 0) skew(0deg, 0deg) skewX(0deg) skewY(0deg) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px)"

		it "should handle scientific notation in skew", ->

			layer = new Layer
			layer.skew = 2
			layer.skewX = 2
			layer.skewY = 3
			layer.skew = 1e-5
			layer.skewX = 1e-6
			layer.skewY = 1e-7
			layer.skew.should.equal 1e-5
			layer.skewX.should.equal 1e-6
			layer.skewY.should.equal 1e-7

			# layer.style.webkitTransform.should.equal "matrix(1, 0, 0, 1, 100, 0)"
			layer.style.webkitTransform.should.equal "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) skew(0.00001deg, 0.00001deg) skewX(0.000001deg) skewY(0deg) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px)"

		it "should set x and y", ->

			layer = new Layer

			layer.x = 100
			layer.x.should.equal 100
			layer.y = 50
			layer.y.should.equal 50

			# layer.style.webkitTransform.should.equal "matrix(1, 0, 0, 1, 100, 0)"
			layer.style.webkitTransform.should.equal "translate3d(100px, 50px, 0px) scale3d(1, 1, 1) skew(0deg, 0deg) skewX(0deg) skewY(0deg) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px)"

		it "should handle midX and midY when width and height are 0", ->
			box = new Layer
				midX: 200
				midY: 300
				width: 0
				height: 0

			box.x.should.equal 200
			box.y.should.equal 300

		it "should set scale", ->

			layer = new Layer

			layer.scaleX = 100
			layer.scaleY = 100
			layer.scaleZ = 100

			# layer.style.webkitTransform.should.equal "matrix(1, 0, 0, 1, 100, 50)"
			layer.style.webkitTransform.should.equal "translate3d(0px, 0px, 0px) scale3d(100, 100, 100) skew(0deg, 0deg) skewX(0deg) skewY(0deg) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px)"

		it "should set origin", ->

			layer = new Layer
				originZ: 80

			layer.style.webkitTransformOrigin.should.equal "50% 50%"

			layer.originX = 0.1
			layer.originY = 0.2

			layer.style.webkitTransformOrigin.should.equal "10% 20%"
			layer.style.webkitTransform.should.equal "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) skew(0deg, 0deg) skewX(0deg) skewY(0deg) translateZ(80px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(-80px)"

			layer.originX = 0.5
			layer.originY = 0.5

			layer.style.webkitTransformOrigin.should.equal "50% 50%"
			layer.style.webkitTransform.should.equal "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) skew(0deg, 0deg) skewX(0deg) skewY(0deg) translateZ(80px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(-80px)"

		it "should preserve 3D by default", ->

			layer = new Layer

			layer._element.style.webkitTransformStyle.should.equal "preserve-3d"

		it "should flatten layer", ->

			layer = new Layer
				flat: true

			layer._element.style.webkitTransformStyle.should.equal "flat"


		it "should set local image", ->

			prefix = "../"
			imagePath = "static/test.png"
			fullPath = prefix + imagePath
			layer = new Layer

			layer.image = fullPath
			layer.image.should.equal fullPath

			image = layer.props.image
			layer.props.image.should.equal fullPath

			layer.style["background-image"].indexOf(imagePath).should.not.equal(-1)
			layer.style["background-image"].indexOf("file://").should.not.equal(-1)
			layer.style["background-image"].indexOf("?nocache=").should.not.equal(-1)

		it "should set local image when listening to load events", (done) ->
			prefix = "../"
			imagePath = "static/test.png"
			fullPath = prefix + imagePath
			layer = new Layer

			layer.on Events.ImageLoaded, ->
				layer.style["background-image"].indexOf(imagePath).should.not.equal(-1)
				layer.style["background-image"].indexOf("file://").should.not.equal(-1)
				layer.style["background-image"].indexOf("?nocache=").should.not.equal(-1)
				done()

			layer.image = fullPath
			layer.image.should.equal fullPath

			image = layer.props.image
			layer.props.image.should.equal fullPath

			layer.style["background-image"].indexOf(imagePath).should.equal(-1)
			layer.style["background-image"].indexOf("file://").should.equal(-1)
			layer.style["background-image"].indexOf("?nocache=").should.equal(-1)

			#layer.computedStyle()["background-size"].should.equal "cover"
			#layer.computedStyle()["background-repeat"].should.equal "no-repeat"


		it "should not append nocache to a base64 encoded image", ->

			fullPath = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABMBAMAAAA1uUwYAAAAAXNSR0IArs4c6QAAABVQTFRFKK/6LFj/g9n/lNf9lqz/wez/////Ke+vpgAAAK1JREFUSMft1sENhDAMBdFIrmBboAjuaWFrsNN/CRwAgUPsTAH556c5WVFKQyuLLYbZf/MLmDHW5yJmjHW5kBljPhczY8zlEmaMvXMZM8ZeuZQZY08uZzZh5dqen+XNhLFBbsiEsW9uzISxTy5gwlifi5gw1uVCJoz5XMyEMZdLmASs/s5NnkFl7M7NmDJ25aZMGTtzc6aMtcqYMtYqY8pYq4wpY60ypuvnsNizA+E6656TNMZlAAAAAElFTkSuQmCC"
			layer = new Layer

			layer.image = fullPath
			layer.image.should.equal fullPath

			image = layer.props.image
			image.should.equal fullPath

			layer.style["background-image"].indexOf(fullPath).should.not.equal(-1)
			layer.style["background-image"].indexOf("data:").should.not.equal(-1)
			layer.style["background-image"].indexOf("?nocache=").should.equal(-1)


		it "should append nocache with an ampersand if url params already exist", (done) ->

			prefix = "../"
			imagePath = "static/test.png?param=foo"
			fullPath = prefix + imagePath
			layer = new Layer

			layer.on Events.ImageLoaded, ->
				layer.style["background-image"].indexOf(imagePath).should.not.equal(-1)
				layer.style["background-image"].indexOf("file://").should.not.equal(-1)
				layer.style["background-image"].indexOf("&nocache=").should.not.equal(-1)
				done()

			layer.image = fullPath
			layer.image.should.equal fullPath


		it "should cancel loading when setting image to null", (done) ->
			prefix = "../"
			imagePath = "static/test.png"
			fullPath = prefix + imagePath

			#First set the image directly to something
			layer = new Layer
				image: "static/test2.png"

			#Now add event handlers
			layer.on Events.ImageLoadCancelled, ->
				layer.style["background-image"].indexOf(imagePath).should.equal(-1)
				layer.style["background-image"].indexOf("file://").should.equal(-1)
				layer.style["background-image"].indexOf("?nocache=").should.equal(-1)
				done()

			#so we preload the next image
			layer.image = fullPath

			#set the image no null to cancel the loading
			layer.image = null

		it "should set image", ->
			imagePath = "../static/test.png"
			layer = new Layer image: imagePath
			layer.image.should.equal imagePath

		it "should unset image with null", ->
			layer = new Layer image: "../static/test.png"
			layer.image = null
			layer.image.should.equal ""

		it "should unset image with empty string", ->
			layer = new Layer image: "../static/test.png"
			layer.image = ""
			layer.image.should.equal ""

		it "should test image property type", ->
			f = ->
				layer = new Layer
				layer.image = {}
			f.should.throw()

		it "should set name on create", ->
			layer = new Layer name: "Test"
			layer.name.should.equal "Test"
			layer._element.getAttribute("name").should.equal "Test"

		it "should set name after create", ->
			layer = new Layer
			layer.name = "Test"
			layer.name.should.equal "Test"
			layer._element.getAttribute("name").should.equal "Test"

		it "should handle false layer names correctly", ->
			layer = new Layer
				name: 0
			layer.name.should.equal "0"
			layer._element.getAttribute("name").should.equal "0"

		it "should handle background color with image", ->

			# We want the background color to be there until an images
			# is set UNLESS we set another backgroundColor explicitly

			imagePath = "../static/test.png"

			layer = new Layer image: imagePath
			assert.equal layer.backgroundColor.color, null

			layer = new Layer
			layer.image = imagePath
			assert.equal layer.backgroundColor.color, null

			layer = new Layer backgroundColor: "red"
			layer.image = imagePath
			Color.equal(layer.backgroundColor, new Color("red")).should.be.true

			layer = new Layer
			layer.backgroundColor = "red"
			layer.image = imagePath
			Color.equal(layer.backgroundColor, new Color("red")).should.be.true

		it "should set visible", ->

			layer = new Layer

			layer.visible.should.equal true
			layer.style["display"].should.equal "block"

			layer.visible = false
			layer.visible.should.equal false
			layer.style["display"].should.equal "none"

		it "should set clip", ->

			layer = new Layer

			layer.clip.should.equal false
			layer.style["overflow"].should.equal "visible"

			layer.clip = true
			layer.style["overflow"].should.equal "hidden"

		it "should set scroll", ->

			layer = new Layer

			layer.scroll.should.equal false
			layer.style["overflow"].should.equal "visible"

			layer.scroll = true
			layer.scroll.should.equal true
			layer.style["overflow"].should.equal "scroll"

			layer.ignoreEvents.should.equal false

			layer.scroll = false
			layer.scroll.should.equal false
			layer.style["overflow"].should.equal "visible"

		it "should set scroll from properties", ->

			layer = new Layer
			layer.props = {scroll: false}
			layer.scroll.should.equal false
			layer.props = {scroll: true}
			layer.scroll.should.equal true

		it "should set scrollHorizontal", ->

			layer = new Layer

			layer.scroll.should.equal false
			layer.style["overflow"].should.equal "visible"
			layer.ignoreEvents.should.equal true

			layer.scroll = true
			layer.scroll.should.equal true
			layer.style["overflow"].should.equal "scroll"
			layer.ignoreEvents.should.equal false

		it "should disable ignore events when scroll is set from constructor", ->
			layerA = new Layer
				scroll: true
			layerA.ignoreEvents.should.equal false

		it "should set style properties on create", ->

			layer = new Layer backgroundColor: "red"
			layer.backgroundColor.isEqual(new Color("red")).should.equal true
			layer.style["backgroundColor"].should.equal new Color("red").toString()

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

		it "should set borderRadius with objects", ->

			testBorderRadius = (layer, tl, tr, bl, br) ->

				layer.style["border-top-left-radius"].should.equal "#{tl}"
				layer.style["border-top-right-radius"].should.equal "#{tr}"
				layer.style["border-bottom-left-radius"].should.equal "#{bl}"
				layer.style["border-bottom-right-radius"].should.equal "#{br}"

			layer = new Layer

			# No matching keys is an error
			layer.borderRadius = {aap: 10, noot: 20, mies: 30}
			layer.borderRadius.should.equal 0
			testBorderRadius(layer, "0px", "0px", "0px", "0px")

			# Arrays are not supported either
			layer.borderRadius = [1, 2, 3, 4]
			layer.borderRadius.should.equal 0
			testBorderRadius(layer, "0px", "0px", "0px", "0px")

			layer.borderRadius = {topLeft: 10}
			layer.borderRadius.topLeft.should.equal 10
			testBorderRadius(layer, "10px", "0px", "0px", "0px")

			layer.borderRadius = {topLeft: 1, topRight: 2, bottomLeft: 3, bottomRight: 4}
			layer.borderRadius.topLeft.should.equal 1
			layer.borderRadius.bottomRight.should.equal 4
			testBorderRadius(layer, "1px", "2px", "3px", "4px")

		it "should set perspective", ->

			layer = new Layer
			layer.perspective = 500

			layer.style["-webkit-perspective"].should.equal("500")

		it "should have its backface visible by default", ->

			layer = new Layer
			layer.style["webkitBackfaceVisibility"].should.equal "visible"

		it "should allow backface to be hidden", ->

			layer = new Layer
			layer.backfaceVisible = false
			layer.style["webkitBackfaceVisibility"].should.equal "hidden"

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

		it "should only set name when explicitly set", ->
			layer = new Layer
			layer.__framerInstanceInfo = {name: "aap"}
			layer.name.should.equal ""

		it "it should show the variable name in toInspect()", ->
			layer = new Layer
			layer.__framerInstanceInfo = {name: "aap"}
			(_.startsWith layer.toInspect(), "<Layer aap id:").should.be.true

		it "should set htmlIntrinsicSize", ->
			layer = new Layer

			assert.equal layer.htmlIntrinsicSize, null

			layer.htmlIntrinsicSize = "aap"
			assert.equal layer.htmlIntrinsicSize, null

			layer.htmlIntrinsicSize =
				width: 10
			assert.equal layer.htmlIntrinsicSize, null

			layer.htmlIntrinsicSize =
				width: 10
				height: 20
			layer.htmlIntrinsicSize.should.eql({width: 10, height: 20})

			layer.htmlIntrinsicSize = null
			assert.equal layer.htmlIntrinsicSize, null

		it "should set gradient", ->
			layer = new Layer
			layer.gradient = new Gradient
				start: "blue"
				end: "red"
				angle: 42
			layer.gradient.start.isEqual("blue").should.be.true
			layer.gradient.end.isEqual("red").should.be.true
			layer.gradient.angle.should.equal(42)
			layer.style["background-image"].should.equal("linear-gradient(42deg, rgb(0, 0, 255), rgb(255, 0, 0))")

			layer.gradient =
				start: "yellow"
				end: "purple"
			layer.gradient.angle.should.equal(0)
			layer.style["background-image"].should.equal("linear-gradient(0deg, rgb(255, 255, 0), rgb(128, 0, 128))")

			layer.gradient = null
			layer.style["background-image"].should.equal("")

		it "should copy borderRadius when set with an object", ->
			layer = new Layer
			borderRadius = {topLeft: 100}
			layer.borderRadius = borderRadius
			borderRadius.bottomRight = 100
			layer.borderRadius.bottomRight.should.equal 0

		it "should copy borderWidth when set with an object", ->
			layer = new Layer
			borderWidth = {top: 100}
			layer.borderWidth = borderWidth
			borderWidth.bottom = 100
			layer.borderWidth.bottom.should.equal 0

		it "should copy gradients when set with an object", ->
			layer = new Layer
			gradient = new Gradient
				start: "blue"
			layer.gradient = gradient
			gradient.start = "yellow"
			layer.gradient.start.isEqual("blue").should.be.true

		it "should set sub-properties of borderRadius", ->
			layer = new Layer
				borderRadius: {topLeft: 100}
			layer.borderRadius.bottomRight = 100
			layer.borderRadius.topLeft.should.equal(100)
			layer.borderRadius.bottomRight.should.equal(100)
			layer.style["border-top-left-radius"].should.equal "100px"
			layer.style["border-bottom-right-radius"].should.equal "100px"

		it "should set sub-properties of borderWidth", ->
			layer = new Layer
				borderWidth: {top: 10}
			layer.borderWidth.bottom = 10
			layer.borderWidth.top.should.equal(10)
			layer.borderWidth.bottom.should.equal(10)
			layer._elementBorder.style["border-top-width"].should.equal "10px"
			layer._elementBorder.style["border-bottom-width"].should.equal "10px"

		it "should set sub-properties of gradients", ->
			layer = new Layer
				gradient:
					start: "blue"
			layer.gradient.end = "yellow"
			layer.gradient.start.isEqual("blue").should.be.true
			layer.gradient.end.isEqual("yellow").should.be.true
			layer.style["background-image"].should.equal("linear-gradient(0deg, rgb(0, 0, 255), rgb(255, 255, 0))")

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

			layer.style.boxShadow.should.equal "rgba(123, 123, 123, 0.498039) 10px 10px 10px 10px"

			# Only after we set a color a shadow should be drawn
			layer.shadowColor = "red"
			layer.shadowColor.r.should.equal 255
			layer.shadowColor.g.should.equal 0
			layer.shadowColor.b.should.equal 0
			layer.shadowColor.a.should.equal 1

			layer.style.boxShadow.should.equal "rgb(255, 0, 0) 10px 10px 10px 10px"

			# Only after we set a color a shadow should be drawn
			layer.shadowColor = null
			layer.style.boxShadow.should.equal "rgba(0, 0, 0, 0) 10px 10px 10px 10px"

		it "should remove all events", ->
			layerA = new Layer
			handler = -> console.log "hello"
			layerA.on("test", handler)
			layerA.removeAllListeners("test")
			layerA.listeners("test").length.should.equal 0

		it "should add and clean up dom events", ->
			layerA = new Layer
			handler = -> console.log "hello"

			layerA.on(Events.Click, handler)
			layerA.on(Events.Click, handler)
			layerA.on(Events.Click, handler)
			layerA.on(Events.Click, handler)

			# But never more then one
			layerA._domEventManager.listeners(Events.Click).length.should.equal(1)

			layerA.removeAllListeners(Events.Click)

			# And on removal, we should get rid of the dom event
			layerA._domEventManager.listeners(Events.Click).length.should.equal(0)

		it "should work with event helpers", (done) ->

			layer = new Layer

			layer.onMouseOver (event, aLayer) ->
				aLayer.should.equal(layer)
				@should.equal(layer)
				done()

			simulate.mouseover(layer._element)

		it "should only pass dom events to the event manager", ->

			layer = new Layer
			layer.on Events.Click, ->
			layer.on Events.Move, ->

			layer._domEventManager.listenerEvents().should.eql([Events.Click])

	describe "Hierarchy", ->

		it "should insert in dom", ->

			layer = new Layer

			assert.equal layer._element.parentNode.id, "FramerContextRoot-Default"
			assert.equal layer.superLayer, null

		it "should check superLayer", ->

			f = -> layer = new Layer superLayer: 1
			f.should.throw()

		it "should add child", ->

			layerA = new Layer
			layerB = new Layer superLayer: layerA

			assert.equal layerB._element.parentNode, layerA._element
			assert.equal layerB.superLayer, layerA

		it "should remove child", ->

			layerA = new Layer
			layerB = new Layer superLayer: layerA

			layerB.superLayer = null

			assert.equal layerB._element.parentNode.id, "FramerContextRoot-Default"
			assert.equal layerB.superLayer, null

		it "should list children", ->

			layerA = new Layer
			layerB = new Layer superLayer: layerA
			layerC = new Layer superLayer: layerA

			assert.deepEqual layerA.children, [layerB, layerC]

			layerB.superLayer = null
			assert.equal layerA.children.length, 1
			assert.deepEqual layerA.children, [layerC]

			layerC.superLayer = null
			assert.deepEqual layerA.children, []

		it "should list sibling root layers", ->

			layerA = new Layer
			layerB = new Layer
			layerC = new Layer

			assert layerB in layerA.siblingLayers, true
			assert layerC in layerA.siblingLayers, true

		it "should list sibling layers", ->

			layerA = new Layer
			layerB = new Layer superLayer: layerA
			layerC = new Layer superLayer: layerA

			assert.deepEqual layerB.siblingLayers, [layerC]
			assert.deepEqual layerC.siblingLayers, [layerB]

		it "should list ancestors", ->

			layerA = new Layer
			layerB = new Layer superLayer: layerA
			layerC = new Layer superLayer: layerB

			assert.deepEqual layerC.ancestors(), [layerB, layerA]

		it "should list descendants deeply", ->

			layerA = new Layer
			layerB = new Layer superLayer: layerA
			layerC = new Layer superLayer: layerB

			layerA.descendants.should.eql [layerB, layerC]

		it "should list descendants", ->

			layerA = new Layer
			layerB = new Layer superLayer: layerA
			layerC = new Layer superLayer: layerA

			layerA.descendants.should.eql [layerB, layerC]

		it "should set super/parent with property", ->
			layerA = new Layer
			layerB = new Layer
			layerB.superLayer = layerA
			layerA.children.should.eql [layerB]
			layerA.subLayers.should.eql [layerB]

		it "should set super/parent with with constructor", ->
			layerA = new Layer
			layerB = new Layer
				superLayer: layerA
			layerA.children.should.eql [layerB]
			layerA.subLayers.should.eql [layerB]


	describe "Layering", ->

		it "should set at creation", ->

			layer = new Layer index: 666
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
			layerB = new Layer superLayer: layerA
			layerC = new Layer superLayer: layerA

			assert.equal layerB.index, 1
			assert.equal layerC.index, 2

		it "should send back and front", ->

			layerA = new Layer
			layerB = new Layer superLayer: layerA
			layerC = new Layer superLayer: layerA

			layerC.sendToBack()

			assert.equal layerB.index,  1
			assert.equal layerC.index, -1

			layerC.bringToFront()

			assert.equal layerB.index,  1
			assert.equal layerC.index,  2

		it "should place in front", ->

			layerA = new Layer
			layerB = new Layer superLayer: layerA # 1
			layerC = new Layer superLayer: layerA # 2
			layerD = new Layer superLayer: layerA # 3

			layerB.placeBefore layerC

			assert.equal layerB.index, 2
			assert.equal layerC.index, 1
			assert.equal layerD.index, 3

		it "should place behind", ->

			layerA = new Layer
			layerB = new Layer superLayer: layerA # 1
			layerC = new Layer superLayer: layerA # 2
			layerD = new Layer superLayer: layerA # 3

			layerC.placeBehind layerB

			# TODO: Still something fishy here, but it works

			assert.equal layerB.index, 2
			assert.equal layerC.index, 1
			assert.equal layerD.index, 4

		it "should get a children by name", ->

			layerA = new Layer
			layerB = new Layer name: "B", superLayer: layerA
			layerC = new Layer name: "C", superLayer: layerA
			layerD = new Layer name: "C", superLayer: layerA

			layerA.childrenWithName("B").should.eql [layerB]
			layerA.childrenWithName("C").should.eql [layerC, layerD]

		it "should get a siblinglayer by name", ->

			layerA = new Layer
			layerB = new Layer name: "B", superLayer: layerA
			layerC = new Layer name: "C", superLayer: layerA
			layerD = new Layer name: "C", superLayer: layerA

			layerB.siblingLayersByName("C").should.eql [layerC, layerD]
			layerD.siblingLayersByName("B").should.eql [layerB]

		it "should get a ancestors", ->
			layerA = new Layer
			layerB = new Layer superLayer: layerA
			layerC = new Layer superLayer: layerB
			layerC.ancestors().should.eql [layerB, layerA]

	describe "Select Layer", ->

		beforeEach ->
			Framer.CurrentContext.reset()

		it "should select the layer named B", ->
			layerA = new Layer name: 'A'
			layerB = new Layer name: 'B', parent: layerA
			layerA.selectChild('B').should.equal layerB

		it "should select the layer named C", ->
			layerA = new Layer name: 'A'
			layerB = new Layer name: 'B', parent: layerA
			layerC = new Layer name: 'C', parent: layerB
			layerA.selectChild('B > *').should.equal layerC

		it "should have a static method `select`", ->
			layerA = new Layer name: 'A'
			layerB = new Layer name: 'B', parent: layerA
			layerC = new Layer name: 'C', parent: layerB
			Layer.select('B > *').should.equal layerC

		it "should have a method `selectAllChildren`", ->
			layerA = new Layer name: 'A'
			layerB = new Layer name: 'B', parent: layerA
			layerC = new Layer name: 'C', parent: layerB
			layerD = new Layer name: 'D', parent: layerB
			layerA.selectAllChildren('B > *').should.eql [layerC, layerD]

		it "should have a static method `selectAll`", ->
			layerA = new Layer name: 'A'
			layerB = new Layer name: 'B', parent: layerA # asdas
			layerC = new Layer name: 'C', parent: layerB
			layerD = new Layer name: 'D', parent: layerB
			Layer.selectAll('A *').should.eql [layerB, layerC, layerD]

	describe "Frame", ->

		it "should set on create", ->

			layer = new Layer frame: {x: 111, y: 222, width: 333, height: 444}

			assert.equal layer.x, 111
			assert.equal layer.y, 222
			assert.equal layer.width, 333
			assert.equal layer.height, 444

		it "should set after create", ->

			layer = new Layer
			layer.frame = {x: 111, y: 222, width: 333, height: 444}

			assert.equal layer.x, 111
			assert.equal layer.y, 222
			assert.equal layer.width, 333
			assert.equal layer.height, 444

		it "should set minX on creation", ->
			layer = new Layer minX: 200, y: 100, width: 100, height: 100
			layer.x.should.equal 200

		it "should set midX on creation", ->
			layer = new Layer midX: 200, y: 100, width: 100, height: 100
			layer.x.should.equal 150

		it "should set maxX on creation", ->
			layer = new Layer maxX: 200, y: 100, width: 100, height: 100
			layer.x.should.equal 100

		it "should set minY on creation", ->
			layer = new Layer x: 100, minY: 200, width: 100, height: 100
			layer.y.should.equal 200

		it "should set midY on creation", ->
			layer = new Layer x: 100, midY: 200, width: 100, height: 100
			layer.y.should.equal 150

		it "should set maxY on creation", ->
			layer = new Layer x: 100, maxY: 200, width: 100, height: 100
			layer.y.should.equal 100


		it "should set minX", ->
			layer = new Layer y: 100, width: 100, height: 100
			layer.minX = 200
			layer.x.should.equal 200

		it "should set midX", ->
			layer = new Layer y: 100, width: 100, height: 100
			layer.midX = 200
			layer.x.should.equal 150

		it "should set maxX", ->
			layer = new Layer y: 100, width: 100, height: 100
			layer.maxX = 200
			layer.x.should.equal 100

		it "should set minY", ->
			layer = new Layer x: 100, width: 100, height: 100
			layer.minY = 200
			layer.y.should.equal 200

		it "should set midY", ->
			layer = new Layer x: 100, width: 100, height: 100
			layer.midY = 200
			layer.y.should.equal 150

		it "should set maxY", ->
			layer = new Layer x: 100, width: 100, height: 100
			layer.maxY = 200
			layer.y.should.equal 100

		it "should get and set canvasFrame", ->

			layerA = new Layer x: 100, y: 100, width: 100, height: 100
			layerB = new Layer x: 300, y: 300, width: 100, height: 100, superLayer: layerA

			assert.equal layerB.canvasFrame.x, 400
			assert.equal layerB.canvasFrame.y, 400

			layerB.canvasFrame = {x: 1000, y: 1000}

			assert.equal layerB.canvasFrame.x, 1000
			assert.equal layerB.canvasFrame.y, 1000

			assert.equal layerB.x, 900
			assert.equal layerB.y, 900

			layerB.superLayer = null
			assert.equal layerB.canvasFrame.x, 900
			assert.equal layerB.canvasFrame.y, 900

		it "should calculate scale", ->
			layerA = new Layer scale: 0.9
			layerB = new Layer scale: 0.8, superLayer: layerA
			layerB.screenScaleX().should.equal 0.9 * 0.8
			layerB.screenScaleY().should.equal 0.9 * 0.8

		it "should calculate scaled frame", ->
			layerA = new Layer x: 100, width: 500, height: 900, scale: 0.5
			layerA.scaledFrame().should.eql {"x": 225, "y": 225, "width": 250, "height": 450}

		it "should calculate scaled screen frame", ->

			layerA = new Layer x: 100, width: 500, height: 900, scale: 0.5
			layerB = new Layer y: 50, width: 600, height: 600, scale: 0.8, superLayer: layerA
			layerC = new Layer y: -60, width: 800, height: 700, scale: 1.2, superLayer: layerB

			layerA.screenScaledFrame().should.eql {"x": 225, "y": 225, "width": 250, "height": 450}
			layerB.screenScaledFrame().should.eql {"x": 255, "y": 280, "width": 240, "height": 240}
			layerC.screenScaledFrame().should.eql {"x": 223, "y": 228, "width": 384, "height": 336}

		it "should accept point shortcut", ->
			layer = new Layer point: 10
			layer.x.should.equal 10
			layer.y.should.equal 10

		it "should accept size shortcut", ->
			layer = new Layer size: 10
			layer.width.should.equal 10
			layer.height.should.equal 10

	describe "Center", ->

		it "should center", ->
			layerA = new Layer width: 200, height: 200
			layerB = new Layer width: 100, height: 100, superLayer: layerA
			layerB.center()

			assert.equal layerB.x, 50
			assert.equal layerB.y, 50

		it "should center with offset", ->
			layerA = new Layer width: 200, height: 200
			layerB = new Layer width: 100, height: 100, superLayer: layerA
			layerB.centerX(50)
			layerB.centerY(50)

			assert.equal layerB.x, 100
			assert.equal layerB.y, 100

		it "should center return layer", ->
			layerA = new Layer width: 200, height: 200
			layerA.center().should.equal layerA
			layerA.centerX().should.equal layerA
			layerA.centerY().should.equal layerA

		it "should center pixel align", ->
			layerA = new Layer width: 200, height: 200
			layerB = new Layer width: 111, height: 111, superLayer: layerA
			layerB.center().pixelAlign()

			assert.equal layerB.x, 44
			assert.equal layerB.y, 44

		it "should center with border", ->

			layer = new Layer
				width: 200
				height: 200

			layer.borderColor = "green"
			layer.borderWidth = 30

			layer.center()

			layerB = new Layer
				superLayer: layer
				backgroundColor: "red"
			layerB.center()

			layerB.frame.should.eql {x: 20, y: 20, width: 100, height: 100}

		it "should center within outer frame", ->
			layerA = new Layer width: 10, height: 10
			layerA.center()
			assert.equal layerA.x, 195
			assert.equal layerA.y, 145

		it "should center correctly with dpr set", ->
			device = new DeviceComponent()
			device.deviceType = "apple-iphone-7-black"
			device.context.run ->
				layerA = new Layer size: 100
				layerA.center()
				layerA.context.devicePixelRatio.should.equal 2
				layerA.x.should.equal 137
				layerA.y.should.equal 283

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

			(layer in Framer.CurrentContext.layers).should.be.false
			assert.equal layer._element.parentNode, null

		it "should set text", ->

			layer = new Layer
			layer.html = "Hello"

			layer._element.childNodes[0].should.equal layer._elementHTML
			layer._elementHTML.innerHTML.should.equal "Hello"
			layer.ignoreEvents.should.equal true

		it "should not effect children", ->

			layer = new Layer
			layer.html = "Hello"
			Child = new Layer superLayer: layer

			Child._element.offsetTop.should.equal 0

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

			inputElement = _.head(inputElements)
			inputElement.getAttribute("id").should.equal "hello"

	describe "Force 2D", ->

		it "should switch to 2d rendering", ->

			layer = new Layer

			layer.style.webkitTransform.should.equal "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) skew(0deg, 0deg) skewX(0deg) skewY(0deg) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px)"

			layer.force2d = true

			layer.style.webkitTransform.should.equal "translate(0px, 0px) scale(1, 1) skew(0deg, 0deg) rotate(0deg)"

	describe "Matrices", ->

		it "should have the correct matrix", ->

			layer = new Layer
				scale: 2
				rotation: 45
				x: 200
				y: 120
				skew: 21

			layer.matrix.toString().should.eql "matrix(1.957079, 1.957079, -0.871348, 0.871348, 200.000000, 120.000000)"

		it "should have the correct matrix when 2d is forced", ->

			layer = new Layer
				scale: 2
				rotation: 45
				x: 200
				y: 120
				skew: 21
				force2d: true

			layer.matrix.toString().should.eql "matrix(2.165466, 1.957079, -1.079734, 0.871348, 200.000000, 120.000000)"

		it "should have the correct transform matrix", ->

			layer = new Layer
				scale: 20
				rotation: 5
				rotationY: 20
				x: 200
				y: 120
				skew: 21

			layer.transformMatrix.toString().should.eql "matrix3d(19.391455, 8.929946, -0.340719, 0.000000, 6.010074, 19.295128, 0.029809, 0.000000, 6.840403, 2.625785, 0.939693, 0.000000, -1020.076470, -1241.253701, 15.545482, 1.000000)"

		it "should have the correct screen point", ->

			layer = new Layer
				rotation: 5
				x: 200
				y: 120
				skew: 21

			roundX = Math.round(layer.convertPointToScreen().x)
			roundX.should.eql 184

		it "should have the correct screen frame", ->

			layer = new Layer
				rotation: 5
				x: 200
				y: 120
				skew: 21
			boundingBox = layer.screenFrame

			boundingBox.x.should.eql 184
			boundingBox.y.should.eql 98
			boundingBox.width.should.eql 132
			boundingBox.height.should.eql 144

		it "should use Framer.Defaults when setting the screen frame", ->
			Framer.Defaults.Layer.width = 300
			Framer.Defaults.Layer.height = 400
			box = new Layer
				screenFrame:
					x: 123
			box.stateCycle()
			box.x.should.equal 123
			box.width.should.equal 300
			box.height.should.equal 400
			Framer.resetDefaults()

		it "should have the correct canvas frame", ->

			layer = new Layer
				rotation: 5
				x: 200
				y: 120
				skew: 21
			boundingBox = layer.canvasFrame

			boundingBox.x.should.eql 184
			boundingBox.y.should.eql 98
			boundingBox.width.should.eql 132
			boundingBox.height.should.eql 144

	describe "Copy", ->

		it "copied Layer should hold set props", ->

			X = 100
			Y = 200
			IMAGE = "../static/test.png"
			BORDERRADIUS = 20

			layer = new Layer
				x: X
				y: Y
				image: IMAGE

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

		it "copied Layer should also copy styles", ->
			layer = new Layer
				style:
					"font-family": "-apple-system"
					"font-size": "1.2em"
					"text-align": "right"

			copy = layer.copy()
			copy.style["font-family"].should.equal "-apple-system"
			copy.style["font-size"].should.equal "1.2em"
			copy.style["text-align"].should.equal "right"

	describe "Point conversion", ->

		it "should correctly convert points from layer to Screen", ->

			point =
				x: 200
				y: 300

			layer = new Layer point: point
			screenPoint = layer.convertPointToScreen()
			screenPoint.x.should.equal point.x
			screenPoint.y.should.equal point.y

		it "should correctly convert points from Screen to layer", ->

			point =
				x: 300
				y: 200

			layer = new Layer point: point
			layerPoint = Screen.convertPointToLayer({}, layer)
			layerPoint.x.should.equal -point.x
			layerPoint.y.should.equal -point.y

		it "should correctly convert points from layer to layer", ->

			layerBOffset =
				x: 200
				y: 400

			layerA = new Layer
			layerB = new Layer point: layerBOffset

			layerAToLayerBPoint = layerA.convertPointToLayer({}, layerB)
			layerAToLayerBPoint.x.should.equal -layerBOffset.x
			layerAToLayerBPoint.y.should.equal -layerBOffset.y

		it "should correctly convert points when layers are nested", ->

			layerBOffset =
				x: 0
				y: 200

			layerA = new Layer
			layerB = new Layer
				parent: layerA
				point: layerBOffset
				rotation: 90
				originX: 0
				originY: 0

			layerAToLayerBPoint = layerA.convertPointToLayer({}, layerB)
			layerAToLayerBPoint.x.should.equal -layerBOffset.y

		it "should correctly convert points between multiple layers and transforms", ->

			layerA = new Layer
				x: 275

			layerB = new Layer
				y: 400
				x: 400
				scale: 2
				parent: layerA

			layerC = new Layer
				x: -200
				y: 100
				rotation: 180
				originX: 0
				originY: 0
				parent: layerB

			screenToLayerCPoint = Screen.convertPointToLayer(null, layerC)

			screenToLayerCPoint.x.should.equal 112.5
			screenToLayerCPoint.y.should.equal 275

		it "should correctly convert points from the Canvas to a layer", ->

			layerA = new Layer
				scale: 2

			layerB = new Layer
				parent: layerA
				originY: 1
				rotation: 90

			canvasToLayerBPoint = Canvas.convertPointToLayer({}, layerB)

			canvasToLayerBPoint.x.should.equal -25
			canvasToLayerBPoint.y.should.equal 125
	describe "Device Pixel Ratio", ->
		it "should default to 1", ->
			a = new Layer
			a.context.devicePixelRatio.should.equal 1

		it "should change all of a layers children", ->
			context = new Framer.Context(name: "Test")
			context.run ->
				a = new Layer
				b = new Layer
					parent: a
				c = new Layer
					parent: b
				a.context.devicePixelRatio = 3
				for l in [a, b, c]
					l._element.style.width.should.equal "300px"

	describe "containers", ->
		it "should return empty when called on rootLayer", ->
			a = new Layer name: "a"
			a.containers().should.deep.equal []

		it "should return all ancestors", ->
			a = new Layer name: "a"
			b = new Layer parent: a, name: "b"
			c = new Layer parent: b, name: "c"
			d = new Layer parent: c, name: "d"
			names = d.containers().map (l) -> l.name
			names.should.deep.equal ["c", "b", "a"]

		it "should include the device return all ancestors", ->
			device = new DeviceComponent()
			device.context.run ->
				a = new Layer name: "a"
				b = new Layer parent: a, name: "b"
				c = new Layer parent: b, name: "c"
				d = new Layer parent: c, name: "d"
				containers = d.containers(true)
				containers.length.should.equal 10
				names = containers.map((l) -> l.name)
				names.should.eql ["c", "b", "a", undefined, "viewport", "screen", "phone", "phone", "hands", undefined]

	describe "constraintValues", ->
		it "layout should not break constraints", ->
			l = new Layer
				x: 100
				constraintValues:
					aspectRatioLocked: true
			l.x.should.equal 100
			l.layout()
			l.x.should.equal 0
			assert.notEqual l.constraintValues, null

		it "should break all constraints when setting x", ->
			l = new Layer
				x: 100
				constraintValues:
					aspectRatioLocked: true
			l.x.should.equal 100
			assert.notEqual l.constraintValues, null
			l.x = 50
			assert.equal l.constraintValues, null

		it "should break all constraints when setting y", ->
			l = new Layer
				y: 100
				constraintValues:
					aspectRatioLocked: true
			l.y.should.equal 100
			assert.notEqual l.constraintValues, null
			l.y = 50
			assert.equal l.constraintValues, null

		it "should update the width constraint when setting width", ->
			l = new Layer
				width: 100
				constraintValues:
					aspectRatioLocked: true
			l.width.should.equal 100
			assert.notEqual l.constraintValues, null
			l.width = 50
			l.constraintValues.width.should.equal 50

		it "should update the height constraint when setting height", ->
			l = new Layer
				height: 100
				constraintValues:
					aspectRatioLocked: true
			l.height.should.equal 100
			assert.notEqual l.constraintValues, null
			l.height = 50
			l.constraintValues.height.should.equal 50

		it "should disable the aspectRatioLock and widthFactor constraint when setting width", ->
			l = new Layer
				constraintValues:
					aspectRatioLocked: true
					widthFactor: 0.5
					width: null
			l.layout()
			l.width.should.equal 200
			assert.notEqual l.constraintValues, null
			l.width = 50
			l.constraintValues.aspectRatioLocked.should.equal false
			assert.equal l.constraintValues.widthFactor, null

		it "should disable the aspectRatioLock and heightFactor constraint when setting height", ->
			l = new Layer
				constraintValues:
					aspectRatioLocked: true
					heightFactor: 0.5
					height: null
			l.layout()
			l.height.should.equal 150
			assert.notEqual l.constraintValues, null
			l.height = 50
			assert.equal l.constraintValues.heightFactor, null

		it "should update the x position when changing width", ->
			l = new Layer
				width: 100
				constraintValues:
					left: null
					right: 20
			l.layout()
			l.width.should.equal 100
			l.x.should.equal 280
			assert.notEqual l.constraintValues, null
			l.width = 50
			l.x.should.equal 330

		it "should update the y position when changing height", ->
			l = new Layer
				height: 100
				constraintValues:
					top: null
					bottom: 20
			l.layout()
			l.height.should.equal 100
			l.y.should.equal 180
			assert.notEqual l.constraintValues, null
			l.height = 50
			l.y.should.equal 230

		it "should update to center the layer when center() is called", ->
			l = new Layer
				constraintValues:
					aspectRatioLocked: true
			l.layout()
			l.center()
			l.x.should.equal 150
			l.y.should.equal 100
			assert.equal l.constraintValues.left, null
			assert.equal l.constraintValues.right, null
			assert.equal l.constraintValues.top, null
			assert.equal l.constraintValues.bottom, null
			assert.equal l.constraintValues.centerAnchorX, 0.5
			assert.equal l.constraintValues.centerAnchorY, 0.5

		it "should update to center the layer vertically when centerX() is called", ->
			l = new Layer
				constraintValues:
					aspectRatioLocked: true
			l.layout()
			l.x.should.equal 0
			l.centerX()
			l.x.should.equal 150
			assert.equal l.constraintValues.left, null
			assert.equal l.constraintValues.right, null
			assert.equal l.constraintValues.centerAnchorX, 0.5

		it "should update to center the layer horizontally when centerY() is called", ->
			l = new Layer
				constraintValues:
					aspectRatioLocked: true
			l.layout()
			l.y.should.equal 0
			l.centerY()
			l.y.should.equal 100
			assert.equal l.constraintValues.top, null
			assert.equal l.constraintValues.bottom, null
			assert.equal l.constraintValues.centerAnchorY, 0.5

		describe "when no constraints are set", ->
			it "should not set the width constraint when setting the width", ->
				l = new Layer
					width: 100
				l.width.should.equal 100
				assert.equal l.constraintValues, null
				l.width = 50
				assert.equal l.constraintValues, null

			it "should not set the height constraint when setting the height", ->
				l = new Layer
					height: 100
				l.height.should.equal 100
				assert.equal l.constraintValues, null
				l.height = 50
				assert.equal l.constraintValues, null
