Utils = require "../Utils"

exports.enable = ->

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

			@on "change:scrollVertical", @_updateScrollListeners
			@_updateScrollListeners()

		_updateScrollListeners: =>
			if @scrollVertical is true
				@on "touchmove", handleScrollingLayerTouchMove
				@on "touchstart", handleScrollingLayerTouchStart
			else
				@off "touchmove", handleScrollingLayerTouchMove
				@off "touchstart", handleScrollingLayerTouchStart

		__createRootElement: =>
			
			rootElement = super

			rootElement.addEventListener "touchmove", (event) ->
				event.preventDefault()

			return rootElement

	# Override the standard window Layer with this patched one
	window.Layer = window.Framer.Layer = MobileScrollFixLayer
