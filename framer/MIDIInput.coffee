{BaseClass} = require "./BaseClass"
{Events} = require "./Events"

Events.MIDICommand = "midiCommand"

class MIDIInput extends BaseClass

	@define "enabled",
		get: -> @_input or @_request
		set: (value) ->
			return unless value != @enabled
			return @_requestRejected() if not navigator.requestMIDIAccess
			if value
				@_request = navigator.requestMIDIAccess().then @_requestResolved, @_requestRejected
			else
				@_input?.close()
				@_request = null
				@_input = null

	# Success handlers

	_requestResolved: (access) =>
		# Pick the last one
		access.inputs.forEach (input) =>
			@_input = input
		@_input.onmidimessage = @_onmidimessage

	# Failure handlers

	_requestRejected: (error) =>
		throw Error "Requesting MIDI access failed: #{error ? "not supported by browser"}"

	# Event handlers

	_onmidimessage: (message) =>
		@emit(Events.MIDICommand, message.timeStamp, message.data)

	# Event shortcuts

	onCommand: (cb) -> @on(Events.MIDICommand, cb)

exports.MIDIInput = new MIDIInput
