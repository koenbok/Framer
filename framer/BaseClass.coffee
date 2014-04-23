{_} = require "./Underscore"

Utils = require "./Utils"

{EventEmitter} = require "./EventEmitter"

DefinedPropertiesKey = "_DefinedPropertiesKey"
DefinedPropertiesValuesKey = "_DefinedPropertiesValuesKey"

class exports.BaseClass extends EventEmitter

	#################################################################
	# Framer object properties

	@define = (propertyName, descriptor) ->

		if @ isnt BaseClass and descriptor.exportable == true
			# descriptor.enumerable = true
			descriptor.propertyName = propertyName

			@[DefinedPropertiesKey] ?= {}
			@[DefinedPropertiesKey][propertyName] = descriptor

		Object.defineProperty @prototype, propertyName, descriptor
		Object.__

	_setPropertyValue: (k, v) =>
		@[DefinedPropertiesValuesKey][k] = v

	_getPropertyValue: (k) =>
		Utils.valueOrDefault @[DefinedPropertiesValuesKey][k],
			@_getPropertyDefaultValue k

	_getPropertyDefaultValue: (k) ->
		@constructor[DefinedPropertiesKey][k]["default"]

	_propertyList: ->
		@constructor[DefinedPropertiesKey]

	@define "properties",
		get: ->
			properties = {}

			for k, v of @constructor[DefinedPropertiesKey]
				if v.exportable isnt false
					properties[k] = @[k]

			properties

		set: (value) ->
			for k, v of value
				if @constructor[DefinedPropertiesKey].hasOwnProperty k
					if @constructor[DefinedPropertiesKey].exportable isnt false
						@[k] = v


	#################################################################
	# Base constructor method

	constructor: (options) ->

		super

		@[DefinedPropertiesValuesKey] = {}

		options ?= {}

		_.map @constructor[DefinedPropertiesKey], (descriptor, name) =>
			@[name] = Utils.valueOrDefault options[name], @_getPropertyDefaultValue name

