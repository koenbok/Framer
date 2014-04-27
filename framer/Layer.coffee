{_} = require "./Underscore"

Utils = require "./Utils"

{Config} = require "./Config"
{BaseClass} = require "./BaseClass"
{LayerStyle} = require "./LayerStyle"
{LayerStates} = require "./LayerStates"
{Animation} = require "./Animation"

_RootElement = null
_LayerList = []

layerProperty = (name, cssProperty, fallback) ->
	exportable: true
	default: fallback
	get: ->
		@_getPropertyValue name
	set: (value) ->
		@_setPropertyValue name, value
		@style[cssProperty] = LayerStyle[cssProperty](@)

class exports.Layer extends BaseClass

	constructor: (options) ->

		_LayerList.push @

		# We have to create the element before we set the defaults
		@_setLayerId()
		@_createElement()
		@_setDefaultCSS()

		# TODO: set the Defaults
		# TODO: take all the options as properties

		# Set some special defaults
		# @style.backgroundColor = Config.defaultBackgroundColor()

		super options

		options ?= {}

		if not options.superView
			@_insertElement()

		# Set needed private variables
		@_subLayers = []

	##############################################################
	# Geometry

	# Css properties
	@define "width",  layerProperty "width",  "width", 100
	@define "height", layerProperty "height", "height", 100

	@define "visible", layerProperty "visible", "visibility", true
	@define "opacity", layerProperty "opacity", "opacity", 1
	@define "clip", layerProperty "clip", "overflow", false

	# Matrix properties
	@define "x", layerProperty "x", "webkitTransform", 0
	@define "y", layerProperty "y", "webkitTransform", 0
	@define "z", layerProperty "z", "webkitTransform", 0

	@define "scaleX", layerProperty "scaleX", "webkitTransform", 1
	@define "scaleY", layerProperty "scaleY", "webkitTransform", 1
	@define "scaleZ", layerProperty "scaleZ", "webkitTransform", 1
	# @define "scale", layerProperty "scale", "webkitTransform", 1

	@define "scale",
		get: -> (@scaleX + @scaleY + @scaleZ) / 3.0
		set: (value) -> @scaleX = @scaleY = @scaleZ = value

	@define "originX", layerProperty "originX", "webkitTransformOrigin", 0.5
	@define "originY", layerProperty "originY", "webkitTransformOrigin", 0.5
	# @define "originZ", layerProperty "originZ", "webkitTransformOrigin", 0.5

	@define "rotationX", layerProperty "rotationX", "webkitTransform", 0
	@define "rotationY", layerProperty "rotationY", "webkitTransform", 0
	@define "rotationZ", layerProperty "rotationZ", "webkitTransform", 0
	@define "rotation",  layerProperty "rotationZ", "webkitTransform", 0

	# Filter properties
	@define "blur", layerProperty "blur", "webkitFilter", 0
	@define "brightness", layerProperty "brightness", "webkitFilter", 100
	@define "saturate", layerProperty "saturate", "webkitFilter", 100
	@define "hueRotate", layerProperty "hueRotate", "webkitFilter", 0
	@define "contrast", layerProperty "contrast", "webkitFilter", 100
	@define "invert", layerProperty "invert", "webkitFilter", 0
	@define "grayscale", layerProperty "grayscale", "webkitFilter", 0
	@define "sepia", layerProperty "sepia", "webkitFilter", 0

	##############################################################
	# CSS

	@define "style",
		get: -> @_element.style
		set: (value) -> _.extend @_element.style, value

	computedStyle: ->
		document.defaultView.getComputedStyle @_element

	_setDefaultCSS: ->
		@style = Config.layerBaseCSS

	##############################################################
	# DOM ELEMENTS

	_setLayerId: ->
		@id = _LayerList.length
		
	_createElement: ->
		return if @_element?
		@_element = document.createElement "div"
		@_element.id = "FramerLayer-#{@id}"

	_insertElement: ->
		Utils.domComplete @__insertElement

	__insertElement: =>
		if not _RootElement
			_RootElement = document.createElement "div"
			_RootElement.id = "FramerRoot"
			document.body.appendChild _RootElement

		_RootElement.appendChild @_element

	##############################################################
	## COPYING

	copy: ->

		# Todo: what about events, states, etc.

		layer = @copySingle()

		for subLayer in @subLayers
			copiedSublayer = subLayer.copy()
			copiedSublayer.superLayer = layer

		layer

	copySingle: -> new Layer @properties

	##############################################################
	## ANIMATION

	animate: (options) ->
		
		options.layer = @
		options.curveOptions = options

		animation = new Animation options
		animation.start()

		animation

	##############################################################
	## IMAGE

	@define "image",
		exportable: true
		default: ""
		get: ->
			@_getPropertyValue "image"
		set: (value) ->

			currentValue = @_getPropertyValue "image"

			if currentValue == value
				return @emit "load"


			# Unset any background color
			@style.backgroundColor = null

			# Set the property value
			@_setPropertyValue "image", value

			imageUrl = value

			# Optional base image value 
			# imageUrl = Config.baseUrl + imageUrl

			# If the file is local, we want to avoid caching
			if Utils.isLocal()
				imageUrl += "?nocache=#{Date.now()}"
			
			# As an optimization, we will only use a loader
			# if something is explicitly listening to the load event
			
			if @events?.hasOwnProperty "load" or @events?.hasOwnProperty "error"
			
				loader = new Image()
				loader.name = imageUrl
				loader.src = imageUrl
			
				loader.onload = =>
					@style["background-image"] = "url('#{imageUrl}')"
					@emit "load", loader
			
				loader.onerror = =>
					@emit "error", loader
			
			else
				@style["background-image"] = "url('#{imageUrl}')"

	##############################################################
	## HIERARCHY


	@define "superLayer",
		exportable: false
		get: -> 
			@_superLayer or null
		set: (layer) ->
			
			return if layer is @_superLayer
			
			# Cancel previous pending insertions
			Utils.domCompleteCancel @__insertElement
			
			# Remove from previous superlayer sublayers
			if @_superLayer
				@_superLayer._element.removeChild @_element
				@_superLayer._subLayers = _.without @_superLayer._subLayers, @
				@_superLayer.emit "change:subLayers", {added:[], removed:[@]}
			
			# Either insert the element to the new superlayer element or into dom
			if layer
				layer._element.appendChild @_element
				layer._subLayers.push @
				layer.emit "change:subLayers", {added:[@], removed:[]}
			else
				@_insertElement()
			
			# Set the superlayer
			@_superLayer = layer
			
			# Place this layer on top of it's siblings
			@bringToFront()
			
			@emit "change:superLayer"
	
	@define "subLayers",
		exportable: false
		get: -> @_subLayers.map (layer) -> layer
	
	# @define "siblingLayers",
	# 	exportable: false
	# 	get: ->
	# 		if @superView is null
	# 			_.filter View.ViewList, (view) =>
	# 				view isnt @ and view.superView
	# 		else
	# 			_.filter @superView.subViews, (view) =>
	# 				view isnt @

	addSubLayer: (layer) ->
		layer.superLayer = @
	
	removeSubLayer: (layer) ->
		
		if layer not in @subLayer
			return
		
		view.superLayer = null

	##############################################################
	## ANIMATION

	animate: (options) ->

		start = options.start
		start ?= true
		delete options.start

		options.layer = @
		animation = new Animation options
		animation.start() if start
		animation

	animateStop: ->

		layerAnimations = _.filter Animation.runningAnimations(), (a) =>
			a.options.layer == @

		_.invoke layerAnimations, "stop"

	##############################################################
	## INDEX ORDERING

	bringToFront: ->
		throw "Layer.bringToFront not implemented"

	##############################################################
	## STATES

	@define "states",
		get: -> @_states ?= new LayerStates @

	##############################################################
	## EVENTS
	
	# Listen to dom events on the element

	addListener: (event, listener) ->
		super
		@_element.addEventListener event, listener

	removeListener: (event, listener) ->
		super
		@_element.removeEventListener event, listener

	on: @::addListener
	off: @::removeListener
