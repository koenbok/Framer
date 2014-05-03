{BaseClass} = require "./BaseClass"

class exports.Frame extends BaseClass

	@define "x", @simpleProperty "x", 0
	@define "y", @simpleProperty "y", 0
	@define "width", @simpleProperty "width", 0
	@define "height", @simpleProperty "height", 0

	@define "minX", @simpleProperty "x", 0, false
	@define "minY", @simpleProperty "y", 0, false

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