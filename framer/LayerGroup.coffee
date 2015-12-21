{_} = require "./Underscore"

Utils = require "./Utils"

{BaseClass} = require "./BaseClass"

Function::property = (prop, desc) ->
	Object.defineProperty @prototype, prop, desc

LayerProps = [
	"x",
	"y",
	"z",
	"width",
	"height",
	"minX",
	"midX",
	"maxX",
	"minY",
	"midY",
	"maxY",
	"point",
	"size",
	"frame",
	"props",
	"backgroundColor",
	"image",
	"visible",
	"opacity",
	"clip",
	"ignoreEvents",
	"force2d",
	"originX",
	"originY",
	"perspective",
	"rotation",
	"rotationX",
	"rotationY",
	"rotationZ",
	"scale",
	"scaleX",
	"scaleY",
	"index",
	"html",
	"style",
	"blur",
	"brightness",
	"saturate",
	"hueRotate",
	"contrast",
	"invert",
	"grayscale",
	"sepia",
	"shadowX",
	"shadowY",
	"shadowBlur",
	"shadowColor",
	"shadowSpread",
	"borderRadius",
	"borderColor",
	"borderWidth"
]

class exports.LayerGroup extends BaseClass

	constructor: (layers...) ->

		super
		@_layers = []
		for layer in layers
			@addLayer(layer)
		@states = new LayerGroupStates(@)

	LayerProps.map (prop) =>
		@property prop,
			get: ->
				if @_layers.length < 1
					return false
				value = @_layers[0][prop]
				for layer in @_layers
					if layer[prop] != value
						return false
				return value
			set: (newValue) ->
				for layer in @_layers
					layer[prop] = newValue

	@property "layers", get: -> @_layers

	addLayer: (layers...) ->
		for layer in layers
			if _.isArray(layer)
				for item in layer
					@addLayer(item)
			else if layer instanceof Layer
				@_layers.push(layer) unless layer in @_layers
	
	removeLayer: (layer) ->
		if _.isArray(layer)
			for item in layer
				@removeLayer(item)
		else if layer instanceof Layer
			index = @_layers.indexOf(layer)
			if index >= 0
				@_layers.splice(index, 1)
	
	animate: (options) ->
		for layer in @_layers
			layer.animate(options)

	##############################################################
	## EVENTS

	once: (eventName, listener) =>
		for layer in @_layers
			layer.once(eventName, listener)

	on: (eventName, listener) ->
		for layer in @_layers
			layer.on(eventName, listener)

	off: (eventName, listener) ->
		for layer in @_layers
			layer.off(eventName, listener)

	# ##############################################################
	# ## EVENT HELPERS

	onClick: (cb) -> @on(Events.Click, cb)
	onDoubleClick: (cb) -> @on(Events.DoubleClick, cb)
	onScroll: (cb) -> @on(Events.Scroll, cb)
	
	onTouchStart: (cb) -> @on(Events.TouchStart, cb)
	onTouchEnd: (cb) -> @on(Events.TouchEnd, cb)
	onTouchMove: (cb) -> @on(Events.TouchMove, cb)

	onMouseUp: (cb) -> @on(Events.MouseUp, cb)
	onMouseDown: (cb) -> @on(Events.MouseDown, cb)
	onMouseOver: (cb) -> @on(Events.MouseOver, cb)
	onMouseOut: (cb) -> @on(Events.MouseOut, cb)
	onMouseMove: (cb) -> @on(Events.MouseMove, cb)
	onMouseWheel: (cb) -> @on(Events.MouseWheel, cb)

	onAnimationStart: (cb) -> @on(Events.AnimationStart, cb)
	onAnimationStop: (cb) -> @on(Events.AnimationStop, cb)
	onAnimationEnd: (cb) -> @on(Events.AnimationEnd, cb)
	onAnimationDidStart: (cb) -> @on(Events.AnimationDidStart, cb)
	onAnimationDidStop: (cb) -> @on(Events.AnimationDidStop, cb)
	onAnimationDidEnd: (cb) -> @on(Events.AnimationDidEnd, cb)

	onImageLoaded: (cb) -> @on(Events.ImageLoaded, cb)
	onImageLoadError: (cb) -> @on(Events.ImageLoadError, cb)
	
	onMove: (cb) -> @on(Events.Move, cb)
	onDragStart: (cb) -> @on(Events.DragStart, cb)
	onDragWillMove: (cb) -> @on(Events.DragWillMove, cb)
	onDragMove: (cb) -> @on(Events.DragMove, cb)
	onDragDidMove: (cb) -> @on(Events.DragDidMove, cb)
	onDrag: (cb) -> @on(Events.Drag, cb)
	onDragEnd: (cb) -> @on(Events.DragEnd, cb)
	onDragAnimationDidStart: (cb) -> @on(Events.DragAnimationDidStart, cb)
	onDragAnimationDidEnd: (cb) -> @on(Events.DragAnimationDidEnd, cb)
	onDirectionLockDidStart: (cb) -> @on(Events.DirectionLockDidStart, cb)

	##############################################################
	## DESCRIPTOR

	toInspect: ->

		return "<Layer#{@constructor.name}>"

##############################################################
## LAYER GROUP STATES

class exports.LayerGroupStates extends BaseClass

	constructor: (layerGroup) ->
		@_states = []
		@_layerGroup = layerGroup
		@add("default")
		@_currentState = "default"
		super
	
	@property "state", get: -> @_currentState
	@property "current", get: -> @_currentState
	
	add: (newStates...) ->
		for state in newStates
			if _.isString(state)
				@_states.push state unless state in @_states
			else if _.isArray(state)
				for item in state
					@add(item)

	next: ->
		currentIndex = @_states.indexOf(@_currentState)
		if currentIndex == @_states.length - 1 || currentIndex < 0
			@_currentState = @_states[0]
		else
			@_currentState = @_states[currentIndex+1]
		@_switchToState(@_currentState)
	
	switch: (state, animationOptions, instant = false) ->
		@_switchToState(state, instant, animationOptions)

	switchInstant: (state) ->
		@_switchToState(state, true)

	printContents: ->
		print @_states
	
	_switchToState: (newState, instant, animationOptions) ->
		if newState in @_states
			@_currentState = newState
		for layer in @_layerGroup.layers
			if newState in _.keys layer.states._states
				if instant
					layer.states.switchInstant(newState)
				else
					layer.states.switch(newState)
