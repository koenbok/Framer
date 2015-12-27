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

		for i in ["enumerable", "exportable", "importable"]
			if descriptor.hasOwnProperty(i)
				throw Error("woops #{propertyName} #{descriptor[i]}") if not _.isBoolean(descriptor[i])

		# See if we need to add this property to the internal properties class
		if @ isnt BaseClass
			descriptor.propertyName = propertyName

			# Have the following flags set to true when undefined:
			descriptor.enumerable ?= true
			descriptor.exportable ?= true
			descriptor.importable ?= true

			# Toggle importable to false when there's no setter defined:
			descriptor.importable = descriptor.importable and descriptor.set

			# Only retain options that are importable, exportable or both:
			if descriptor.exportable or descriptor.importable
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

	@simpleProperty = (name, fallback, options={}) ->
		return _.extend options, 
			default: fallback
			get: -> @_getPropertyValue(name)
			set: (value) -> @_setPropertyValue(name, value)

	@proxyProperty = (keyPath, options={}) ->
		# Allows to easily proxy properties from an instance object
		# Object property is in the form of "object.property"
		objectKey = keyPath.split(".")[0]
		return _.extend options,
			get: ->
				return unless _.isObject(@[objectKey])
				Utils.getValueForKeyPath(@, keyPath)
			set: (value) -> 
				return unless _.isObject(@[objectKey])
				Utils.setValueForKeyPath(@, keyPath, value)

	_setPropertyValue: (k, v) =>
		@[DefinedPropertiesValuesKey][k] = v

	_getPropertyValue: (k) =>
		Utils.valueOrDefault @[DefinedPropertiesValuesKey][k],
			@_getPropertyDefaultValue k

	_getPropertyDefaultValue: (k) ->
		@_propertyList()[k]["default"]

	_propertyList: ->
		@constructor[DefinedPropertiesKey]

	keys: -> _.keys(@props)

	@define "props",
		importable: false
		exportable: false
		get: ->
			keys = []
			propertyList = @_propertyList()
			for key, descriptor of propertyList
				if descriptor.exportable
					keys.push key

			_.pick(@, keys)

		set: (value) ->
			propertyList = @_propertyList()
			for k,v of value
				# We only apply properties that we know and are marked to be
				# importable.
				@[k] = v if propertyList[k]?.importable

	@define "id",
		get: -> @_id

	toInspect: =>
		"<#{@constructor.name} id:#{@id or null}>"

	onChange: (name, cb) -> @on("change:#{name}", cb)


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

		@_applyOptionsAndDefaults(options)

	_applyOptionsAndDefaults: (options) ->
		for key, descriptor of @_propertyList()
			# For each known property (registered with @define) that has a setter, fetch
			# the value from the options object, unless the prop is not importable.
			# When there's no user value, apply the default value:
			if descriptor.set
				value = Utils.valueOrDefault(
					(options?[key] if descriptor.importable),
					@_getPropertyDefaultValue(key)
				)

				if not (value in [null, undefined])
					@[key] = value