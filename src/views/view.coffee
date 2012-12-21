utils = require "../utils"

{Frame} = require "../primitives/frame"
{Rotation} = require "../primitives/rotation"
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
		
		@properties = args
		
		@clip = true
		
		if not args.superView
			@_insertElement()
		
		@_subViews = []
		@_animations = []
		
		# Override this prototype to change all behaviour
		@_postCreate()
	
	_postCreate: ->
	
	# Helpers
	
	@define "properties"
		get: ->
			p = {}
			for key, value of View.Properties
				p[key] = @[key] or View.Properties[key]
			return p
			
		set: (args) ->
			
			for key, value of View.Properties
				@[key] = args[key] if args[key]
			
			for key, value of Frame.CalculatedProperties
				@[key] = args[key] if args[key] not in [null, undefined]
	
	# Geometry
	
	@define "frame"
		get: -> new Frame {x:@x, y:@y, width:@width, height:@height}
		set: (value) ->
			for p in ["x", "y", "width", "height"]
				@[p] = value[p]
	
	@define "x"
		get: ->
			@_x or 0  
			# @_matrix.m41
		set: (value) -> 
			@_x = value
			@_matrix = utils.extend @_matrix, {m41: value}
	
	@define "y"
		get: ->
			@_y or 0 
			# @_matrix.m42
		set: (value) -> 
			@_y = value
			@_matrix = utils.extend @_matrix, {m42: value}
	
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

	@define "height"
		get: -> 
			@_height or 0
			# @_getPropertyCSSValue("height").getFloatValue CSSPrimitiveValue.CSS_NUMBER
		set: (value) -> 
			@_height = value
			@_element.style.height = "#{value}px"
	
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
	
	# Scale, Opacity
	
	@define "opacity"
		get: ->
			@_opacity or 1
			# @_getPropertyCSSValue("opacity")
			# 	.getFloatValue CSSPrimitiveValue.CSS_NUMBER
		set: (value) -> 
			@_opacity = value
			@style["opacity"] = value
	
	@define "scale"
		get: -> 
			@_scale
			# @_matrix.m11
		set: (value) ->  
			@_scale = value
			@_matrix = utils.extend @_matrix, 
				{m11:value, m22:value, m33:value}
	
	@define "clip"
		get: ->
			@_clip or true
		set: (value) -> 
			@_clip = value
			@style.overflow = "hidden" if value is true
			@style.overflow = "visible" if value is false

	# Hierarchy
	
	removeFromSuperview: ->
		@_superView = null
	
	@define "superView"
		get: -> @_superView or null
		set: (value) ->
			return if value is @_superView
			
			# Remove from previous superview subviews
			if @_superView
				@_superView._element.removeChild @_element
				utils.remove @_superView._subViews, @
			
			if value
				value._element.appendChild @_element
				value._subViews.push @
			
			@_superView = value
	
	@define "subViews"
		get: -> @_subViews
	

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



	# Html helpers

	@define "html"
		get: -> @_element.innerHTML
		set: (value) -> @_element.innerHTML = value

	@define "style"
		get: -> @_element.style
		set: (value) -> utils.extend @_element.style, value

	@define "computedStyle"
		get: -> document.defaultView.getComputedStyle @_element
		set: (value) ->
			throw Error "computedStyle is readonly"

	_getPropertyCSSValue: (name) ->
		
		value = @computedStyle.getPropertyCSSValue name

		if value instanceof CSSValueList
			return value[value.length - 1]

		return value

	addClass: (className) ->
		@_element.className += " #{className}"

	removeClass: (className) ->
		values = for item in @_element.classList
			item if item and item isnt className
		@_element.className = values.join " "

	_insertElement: ->
		document.body.appendChild @_element


	# Dom element events

	addListener: (event, listener) ->
		if EventTypes[event]
			@_element.addEventListener event, listener
		else
			super

	removeListener: (event, listener) ->
		if EventTypes[event]
			@_element.removeEventListener event, listener
		else
			super

	on: @::addListener
	off: @::removeListener

	#### TODO
	
	
	
	# FRAME

View.Properties = utils.extend Frame.Properties,
	frame: null
	scale: 1.0
	opacity: 1.0
	rotation: 0
	style: null
	html: null
	class: ""
	superView: null

View.Views = []

exports.View = View