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