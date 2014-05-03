{BaseClass} = require "./BaseClass"

class exports.Frame extends BaseClass

	@define "x", @SimpleProperty "x", 0
	@define "y", @SimpleProperty "y", 0
	@define "width", @SimpleProperty "width", 0
	@define "height", @SimpleProperty "height", 0

	@define "minX", @SimpleProperty "x", 0, false
	@define "minY", @SimpleProperty "y", 0, false

	constructor: (options={}) ->

		super options

		for k in ["minX", "midX", "maxX", "minY", "midY", "maxY"]
			if options.hasOwnProperty k
				@[k] = options[k]

	@define "midX",
		get: -> Utils.frameGetMidX @
		set: (value) -> Utils.frameSetMidX @, value

	@define "maxX",
		get: -> Utils.frameGetMaxX @
		set: (value) -> Utils.frameSetMaxX @, value

	@define "midY",
		get: -> Utils.frameGetMidY @
		set: (value) -> Utils.frameSetMidY @, value

	@define "maxY",
		get: -> Utils.frameGetMaxY @
		set: (value) -> Utils.frameSetMaxY @, value

	merge: (r2) ->

		# Combine two frames into one large frame

		r1 = @
		xmin = Math.min(r1.x, r2.x)
		ymin = Math.min(r1.y, r2.y)

		return new exports.Frame
			x: xmin
			y: ymin
			width: Math.max(r1.x + r1.width, r2.x + r2.width) - xmin
			height: Math.max(r1.y + r1.height, r2.y + r2.height) - ymin


