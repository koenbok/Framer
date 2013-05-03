{ScrollView} = require "./scrollview"

class PagingView extends ScrollView

	constructor: ->
		super
		
		@endBehaviour = @_endBehaviourSnap

exports.PagingView = PagingView
