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

		defaults = Utils.setDefaultProperties Framer.Defaults[className], Originals[className], false

		for k, v of options
			defaults[k] = if _.isFunction(v) then v() else v

		defaults

	reset: ->
		Framer.Defaults = _.clone Originals





