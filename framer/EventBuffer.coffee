{_} = require "./Underscore"

Utils        = require "./Utils"
{BaseClass}  = require "./BaseClass"
{Events}     = require "./Events"

Events.EventBufferReset   = "eventbufferreset"
Events.EventBufferUpdated = "eventbufferupdated"

class exports.EventBuffer extends BaseClass

	constructor: (options = {}) ->
		@options = _.defaults options,
			velocityTimeout: 100
		@_events = []

	push: (event) -> 
		@_events.push event
		@emit Events.EventBufferUpdated, event

	reset: -> 
		@_events.length = 0
		@emit Events.EventBufferReset

	@define "length",
		get: -> @_events.length

	@define "first",
		get: -> @_events[0]

	@define "offset",
		get: ->
			return {x:0, y:0} if events.length < 2

			current = events[events.length - 1]
			first   = events[0]

			offset = 
				x: current.x - first.x
				y: current.y - first.y

			offset

	@define "events",
		get: ->
			timeout = Date.now() - @options.velocityTimeout
			return _.filter @_events, (event) => event.t > timeout

	@define "angle",
		get: ->
			{x, y} = @velocity
			Math.atan2 y, x

	@define "velocity",
		get: ->
			events = @events

			return {x:0, y:0} if events.length < 2

			current = events[events.length - 1]
			first   = events[0]
			time    = current.t - first.t

			velocity =
				x: (current.x - first.x) / time
				y: (current.y - first.y) / time

			velocity.x = 0 if velocity.x is Infinity
			velocity.y = 0 if velocity.y is Infinity

			velocity
