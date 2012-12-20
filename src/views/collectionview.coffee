{ScrollView} = require "./scrollview"

class exports.CollectionView extends ScrollView
	constructor: (@itemViewConstructor) ->
		@rowViews = []
		super

	setContent: (data) ->
		@removeAllSubViews()
		@rowViews = []
		lastView = null
		for index in [0..data.length-1]
			view = new @itemViewConstructor(@, index, data[index])
			view.frame = {x:0, y:0}
			if lastView
				view.frame.y = lastView.frame.maxY
			lastView = view
			@addSubView(view) # Batch these up?
			@rowViews.push(view)