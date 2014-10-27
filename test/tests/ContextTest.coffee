assert = require "assert"

describe "Context", ->

	describe "Reset", ->

		# Todo: event cleanup
		# Todo: paren layer on context cleanup

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

