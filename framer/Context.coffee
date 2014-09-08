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
			parentElement: null
			name: null

		if not options.name
			throw Error("Contexts need a name")

		@_parentElement = options.parentElement
		@_name = options.name

		@reset()

	reset: ->

		@eventManager?.reset()
		@eventManager = new EventManager

		@_rootElement?.parentNode.removeChild(@_rootElement)
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
		
		_.extend element.style, Config.rootBaseCSS

		parentElement = @_parentElement

		# Utils.domComplete -> Utils.delay 0, ->
		Utils.domComplete ->
			parentElement ?= document.body
			parentElement.appendChild(element)
		
		element

	run: (f) ->

		Framer.CurrentContext = @
		f()
		Framer.CurrentContext = Framer.DefaultContext