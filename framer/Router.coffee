{BaseClass} = require "./BaseClass"

class exports.Router extends BaseClass
	constructor: (props) ->
		props.debug ?= false
		super()
		@route = props.indexRoute
		@debug = props.debug
		@lastRoute = null
		@nextRoute = null

	push: (i) =>
		unless @route is i
			@lastRoute = @route
			@nextRoute = i
			if @debug
				print
					routeWillChange:
						lastRoute: @lastRoute
						nextRoute: @nextRoute

			@emit "routeWillChange"
			@route = i
			@emit "routeDidChange" # could be interesting if you want.
			if @debug then print routeDidChange: @route

# @TODO:
#	  goBack: () =>
#	    handle history array
#
#	  replace: () =>
#	    switch instantly to a route, perhaps no animations?
