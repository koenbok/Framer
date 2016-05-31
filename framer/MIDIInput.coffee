{BaseClass} = require "./BaseClass"
{Events} = require "./Events"

Events.MIDICommand = "midiCommand"

class MIDIInput extends BaseClass

	@define "enabled",
		get: -> @_inputs?.length or @_request
		set: (value) ->
			return unless value != @enabled
			return @_requestRejected() if not navigator.requestMIDIAccess
			if value
				@_request = navigator.requestMIDIAccess().then @_requestResolved, @_requestRejected
			else
				@_inputs?.map close
				@_request = null
				@_inputs = []

	# Success handlers

	_requestResolved: (access) =>
		@_inputs ?= []
		access.inputs.forEach (input) =>
			console.log(input)
			@_inputs.push input
			input.onmidimessage = @_onmidimessage(input.id)

	# Failure handlers

	_requestRejected: (error) =>
		throw Error "Requesting MIDI access failed: #{error ? "not supported by browser"}"

	# Event handlers

	_onmidimessage: (sourceID) =>
		(message) => @emit(Events.MIDICommand, sourceID, message.timeStamp, message.data)

	# Event shortcuts

	onCommand: (cb) -> @on(Events.MIDICommand, cb)

exports.MIDIInput = new MIDIInput
