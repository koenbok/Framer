{_} = require "./Underscore"

Utils = require "./Utils"

{EventEmitter} = require "./EventEmitter"

CounterKey = "_ObjectCounter"
DefinedPropertiesKey = "_DefinedPropertiesKey"
DefinedPropertiesValuesKey = "_DefinedPropertiesValuesKey"
DefinedPropertiesOrderKey = "_DefinedPropertiesOrderKey"

class exports.BaseClass extends EventEmitter

	#################################################################
	# Framer object properties

	@define = (propertyName, descriptor) ->

		# See if we need to add this property to the internal properties class
		if @ isnt BaseClass
			@_addDescriptor(propertyName, descriptor)

		# if not descriptor.set?
		# 	descriptor.set = (value) ->
		# 		throw Error("#{@constructor.name}.#{propertyName} is readonly")

		# Define the property on the prototype
		Object.defineProperty(@prototype, propertyName, descriptor)

	@_addDescriptor: (propertyName, descriptor) ->

		# for key in ["enumerable", "exportable", "importable"]
		# 	if descriptor.hasOwnProperty(key)
		# 		throw Error("woops #{propertyName} #{descriptor[key]}") if not _.isBoolean(descriptor[key])

		descriptor.propertyName = propertyName

		# Have the following flags set to true when undefined:
		descriptor.enumerable ?= true
		descriptor.exportable ?= true
		descriptor.importable ?= true

		# We assume we don't import if there is no setter, because we can't
		descriptor.importable = descriptor.importable and descriptor.set
		# We also assume we don't export if there is no setter, because
		# it is likely a calculated property, and we can't set it.
		descriptor.exportable = descriptor.exportable and descriptor.set

		# We assume that every property with an underscore is private
		return if _.startsWith(propertyName, "_")

		# Only retain options that are importable, exportable or both:
		if descriptor.exportable or descriptor.importable
			@[DefinedPropertiesKey] ?= {}
			@[DefinedPropertiesKey][propertyName] = descriptor

			# Set the order, insert it's dependants before, we'll check if they exist later
			@[DefinedPropertiesOrderKey] ?= []

			if descriptor.depends
				for depend in descriptor.depends
					if depend not in @[DefinedPropertiesOrderKey]
						@[DefinedPropertiesOrderKey].push(depend)

			@[DefinedPropertiesOrderKey].push(propertyName)

	@simpleProperty = (name, fallback, options={}) ->
		return _.extend options,
			default: fallback
			get: -> @_getPropertyValue(name)
			set: (value) -> @_setPropertyValue(name, value)

	@proxyProperty = (keyPath, options={}) ->

		# Allows to easily proxy properties from an instance object
		# Object property is in the form of "object.property"

		objectKey = keyPath.split(".")[0]

		descriptor = _.extend options,
			get: ->
				return unless _.isObject(@[objectKey])
				Utils.getValueForKeyPath(@, keyPath)
			set: (value) ->
				return unless _.isObject(@[objectKey])
				Utils.setValueForKeyPath(@, keyPath, value)
			proxy: true

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
			for k, v of value
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

		@_applyDefaults(options)

		# Count the creation for these objects and set the id
		@constructor[CounterKey] ?= 0
		@constructor[CounterKey] += 1

		# We set this last so if we print a layer during construction
		# we don't get confused because the id changes from global to context
		@_id = @constructor[CounterKey]

	_applyDefaults: (options) ->

		return unless @constructor[DefinedPropertiesOrderKey]
		return unless options

		for k in @constructor[DefinedPropertiesOrderKey]
			@_applyDefault(k, options[k])

	_applyProxyDefaults: (options) ->

		return unless @constructor[DefinedPropertiesOrderKey]
		return unless options

		for k in @constructor[DefinedPropertiesOrderKey]
			descriptor = @constructor[DefinedPropertiesKey][k]
			continue unless descriptor?.proxy? is true
			@_applyDefault(k, options[k])

	_applyDefault: (key, optionValue) ->

		descriptor = @constructor[DefinedPropertiesKey][key]

		# If this was listed as a dependent property, but it did not get defined, we err.
		throw Error("Missing dependant descriptor: #{key}") unless descriptor

		# For each known property (registered with @define) that has a setter, fetch
		# the value from the options object, unless the prop is not importable.
		# When there's no user value, apply the default value:

		return unless descriptor.set

		value = Utils.valueOrDefault(optionValue, @_getPropertyDefaultValue(key))

		return if value in [null, undefined]

		@[key] = value
