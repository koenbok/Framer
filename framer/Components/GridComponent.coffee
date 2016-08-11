Utils = require "../Utils"

{Defaults} = require "../Defaults"
{Layer} = require "../Layer"

class exports.GridComponent extends Layer

	constructor: (options={}) ->
		super Defaults.getDefaults("GridComponent", options)

	@define "rows",
		get: -> @_rows
		set: (value) ->
			@_rows = value
			@_render()

	@define "columns",
		get: -> @_columns
		set: (value) ->
			@_columns = value
			@_render()

	@define "spacing",
		get: -> @_spacing or {horizontal: 0, vertical: 0}
		set: (value) ->
			if _.isNumber(value)
				value = {horizontal: value, vertical: value}
			@_spacing = value
			@_render()
	
	@define "renderCell",
		get: -> @_renderCell or @_defaultRenderCell
		set: (f) ->
			return if f is @_renderCell

			if not _.isFunction(f)
				throw Error "GridComponent.renderCell should be a function, not #{typeof(f)}"

			@_renderCell = f
			@render()

	@define "cellWidth",
		get: -> (@width - (@spacing.horizontal * (@columns - 1))) / @columns

	@define "cellHeight",
		get: -> (@height - (@spacing.vertical * (@rows - 1))) / @rows

	@define "cells",
		get: -> _.values(@_cells)

	cellX: (row) -> 
		row * (@cellWidth + @spacing.horizontal)
	
	cellY: (column) ->
		column * (@cellHeight + @spacing.vertical)

	cellFrame: (column, row) ->
		frame = 
			x: @cellX(column)
			y: @cellY(row)
			width: @cellWidth
			height: @cellHeight

	cell: (column, row) ->
		@_cells["#{column}:#{row}"]

	render: ->
		@_render()

	# columns and rows

	_render: ->
		
		@_reset()
		
		for row in [@rows-1..0]
			for column in [@columns-1..0]

				frame = @cellFrame(column, row)
				# frame.x = Math.floor(frame.x)
				# frame.y = Math.floor(frame.y)
				# frame.width = Math.ceil(frame.width)
				# frame.height = Math.ceil(frame.height)

				cell = new Layer
					parent: @
					frame: frame
					name: "Cell #{column}:#{row}"
					
				@renderCell(cell, row, column)
				
				@_cells["#{column}:#{row}"] = cell

	_defaultRenderCell: (cell, column, row) ->
		fraction = ((column / @columns) + (row / @rows) / 2)
		cell.backgroundColor = "#28affa"
		cell.hueRotate = column * 20 + (row % @columns) * (20 / (@columns + 1))
		Utils.labelLayer(cell, "#{row}:#{column}")
		cell.style.fontSize = "30px"

	_reset: ->
		_.invokeMap(@cells, "destroy")
		@_cells = {}

	# copy: ->
	# 	result = super
	# 	result.render()
	
