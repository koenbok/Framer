{Layer} = require "./Layer"

class SVGGroup extends Layer
	constructor: (group, options) ->
		@_element = group
		super (options)

	_insertElement: ->

exports.SVGGroup = SVGGroup
