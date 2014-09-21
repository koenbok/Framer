Utils = require "./Utils"

{_} = require "./Underscore"
{Config} = require "./Config"
{EventManager} = require "./EventManager"

Counter = 1

class exports.Context
	
	constructor: (options={}) ->

		Counter++

		options = Utils.setDefaultProperties options,
			contextName: null
			parentLayer: null
			name: null

		if not options.name
			throw Error("Contexts need a name")

		@_parentLayer = options.parentLayer
		@_name = options.name

		@reset()

	reset: ->

		@eventManager?.reset()
		@eventManager = new EventManager

		@_rootElement?.parentNode?.removeChild?(@_rootElement)
		@_rootElement = @_createRootElement()

		@_delayTimers?.map (timer) -> window.clearTimeout(timer)
		@_delayIntervals?.map (timer) -> window.clearInterval(timer)

		@_layerList = []
		@_delayTimers = []
		@_delayIntervals = []	

	getRootElement: ->
		@_rootElement

	getLayers: ->
		_.clone @_layerList

	_createRootElement: ->

		element = document.createElement("div")
		element.id = "FramerContextRoot-#{@_name}"

		# Disable bouncy scrolling on mobile
		if Utils.isMobile()
			@eventManager.wrap(element).addEventListener "touchmove", (event) ->
				event.preventDefault()
		
		_.extend element.style, Config.rootBaseCSS

		parentElement = @_parentLayer?._element

		# Utils.domComplete -> Utils.delay 0, ->
		Utils.domComplete ->
			parentElement ?= document.body
			parentElement.appendChild(element)
		
		element

	run: (f) ->

		previousContext = Framer.CurrentContext

		Framer.CurrentContext = @
		f()
		Framer.CurrentContext = previousContext