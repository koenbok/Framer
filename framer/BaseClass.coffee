{_} = require "./Underscore"

Utils = require "./Utils"

{EventEmitter} = require "./EventEmitter"

CounterKey = "_ObjectCounter"
DefinedPropertiesValuesKey = "_DefinedPropertiesValuesKey"

ObjectDescriptors = []

# Theoretically this should be an array per class, but as long as we don't do weird stuff
# like depending properties of subclasses in a different order then superclasses this will work
DefaultPropertyOrder = []

class exports.BaseClass extends EventEmitter

	#################################################################
	# Framer object properties

	@define = (propertyName, descriptor) ->

		# See if we need to add this property to the internal properties class
		if @ isnt BaseClass
			@_addDescriptor(propertyName, descriptor)

		if descriptor.readonly
			descriptor.set = (value) ->
				throw Error("#{@constructor.name}.#{propertyName} is readonly")

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
		descriptor.readonly ?= not descriptor.set?

		# We assume we don't import if there is no setter, because we can't
		descriptor.importable = descriptor.importable and not descriptor.readonly
		# We also assume we don't export if there is no setter, because
		# it is likely a calculated property, and we can't set it.
		descriptor.exportable = descriptor.exportable and not descriptor.readonly

		# We assume that every property with an underscore is private
		return if _.startsWith(propertyName, "_")

		# Only retain options that are importable, exportable or both:
		if descriptor.exportable or descriptor.importable
			ObjectDescriptors.push([@, propertyName, descriptor])

			if descriptor.depends
				for depend in descriptor.depends
					if depend not in DefaultPropertyOrder
						DefaultPropertyOrder.push(depend)
			if propertyName not in DefaultPropertyOrder
				DefaultPropertyOrder.push(propertyName)

	@simpleProperty = (name, fallback, options={}) ->
		return _.extend options,
			default: fallback
			get: -> @_getPropertyValue(name)
			set: (value) ->
				@_setPropertyValue(name, value)
				options?.didSet?(@, value)

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
				options?.didSet?(@, value)
			proxy: true

	_setPropertyValue: (k, v) =>
		@[DefinedPropertiesValuesKey][k] = v

	_getPropertyValue: (k) =>
		Utils.valueOrDefault @[DefinedPropertiesValuesKey][k],
			@_getPropertyDefaultValue k

	_getPropertyDefaultValue: (k) ->
		@_propertyList()[k]["default"]

	_propertyList: ->
		result = {}
		for k in ObjectDescriptors
			if @ instanceof k[0]
				result[k[1]] = k[2]
		return result

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

	_applyDefaults: (options, proxy = false) ->

		return unless options

		propertyList = @_propertyList()
		for k in DefaultPropertyOrder
			descriptor = propertyList[k]
			if descriptor?
				continue if proxy and not (descriptor.proxy is true)
				@_applyDefault(descriptor, k, options[k])

	_applyProxyDefaults: (options) ->
		@_applyDefaults(options, true)

	_applyDefault: (descriptor, key, optionValue) ->

		# For each known property (registered with @define) that has a setter, fetch
		# the value from the options object, unless the prop is not importable.
		# When there's no user value, apply the default value:

		return if descriptor.readonly

		value = optionValue if descriptor.importable
		value = Utils.valueOrDefault(optionValue, @_getPropertyDefaultValue(key))

		return if value in [null, undefined]

		@[key] = value
