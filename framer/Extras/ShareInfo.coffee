{_} = require "../Underscore"
{BaseClass} = require "../BaseClass"
{Context} = require "../Context"
{ShareComponent} = require "../Components/ShareComponent"

ShareInfoDisabled = false

class ShareInfo extends BaseClass

	constructor: (options={}) ->

		@context = new Framer.Context({name: "Sharing"})
		@context.index = 20000

		run = =>
			@context.run ->
				share = new ShareComponent(Framer.Info)

		# When enabled before specifying Framer.Info
		if _.isEmpty(Framer.Info)
			Utils.delay 0, run
		else
			run()

	destroy: ->
		@context.destroy()


exports.enable = ->
	return if ShareInfoDisabled
	Framer.ShareInfo ?= new ShareInfo()

exports.disable = (force = true) ->
	ShareInfoDisabled = force
	return unless Framer.ShareInfo
	Framer.ShareInfo.destroy()
	Framer.ShareInfo = null
