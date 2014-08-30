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
			rootElement: null

		@_rootElement = options.rootElement or @_createRootElement()
		@_layerList = []
		@_delayTimers = []
		@_delayIntervals = []

		@eventManager = new EventManager

	reset: ->
		@eventManager.reset()

		@_rootElement.innerHTML = ""

		@_delayTimers.map (timer) -> window.clearTimer(timer)
		@_delayIntervals.map (timer) -> window.clearInterval(timer)


		# for layer in @_layerList
		# 	layer.destroy()

	getRootElement: ->
		@_rootElement

	getLayers: ->
		_.clone @_layerList

	_createRootElement: ->
		element = document.createElement "div"
		element.id = "FramerContextRoot-#{Counter}"
		_.extend element.style, Config.rootBaseCSS

		Utils.domComplete -> document.body.appendChild(element)
		
		element

	run: (f) ->

		Framer.CurrentContext = @
		f()
		Framer.CurrentContext = Framer.DefaultContext