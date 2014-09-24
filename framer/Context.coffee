Utils = require "./Utils"

{_} = require "./Underscore"
{Config} = require "./Config"
{EventManager} = require "./EventManager"

#React = require "React"

# onTouchCancel onTouchEnd onTouchMove onTouchStart

reactEventMap =
	"mouseup": "onMouseUp"
	"click": "onClick"
	"mouseover": "onMouseOver"
	"touchcancel": "onTouchCancel"
	"touchend": "onTouchEnd"
	"touchmove": "onTouchMove"
	"touchstart": "onTouchStart"

	# onDrag onDragEnd
	# onDragEnter
	# onDragExit
	# onDragLeave
	# onDragOver
	# onDragStart
	# onDrop
	# onMouseDown
	# onMouseEnter
	# onMouseLeave
	# onMouseMove
	# onMouseOut
	# onMouseOver
	# onMouseUp

reactElement = (layer) ->

	if !layer._reactElement or layer._needsRender is true

		options = 
			className: "framerLayer"
			style: layer._style

		# todo: make this work on the moment you add an event
		for eventName in _.keys(layer._events)
			if reactEventMap.hasOwnProperty(eventName)
				options[reactEventMap[eventName]] = (e) => layer.emit(eventName, e)
		
		layer._reactElement = React.DOM.div(options, null, reactElementList(layer.subLayers)...)


	layer._needsRender = false

	return layer._reactElement

reactElementList = (layers) -> _.map(layers, reactElement)

# ReactRAFBatchingStrategy =
# 	isBatchingUpdates: true
# 	batchedUpdates: (callback, param) -> callback(param)

# # var ReactRAFBatchingStrategy = require('./ReactRAFBatchingStrategy');
# ReactUpdates = require('react/lib/ReactUpdates')
# ReactUpdates.injection.injectBatchingStrategy(ReactRAFBatchingStrategy);






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

		# @_rootElement?.parentNode?.removeChild?(@_rootElement)
		if not @_rootElement
			@_rootElement = @_createRootElement()

		@_delayTimers?.map (timer) -> window.clearTimeout(timer)
		@_delayIntervals?.map (timer) -> window.clearInterval(timer)

		@_layerList = []
		@_delayTimers = []
		@_delayIntervals = []
		@_needsRender = true
		@_count = 0

		@_reactApplication = React.createClass
			render: =>
				# Todo: cache the root layers
				rootLayers = _.filter(@_layerList, (layer) -> !layer.superLayer)
				React.DOM.div({className: "framerContext"}, "render: #{@_count}", reactElementList(rootLayers)...)


# Utils.domComplete ->
# 	Utils.insertCSS(css)
# 	document.body.appendChild(contentNode)
# 	main()

# 	Framer.Loop.on "render", ->
# 		React.renderComponent(FramerApplication(), contentNode)

	getRootElement: ->
		@_rootElement

	getLayers: ->
		_.clone @_layerList

	_createRootElement: ->

		element = document.createElement("div")
		element.id = "FramerContextRoot-#{@_name}"
		
		# _.extend element.style, Config.rootBaseCSS

		parentElement = @_parentLayer?._element

		# Utils.domComplete -> Utils.delay 0, ->
		Utils.domComplete =>
			parentElement ?= document.body
			parentElement.appendChild(element)
			Framer.Loop.on "render", =>

				if @_needsRender is true
					@_count++

					console.log "render: #{@_count}"
					React.renderComponent(@_reactApplication(), element)
					@_needsRender = false

			# Framer.Loop.on "render", =>
			# 	React.renderComponent(@_reactApplication(), element)
			# 	ReactUpdates.flushBatchedUpdates();

		element

	run: (f) ->

		previousContext = Framer.CurrentContext

		Framer.CurrentContext = @
		f()
		Framer.CurrentContext = previousContext