{_} = require "./Underscore"

Utils = require "./Utils"

{Config} = require "./Config"
{Defaults} = require "./Defaults"
{BaseClass} = require "./BaseClass"
{LayerStyle} = require "./LayerStyle"
{LayerStates} = require "./LayerStates"
{Animation} = require "./Animation"
{Frame} = require "./Frame"

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
		@emit "change:#{name}", value

layerStyleProperty = (cssProperty) ->
	exportable: true
	# default: fallback
	get: -> @style[cssProperty]
	set: (value) -> 
		@style[cssProperty] = value
		@emit "change:#{cssProperty}", value

frameProperty = (name) ->
	exportable: false
	get: -> @frame[name]
	set: (value) -> 
		frame = @frame
		frame[name] = value
		@frame = frame

class exports.Layer extends BaseClass

	constructor: (options={}) ->

		_LayerList.push @

		# We have to create the element before we set the defaults
		@_createElement()
		@_setDefaultCSS()

		options = Defaults.getDefaults "Layer", options

		super options

		# Extract the frame from the options, so we support minX, maxX etc.
		if options.hasOwnProperty "frame"
			frame = new Frame options.frame
		else
			frame = new Frame options

		@frame = frame

		# Insert the layer into the dom or the superLayer element
		if not options.superLayer
			@bringToFront()
			@_insertElement()
		else
			
			if not options.superLayer instanceof Layer
				throw "Layer.superLayer needs to be a Layer object"
			
			@superLayer = options.superLayer

		# Set needed private variables
		@_subLayers = []

	##############################################################
	# Properties

	# Css properties
	@define "width",  layerProperty "width",  "width", 100
	@define "height", layerProperty "height", "height", 100

	@define "visible", layerProperty "visible", "visibility", true
	@define "opacity", layerProperty "opacity", "opacity", 1
	@define "index", layerProperty "index", "zIndex", 0

	@define "clip", layerProperty "clip", "overflow", true
	@define "scrollX", layerProperty "scrollX", "overflowX", false
	@define "scrollY", layerProperty "scrollY", "overflowY", false

	@define "scroll",
		get: -> @scrollX is true or @scrollY is true
		set: (value) -> @scrollX = @scrollY = true

	# Behaviour properties
	@define "ignoreEvents", layerProperty "ignoreEvents", "pointerEvents", true

	# Matrix properties
	@define "x", layerProperty "x", "webkitTransform", 0
	@define "y", layerProperty "y", "webkitTransform", 0
	@define "z", layerProperty "z", "webkitTransform", 0

	@define "scaleX", layerProperty "scaleX", "webkitTransform", 1
	@define "scaleY", layerProperty "scaleY", "webkitTransform", 1
	@define "scaleZ", layerProperty "scaleZ", "webkitTransform", 1
	@define "scale", layerProperty "scale", "webkitTransform", 1

	# @define "scale",
	# 	get: -> (@scaleX + @scaleY + @scaleZ) / 3.0
	# 	set: (value) -> @scaleX = @scaleY = @scaleZ = value

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

	# Mapped style properties

	@define "backgroundColor", layerStyleProperty "backgroundColor"
	@define "borderRadius", layerStyleProperty "borderRadius"
	@define "borderColor", layerStyleProperty "borderColor"
	@define "borderWidth", layerStyleProperty "borderWidth"


	##############################################################
	# Geometry

	@define "frame",
		get: ->
			new Frame @
		set: (frame) ->
			return if not frame
			for k in ["x", "y", "width", "height"]
				@[k] = frame[k]

	@define "minX", frameProperty "minX"
	@define "midX", frameProperty "midX"
	@define "maxX", frameProperty "maxX"
	@define "minY", frameProperty "minY"
	@define "midY", frameProperty "midY"
	@define "maxY", frameProperty "maxY"

	convertPoint: (point) ->
		# Convert a point on screen to this views coordinate system
		# TODO: needs tests
		Utils.convertPoint point, null, @
		
	screenFrame: ->
		# Get this views absolute frame on the screen
		# TODO: needs tests
		Utils.convertPoint @frame, @, null
	
	contentFrame: ->
		# Get the total size of all subviews
		# TODO: needs tests
		
		# minX = _.min _.map @subLayers, (layer) -> layer.minX
		# maxX = _.max _.map @subLayers, (layer) -> layer.maxX
		# minY = _.min _.map @subLayers, (layer) -> layer.minY
		# maxY = _.max _.map @subLayers, (layer) -> layer.maxY
		
		# new Frame
		# 	x: minX
		# 	y: minY
		# 	width: maxX - minX
		# 	height: maxY - minY

		frame = @frame

		for subLayer in @subLayers
			frame = frame.merge subLayer.frame

		frame

	centerFrame: ->
		# Get the centered frame for its superview
		# We always make these pixel perfect
		# TODO: needs tests
		if @superView
			frame = @frame
			frame.midX = parseInt @superView.width / 2.0
			frame.midY = parseInt @superView.height / 2.0
			return frame
		
		else
			frame = @frame
			frame.midX = parseInt window.innerWidth / 2.0
			frame.midY = parseInt window.innerHeight / 2.0
			return frame
	
	center: -> @frame = @centerFrame() # Center  in superLayer
	centerX: -> @x = @centerFrame().x # Center x in superLayer
	centerY: -> @y = @centerFrame().y # Center y in superLayer
	
	pixelAlign: ->
		# Put this view exactly on the pixel
		# TODO: needs tests
		@frame = {x:parseInt(@x), y:parseInt(@y)}


	##############################################################
	# CSS

	@define "style",
		get: -> @_element.style
		set: (value) -> 
			_.extend @_element.style, value
			@emit "change:style"

	@define "html",
		get: -> @_element.innerHTML
		set: (value) ->
			@_element.innerHTML = value
			@emit "change:html"

	computedStyle: ->
		document.defaultView.getComputedStyle @_element

	_setDefaultCSS: ->
		@style = Config.layerBaseCSS

	@define "classList",
		get: -> @_element.classList	


	##############################################################
	# DOM ELEMENTS
		
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

			# Unset any background color if it's the default color
			# You can't really do this, because it ends up as a slightly different color
			# if @backgroundColor is Framer.Defaults.Layer.backgroundColor
			
			@backgroundColor = null

			# Set the property value
			@_setPropertyValue "image", value

			imageUrl = value

			# Optional base image value 
			# imageUrl = Config.baseUrl + imageUrl

			# If the file is local, we want to avoid caching
			# if Utils.isLocal()
			# 	imageUrl += "?nocache=#{Date.now()}"
			
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
				@_superLayer._subLayers = _.without @_superLayer._subLayers, @
				@_superLayer._element.removeChild @_element
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
		get: -> _.clone @_subLayers
	
	@define "siblingLayers",
		exportable: false
		get: ->

			# If there is no superLayer we need to walk through the root
			if @superLayer is null
				return _.filter _LayerList, (layer) =>
					layer isnt @ and layer.superLayer is null

			return _.without @superLayer.subLayers, @

	addSubLayer: (layer) ->
		layer.superLayer = @
	
	removeSubLayer: (layer) ->
		
		if layer not in @subLayers
			return
		
		layer.superLayer = null

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

	animations: ->
		# Current running animations on this layer
		_.filter Animation.runningAnimations(), (a) =>
			a.options.layer == @

	animateStop: ->
		_.invoke @animations(), "stop"

	##############################################################
	## INDEX ORDERING

	bringToFront: ->
		@index = _.max(_.union([0], @siblingLayers.map (layer) -> layer.index)) + 1

	sendToBack: ->
		@index = _.min(_.union([0], @siblingLayers.map (layer) -> layer.index)) - 1

	placeBefore: (layer) ->
		return if layer not in @siblingLayers

		for l in @siblingLayers
			if l.index <= layer.index
				l.index -= 1

		@index = layer.index + 1

	placeBehind: (layer) ->
		return if layer not in @siblingLayers

		for l in @siblingLayers
			if l.index >= layer.index
				l.index += 1

		@index = layer.index - 1

	##############################################################
	## STATES

	@define "states",
		get: -> @_states ?= new LayerStates @

	##############################################################
	## SCROLLING

	# TODO: Tests

	# scrollToTop: ->
	# 	@_element.scrollTop = 0
	
	# scrollToBottom: ->
	# 	setTimeout =>
	# 		@scrollPoint = @_element.scrollHeight - @frame.height
	# 	, 0
	
	# @define "scrollPoint",
	# 	get: ->
	# 		@_element.scrollTop
	# 	set: (value) ->
	# 		@_element.scrollTop = value

	@define "scrollFrame",
		get: ->
			return new Frame {
				x: @_element.scrollLeft
				y: @_element.scrollTop
				width: @width
				height: @height
			}
		set: (frame) ->
			@_element.scrollLeft = frame.x
			@_element.scrollTop = frame.y
			# @_element.innerWidth = frame.width
			# @_element.innerHeight = frame.height

	##############################################################
	## EVENTS
	
	addListener: (event, originalListener) =>

		# Modify the scope to be the calling object, just like jquery
		# also add the object as the last argument
		listener = (args...) =>
			originalListener.call @, args..., @

		# Listen to dom events on the element
		super event, listener
		@_element.addEventListener event, listener

		# We want to make sure we listen to these events
		@ignoreEvents = false

	removeListener: (event, listener) ->
		super
		@_element.removeEventListener event, listener

	on: @::addListener
	off: @::removeListener
