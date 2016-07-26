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
				webkitFontSmoothing: "antialiased";
				webkitUserSelect: "text"
				userSelect: "text"

		@props = _.merge(defaultProps, options)

# Button layer with default behaviour
class Button extends ShareLayer
	constructor: (options) ->
		super options

		defaultProps =
			height: 33
			style:
				fontFamily: "Roboto, Helvetica Neue, Helvetica, Arial, sans-serif"
				fontWeight: "500"
				webkitUserSelect: "text"
				borderRadius: 3
				textAlign: "center"
				paddingTop: "9px"
			width: options.parent.width if options and options.parent

		@props = _.merge(defaultProps, options)

		@onMouseOver ->
			@style.cursor = "pointer"
			@opacity = .9

		@onMouseOut ->
			@opacity = 1

		@onClick -> window.open(options.url)

# Share component
class ShareComponent
	constructor: (@shareInfo) ->

		# When fixed is set to true, the sheet won't hide on resize.
		# This is triggered by a manual open / close action.
		@options =
			padding: 20
			width: 250
			minAvailableSpace: 300
			minAvailableSpaceFullScreen: 500
			fixed: false
			maxDescriptionLength: 135

		@render()
		@_startListening()

	render: ->
		@_renderSheet()
		@_renderToggleButtons()
		@_renderCTA()
		@_renderInfo()
		@_renderDescription() if @shareInfo.description
		@_renderDate()
		@_renderButtons() if !@shareInfo.local

		# Evaluate content and set height accordingly
		@_updateHeight()
		@sheet.minHeight = @sheet.maxHeight

		# Wait until the device screen x position is available
		Utils.delay .1, =>
			@_calculateAvailableSpace()

	# Render main sheet
	_renderSheet: ->
		@sheet = new Layer
			width: @options.width
			clip: true
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
			height: 118

		ctaLogo = new Layer
			parent: @cta
			width: 16
			height: 24
			x: Align.center()
			y: 20
			image: "images/logo.png"

		ctaSlogan = new ShareLayer
			parent: @cta
			y: ctaLogo.y + 36
			height: 30
			html: "Made with Framer"
			style:
				textAlign: "center"
				fontSize: "18px"

		ctaLink = new ShareLayer
			parent: @cta
			y: ctaSlogan.y + 24
			height: 30
			html: "Try it for free now"
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

			@avatar.onImageLoadError =>
				@credentials.x = 0
				@avatar.destroy()

			@avatar.image = "http://tweetimag.es/i/#{@shareInfo.twitter}_o"

			avatarBorder = new ShareLayer
				size: @avatar.width - 2
				point: 1
				parent: @avatar
				borderRadius: 100
				style:
					boxShadow: "0 0 0 1px rgba(0,0,0,.1)"
			@_showPointer(@avatar)

			# If author name isn't available, fallback to Twitter handle
			name = if @shareInfo.author then @shareInfo.author else "@#{@shareInfo.twitter}"
			showAuthor("<a href='http://twitter.com/#{@shareInfo.twitter}' style='text-decoration: none;'>#{name}</a>")

		# If there's no twitter handle, show plain author name
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

		@description = new Layer
			parent: @info
			y: @credentials.maxY + 10
			backgroundColor: null
			style:
				lineHeight: "1.5"
				wordWrap: "break-word"
				color: "#111"

		descriptionStyle =
			fontSize: "14px"
			fontFamily: "Roboto"
			lineHeight: "1.5"
			wordWrap: "break-word"

		showFullDescription = =>

			@options.truncated = false
			@descriptionSize = Utils.textSize(
				parseDescription(@shareInfo.description),
				descriptionStyle,
				{width: "#{@description.width}"}
			)

			@description.height = @descriptionSize.height
			@description.html = parseDescription(@shareInfo.description)

			@date.y = @description.maxY + 16
			@buttons.y = @date.maxY + 20
			@_updateHeight()
			@_calculateAvailableSpace()

			@description.onMouseMove =>
				@description.style =
					cursor: "default"

		if @shareInfo.description.length > @options.maxDescriptionLength

			@options.truncated = true

			truncated = @shareInfo.description.substring(@options.maxDescriptionLength,length).trim()
			@options.shortDescription = truncated + "…"

			@descriptionTruncatedSize = Utils.textSize(
				parseDescription(@options.shortDescription),
				descriptionStyle,
				{width: "#{@description.width}"}
			)

			@description.height = @descriptionTruncatedSize.height
			@description.html = parseDescription(@options.shortDescription)

			@_showPointer(@description)
			@description.onClick -> showFullDescription()

		else
			@description.height = descriptionSize.height
			@description.html = parseDescription(@shareInfo.description)


	_renderButtons: ->
		@buttons = new ShareLayer
			height: 33
			parent: @info
			y: @date.maxY + 20

		@buttonDownload = new Button
			url: "#"
			html: "Open in Framer"
			color: "#FFF"
			parent: @buttons
			width: 139
			borderRadius: 3
			backgroundColor: "00AAFF"

		@buttonFacebook = new Button
			url: "http://www.facebook.com"
			parent: @buttons
			borderWidth: 1
			borderColor: "#D5D5D5"
			width: 33
			x: @buttonDownload.maxX + 6
			style:
				borderRadius: "3px 0 0 3px"

		@buttonFacebookIcon = new Layer
			parent: @buttonFacebook
			image: "images/icon-facebook.png"
			width: 7
			height: 14
			point: Align.center()

		@buttonTwitter = new Button
			url: "http://www.twitter.com"
			parent: @buttons
			borderWidth: 1
			borderColor: "#D5D5D5"
			width: 33
			x: @buttonFacebook.maxX - 1
			style:
				borderRadius: "0 3px 3px 0"

		@buttonTwitterIcon = new Layer
			parent: @buttonTwitter
			image: "images/icon-twitter.png"
			width: 14
			height: 11
			point: Align.center()

	_calculateAvailableSpace: =>
		device = Framer.Device
		threshold = @options.minAvailableSpaceFullScreen
		availableSpace = Canvas.width

		# When device is selected, us the device's
		# position to calculate available space
		if device.deviceType isnt "fullscreen"
			threshold = @options.minAvailableSpace
			availableSpace = Screen.canvasFrame.x

		# Open or close sheet beased on available space
		if availableSpace < threshold and !@options.fixed
			@_closeSheet()
		else
			@_openSheet()

		# If verticalSpace is less then sheet height, make sheet scrollable
		canvasHeight = Canvas.height - 20

		if canvasHeight < @sheet.maxHeight and canvasHeight > @sheet.minHeight
			@sheet.height = canvasHeight

			# Make the description scrollable
			verticalSpace = @sheet.height - @cta.height - @credentials.height - @buttons.height - @date.height - 95

			@description.height = verticalSpace
			@description.style.overflow = "scroll"

			@date.y = @description.maxY + 20
			@buttons.y = @date.maxY + 20

		if canvasHeight > @sheet.maxHeight
			@sheet.height = @sheet.maxHeight
			@description.style.overflow = "visible"

	_startListening: ->
		@_calculateAvailableSpace()

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
			@_calculateAvailableSpace() if !@options.fixed

	# Show hand cursor
	_showPointer: (layer) ->
		layer.onMouseOver ->
			@style =
				cursor: "pointer"

	_updateHeight: ->
		@credentials.height = @credentials.contentFrame().height
		@info.height = @info.contentFrame().height
		@sheet.height = @sheet.contentFrame().height + @options.padding
		@sheet.maxHeight = @sheet.height

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

# Activate Module
Framer.Metadata =
	author: "Eelco Lempsink"
	twitter: "eelco"
	title: "MIDI Controller"
	description: """
		Our goal with Framer has always been to build a full service design tool. So while it’s been possible to view working prototypes on a mobile browser, the experience has been less than seamless.

		Then, our community came to the rescue. Both Frameless by Jay Stakelon and Frames by Rafael Conde set a new standard for mobile viewing of prototypes. Inspired by their work and your feedback, we are now launching an iOS app that fully rounds out your design experience.

		Framer for iOS features live preview, offline use and intuitive sharing features that are protected by secure links. Paired with Framer for Mac, you now have access to a full mobile prototyping toolkit.
	"""
	date: "Jun 14 2016"
	local: false

Utils.delay 0, ->
	context.run ->
		share = new ShareComponent(Framer.Metadata)
