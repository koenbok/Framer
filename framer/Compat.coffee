{Layer} = require "./Layer"

compatWarning = (msg) ->
	console.warn msg

compatProperty = (name, originalName) ->
	enumerable: false
	get: ->
		compatWarning "#{originalName} is a deprecated property"
		@[name]
	set: (value) ->
		compatWarning "#{originalName} is a deprecated property"
		@[name] = value

class CompatLayer extends Layer

	constructor: (options={}) ->

		if options.hasOwnProperty "superView"
			options.parent = options.superView

		super options

	@define "superView", compatProperty "parent", "superView"
	@define "subViews", compatProperty "children", "subViews"
	@define "siblingViews", compatProperty "siblingLayers", "siblingViews"

	addSubView = (layer) -> @addChild layer
	removeSubView = (layer) -> @removeChild layer

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

# Utils were utils in Framer 2
window.utils = window.Utils
