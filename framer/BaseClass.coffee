{_} = require "./Underscore"

Utils = require "./Utils"

{EventEmitter} = require "./EventEmitter"

CounterKey = "_ObjectCounter"
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

	@SimpleProperty = (name, fallback, exportable=true) ->
		exportable: exportable
		default: fallback
		get: ->  @_getPropertyValue name
		set: (value) -> @_setPropertyValue name, value

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

	@define "id",
		get: -> @_id

	toString: =>
		properties = _.map(@properties, ((v, k) -> "#{k}:#{v}"), 4)
		"[#{@constructor.name} id:#{@id} #{properties.join " "}]"


	#################################################################
	# Base constructor method

	constructor: (options={}) ->

		super

		# Create a holde for the property values
		@[DefinedPropertiesValuesKey] = {}

		# Count the creation for these objects and set the id
		@constructor[CounterKey] ?= 0
		@constructor[CounterKey] += 1

		@_id = @constructor[CounterKey]

		# Set the default values for this object
		_.map @constructor[DefinedPropertiesKey], (descriptor, name) =>
			@[name] = Utils.valueOrDefault options[name], @_getPropertyDefaultValue name

