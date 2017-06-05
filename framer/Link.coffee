{Layer} = require "./Layer"
{Events} = require "./Events"

class exports.Link extends Layer
	constructor: (props) ->
		super props
		@router = props.router
		@to = props.to
		@on Events.Click, @clicked
	# When you click a Link, change routes
	clicked: () =>
		@router.push(@to)
