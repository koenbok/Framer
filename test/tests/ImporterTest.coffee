assert = require "assert"

describe "ExternalDocument", ->

	compareDocument = (name) ->

		path = "static/ExternalDocument"

		layers = Framer.Importer.load Utils.pathJoin(path, name)
		
		dataA = Framer.Utils.domLoadJSONSync Utils.pathJoin(path, "#{name}.out.json")
		dataB = {}

		for layerName, layer of layers
			dataB[layerName] =
				frame: layer.frame
				superLayerName: layer.superLayer?.layerName
				subLayerNames: layer.subLayers.map (l) -> l.name

		jsonA = JSON.stringify dataA, null, "\t"
		jsonB = JSON.stringify dataB, null, "\t"

		if jsonA != jsonB
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

	describe "Shady Hacks", ->

		it "Should work on Chrome", ->

			# This is terrible, but better than having people load
			# Chrome with some command line option.
			
			window.__imported__ ?= {}
			window.__imported__["Android/layers.json.js"] = "hello"

			importer = new Framer.Importer "imported/Android"

			data = importer._loadlayerInfo()
			data.should.equal "hello"


