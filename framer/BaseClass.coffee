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
		if @ isnt BaseClass and descriptor.exportable == true
			# descriptor.enumerable = true
			descriptor.propertyName = propertyName

			@[DefinedPropertiesKey] ?= {}
			@[DefinedPropertiesKey][propertyName] = descriptor

		# If no setter was given, this must be a readonly class
		if not descriptor.set
			descriptor.set = -> throw Error("#{@constructor.name}.#{propertyName} property is readonly")

		# Set the getter/setter as setProperty on this object so we can access and override it easily
		getName = "get#{capitalizeFirstLetter(propertyName)}"
		setName = "set#{capitalizeFirstLetter(propertyName)}"

		@::[getName] = descriptor.get
		@::[setName] = descriptor.set

		descriptor.get = @::[getName]
		descriptor.set = @::[setName]

		# Define the property
		Object.defineProperty(@prototype, propertyName, descriptor)
		Object.__

	@simpleProperty = (name, fallback, exportable=true) ->
		# Default property, provides storage and fallback
		exportable: exportable
		default: fallback
		get: -> @_getPropertyValue(name)
		set: (value) -> @_setPropertyValue(name, value)

	@proxyProperty = (keyPath, exportable=true) ->
		# Allows to easily proxy properties from an instance object
		# Object property is in the form of "object.property"
		objectKey = keyPath.split(".")[0]
		result = 
			exportable: exportable
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
		get: ->
			props = {}

			for k, v of @constructor[DefinedPropertiesKey]
				if v.exportable isnt false
					props[k] = @[k]

			props

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
			@[name] = Utils.valueOrDefault(options?[name], @_getPropertyDefaultValue(name))

