{_} = require "./Underscore"

Utils = require "./Utils"

{EventEmitter} = require "./EventEmitter"

CounterKey = "_ObjectCounter"
DefinedPropertiesKey = "_DefinedPropertiesKey"
DefinedPropertiesValuesKey = "_DefinedPropertiesValuesKey"

capitalizeFirstLetter = (string) ->
	string.charAt(0).toUpperCase() + string.slice(1)

class exports.BaseClass extends EventEmitter

	#################################################################
	# Framer object properties

	@define = (propertyName, descriptor) ->

		# See if we need to add this property to the internal properties class
		if @ isnt BaseClass
			descriptor.enumerable = descriptor.enumerable || !descriptor.hasOwnProperty('enumerable')
			descriptor.propertyName = propertyName

			if not descriptor.excludeFromProps
				@[DefinedPropertiesKey] ?= {}
				@[DefinedPropertiesKey][propertyName] = descriptor

		# Set the getter/setter as setProperty on this object so we can access and override it easily
		getName = "get#{capitalizeFirstLetter(propertyName)}"
		@::[getName] = descriptor.get
		descriptor.get = @::[getName]

		if descriptor.set
			setName = "set#{capitalizeFirstLetter(propertyName)}"
			@::[setName] = descriptor.set
			descriptor.set = @::[setName]

		# Define the property
		Object.defineProperty(@prototype, propertyName, descriptor)

	@simpleProperty = (name, fallback, enumerable=true) ->
		# Default property, provides storage and fallback
		enumerable: enumerable
		default: fallback
		get: -> @_getPropertyValue(name)
		set: (value) -> @_setPropertyValue(name, value)

	@proxyProperty = (keyPath, enumerable=true) ->
		# Allows to easily proxy properties from an instance object
		# Object property is in the form of "object.property"
		objectKey = keyPath.split(".")[0]
		result =
			enumerable: enumerable
			get: ->
				return unless @[objectKey]
				Utils.getValueForKeyPath(@, keyPath)
			set: (value) -> 
				return unless @[objectKey]
				Utils.setValueForKeyPath(@, keyPath, value)

	_setPropertyValue: (k, v) =>
		@[DefinedPropertiesValuesKey][k] = v

	_getPropertyValue: (k) =>
		Utils.valueOrDefault @[DefinedPropertiesValuesKey][k],
			@_getPropertyDefaultValue k

	_getPropertyDefaultValue: (k) ->
		@constructor[DefinedPropertiesKey][k]["default"]

	_propertyList: ->
		@constructor[DefinedPropertiesKey]

	keys: -> _.keys(@props)

	@define "props",
		excludeFromProps: true
		get: ->
			value = {}
			for k, v of @constructor[DefinedPropertiesKey]
				value[k] = @[k]

			value

		set: (value) ->
			for k, v of value
				if @constructor[DefinedPropertiesKey].hasOwnProperty(k)
					if @constructor[DefinedPropertiesKey].exportable isnt false
						@[k] = v

	@define "id",
		get: -> @_id

	toInspect: =>
		properties = _.map(@properties, ((v, k) -> "#{k}:#{v}"), 4)
		"<#{@constructor.name} id:#{@id} #{properties.join " "}>"


	#################################################################
	# Base constructor method

	constructor: (options) ->

		super

		@_context = Framer?.CurrentContext

		# Create a holder for the property values
		@[DefinedPropertiesValuesKey] = {}

		# Count the creation for these objects and set the id
		@constructor[CounterKey] ?= 0
		@constructor[CounterKey] += 1

		@_id = @constructor[CounterKey]

		# Set the default values for this object
		for name, descriptor of @constructor[DefinedPropertiesKey]
			if descriptor.set
				initialValue = Utils.valueOrDefault(options?[name], @_getPropertyDefaultValue(name));
				if not (initialValue in [null, undefined])
					@[name] = initialValue