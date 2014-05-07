{_} = require "./Underscore"
Utils = require "./Utils"

class exports.Importer

	constructor: (@path, @extraLayerProperties={}) ->

		@paths =
			viewInfo: Utils.pathJoin @path, "views.json"
			images: Utils.pathJoin @path, "images"

		@_createdLayers = []
		@_createdLayersByName = {}

	load: ->

		layersByName = {}
		viewInfo = @_loadViewInfo()
		
		# Pass one. Create all layers build the hierarchy
		viewInfo.map (layerInfo) =>
			@_createLayer layerInfo

		# Pass two. Adjust position on screen for all layers
		# based on the hierarchy.
		for layer in @_createdLayers
			@_correctLayer layer

		# Pass three, insert the layers into the dom
		# (they were not inserted yet because of the shadow keyword)
		for layer in @_createdLayers
			if not layer.superLayer
				layer.superLayer = null

		@_createdLayersByName

	_loadViewInfo: ->
		Framer.Utils.domLoadJSONSync @paths.viewInfo

	_createLayer: (info, superLayer) ->
		
		LayerClass = Layer

		viewInfo =
			shadow: true
			name: info.name
			frame: info.layerFrame
			clip: false
			backgroundColor: null
			visible: info.visible

		_.extend viewInfo, @extraLayerProperties

		# Most layer will have an image, add that here
		if info.image
			viewInfo.frame = info.image.frame
			viewInfo.image = Utils.pathJoin @path, info.image.path
			
		# If there is a mask on this layer group, take it's frame
		if info.maskFrame
			viewInfo.frame = info.maskFrame
			viewInfo.clip = true

		# Todo: smart stuff for paging and scroll views

		# Figure out what the super layer should be. If this layer has a contentLayer
		# (like a scroll view) we attach it to that instead.
		if superLayer?.contentLayer
			viewInfo.superLayer = superLayer.contentLayer
		else if superLayer
			viewInfo.superLayer = superLayer

		# We can create the layer here
		layer = new LayerClass viewInfo
		layer.name = viewInfo.name

		# A layer without an image, mask or sublayers should be zero
		if not layer.image and not info.children.length and not info.maskFrame
			layer.frame = new Frame

		info.children.reverse().map (info) => @_createLayer info, layer

		# TODODODODOD
		if not layer.image and not info.maskFrame
			layer.frame = layer.contentFrame()

		layer._info = info

		@_createdLayers.push layer
		@_createdLayersByName[layer.name] = layer

	_correctLayer: (layer) ->

		traverse = (layer) ->

			if layer.superLayer
				layer.frame = Utils.convertPoint layer.frame, null, layer.superLayer

			for subLayer in layer.subLayers
				traverse subLayer

		if not layer.superLayer
			traverse layer

exports.Importer.load = (path) ->
	importer = new exports.Importer path
	importer.load()