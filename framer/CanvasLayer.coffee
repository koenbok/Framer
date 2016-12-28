{_} = require "./Underscore"

{Layer} = require "./Layer"

DPR = window.devicePixelRatio or 1

class exports.CanvasLayer extends Layer
	
	constructor: (options={}) ->

		super _.defaults options,
			backgroundColor: null
		
		@_canvas = document.createElement("canvas")
		@_ctx = @canvas.getContext("2d")
		
		@_update()
		@_element.appendChild(@canvas)
		@on("update:frame", @_update)
	
	@define "canvas", get: -> @_canvas
	@define "ctx", get: -> @_ctx

	_update: =>
		@canvas.width = @width * DPR
		@canvas.height = @height * DPR
		@canvas.style.width = @width + "px"
		@canvas.style.height = @height + "px"
		@ctx.scale(DPR, DPR)