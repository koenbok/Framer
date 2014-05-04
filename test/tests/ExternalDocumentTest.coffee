assert = require "assert"

describe "ExternalDocument", ->

	compareDocument = (name) ->

		path = "static/ExternalDocument"

		layers = (new Framer.ExternalDocument Utils.pathJoin(path, name)).load()
		
		dataA = Framer.Utils.domLoadScriptSync Utils.pathJoin(path, "#{name}.out.json")
		dataB = {}

		for layerName, layer of layers
			dataB[layerName] =
				frame: layer.frame.properties
				superLayerName: layer.superLayer?.layerName
				subLayerNames: layer.subLayers.map (l) -> l.name

		jsonA = JSON.stringify dataA, null, "\t"
		jsonB = JSON.stringify dataB, null, "\t"

		# Uncomment this to see current dump
		# console.log ""
		# console.log "Name: #{name}"
		# console.log jsonB

		assert.equal jsonA, jsonB

	describe "External Files", ->

		it "Android", ->
			compareDocument "Android"

		it "Square", ->
			compareDocument "Square"

		it "Test", ->
			compareDocument "Test"


