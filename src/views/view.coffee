utils = require "../utils"
_ = require "underscore"

{Frame} = require "../primitives/frame"
# {Rotation} = require "../primitives/rotation"
{Spring} = require "../primitives/spring"
{EventTypes} = require "../primitives/events"
{EventClass} = require "../primitives/events"

{EventEmitter} = require "../eventemitter"
{Animation} = require "../animation"

exports.ViewList = []


class View extends Frame
	
	constructor: (args) ->
		
		args ?= {}
		
		View.Views.push @
		@id = View.Views.length
		
		@_element = document.createElement "div"
		@_element.id = @id
		
		@addClass "uilayer textureBacked"
		# @addClass "textureBacked"
		# @addClass "animated"
		
		@clip = args.clip or View.Properties.clip
		
		@properties = args
		
		if not args.superView
			@_insertElement()
		
		@_subViews = []
		@_animations = []
		
		# Override this prototype to change all behaviour
		@_postCreate()
	
	_postCreate: ->
	
	# Helpers

	@define "name"
		get: ->
			@_name or @id
			
		set: (value) ->
			@_name = value
			@_element.setAttribute "name", @_name

	@define "properties"
		get: ->
			p = {}
			for key, value of View.Properties
				p[key] = @[key] or View.Properties[key]
			return p
			
		set: (args) ->
			
			for key, value of View.Properties
				if args[key] not in [null, undefined]
					@[key] = args[key] 
			
			for key, value of Frame.CalculatedProperties
				@[key] = args[key] if args[key] not in [null, undefined]
	
	# Geometry
	
	@define "frame"
		get: -> new Frame {x:@x, y:@y, width:@width, height:@height}
		set: (value) ->
			return if not value
			for p in ["x", "y", "width", "height"]
				@[p] = value[p]
	
	@define "x"
		get: ->
			@_x or 0  
			# @_matrix.m41
		set: (value) -> 
			@_x = value
			@_matrix = utils.extend @_matrix, {m41: value}
			@emit "change:x"
			@emit "change:frame"
	
	@define "y"
		get: ->
			@_y or 0 
			# @_matrix.m42
		set: (value) -> 
			@_y = value
			@_matrix = utils.extend @_matrix, {m42: value}
			@emit "change:y"
			@emit "change:frame"
	
	# @define "z"
	# 	get: -> @_matrix.m43
	# 	set: (value) ->  @_matrix = utils.extend @_matrix, {m43: value}

	@define "width"
		get: -> 
			@_width or 0
			# @_getPropertyCSSValue("width").getFloatValue CSSPrimitiveValue.CSS_NUMBER
		set: (value) -> 
			@_width = value
			@_element.style.width = "#{value}px"
			@emit "change:width"
			@emit "change:frame"

	@define "height"
		get: -> 
			@_height or 0
			# @_getPropertyCSSValue("height").getFloatValue CSSPrimitiveValue.CSS_NUMBER
		set: (value) -> 
			@_height = value
			@_element.style.height = "#{value}px"
			@emit "change:height"
			@emit "change:frame"
	
	@define "_matrix"
		get: -> 
			return @__matrix or @__matrix = new WebKitCSSMatrix @_element.style.webkitTransform
			
		set: (value) ->
		
			m = value or @_matrix
			
			# Blue pill
			if not m instanceof WebKitCSSMatrix
				return @_element.style.webkitTransform = null
			
			# Red pill
			values = "
				matrix3d(
					#{m.m11}, #{m.m12}, #{m.m13}, #{m.m14}, 
					#{m.m21}, #{m.m22}, #{m.m23}, #{m.m24}, 
					#{m.m31}, #{m.m32}, #{m.m33}, #{m.m34}, 
					#{m.m41}, #{m.m42}, #{m.m43}, #{m.m44})"
			
			@__matrix = m

			return @_element.style.webkitTransform = value

	convertPoint: (point) ->
		# Convert a point on screen to this views coordinate system
		utils.convertPoint point, null, @
		
	screenFrame: ->
		# Get this views absolute frame on the screen
		utils.convertPoint @frame, @, null

	# Scale, Opacity
	
	@define "opacity"
		get: ->
			@_opacity or 1
			# @_getPropertyCSSValue("opacity")
			# 	.getFloatValue CSSPrimitiveValue.CSS_NUMBER
		set: (value) -> 
			@_opacity = value
			@style["opacity"] = value
			@emit "change:opacity"
	
	@define "scale"
		get: -> 
			@_scale
			# @_matrix.m11
		set: (value) ->  
			@_scale = value
			@_matrix = utils.extend @_matrix, 
				{m11:value, m22:value, m33:value}
			@emit "change:scale"
	
	@define "clip"
		get: ->
			@_clip
		set: (value) ->
			@_clip = value
			@style.overflow = "hidden" if value is true
			@style.overflow = "visible" if value is false
			@emit "change:clip"
	
	@define "visible"
		get: ->
			@_visible
		set: (value) -> 
			@_visible = value
			@style.display = "block" if value is true
			@style.display = "none" if value is false
			@emit "change:visible"
	
	@define "rotateX"
		get: ->
			@_rotateX or 0
		set: (value) ->
			oldValue = @rotateX
			@_rotateX = value
			@_matrix = @_matrix.rotate @_rotateX - oldValue, @_rotateY, @_rotateZ
			@emit "change:rotateX"
			@emit "change:frame"
	
	@define "rotateY"
		get: ->
			@_rotateY or 0
		set: (value) ->
			oldValue = @rotateY
			@_rotateY = value
			@_matrix = @_matrix.rotate @_rotateX, @_rotateY - oldValue, @_rotateZ
			@emit "change:rotateY"
			@emit "change:frame"
	
	@define "rotateZ"
		get: ->
			@_rotateZ or 0
		set: (value) ->
			oldValue = @rotateZ
			@_rotateZ = value
			@_matrix = @_matrix.rotate @_rotateX, @_rotateY, @_rotateZ - oldValue
			@emit "change:rotateZ"
			@emit "change:frame"

	# Hierarchy
	
	removeFromSuperview: ->
		@superView = null
	
	@define "superView"
		get: -> @_superView or null
		set: (value) ->
			
			return if value is @_superView
			
			# Cancel previous pending insertions
			document.removeEventListener "DOMContentLoaded", @__insertElement
			
			# Remove from previous superview subviews
			if @_superView
				@_superView._element.removeChild @_element
				utils.remove @_superView._subViews, @
			
			# Either insert the element to the new superview or into dom
			if value
				value._element.appendChild @_element
				value._subViews.push @
			else
				@__insertElement()
			
			@_superView = value
			@emit "change:superView"
	
	@define "subViews"
		get: -> @_subViews

	@define "index"
	  get: -> @_index or 0
	  set: (value) ->
	    @_index = value
	    @style['z-index'] = value
	    @emit "change:index"
	
	placeBefore: (view) ->
	  @index = view.index + 1

	placeBehind: (view) ->
	  @index = view.index - 1

	switchPlaces: (view) ->
	  our_i      = @index
	  their_i    = view.index
	  view.index = our_i
	  @index     = their_i

	# Animation

	@define "_animated"
		get: -> @__animated or false
		set: (value) ->
			
			return if value not in [true, false]

			# @addClass "animated" if value is true
			# @removeClass "animated" if value is false
			
			@__animated = value

			# Small hack to go to next event tick and make sure
			# that the css gets added so animations start working
			# after this call
			# @_animationDuration

	@define "_animationDuration"
		get: -> 
			@__animationDuration
			# @_getPropertyCSSValue "-webkit-transition-duration", CSSPrimitiveValue.CSS_MS
		set: (value) -> 
			@__animationDuration = value
			@style["-webkit-transition-duration"] = "#{value}ms"

	@define "_animationTimingFunction"
		get: -> @computedStyle["-webkit-transition-timing-function"]
		set: (value) -> @style["-webkit-transition-timing-function"] = value

	@define "_animationTransformOrigin"
		get: -> @computedStyle["-webkit-transform-origin"]
		set: (value) -> @style["-webkit-transform-origin"] = value
	
	animate: (args, callback) =>
		args.view = @
		animation = new Animation args
		animation.start callback
		return animation
	
	animateStop: ->
		@_animations.map (animation) ->
			animation.stop()



	# Html helpers

	@define "html"
		get: -> @_element.innerHTML
		set: (value) -> 
			@_element.innerHTML = value
			@emit "change:html"

	@define "style"
		get: -> @_element.style
		set: (value) ->
			utils.extend @_element.style, value
			@emit "change:style"

	@define "computedStyle"
		get: -> document.defaultView.getComputedStyle @_element
		set: (value) ->
			throw Error "computedStyle is readonly"

	_getPropertyCSSValue: (name) ->
		
		value = @computedStyle.getPropertyCSSValue name

		if value instanceof CSSValueList
			return value[value.length - 1]

		return value

	# Class helpers

	@define "class"
		get: -> 
			@_element.className
		set: (value) ->
			@_element.className = value
			@emit "change:class"

	@define "classes"
		get: ->
			classes = @class.split " "
			classes = _(classes).filter (item) -> item not in ["", null]
			classes = _(classes).unique()
			classes
		set: (value) ->
			@class = value.join " "

	addClass: (className) ->
		classes = @classes
		classes.push className
		@classes = classes

	removeClass: (className) ->
		classes = @classes
		if className in classes
			classes.remove className
		@classes = classes

	_insertElement: ->
		
		# If we are loaded we insert the node immediately, if not we wait
		if document.readyState is "complete" or document.readySate is "loaded"
			@__insertElement()
		else
			document.addEventListener "DOMContentLoaded", @__insertElement

	__insertElement: =>
		document.body.appendChild @_element


	# Dom element events

	addListener: (event, listener) ->
		super
		# if EventTypes[event]
		@_element.addEventListener event, listener

	removeListener: (event, listener) ->
		super
		# if EventTypes[event]
		@_element.removeEventListener event, listener

	on: @::addListener
	off: @::removeListener

	#### TODO
	
	
	
	# FRAME

View.Properties = utils.extend Frame.Properties,
	frame: null
	clip: true
	scale: 1.0
	opacity: 1.0
	rotateX: 0.0
	rotateY: 0.0
	rotateZ: 0.0
	style: null
	html: null
	class: ""
	superView: null
	visible: true
	index: 0

View.Views = []

exports.View = View
