_ = require "underscore"
utils = require "./utils"
css = require "./css"

{EventEmitter} = require "./eventemitter"
{Matrix} = require "./primitives/matrix"

spring = require "./curves/spring"
bezier = require "./curves/bezier"

AnimationCounter = 0
AnimationList = []

parseCurve = (a, prefix) ->

	# "spring(1, 2, 3)" -> 1, 2, 3

	a = a.replace prefix, ""
	a = a.replace /\s+/g, ""
	a = a.replace "(", ""
	a = a.replace ")", ""
	a = a.split ","

	return a.map (i) -> parseFloat i


class Animation extends EventEmitter
	
	AnimationProperties: [
		"view", "properties", "curve", "time",
		"origin", "tolerance", "precision", "modifiers" 
		"debug", "profile"
	]
	AnimatableCSSProperties: {
		opacity: "",
		width: "px",
		height: "px",
	}
	AnimatableMatrixProperties: [
		"x", "y", "z",
		"scaleX", "scaleY", "scaleZ", # "scale",
		"rotateX", "rotateY", "rotateZ", # "rotate"
	]

	constructor: (args) ->
		
		# console.log "Animation.constructor", args
		
		# Set all properties
		for p in @AnimationProperties
			@[p] = args[p]
		
		# Set all the defaults
		@time ?= 1000
		@curve ?= "linear"
		@precision ?= 30
		@count = 0
		
		AnimationCounter += 1
		@animationId = AnimationCounter
		
		
	start: (callback) =>
		
		AnimationList.push @
		
		########################################################
		# Set up some variables to start with
		
		startTime = new Date().getTime()
		
		@count++
		@animationName = "framer-animation-#{@animationId}-#{@count}"
		
		console.log "Animation.start #{@animationName}" if @debug
		console.profile @animationName if @profile
		
		
		########################################################
		# Deal with other animations on this view
		
		@view.animateStop()
		@view._currentAnimations.push @
		
		
		########################################################
		# Calculate the curve values
		
		@curveValues = @_parseCurve @curve
		@totalTime = @curveValues.length / @precision

		
		########################################################
		# Build a property list that we want to animate

		# TODO: test if we are trying to animate something that cannot animate
		
		propertiesA = @view.properties
		propertiesB = @properties
		
		# Set the derived properties scale and rotation
		if propertiesB.scale
			propertiesB.scaleX = propertiesB.scale
			propertiesB.scaleY = propertiesB.scale
		
		if propertiesB.rotate
			propertiesB.rotateZ = propertiesB.rotate
			
		@propertiesA = {}
		@propertiesB = {}
		
		# Build up the matrix animation properties
		
		for k in @AnimatableMatrixProperties
			
			@propertiesA[k] = propertiesA[k]
			
			if propertiesB.hasOwnProperty k
				@propertiesB[k] = propertiesB[k]
			else
				@propertiesB[k] = propertiesA[k]
			
		# Build up the css animation properties
		
		for k, v of @AnimatableCSSProperties
			
			if propertiesB.hasOwnProperty k
				@propertiesA[k] = propertiesA[k]
				@propertiesB[k] = propertiesB[k]

		if @debug
			for k of @propertiesA
				if @propertiesA[k] isnt @propertiesB[k]
					console.log " .#{k} #{@propertiesA[k]} -> #{@propertiesB[k]}"


		########################################################
		# Generate the keyframe css and insert

		@keyFrameAnimationCSS = @_css()
		@view.once "webkitAnimationEnd", @_finalize
		
		css.addStyle "
			#{@keyFrameAnimationCSS}
		
			.#{@animationName} {
				-webkit-animation-duration: #{@totalTime}s;
				-webkit-animation-name: #{@animationName};
				-webkit-animation-timing-function: linear;
				-webkit-animation-fill-mode: both;
			}"
		
		@view.addClass @animationName
		
		
		########################################################
		# Finalize

		if @debug
			endTime = new Date().getTime() - startTime
			console.log "Animation.setupTime = #{endTime}ms"
		
		console.profileEnd @animationName if @profile

	reverse: =>
		
		# Return the inverse of this animation

		options = {}
		
		for p in @AnimationProperties
			options[p] = @[p]
		
		options.properties = {}

		for k, v of @properties
			options.properties[k] = @view[k]
			
		return new Animation options


	
	stop: =>
		
		console.log "Animation.stop #{@animationName}" if @debug
		
		@_canceled = true
		
		# @view.style["-webkit-animation-play-state"] = "paused"

		@_cleanup false
		
		# @view.style["-webkit-animation-play-state"] = "running"
	

	_finalize: =>

		if @_canceled is true
			return
		
		console.log "Animation.end #{@animationName}" if @debug
		
		@_cleanup true
		
		callback?()


	_cleanup: (completed) =>

		# Remove this animation from the current ones for this view
		@view._currentAnimations = _.without @view._currentAnimations, @
		
		if completed
			
			# A matrix with the defined end state
			endMatrix = utils.extend new Matrix(), @propertiesB
			endStyles = {}
			
			for k, v of @AnimatableCSSProperties
				endStyles[k] = @propertiesB[k] + v

		else
			# A matrix from the current state
			endMatrix = new Matrix(@view._computedMatrix())
			endStyles = {}

			computedStyles = @view.computedStyle

			for k, v of @AnimatableCSSProperties
				endStyles[k] = computedStyles[k]
		
		# Remove the animation class
		@view.removeClass @animationName
		
		# Set the end states
		@view._matrix = endMatrix
		@view.style = endStyles
		
		@emit "end"
		
	_css: ->
		
		# Build the css for the keyframe animation. I wish there was a nicer
		# way to do this, but this will work for now.
		
		stepIncrement = 0
		stepDelta = 100 / (@curveValues.length - 1)
		
		cssString = []
		cssString.push "@-webkit-keyframes #{@animationName} {\n"
		
		deltas = @_deltas()
		
		# We define this object outside of the loop to re-use it.
		# In theory this should help a bit with perfomance, in practise
		# I'm too lazy to prove it.
		m = new Matrix()
		
		for springValue in @curveValues
		
			position = stepIncrement * stepDelta

			cssString.push "\t#{position}%\t{ -webkit-transform: "
			
			# Add the matrix based values
			for propertyName in @AnimatableMatrixProperties
				
				# Calculate the clean spring value for this point
				value = springValue * deltas[propertyName] + @propertiesA[propertyName]
				
				# Modify the value if we have a modifier set up. This let's us do 
				# special stuff like drop the friction once we run into the scroll 
				# bounds for a scrollview.
				if @modifiers?[propertyName]?
					value = @modifiers[propertyName](value)
				
				m[propertyName] = value
			
			cssString.push m.matrix().cssValues() + "; "
			
			for propertyName, unit of @AnimatableCSSProperties
				continue if not @propertiesA.hasOwnProperty propertyName
				value = springValue * deltas[propertyName] + @propertiesA[propertyName]
				cssString.push "#{propertyName}:#{value}#{unit}; "
				
			cssString.push "}\n"
			
			stepIncrement++
			
		cssString.push "}\n"
		cssString.join ""
	
	_deltas: ->
		
		deltas = {}
		
		# Pre-calculate the delta values
		for k of @propertiesA
			deltas[k] = (@propertiesB[k] - @propertiesA[k]) / 100.0
		
		return deltas
		
	_parseCurve: (curve) ->
		
		curve ?= ""
		curve = curve.toLowerCase()
		
		if curve in ["linear"]
			return bezier.defaults.Linear @precision, @time
		else if curve in ["ease"]
			return bezier.defaults.Ease @precision, @time
		else if curve in ["ease-in"]
			return bezier.defaults.EaseIn @precision, @time
		else if curve in ["ease-out"]
			return bezier.defaults.EaseOut @precision, @time
		else if curve in ["ease-in-out"]
			return bezier.defaults.EaseInOut @precision, @time
		else if curve[.."cubic-bezier".length-1] is "cubic-bezier"
			v = parseCurve curve, "cubic-bezier"
			return bezier.BezierCurve v[0], v[1], v[2], v[3], @precision, @time
		else if curve[.."spring".length-1] is "spring"
			v = parseCurve curve, "spring"
			return spring.SpringCurve v[0], v[1], v[2], @precision
		else

			# The default curve is linear
			console.log "Animation.parseCurve: could not parse curve '#{curve}'"
			return bezier.defaults.Linear @precision, @time

	graphView: (animation, x, y, h, time) ->
	
		color = "rgba(50,150,200,.35)"
		values = animation.curveValues
		
		width = 300
	
		graph = new View
			y: y
			x: x
			width:100
			height:h
	
		# graph.style.backgroundColor = "rgba(0, 0, 0, 1)"
		graph.clip = false
		
		background = new View
			y: 0 - h
			height:h * 2 + 3
			superView: graph
		
		background.style.backgroundColor = "rgba(255,255,255,.85)"
			
		
		for value, i in values
			dot = new View
				width:3, height:3
				x: i * widthFactor, y: (100 - value) * (h / 100)
				superView: graph
			dot.style.borderRadius = "5px"
			dot.style.backgroundColor = color

		graph.width = dot.x
		background.width = dot.x

		if time
			player = new View
				x:0, y:-h
				width: 2, height: h * 2
				superView: graph
	
			player.style.backgroundColor = color
		
			player.animate
				properties: {x:graph.width}
				time: time

		return graph



exports.Animation = Animation
