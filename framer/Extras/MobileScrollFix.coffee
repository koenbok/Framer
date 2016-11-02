Utils = require "../Utils"

exports.enable = ->

	# If we touch the document directly we want to ignore scroll events
	document.ontouchmove = (event) ->
		if event.target is document.body
			event.preventDefault()


	# The second part is that when we scroll a div that is already at it's top
	# scroll position the scroll event will propagate up and enable elastic scrolling.

	handleScrollingLayerTouchMove = (event) ->
		event.stopPropagation()

	handleScrollingLayerTouchStart = (event) ->

		element = @_element

		startTopScroll = element.scrollTop

		if startTopScroll <= 0
			element.scrollTop = 1

		if startTopScroll + element.offsetHeight >= element.scrollHeight
			element.scrollTop = element.scrollHeight - element.offsetHeight - 1


	class MobileScrollFixLayer extends Framer.Layer

		constructor: (options) ->
			super options

			# Only do this for bare layers, it messes with the
			# Scroll and Page Component for now.
			if @constructor.name is "Layer"
				@on "change:scrollVertical", @_updateScrollListeners
				@_updateScrollListeners()

		_updateScrollListeners: =>

			if @scrollVertical is true
				@on "touchmove", handleScrollingLayerTouchMove
				@on "touchstart", handleScrollingLayerTouchStart
			else
				@off "touchmove", handleScrollingLayerTouchMove
				@off "touchstart", handleScrollingLayerTouchStart

		toInspect: ->
			if @constructor.name is "MobileScrollFixLayer"
				super "Layer"
			else
				super

	# Override the standard window Layer with this patched one
	window.Layer = window.Framer.Layer = MobileScrollFixLayer
