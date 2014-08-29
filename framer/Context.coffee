Utils = require "./Utils"

{_} = require "./Underscore"
{Config} = require "./Config"
{EventManager} = require "./EventManager"

Counter = 1

class exports.Context
	
	constructor: (rootElement) ->

		Counter++

		@_rootElement = rootElement or @_createRootElement()
		@_layerList = []

		@eventManager = new EventManager

	reset: ->
		@eventManager.reset()

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