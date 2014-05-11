{Layer} = require "./Layer"

compatWarning = (msg) ->
	console.warn msg

compatProperty = (name) ->
	exportable: false
	get: -> 
		compatWarning "#{name} is a deprecated property"
		@[name]
	set: (value) -> 
		compatWarning "#{name} is a deprecated property"
		@[name] = value

class CompatLayer extends Layer

	constructor: (options={}) ->

		if options.hasOwnProperty "superView"
			options.superLayer = options.superView

		super options

	@define "superView", compatProperty "superLayer"
	@define "subViews", compatProperty "subLayers"
	@define "siblingViews", compatProperty "siblingLayers"

	addSubView = (layer) -> @addSubLayer layer
	removeSubView = (layer) -> @removeSubLayer layer

class CompatView extends CompatLayer

	constructor: (options={}) ->
		compatWarning "Views are now called Layers"
		super options

class CompatImageView extends CompatView

class CompatScrollView extends CompatView
	constructor: ->
		super
		@scroll = true

window.Layer = CompatLayer
window.Framer.Layer = CompatLayer

window.View = CompatView
window.ImageView = CompatImageView
window.ScrollView = CompatScrollView

	

