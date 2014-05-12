{_} = require "./Underscore"

Utils = require "./Utils"

Originals = 
	Layer:
		backgroundColor: "rgba(0,124,255,.5)"
		width: 100
		height: 100
	Animation:
		curve: "spring(500,30,0)"

exports.Defaults =

	getDefaults: (className, options) ->

		# Always start with the originals
		defaults = _.clone Originals[className]

		# Copy over the user defined options
		for k, v of Framer.Defaults[className]
			defaults[k] = if _.isFunction(v) then v() else v

		# Then copy over the default keys to the options
		for k, v of defaults
			if not options.hasOwnProperty k
				options[k] = v

		# Include a secret property with the default keys
		# options._defaultValues = defaults
		
		options

	reset: ->
		window.Framer.Defaults = _.clone Originals