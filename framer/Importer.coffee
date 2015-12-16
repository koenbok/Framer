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
		
		# Pass one. Create all layers build the hierarchy
		layerInfo.map (layerItemInfo) =>
			@_createLayer(layerItemInfo)

		# Pass two. Adjust position on screen for all layers
		# based on the hierarchy.
		for layer in @_createdLayers
			@_correctLayer(layer)

		# Pass three, correct artboard positions, and reset top left
		# to the minimum x, y of all artboards
		@_correctArtboards(@_createdLayers)

		# Pass three, insert the layers into the dom
		# (they were not inserted yet because of the shadow keyword)
		for layer in @_createdLayers
			if not layer.superLayer
				layer.superLayer = null

		return @_createdLayersByName

	_loadlayerInfo: ->

		# Chrome is a pain in the ass and won't allow local file access
		# therefore I add a .js file which adds the data to 
		# window.__imported__["<path>"]

		importedKey = "#{@paths.documentName}/layers.json.js"

		if window.__imported__?.hasOwnProperty(importedKey)
			return _.cloneDeep(window.__imported__[importedKey])

		return Framer.Utils.domLoadJSONSync @paths.layerInfo

	_createLayer: (info, superLayer) ->

		# Resize the layer frames
		info.layerFrame = resizeFrame(@scale, info.layerFrame) if info.layerFrame
		info.maskFrame = resizeFrame(@scale, info.maskFrame) if info.maskFrame
		info.image.frame = resizeFrame(@scale, info.image.frame) if info.image?.frame?
		
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
			
		# If there is a mask on this layer group, take its frame
		if info.maskFrame
			layerInfo.frame = info.maskFrame
			layerInfo.clip = true

		# Possible fix for images that have a mask in Sketch
		# So if a layer without children has a mask, Sketch imports the full image
		# That is whay we then take the image frame over the mask frame again
		if info.children.length is 0 and true in _.pluck(superLayer?.superLayers(), "clip")
			layerInfo.frame = info.image.frame
			layerInfo.clip = false
			
		# Figure out what the super layer should be. If this layer has a contentLayer
		# (like a scroll view) we attach it to that instead.
		if superLayer?.contentLayer
			layerInfo.superLayer = superLayer.contentLayer
		else if superLayer
			layerInfo.superLayer = superLayer

		# Sanitize the layer names so mylayer.jpg gets converted to mylayer
		for suffix in ["*", ".jpg", ".pdf"]
			layerInfo.name = _.trimRight(layerInfo.name, suffix)
			layerInfo.name = _.trimRight(layerInfo.name, suffix.toUpperCase())

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

		# A layer without an image, mask or sublayers should be zero
		if not layer.image and not info.children.length and not info.maskFrame
			layer.frame = Utils.frameZero()

		_.clone(info.children).reverse().map (info) =>
			@_createLayer(info, layer)

		# Not really sure what this was for, but I don't want to touch it now
		if not layer.image and not info.maskFrame
			layer.frame = layer.contentFrame()

		layer._info = info

		@_createdLayers.push(layer)
		@_createdLayersByName[layer.name] = layer

	_correctArtboards: (layers) ->

		points = []

		for layer in layers
			if layer._info.kind is "artboard"
				# We don't have to scale this, because the artboard positions are always in pixels.
				layer.frame = layer._info.layerFrame
				layer.visible = true
				points.push(layer.point)

		# # Calculate the artboard positions to always be 0,0.
		# pointOffset =
		# 	x: Math.min.apply(@, points.map (p) -> p.x)
		# 	y: Math.min.apply(@, points.map (p) -> p.y)

		# # Correct the layers
		# for layer in layers
		# 	if layer._info.kind is "artboard"
		# 		layer.x -= pointOffset.x
		# 		layer.y -= pointOffset.y


	_correctLayer: (layer) ->

		traverse = (layer) ->

			if layer.superLayer
				layer.frame = Utils.convertPoint(layer.frame, null, layer.superLayer)

			for subLayer in layer.subLayers
				traverse(subLayer)

		if not layer.superLayer
			traverse(layer)

exports.Importer.load = (path, scale) ->

	scale ?= getScaleFromName(path)
	scale ?= 1

	importer = new exports.Importer(path, scale)
	return importer.load()