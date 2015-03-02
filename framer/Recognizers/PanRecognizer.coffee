{_} = require "../Underscore"

Utils        = require "../Utils"
{BaseClass}  = require "../BaseClass"
{Events}     = require "../Events"

Events.DidStartPan = "didstartpan"
Events.DidEndPan   = "didendpan"
Events.DidPan      = "didpan"

class exports.PanRecognizer extends BaseClass

	STATE = Utils.defineEnum [
		"POSSIBLE"
		"BEGAN"
		"CHANGED"
		"ENDED"
		"CANCELLED"
		"FAILED"
	], 0, 2

	constructor: (@eventBuffer, options = {}) ->

		@options = _.defaults options,
			horizontal: true
			vertical: true
			lockDirection: true
			lockDirectionOptions: 
				thresholdX: 10
				thresholdY: 10

		@state = STATE.POSSIBLE

		@thresholdX = @options.lockDirectionOptions.thresholdX
		@thresholdY = @options.lockDirectionOptions.thresholdY

		# @eventBuffer.on Events.EventBufferReset, => @state = STATE.POSSIBLE

	process: ->

		offset = {x, y} = @eventBuffer.offset

		switch @state

			when STATE.POSSIBLE

				panX = @options.horizontal && Math.abs(x) > @thresholdX
				panY = @options.vertical   && Math.abs(y) > @thresholdY
				
				panHalfX = @options.horizontal && Math.abs(x) > @thresholdX / 2
				panHalfY = @options.vertical   && Math.abs(y) > @thresholdY / 2
				pan = panHalfX && panHalfY

				if panX || panY || pan

					direction =
						x: panX || pan
						y: panY || pan

					@emit Events.DidStartPan, direction, offset
					@emit Events.DidPan, offset

					@state = STATE.BEGAN

			when STATE.BEGAN

				@emit Events.DidPan, offset
