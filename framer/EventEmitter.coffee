{_} = require "./Underscore"

EventEmitter3 = require "EventEmitter3"

EventKey = "_events"

class exports.EventEmitter extends EventEmitter3

	listenerEvents: ->
		return _.keys(@[EventKey])

	removeAllListeners: (eventName) ->
		for listener in @listeners(eventName)
			@removeListener(eventName, listener)