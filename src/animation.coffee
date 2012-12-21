{Spring} = require "./primitives/spring"
{EventEmitter} = require "./eventemitter"

require "./utils"

PROPERTIES = ["view", "curve", "time", "origin"]

parseCurve = (a) ->

	# "spring(1, 2, 3)" -> 1, 2, 3

	a = a.replace "spring", ""
	a = a.replace /\s+/g, ""
	a = a.replace "(", ""
	a = a.replace ")", ""
	a = a.split ","

	return a.map (i) -> parseFloat i


class exports.Animation extends EventEmitter
	
	constructor: (args) ->
		super
		
		for p in PROPERTIES
			@[p] = args[p]
		
		@modifiers = args.modifiers or {}
		@endProperties = args.properties
	
	start: (callback) =>
		
		@beginProperties = @view.properties
		@view._animationTransformOrigin = @origin
		setTimeout =>
			@_start callback
		, 0
		# @_start callback
	
	stop: ->
		@_stop = true
	
	_end: (callback) =>
		@emit "end", @
		utils.remove @view._animations, @
		callback?()
	
	_start: (callback) =>
		
		@emit "start", @
		@view._animations.push @
		
		@_stop = false
		
		time = @time or 300
		curve = @curve or "linear" 
		
		# linear, ease, ease-in, ease-out, ease-in-out
		# cubic-bezier(0.76, 0.18, 0.25, 0.75)
		# spring(tension, friction, velocity)
		
		if curve[..5] == "spring"
			
			if @time
				console.log "view.animate: ignoring time for spring"
			
			values = parseCurve curve
			options = 
				tension: values[0]
				friction: values[1]
				velocity: values[2]
				speed: 1/60
				
			@_startSpring options, callback
			
			return
		
		@_animate @endProperties, curve, time, =>
			@_end callback


	_startSpring: (options, callback) =>
	
		@spring = new Spring options
	
		beginState = {}
		deltas = {}
		
		for k, v of @endProperties
			deltas[k] = (@endProperties[k] - @beginProperties[k]) / 100.0
			beginState[k] = @beginProperties[k]
	
		run = =>
			
			# If the spring stopped moving we can stop
			if not @spring.moving or @_stop
				return @_end callback
			
			value = @spring.next()
			
			if @modifiers[k]
				value = @modifiers[k](value)

			nextState = {}
			
			for k, v of beginState

				nextState[k] = (deltas[k] * value) + beginState[k]
				
				# Let's round some variables to pixels to avoid pixel cracks. So not scale
				# and opacity, but basically all others. I think it makes sense to avoid these
				# for designers, but you lose some control wit this magic added.
				# if k in ["x", "y", "z", "width", "height"]
				# 	nextState[k] = parseInt nextState[k]
			
			@_animate nextState, "linear", @spring.speed, run
	
		run()

	_animate: (properties, curve, time, callback) =>

		# @view._animated = true
		@view._animationDuration = time
		@view._animationTimingFunction = curve
		
		# FIX: we should probarbly do it like this: 
		# http://stackoverflow.com/questions/2087510/callback-on-css-transition

		@timer = setTimeout =>
			# @view._animated = false
			# @view._animationDuration = 0
			callback?()
		, time

		for k, v of properties
			if k in ["rotation", "opacity", "scale", "x", "y", "z", "width", "height"]
				@view[k] = properties[k]


	pause: ->
		
	revert: ->