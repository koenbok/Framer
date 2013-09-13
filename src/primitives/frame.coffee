utils = require "../utils"

{EventEmitter} = require "../eventemitter"

class Frame extends EventEmitter

	constructor: (args) ->
		@properties = args

	@define "properties",
		get: ->
			p = {}
			for key, value of Frame.Properties
				p[key] = @[key] or Frame.Properties[key]
			return p
			
		set: (args) ->
			
			for key, value of Frame.Properties
				@[key] = args[key] if args[key] not in [null, undefined]
			
			for key, value of Frame.CalculatedProperties
				@[key] = args[key] if args[key] not in [null, undefined]

	@define "minX",
		get: -> @x
		set: (value) ->  @x = value

	@define "midX",
		get: -> @x + (@width / 2.0)
		set: (value) ->
			if @width is 0
				@x = 0
			else
				@x = value - (@width / 2.0)

	@define "maxX",
		get: -> @x + @width
		set: (value) ->
			if @width is 0
				@x = 0
			else
				@x = value - @width

	@define "minY",
		get: -> @y
		set: (value) -> @y = value

	@define "midY",
		get: -> @y + (@height / 2.0)
		set: (value) ->
			if @height is 0
				@y = 0
			else
				@y = value - (@height / 2.0)



	@define "maxY",
		get: -> @y + @height
		set: (value) ->
			if @height is 0
				@y = 0
			else
				@y = value - @height

	merge: (r2) ->
		r1 = @
		frame =
			x: Math.min(r1.x, r2.x)
			y: Math.min(r1.y, r2.y)
			width: Math.max(r1.width, (r2.x - r1.x) + r2.width),
		        height: Math.max(r1.height, (r2.y - r1.y) + r2.height)

		return new Frame frame

Frame.Properties =
	x: 0
	y: 0
	z: 0
	width: 0
	height: 0

Frame.CalculatedProperties =
	minX: null
	midX: null
	maxX: null
	minY: null
	midY: null
	maxY: null

exports.Frame = Frame
