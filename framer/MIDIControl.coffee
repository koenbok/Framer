{BaseClass} = require "./BaseClass"
{Events}    = require "./Events"
{MIDIInput} = require "./MIDIInput"

Events.MIDIControlChange = "MIDIControlChange"

class MIDIControl extends BaseClass

  @define "min", @simpleProperty("min", 0)
  @define "max", @simpleProperty("max", 127)
  @define "control", @simpleProperty("control", null)
  @define "channel", @simpleProperty("channel", null)
  @define "source", @simpleProperty("source", null)

  constructor: (options={}) ->
    super options

    # TODO
    # - [ ] Listen to raw MIDIInput, do note/control recognition here to clean up code
    # - [ ] Rething event names
    # - [ ] Make MIDIInput pass source

    MIDIInput.enabled = true
    MIDIInput.onNoteOn (note, velocity, channel, source) =>
      return if @source? and @source isnt source
      return if @channel? and @channel isnt channel
      return if @control? and @control isnt note
      @emit(Events.MIDIControlChange, @_modulate(value), {velocity: velocity, channel: channel, source: source})
    MIDIInput.onNoteOff (note, velocity, channel, source) =>
      return if @source? and @source isnt source
      return if @channel? and @channel isnt channel
      return if @control? and @control isnt note
      @emit(Events.MIDIControlChange, @_modulate(value), {velocity: velocity, channel: channel, source: source})
    MIDIInput.onControlChange (control, value, channel, source) =>
      return if @source? and @source isnt source
      return if @channel? and @channel isnt channel
      return if @control? and @control isnt control
      @emit(Events.MIDIControlChange, @_modulate(value), {channel: channel, source: source})

  _modulate: (value) ->
    Utils.modulate(value, [0, 127], [@min, @max])

  # XXX This is too close to "change:", might be confusing? Use ValueChange?
  onChange: (cb) -> @on(Events.MIDIControlChange, cb)

exports.MIDIControl = MIDIControl
