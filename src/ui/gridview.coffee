{View} = require "../views/view"

class exports.GridView extends View
	
	constructor: (args) ->
		super
		@rows = args.rows or 2
		@cols = args.cols or 2
		@views = {}
		@update()
	
	update: ->
		for rowIndex in [1..@rows]
			for colIndex in [1..@cols]

				view = @createView()
				view.superView = @
				
				frame =
					width: @width / @cols
					height: @height / @cols
				
				frame.x = (colIndex - 1) * frame.width
				frame.y = (rowIndex - 1) * frame.height
				
				view.frame = frame
				@views["#{rowIndex}.#{colIndex}"] = view
	
	createView: ->
		view = new View
		view.style.backgroundColor = utils.randomColor(.1)
		view.clip = false
		view

# gv = new GridView
# 	width: 1000
# 	height: 1000
# 	rows: 5
# 	cols: 5