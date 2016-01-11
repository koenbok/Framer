computeLayout = require 'css-layout'

class LayerLayout

	constructor: (@layer, rules, isRoot = true) ->
		@layer.on("change:subLayers", @_updateLayersAndTree)
		# When the change:subLayers event is triggered, the 'superLayer' property has not been set yet, so we need a way to know
		# if we are dealing with a root layer (i.e. doesn't have any superLayer) or not
		if isRoot
			@_setupListener()
		@updateRules(rules)
		
	updateRules: (rules) ->
		if rules
			@rules = rules
		@_updateLayersAndTree()
		@_setNeedsUpdate()

	_createLayersTree: () =>
		layerTree =
			style: {}
			children: []
		
		if @layer.subLayers
			for subLayer in @layer.subLayers
				if subLayer._layout
					layerTree.children.push(subLayer._layout._createLayersTree())
				else
					console.log("Sublayer has no layout. Name: ", subLayer.name)
		layoutProps = [
			"width", "height", 
			"minWidth", "minHeight", 
			"maxWidth", "maxHeight", 
			"left", "right", "top", "bottom", 
			"margin", "marginLeft", "marginRight", "marginTop", "marginBottom",
			"padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom",
			"borderWidth", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth",
			"flexDirection",
			"justifyContent",
			"alignItems", "alignSelf",
			"flex",
			"flexWrap",
			"position"
		]

		for property, value of @rules
			if property in layoutProps
				layerTree.style[property] = value

		if not @layer.superLayer
			# Add the Screen as root node
			layerTree =
				style:
					width: Screen.width
					height: Screen.height
				children: [layerTree]
		else if not @layer._layout
			# Add the layer as root
			layerTree =
				style:
					width: @layer.width
					height: @layer.height
				children: [layerTree]

		return layerTree

	_updateLayersAndTree: =>
		# Add a basic layout config for all the sublayers
		# NOTE: This is a hack. In order to avoid ALL layers having an _layout variable, 
		# we just add the _layout when a layer is added to a "layed out" tree branch, i.e.
		# a branch that has at least a layout with layout
		if @layer.subLayers
			for subLayer in @layer.subLayers
				if not subLayer._layout
					subLayer._layout = new LayerLayout(subLayer, {width: subLayer.width, height: subLayer.height}, false)

		# To improve performance, we update and store the layer tree on the root layer
		# every time the sublayers are updated
		rootLayer = @layer
		while rootLayer.superLayer
			rootLayer = rootLayer.superLayer
		if rootLayer._layout
			rootLayer._layout._layerTree = rootLayer._layout._createLayersTree()

	_setupListener: =>
		
		@_removeListeners()

		# if @layer
		# 	@_addListener(@layer, "change:frame", @_setNeedsUpdate)

		if not @layer.superLayer
			@_addListener(Canvas, "resize", @_afterResize)
	
	_afterResize: =>
		@_updateLayersAndTree()
		@_setNeedsUpdate()

	_addListener: (obj, eventName, listener) =>
		obj.on(eventName, listener)
		@_currentListeners[eventName] ?= []
		@_currentListeners[eventName].push(obj)
	
	_removeListeners: ->
		for eventName, objects of @_currentListeners
			for obj in objects
				obj.off(eventName, @_setNeedsUpdate)
		@_currentListeners = {}
			
	_setNeedsUpdate: =>
		rootLayer = @layer
		while rootLayer.superLayer
			rootLayer = rootLayer.superLayer
		if rootLayer._layout and rootLayer._layout._layerTree
			layerTree = rootLayer._layout._layerTree
			computeLayout(layerTree)
			if layerTree.shouldUpdate and layerTree.children[0]
				rootLayer._layout._applyNewLayout(layerTree.children[0])

	_applyNewLayout: (layoutTree) ->
		frame = {}
		frame.x = layoutTree.layout.left
		frame.y = layoutTree.layout.top
		frame.width = layoutTree.layout.width
		frame.height = layoutTree.layout.height
		@layer.frame = frame
		for subLayer, index in @layer.subLayers
			if layoutTree.children[index] and subLayer._layout
				subLayer._layout._applyNewLayout(layoutTree.children[index])

exports.LayerLayout = LayerLayout
