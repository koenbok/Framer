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

		it "should stop animations", ->

			context = new Framer.Context(name:"Test")
			
			layer = null
			animation = null

			handler = ->

			context.run ->
				layer = new Layer
				animation = layer.animate
					properties:
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