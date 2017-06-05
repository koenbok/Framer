{Layer} = require "./Layer"
{Screen} = require "./Screen"

class exports.Route extends Layer
	constructor: (props) ->
		props.x ?= 0 # set default props
		props.y ?= 0 # set default props
		super(props)
		@router = props.router
		@visible = @router.route == @name
		@width = Screen.width
		@height = Screen.height
#		@size = Screen
		@onLeave = props.onLeave
		@onEnter = props.onEnter
		@router.on "routeWillChange", @handleRouteChange

	handleOnLeave: () =>
		@emit "routeDidLeave"
		if @router.debug then print routeDidLeave: @name

	handleOnEnter: () =>
		@emit "routeDidEnter"
		if @router.debug then print routeDidEnter: @name

	handleRouteChange: () =>
		if @router.lastRoute is @name
			if @router.debug then print routeWillLeave: @name
			@emit "routeWillLeave"
			@ignoreEvents = true
			if @onLeave then @onLeave(@handleOnLeave) else visible = false

		if @router.nextRoute is @name
			if @router.debug then print routeWillEnter: @name
			@emit "routeWillEnter"
			@ignoreEvents = false
			@visible = true
			if @onEnter then @onEnter(@handleOnEnter)
