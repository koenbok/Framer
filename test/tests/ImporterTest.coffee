assert = require "assert"

describe "ExternalDocument", ->

	compareDocument = (name) ->

		path = "../static/ExternalDocument"

		layers = Framer.Importer.load Utils.pathJoin(path, name)

		dataA = Framer.Utils.domLoadJSONSync Utils.pathJoin(path, "#{name}.out.json")
		dataB = {}

		for layerName, layer of layers
			dataB[layerName] =
				frame: layer.frame
				superLayerName: layer.superLayer?.layerName
				subLayerNames: layer.children.map (l) -> l.name
				# clip: layer.clip

		jsonA = JSON.stringify dataA, null, "\t"
		jsonB = JSON.stringify dataB, null, "\t"

		if jsonA isnt jsonB
			# Uncomment this to see current dump
			console.log ""
			console.log "Name: #{name}"
			console.log jsonB

		assert.equal jsonA, jsonB

	if not Utils.isChrome()
		describe "External Files", ->

			it "Android", ->
				compareDocument "Android"

			it "Square", ->
				compareDocument "Square"

			it "Test", ->
				compareDocument "Test"

			it "Artboard@1x", ->
				compareDocument "Artboard@1x"

			it "Artboard@2x", ->
				compareDocument "Artboard@2x"

			it "ImportFlatten@2x", ->
				compareDocument "ImportFlatten@2x"

			it "masks@1x", ->
				compareDocument "masks@1x"

			it "innermasks@1x", ->
				compareDocument "innermasks@1x"

			it "Screens@1x", ->
				compareDocument "Screens@1x"

			it "sketch-tests@1x", ->
				compareDocument "sketch-tests@1x"

	describe "Shady Hacks", ->

		it "Should work on Chrome", ->

			# This is terrible, but better than having people load
			# Chrome with some command line option.

			window.__imported__ ?= {}
			window.__imported__["Android/layers.json.js"] = "hello"

			importer = new Framer.Importer "imported/Android"

			data = importer._loadlayerInfo()
			data.should.equal "hello"
