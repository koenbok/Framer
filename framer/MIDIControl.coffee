{_} = require "./Underscore"
{BaseClass} = require "./BaseClass"
{Events} = require "./Events"
{MIDIInput} = require "./MIDIInput"

Events.MIDIControlValueChange = "MIDIControlValueChange"

class MIDIControl extends BaseClass

	@define "min", @simpleProperty("min", 0)
	@define "max", @simpleProperty("max", 127)
	@define "control", @simpleProperty("control", null)
	@define "channel", @simpleProperty("channel", null)
	@define "source", @simpleProperty("source", null)

	constructor: (options={}) ->
		super options

		MIDIInput.enabled = true
		MIDIInput.onCommand (source, timeStamp, data) =>

			[b1, b2, b3] = data

			# Mask the bytes to get the info we want
			command = b1 & 0xf0
			channel = (b1 & 0x0f) + 1 # 1-16
			data1 = b2 & 0x7f
			data2 = b3 & 0x7f

			# 0xb0 control change
			# 0x90 note on
			# 0x80 note off

			return unless command in [0xb0, 0x90, 0x80]
			return if @source? and @source isnt source
			return if @channel? and @channel isnt channel
			return if @control? and @control isnt data1

			info =
				source: source
				channel: channel
				control: data1

			if command in [0x90, 0x80]
				info = _.defaults info
					type: "note"

			@emit(Events.MIDIControlValueChange, @_modulate(data2), info)

	_modulate: (value) ->
		Utils.modulate(value, [0, 127], [@min, @max])

	onValueChange: (cb) -> @on(Events.MIDIControlValueChange, cb)

exports.MIDIControl = MIDIControl
