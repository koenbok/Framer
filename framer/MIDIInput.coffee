{BaseClass} = require "./BaseClass"
{Events}    = require "./Events"

Events.MIDIControlChange = "midiControlChange"
Events.MIDINoteOn = "midiNoteOn"
Events.MIDINoteOff = "midiNoteOff"
Events.MIDICommand = "midiCommand"
# TODO Events.MIDIInputEnabled, or make enable a function with a callback?

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
    [b1, b2, b3] = message.data

    # Mask the bytes to get the info we want
    command = b1 & 0xf0
    channel = b1 & 0x0f
    data1 = b2 & 0x7f
    data2 = b3 & 0x7f

    if command == 0xb0
      controller = data1
      value = data2
      @emit(Events.MIDIControlChange, controller, value, channel)
    if command == 0x90
      note = data1
      velocity = data2
      @emit(Events.MIDINoteOn, note, velocity, channel)
    if command == 0x80
      note = data1
      velocity = data2
      @emit(Event.MIDINoteOff, note, velocity, channel)

  # Event shortcuts

  onControlChange: (cb) -> @on(Events.MIDIControlChange, cb)
  onNoteOn: (cb) -> @on(Events.MIDINoteOn, cb)
  onNoteOff: (cb) -> @on(Events.MIDINoteOff, cb)
  onCommand: (cb) -> @on(Events.MIDICommand, cb)

exports.MIDIInput = new MIDIInput
