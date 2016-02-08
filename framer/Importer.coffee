{_} = require "./Underscore"
Utils = require "./Utils"

ChromeAlert = """
Importing layers is currently only supported on Safari. If you really want it to work with Chrome quit it, open a terminal and run:
open -a Google\ Chrome -–allow-file-access-from-files
"""

resizeFrame = (scale, frame) ->

	return frame if scale == 1

	result = {}

	for key in ["x", "y", "width", "height"]
		if frame.hasOwnProperty(key)
			result[key] = frame[key] * scale

	return result

getScaleFromName = (str) ->

	re = /@([\d]+|[\d]+.[\d]+)x/
	m = undefined
	if (m = re.exec(str)) != null
		return parseFloat(m[1]) if m[1]

	return null

startsWithNumber = (str) ->
	return (new RegExp("^[0-9]")).test(str)

class exports.Importer

	constructor: (@path, @scale=1, @extraLayerProperties={}) ->

		@paths =
			layerInfo: Utils.pathJoin(@path, "layers.json")
			images: Utils.pathJoin(@path, "images")
			documentName: @path.split("/").pop()

		@_createdLayers = []
		@_createdLayersByName = {}

	load: ->

		layersByName = {}
		layerInfo = @_loadlayerInfo()

		if layerInfo.length is 0
			throw new Error("Importer: no layers. Do you have at least one layer group?")

		# Pass one. Create all layers build the hierarchy
		layerInfo.map (layerItemInfo) =>
			@_createLayer(layerItemInfo)

		# Pass three, correct artboard positions, and reset top left
		# to the minimum x, y of all artboards
		# @_correctArtboards(@_createdLayers)

		# Pass two. Adjust position on screen for all layers
		# based on the hierarchy.
		for layer in @_createdLayers
			@_correctLayer(layer)

		@_correctArtboards(@_createdLayers)


		# Pass three, insert the layers into the dom
		# (they were not inserted yet because of the shadow keyword)
		for layer in @_createdLayers
			if not layer.parent
				layer.parent = null

		return @_createdLayersByName

	_loadlayerInfo: ->

		# Chrome is a pain in the ass and won't allow local file access
		# therefore I add a .js file which adds the data to
		# window.__imported__["<path>"]

		importedKey = "#{@paths.documentName}/layers.json.js"

		if window.__imported__?.hasOwnProperty(importedKey)
			return _.cloneDeep(window.__imported__[importedKey])

		return Framer.Utils.domLoadJSONSync @paths.layerInfo

	_createLayer: (info, parent) ->

		# Resize the layer frames
		info.layerFrame = resizeFrame(@scale, info.layerFrame) if info.layerFrame
		info.maskFrame = resizeFrame(@scale, info.maskFrame) if info.maskFrame
		info.image.frame = resizeFrame(@scale, info.image.frame) if info.image?.frame?

		# Flattened layers don't get children
		if not info.children
			info.children = []

		LayerClass = Layer

		layerInfo =
			shadow: true
			name: info.name
			frame: info.layerFrame
			clip: false
			backgroundColor: null
			visible: info.visible ? true

		_.extend(layerInfo, @extraLayerProperties)

		# Most layers will have an image, add that here
		if info.image
			layerInfo.frame = info.image.frame
			layerInfo.image = Utils.pathJoin(@path, info.image.path)

		# If there is a mask on this layer we clip the layer
		if info.maskFrame
			layerInfo.clip = true

		if layerInfo.kind is "artboard"
			layerInfo.frame.x = 0
			layerInfo.frame.y = 0

		# Figure out what the super layer should be. If this layer has a contentLayer
		# (like a scroll view) we attach it to that instead.
		if parent?.contentLayer
			layerInfo.parent = parent.contentLayer
		else if parent
			layerInfo.parent = parent

		# Layer names cannot start with a number
		if startsWithNumber(layerInfo.name)
			throw new Error("(#{layerInfo.name}) Layer or Artboard names can not start with a number")

		# We can create the layer here
		layer = new LayerClass(layerInfo)
		layer.name = layerInfo.name

		# Record the imported path for layers (for the inferencer)
		layer.__framerImportedFromPath = @path

		# Set scroll to true if scroll is in the layer name
		if layerInfo.name.toLowerCase().indexOf("scroll") != -1
			layer.scroll = true

		# Set draggable enabled if draggable is in the name
		if layerInfo.name.toLowerCase().indexOf("draggable") != -1
			layer.draggable.enabled = true

		# A layer without an image, mask or children should be zero
		if not layer.image and not info.children.length and not info.maskFrame
			layer.frame = Utils.frameZero()

		_.clone(info.children).reverse().map (info) =>
			@_createLayer(info, layer)

		# If this is an artboard we retain the size, but set the coordinates to zero
		# because all coordinates within artboards are 0, 0 based.
		if info.kind is "artboard"
			layer.point = {x:0, y:0}

		# If this is not an artboard, and does not have an image or mask, we clip the
		# layer to its content size.
		else if not layer.image and not info.maskFrame
			layer.frame = layer.contentFrame()

		layer._info = info

		@_createdLayers.push(layer)
		@_createdLayersByName[layer.name] = layer

	_correctArtboards: (layers) ->

		leftMostLayer = null

		for layer in layers
			if layer._info.kind is "artboard"
				layer.point = layer._info.layerFrame
				layer.visible = true

				if leftMostLayer is null or layer.x < leftMostLayer.x
					leftMostLayer = layer

		return unless leftMostLayer

		# Calculate the artboard positions to always be 0,0.
		pointOffset = leftMostLayer.point

		# Correct the artboard positions to 0,0.
		for layer in layers
			if layer._info.kind is "artboard"
				layer.x -= pointOffset.x
				layer.y -= pointOffset.y

	_correctLayer: (layer) ->

		traverse = (layer) ->

			if layer.parent
				layer.frame = Utils.convertPoint(layer.frame, null, layer.parent)

			for child in layer.children
				traverse(child)

		if not layer.parent
			traverse(layer)

exports.Importer.load = (path, scale) ->

	scale ?= getScaleFromName(path)
	scale ?= 1

	importer = new exports.Importer(path, scale)
	return importer.load()
