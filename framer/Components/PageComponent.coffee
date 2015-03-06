{Events} = require "../Events"
{ScrollComponent} = require "./ScrollComponent"

class exports.PageComponent extends ScrollComponent

	constructor: ->
		super

		@content.draggable.momentum = false
		@content.draggable.bounce = false

		@on(Events.ScrollEnd, @_onScrollEnd)

	_onScrollEnd: =>
		@scrollToClosestLayer(0, 0)