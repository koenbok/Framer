Utils = require "../Utils"

{BaseClass} = require "../BaseClass"
{Context} = require "../Context"
{Layer} = require "../Layer"

_error = null
_context = null

Config = {}

if Utils.isMobile()
	Config.height = 100
	Config.textInset = 20
	Config.fontSize = 32
else
	Config.height = 40
	Config.textInset = 12
	Config.fontSize = 14


class ErrorDisplay extends BaseClass

	constructor: ->

		@_context ?= new Context name:"Mobile Error"
		@_context.index = 1000

		@_context.run =>

			Events.wrap(window).addEventListener "error", (e) =>
				@showError(e.message)

			Events.wrap(window).addEventListener "resize", (e) =>
				@resize()

	createLayer: ->

		return @_errorLayer if @_errorLayer

		@_context.run =>

			error = new Layer
				name: "error"
				y: Align.bottom
				width: Screen.width
				height: Config.height
				backgroundColor: "rgba(255,0,0,1)"
			
			error.text = new Layer
				name: "text"
				parent: error
				size: Utils.frameInset(error, Config.textInset)
				point: Align.center
				backgroundColor: null
				clip: true
			
			error.text.style =
				font: "#{Config.fontSize}px/1em #{Utils.deviceFont()}"
				lineHeight: "#{parseInt(error.text.height - 2)}px"
				textAlign: "center"
				wordWrap: "break-word"
				textOverflow: "ellipsis"
				
			error.onTap =>
				@_errorLayer?.destroy()
				@_errorLayer = null

			@_errorLayer = error

		return @_errorLayer

	resize: =>
		return unless @_errorLayer
		@_errorLayer.width = Screen.width
		@_errorLayer.y = Align.bottom
		@_errorLayer.text.size = Utils.frameInset(@_errorLayer, Config.textInset)
		@_errorLayer.text.point = Align.center

	showError: (message) ->

		error = @createLayer()
		error.scale = 1.1
		error.text.html = message

		animation = error.animate
			properties:
				scale: 1
			curve: "spring(800, 55, 10)"
		
		# Terrible hacky fix for blurred text bug on Chrome desktop
		if Utils.isChrome() and Utils.isDesktop()
			animation.onAnimationEnd ->
				Utils.delay 0, -> error.text.html = message + " "
		
	destroy: ->
		@_context?.destroy()

_errorDisplay = null

exports.enable = ->
	return if _errorDisplay
	_errorDisplay = new ErrorDisplay

exports.disable = ->
	return unless _errorDisplay
	_errorDisplay.destroy()
	_errorDisplay = null