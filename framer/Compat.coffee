{Layer} = require "./Layer"

compatProperty = (name) ->
	exportable: false
	get: -> @[name]
	set: (value) -> @[name] = value

class CompatView extends Layer

	constructor: (options={}) ->

		console.debug "CompatView.constructor: Views are now called Layers"

		if options.hasOwnProperty "superView"
			options.superLayer = options.superView

		super options

	@define "superView", compatProperty "superLayer"
	@define "subViews", compatProperty "subLayers"
	@define "siblingViews", compatProperty "siblingLayers"

	addSubView = (layer) -> @addSubLayer layer
	removeSubView = (layer) -> @removeSubLayer layer

class CompatImageView extends CompatView

class CompatScrollView extends CompatView
	constructor: ->
		super
		@scroll = true

window.View = CompatView
window.ImageView = CompatImageView
window.ScrollView = CompatScrollView

	

