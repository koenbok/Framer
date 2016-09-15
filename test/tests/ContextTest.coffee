assert = require "assert"

describe "Context", ->

	describe "Reset", ->

		it "should never append more than a single child on reset", (done) ->

			c1 = document.querySelectorAll(".framerContext").length

			# There's one default context:
			document.querySelectorAll(".framerContext").length.should.equal(c1)

			context = new Framer.Context(name:"Test")

			context.reset()
			context.reset()
			context.reset()

			Framer.Loop.once "render", ->
				document.querySelectorAll(".framerContext").length.should.equal(c1+1)
				done()

	# Todo: event cleanup
		# Todo: parent layer on context cleanup

	describe "Freezing", ->

		it "should remove events", ->

			context = new Framer.Context(name:"Test")

			layer = null
			handler = ->

			context.run ->
				layer = new Layer
				layer.on(Events.Click, handler)

			# We should have a click listener
			layer.listeners(Events.Click).should.eql([handler])
			context.freeze()
			layer.listeners(Events.Click).should.eql([])

		it "should restore events", ->

			context = new Framer.Context(name:"Test")

			layer = null
			handler = ->

			context.run ->
				layer = new Layer
				layer.on(Events.Click, handler)

			context.freeze()
			context.resume()

			# Now it should have been restored
			layer.listeners(Events.Click).should.eql([handler])

		it "should freeze and restore multiple events on multiple layers", ->

			context = new Framer.Context(name:"Test")

			layerA = layerB = null
			handlerA = ->
			handlerB = ->
			handlerC = ->
			handlerD = ->

			context.run ->

				layerA = new Layer
				layerA.on(Events.Click, handlerA)
				layerA.on(Events.Click, handlerB)

				layerB = new Layer
				layerB.on(Events.Scroll, handlerC)
				layerB.on(Events.Scroll, handlerD)

			# We should have a click listener
			layerA.listeners(Events.Click).should.eql([handlerA, handlerB])
			layerB.listeners(Events.Scroll).should.eql([handlerC, handlerD])

			context.freeze()
			layerA.listeners(Events.Click).should.eql([])
			layerB.listeners(Events.Click).should.eql([])

			context.resume()
			layerA.listeners(Events.Click).should.eql([handlerA, handlerB])
			layerB.listeners(Events.Scroll).should.eql([handlerC, handlerD])

		it "should freeze and restore multiple events a layer", ->

			context = new Framer.Context(name:"Test")

			layerA = null
			handlerA = ->
			handlerB = ->
			handlerC = ->
			handlerD = ->

			context.run ->

				layerA = new Layer
				layerA.on(Events.Click, handlerA)
				layerA.on(Events.Click, handlerB)
				layerA.on(Events.Scroll, handlerC)
				layerA.on(Events.Scroll, handlerD)

			# We should have a click listener
			layerA.listeners(Events.Click).should.eql([handlerA, handlerB])
			layerA.listeners(Events.Scroll).should.eql([handlerC, handlerD])

			context.freeze()
			layerA.listeners(Events.Click).should.eql([])

			context.resume()
			layerA.listeners(Events.Click).should.eql([handlerA, handlerB])
			layerA.listeners(Events.Scroll).should.eql([handlerC, handlerD])


		it "should stop animations", ->

			context = new Framer.Context(name:"Test")

			layer = null
			animation = null

			handler = ->

			context.run ->
				layer = new Layer
				animation = layer.animate
					x: 100

			# We should have a click listener
			context.animations.should.eql [animation]
			context.freeze()
			context.animations.should.eql []

		it "should stop timers", ->

			context = new Framer.Context(name:"Test")

			layer = null
			timer = null

			handler = ->

			context.run ->
				layer = new Layer
				timer = Utils.delay(1, handler)

			# We should have a click listener
			context.timers.should.eql [timer]
			context.freeze()
			context.timers.should.eql []


	describe "Layers", ->

		it "should add and remove layers", ->

			context = new Framer.Context(name:"Test")

			context.run ->

				layerA = new Layer
				layerB = new Layer
				layerC = new Layer
				layerD = new Layer

				context.layers.should.eql [layerA, layerB, layerC, layerD]
				_.invokeMap(context.layers, "destroy")
				context.layers.should.eql []

		it "should list root layers", ->

			context = new Framer.Context(name:"Test")

			context.run ->

				layerA = new Layer
				layerB = new Layer parent:layerA

				context.rootLayers.should.eql [layerA]
				layerB.parent = null
				context.rootLayers.should.eql [layerA, layerB]

		it "should get layers by id", ->

			context = new Framer.Context(name:"Test")

			context.run ->
				layerA = new Layer
				context.layerForId(layerA.id).should.equal layerA

		it "should get layers by element", ->

			context = new Framer.Context(name:"Test")

			context.run ->
				layerA = new Layer
				context.layerForElement(layerA._element).should.equal layerA



	describe "Events", ->

		it "should emit reset", (callback) ->

			context = new Framer.Context(name:"Test")
			context.on "reset", -> callback()
			context.reset()

		it "should emit layer create", (callback) ->

			context = new Framer.Context(name:"Test")
			context.on "layer:create", ->
				context.getLayers().length.should.equal 1
				callback()

			context.run ->
				layer = new Layer


		it "should emit layer destroy", (callback) ->

			context = new Framer.Context(name:"Test")

			context.on "layer:create", ->
				context.getLayers().length.should.equal 1

			context.on "layer:destroy", ->
				context.getLayers().length.should.equal 0
				callback()

			context.run ->
				layer = new Layer
				layer.destroy()

		it "should keep layer id count per context", ->

			context = new Framer.Context(name:"Test")

			context.run ->
				layer = new Layer
				layer.id.should.equal 1
				layer = new Layer
				layer.id.should.equal 2

			context.reset()

			context.run ->
				layer = new Layer
				layer.id.should.equal 1
				layer = new Layer
				layer.id.should.equal 2

	describe "Styling", ->

		it "should set backgroundColor", ->

			context = new Framer.Context(name:"Test")
			context.backgroundColor = "red"
			color = new Color "red"
			colorString = color.toString()
			context._element.style["backgroundColor"].should.equal colorString

		it "should have a default perspective of 0", ->

			context = new Framer.Context(name:"Test")
			context._element.style["webkitPerspective"].should.equal "0"

		it "should allow the perspective to be changed", ->

			context = new Framer.Context(name:"Test")
			context.perspective = 800
			context._element.style["webkitPerspective"].should.equal "800"
