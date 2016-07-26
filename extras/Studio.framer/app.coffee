# Info Fixture
Framer.Metadata =
	author: "Eelco Lempsink"
	twitter: "eelco"
# 	title: "MIDI Controller"
	description: """
		This is pretty niche but actually super cool.

		Connect a MIDI Controller to your Framer designs and play with it on the fly. http://blog.framerjs.com/posts/midi.html
	"""
	# local: true
	date: "Jun 14 2016"

# Setup
context = new Framer.Context({name: "Sharing"})

# Share layer with default behaviour
class ShareLayer extends Layer
	constructor: (options) ->
		super options

		defaultProps =
			backgroundColor: null
			width: options.parent.width if options and options.parent
			style:
				fontFamily: "Roboto, Helvetica Neue, Helvetica, Arial, sans-serif"
				fontSize: "14px"
				color: "#111"
				webkitUserSelect: "text"
				lineHeight: "1"
				textRendering: "optimizeLegibility"

		mergedProps = _.merge(defaultProps, options)
		@props = mergedProps

# Sheet
class ShareComponent
	constructor: (@shareInfo) ->

		# When fixed is set to true, the sheet won't hide on resize
		# This is triggered by a manual open / close action
		@options =
			padding: 20
			width: 250
			hideWidth: 820
			fixed: false

		@render()
		@_startListening()

	render: ->
		@_renderSheet()
		@_renderToggleButtons()
		@_renderCTA()
		@_renderInfo()
		@_renderDescription() if @shareInfo.description
		@_renderDate()
		@_renderDownload() if !@shareInfo.local

		# Evaluate content and set height accordingly
		@_updateHeight()
		@_checkCanvasSize()

	# Render main sheet
	_renderSheet: ->
		@sheet = new Layer
			width: @options.width
			point: 10
			borderRadius: 4
			backgroundColor: "#FFF"
			style:
				boxShadow: "0 0 0 1px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08)"

	# Render buttons to open / close sheet
	_renderToggleButtons: ->
		@close = new Layer
			parent: @sheet
			size: 12
			point: 12
			image: "images/close.png"

		@open = new Layer
			size: 30
			point: @sheet.point
			borderRadius: 4
			backgroundColor: "#FFF"
			visible: false
			style:
				boxShadow: "0 0 0 1px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08)"

		openLogo = new Layer
			parent: @open
			width: 10
			height: 15
			image: "images/logo-button.png"
			y: Align.center(1)
			x: Align.center

		for l in [@close, @open]
			@_showPointer(l)

	# Render CTA section
	_renderCTA: ->
		@cta = new ShareLayer
			parent: @sheet
			style:
				borderBottom: "1px solid #E8E8E8"
			height: 125

		ctaLogo = new Layer
			parent: @cta
			width: 16
			height: 24
			x: Align.center()
			y: 24
			image: "images/logo.png"

		ctaSlogan = new ShareLayer
			parent: @cta
			y: ctaLogo.y + 35
			height: 30
			html: "Start prototyping today"
			style:
				textAlign: "center"
				fontSize: "18px"

		ctaLink = new ShareLayer
			parent: @cta
			y: ctaSlogan.y + 24
			height: 30
			html: "Try Framer for Free"
			style:
				textAlign: "center"
				color: "#00AAFF"

	# Render info section
	_renderInfo: ->
		@info = new ShareLayer
			parent: @sheet
			width: @sheet.width - (@options.padding * 2)
			y: @cta.maxY + 22
			x: 20

		@credentials = new ShareLayer
			parent: @info
			height: 16

		fallbackTitle = _.replace(FramerStudioInfo.documentTitle, /\.framer$/, '')

		@credentialsTitle = new ShareLayer
			parent: @credentials
			width: @credentials.width - 50
			height: 18
			html: @shareInfo.title or fallbackTitle
			style:
				fontWeight: "500"

		# Check what info is available and render layers accordingly
		showAuthor = (content = @shareInfo.author) =>
			@credentials.height = 40
			@credentialsTitle.y = 4

			@credentialsAuthor = new ShareLayer
				parent: @credentials
				width: @credentials.width - 50
				html: content
				y: @credentialsTitle.maxY
				height: 18
				style:
					color: "#808080"

			@_showPointer(@credentialsAuthor)

		# Check if avatar is available
		if @shareInfo.twitter
			@credentials.x = 50

			@avatar = new ShareLayer
				size: 40
				parent: @info
				borderRadius: 100
				image: "http://img.tweetimag.es/i/#{@shareInfo.twitter}_o"

			avatarBorder = new ShareLayer
				size: @avatar.width - 2
				point: 1
				parent: @avatar
				borderRadius: 100
				style:
					boxShadow: "0 0 0 1px rgba(0,0,0,.1)"
			@_showPointer(@avatar)

			# See if author name is available, otherwise fallback to Twitter handle
			name = if @shareInfo.author then @shareInfo.author else "@#{@shareInfo.twitter}"
			showAuthor("<a href='http://twitter.com/#{@shareInfo.twitter}' style='text-decoration: none;'>#{name}</a>")

		# If there's no Twitter handle, but there is an author. Just show author.
		if @shareInfo.author and !@shareInfo.twitter
			showAuthor(@shareInfo.author)

	_renderDate: ->
		verticalPosition = if @description then @description.maxY else @credentials.maxY

		@date = new ShareLayer
			parent: @info
			height: 10
			y: verticalPosition + 16
			html: "Shared on #{@shareInfo.date}"
			style:
				textTransform: "uppercase"
				fontSize: "11px"
				color: "#999"
				letterSpacing: ".2px"


	_renderDescription: ->

		# See if there are any url's in the description and wrap them in anchor tags. Make sure linebreaks are wrapped in <br/ >'s.'
		parseDescription = (text) ->
			urlRegex = /(https?:\/\/[^\s]+)/g
			lineBreakRegex = /(?:\r\n|\r|\n)/g

			urlified = text.replace urlRegex, (url) ->
				'<a href="' + url + '">' + url + '</a>'

			urlified.replace lineBreakRegex, '<br />'

		@description = new ShareLayer
			parent: @info
			y: @credentials.maxY + 10
			html: parseDescription(@shareInfo.description)
			style:
				lineHeight: "1.5"
				wordWrap: "break-word"

		descriptionSize = Utils.textSize(
			parseDescription(@shareInfo.description),
			{fontSize: "14px", fontFamily: "Roboto", lineHeight: "1.5", wordWrap: "break-word"},
			{width: "#{@description.width}"}
		)
		@description.height = descriptionSize.height

	_renderDownload: ->
		@download = new ShareLayer
			parent: @info
			y: @date.maxY + 20
			height: 33
			borderRadius: 3
			backgroundColor: "00AAFF"
			html: "Open in Framer"
			style:
				fontWeight: "500"
				textAlign: "center"
				paddingTop: "9px"
				color: "#FFF"

		@_showPointer(@download)

	_checkCanvasSize: ->
		if Canvas.width < @options.hideWidth then @_closeSheet() else @_openSheet()

	_startListening: ->
		# Show regular cursor on sheet
		@sheet.onMouseOver ->
			@style =
				cursor: "default"

		# Toggle sheet when clicked on close or open buttons
		@close.onClick =>
			@options.fixed = true
			@_closeSheet()

		@open.onClick =>
			@options.fixed = true
			@_openSheet()

		# When the window resizes evaluate if the sheet needs to be hidden
		Canvas.onResize =>
			@_checkCanvasSize() if !@fixed

	# Show hand cursor
	_showPointer: (layer) ->
		layer.onMouseOver ->
			@style =
				cursor: "pointer"

	_updateHeight: ->
		@credentials.height = @credentials.contentFrame().height
		@info.height = @info.contentFrame().height
		@sheet.height = @sheet.contentFrame().height + @options.padding

	_closeSheet: ->
		@sheet.visible = false
		@sheet.ignoreEvents = true
		@open.visible = true
		@open.ignoreEvents = false

	_openSheet: ->
		@sheet.visible = true
		@sheet.ignoreEvents = false
		@open.visible = false
		@open.ignoreEvents = true

Utils.delay 0, ->
	context.run ->
		share = new ShareComponent(Framer.Metadata)
