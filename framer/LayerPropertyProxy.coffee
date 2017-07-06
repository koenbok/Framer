# This is a subset polyfill for ES6’s Proxy
# Because we only use it for setters, the only callback available is when
# a (sub)property is set.

class exports.LayerPropertyProxy
	constructor: (target, callback) ->
		proxy = @
		getter = (prop) ->
			@[prop]
		setter = (prop, value) ->
			callback(@, prop, value, proxy)
		for prop in Object.getOwnPropertyNames(target)
			targetDesc = Object.getOwnPropertyDescriptor(target, prop)
			desc =
				enumerable: targetDesc.enumerable
				get: getter.bind(target, prop)
				set: setter.bind(target, prop)
			Object.defineProperty(proxy, prop, desc)
		proxy.__proto__ = target.__proto__
