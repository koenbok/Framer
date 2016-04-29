Utils = require "../Utils"

{Layer} = require "../Layer"


class exports.GridComponent extends Layer

	constructor: (options) ->

		defaults = 
			rows: 3
			columns: 3
			spacing: 0
			backgroundColor: "transparent"

		options = _.defaults(options, defaults)

		super options
	
		_.extend(@, _.pick(options, _.keys(defaults)))

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
			throw Error "GridComponent.renderCell should be a function, not #{typeof(f)}" unless _.isFunction(f)
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
		
		for column in [@columns-1..0]
			for row in [@rows-1..0]
					
				frame =
					x: @cellX(column)
					y: @cellY(row)
					width: @cellWidth
					height: @cellHeight

				cell = new Layer
					parent: @
					frame: frame
					name: "Cell #{column}:#{row}"
					
				@renderCell(cell, row, column)
				
				@_cells["#{column}:#{row}"] = cell

	_defaultRenderCell: (cell, column, row) ->
		cell.backgroundColor = Utils.randomColor()
		Utils.labelLayer(cell, "#{row}:#{column}")

	_reset: ->
		_.invoke(@cells, "destroy")
		@_cells = {}
	
