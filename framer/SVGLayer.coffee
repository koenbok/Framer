{_} = require "./Underscore"

{Layer} = require "./Layer"

class exports.SVGLayer extends Layer
	
	constructor: (options={}) ->

		super _.defaults options,
			backgroundColor: null
		
		@svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
		@svg.setAttribute("width", "100%")
		@svg.setAttribute("height", "100%")
		@svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink")

	addShape: (type) ->
		shape = document.createElementNS("http://www.w3.org/2000/svg", "circle")
		@svg.appendChild(shape)
		return shape