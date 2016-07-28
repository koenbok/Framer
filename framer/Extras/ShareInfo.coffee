{BaseClass} = require "../BaseClass"
{Context} = require "../Context"
{ShareComponent} = require "../Components/ShareComponent"

class ShareInfo extends BaseClass

	constructor: (options={}) ->

		@context = new Framer.Context({name: "Sharing"})

		Utils.delay 0, =>
			@context.run ->
				share = new ShareComponent(Framer.Info)

	destroy: ->
		@context.destroy()

exports.enable = ->
	Framer.ShareInfo ?= new ShareInfo()

exports.disable = ->
	return unless Framer.ShareInfo
	Framer.ShareInfo.destroy()
	Framer.ShareInfo = null
