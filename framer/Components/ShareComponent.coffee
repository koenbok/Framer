{_} = require "../Underscore"

# Insert Roboto font
css = """
	@font-face {
		font-family: "Roboto";
		font-style: normal;
		font-weight: 400;
		src: local("Roboto"), local("Roboto-Regular"), url("//fonts.gstatic.com/s/roboto/v15/zN7GBFwfMP4uA6AR0HCoLQ.ttf") format("truetype");
	}
	@font-face {
		font-family: "Roboto";
		font-style: normal;
		font-weight: 500;
		src: local("Roboto Medium"), local("Roboto-Medium"), url("//fonts.gstatic.com/s/roboto/v15/RxZJdnzeo3R5zSexge8UUaCWcynf_cDxXwCLxiixG1c.ttf") format("truetype");
	}
"""

Utils.insertCSS(css)

# Share layer with default behaviour
class ShareLayer extends Layer
	constructor: (options) ->
		super options

		defaultProps =
			backgroundColor: null
			ignoreEvents: false
			style:
				fontFamily: "Roboto, Helvetica Neue, Helvetica, Arial, sans-serif"
				textAlign: "left"
				fontSize: "14px"
				color: "#111"
				lineHeight: "1"
				webkitFontSmoothing: "antialiased"

		# If a parent is set, use the parents' width
		if options.parent
			defaultProps.width = options.parent.width

		@props = _.merge(defaultProps, options)

# Button layer with default behaviour
class Button extends ShareLayer
	constructor: (options) ->
		super options

		options = _.defaults options,
			newWindow: true

		defaultProps =
			height: 33
			style:
				fontWeight: "500"
				webkitUserSelect: "text"
				borderRadius: 3
				textAlign: "center"
				paddingTop: "9px"

		@props = _.merge(defaultProps, options)

		@states =
			hover: opacity: .8
			full: opacity: 1
		@animationOptions =
			time: .3

		@onMouseOver ->
			@style.cursor = "pointer"
			@animate("hover")

		@onMouseOut ->
			@animate("full")

		@onTap ->
			if options.shareButton
				window.open(options.url, "Share", "width=560, height=714")
			else
				window.open(options.url, "_blank")

# Share component
class ShareComponent

	constructor: (shareInfo) ->

		@shareInfo = _.clone(shareInfo)

		# Get the project id from the url
		projectId = window.location.pathname.replace(/\//g, "")

		# Set the window title
		document.title = @shareInfo.title

		# When fixed is set to true, the sheet won't hide on resize.
		# This is triggered by a manual open / close action.
		@options =
			padding: 20
			width: 250
			minAvailableSpace: 300
			minAvailableSpaceFullScreen: 500
			maxDescriptionLength: 145
			id: projectId

		# See if a state is set
		@state = localStorage?.getItem("framerShareSheetState-#{@options.id}")
		@options.fixed = if not @state then false else true

		@_checkData()
		@render() unless Utils.isMobile()

	render: ->
		@_renderSheet()
		@_renderCTA()
		@_renderToggleButtons()
		@_renderInfo()
		@_renderDescription() if @shareInfo.description
		@_renderDate() if @shareInfo.openInFramerURL and @shareInfo.date
		@_renderButtons() if @shareInfo.openInFramerURL

		# Evaluate content and set height accordingly
		@_updateHeight()
		@sheet.minHeight = @sheet.maxHeight

		# Wait until the device screen x position is available
		Utils.delay .1, =>
			@_calculateAvailableSpace()

			if @state is "open"
				@_openSheet()
			else if @state is "closed"
				@_closeSheet()
			else
				@_openIfEnoughSpace()

		@_startListening()

	_truncateCredential: (str) ->
		maxLength = 32
		maxLengthWithAvatar = 23

		str = _.escape(str)

		# If an avatar is shown
		if @shareInfo.twitter and str.length > maxLengthWithAvatar
			str = _.truncate(str, {"length": maxLengthWithAvatar})

		else if str.length > maxLength
			str = _.truncate(str, {"length": maxLength})

		return str


	_checkData: ->

		# Remove leading @ from the Twitter handle
		if _.startsWith(@shareInfo.twitter, "@")
			@shareInfo.twitter = _.trimStart(@shareInfo.twitter, "@")

		# Truncate title if too long
		if @shareInfo.title
			@shareInfo.title = @_truncateCredential(@shareInfo.title)

	# Render main sheet
	_renderSheet: ->
		@sheet = new ShareLayer
			width: @options.width
			clip: true
			ignoreEvents: false
			point: 10
			borderRadius: 4
			backgroundColor: "#FFF"
			visible: false
			style:
				boxShadow: "0 0 0 1px rgba(0, 0, 0, .12), 0 1px 3px rgba(0, 0, 0, .08)"

	# Render buttons to open / close sheet
	_renderToggleButtons: ->
		@open = new Layer
			height: 30
			width: 144
			point: @sheet.point
			borderRadius: 4
			backgroundColor: "#FFF"
			visible: false
			style:
				boxShadow: "0 0 0 1px rgba(0, 0, 0, .12), 0 1px 3px rgba(0, 0, 0, .08)"

		openLogo = new Layer
			parent: @open
			width: 10
			height: 15
			backgroundColor: null
			style:
				backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAeCAYAAAAsEj5rAAAABGdBTUEAALGPC/xhBQAAANRJREFUSA2t1dENgjAQBuA7wqsuoEs5hi5Bu4RsoQs4jiygvtceCgRoubZ3f0JI2t5HAy3FtnMGABp/qQRJ0UR7UBMdQS10BmqgK1CKBkEJGgVL0U2wBGXBXBQPN+eoiAsi2OcJDTeu4gYM/f6xzfHeb9OhKXhPBqk6Bc0CU9BskEOLwC20GIyhIjCEisElWlODRv5LCuru8bF+gfFnSrtP2qYVXHcGEK3GLMn4vUNFdPooSugE0nwV0DmogK5BIRoGhSiVx3N5Gzi/kv7qcWTZQ2hivjMmakz6/b3iAAAAAElFTkSuQmCC')"
			y: Align.center(1)
			x: 10

		openLabel = new ShareLayer
			parent: @open
			width: @open - 40
			height: 14
			x: 30
			y: Align.center()
			html: "Made with Framer"
			style:
				fontWeight: "500"
				fontSize: "13px"

		@close = new Layer
			parent: @cta
			ignoreEvents: false
			size: 9
			point: 6
			backgroundColor: null
			style:
				backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABGdBTUEAALGPC/xhBQAAAQxJREFUOBGt09sKgzAMBuB4Qr3Xe0Xf/4kUFXwB0QsFZdvfkWzWahEMuNm1/UjSznl9gh4I9wFDEQIty0J1XdO2bVYbRbRtS9M0yVqB+r5XE1VVXWJAmqahYRgIezgEyrKMoiiieZ7pDGNkHEcKgoDyPGeHBPI8j8qyPMV0pCgKCsNQIOezYHdq6BEyQmbIELjruqoczkRHoB0g/Liuq2o8YyjjCjmFMPGfGcbATJlgDiE9+g5/nygHmznQQ9/3eXj4NkJ6Y22nCfUA6QjKwWPDdpAJwRGjpKurscvoDOFm2O6ZZNR1nfWIdQz/TQ6BkiRRN/XqiLGJsTiOKU1TdswXUmZvvEhGN/YYl74B52DXxksJUvAAAAAASUVORK5CYII=')"

		@_enableUserSelect(@close)
		@_showPointer(@close)
		@_showPointer(@open)

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
			backgroundColor: null
			style:
				backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAwCAYAAABwrHhvAAAABGdBTUEAALGPC/xhBQAAAShJREFUWAnF2MsNwjAMBmCngiPMgdiGMWAJ0iXoGB2APRALsACcAImAoaLqO3Fi21LU0+98iSKlrSkuzgLA/jNUyuCsmogvQBPxB2ghGgANRAcgjegFSCIGAVKIUYAEYhLAjfACcCK8AVyIIAAHIhiQGkECpESQAakQZlU+HDajVgYmP23mlp6nJqvcC9x+XT71AOiIQWTVQqIfVEQyAHUnkgIoiOSAUAQLIATBBvBFsAJ8EOyAKYQIYAwhBhhCiAL6EOKANiL6OsaG1MKrfHY+3nNwjv5/oFhGvdRkcFhYMCanriI29zsDioj6ECohagDupQKiCVBAdAHCiH6AIGIYIIQYBwggpgHMCD8AI8IfwIQIAzAhsG147W4WtteoL+vwSdsJRETWGylMpVP7hSF+AAAAAElFTkSuQmCC')"

		ctaSlogan = new ShareLayer
			parent: @cta
			y: ctaLogo.y + 36
			height: 30
			html: "Made with Framer"
			style:
				textAlign: "center"
				fontSize: "18px"

		@_enableUserSelect(ctaSlogan)

		ctaLink = new Button
			url: "http://framerjs.com/?utm_source=share.framerjs.com&utm_medium=banner&utm_campaign=product"
			parent: @cta
			y: ctaSlogan.y + 24
			height: 16
			width: 120
			x: Align.center()
			html: "Try it for free now"
			style:
				textAlign: "center"
				color: "#00AAFF"
				padding: 0

	# Render info section
	_renderInfo: ->
		@info = new ShareLayer
			parent: @sheet
			width: @sheet.width - (@options.padding * 2)
			y: @cta.maxY + 20
			x: 20

		@credentials = new ShareLayer
			parent: @info
			height: 16

		# If we miss a title from the json metadata, we fallback to the document url
		fallbackTitle = _.replace(FramerStudioInfo?.documentTitle, /\.framer$/, "")

		@credentialsTitle = new ShareLayer
			parent: @credentials
			height: 18
			html: @shareInfo.title or fallbackTitle
			style:
				fontWeight: "500"
				overflow: "hidden"
				whiteSpace: "nowrap"
				lineHeight: "1.3"

		@_enableUserSelect(@credentialsTitle)
		@credentialsTitle.width = @credentials - 50 if @shareInfo.twitter

		# Check what info is available and render layers accordingly
		showAuthor = (content = @shareInfo.author) =>
			@credentials.height = 40
			@credentialsTitle.y = 3

			@credentialsAuthor = new ShareLayer
				parent: @credentials
				html: content
				y: @credentialsTitle.maxY
				height: 18
				style:
					color: "#808080"
					overflow: "hidden"
					whiteSpace: "nowrap"
					lineHeight: "1.3"

			@_enableUserSelect(@credentialsAuthor)
			@credentialsAuthor.width = @credentials - 50 if @shareInfo.twitter
			@_showPointer(@credentialsAuthor)

		# Check if avatar is available
		if @shareInfo.twitter
			@credentials.x = 50

			@avatar = new Button
				url: "https://twitter.com/#{@shareInfo.twitter}"
				size: 40
				parent: @info
				borderRadius: 100

			@avatar.onImageLoadError =>
				@credentials.x = 0
				@avatar.destroy()

			@avatar.image = "https://twitter.com/#{@shareInfo.twitter}/profile_image?size=bigger"

			avatarBorder = new ShareLayer
				size: @avatar.width - 2
				point: 1
				parent: @avatar
				borderRadius: 100
				style:
					boxShadow: "0 0 0 1px rgba(0, 0, 0, .1)"

			# If author name isn't available, fallback to Twitter handle
			name = if @shareInfo.author then @shareInfo.author else "@#{@shareInfo.twitter}"
			name = @_truncateCredential(name)

			showAuthor("<a href='http://twitter.com/#{@shareInfo.twitter}' style='text-decoration: none; -webkit-user-select: auto;' target='_blank'>#{name}</a>")

			@credentialsTitle.width = 155
			@credentialsAuthor?.width = 155

		# If there's no twitter handle, show plain author name
		if @shareInfo.author and not @shareInfo.twitter
			showAuthor(@_truncateCredential(@shareInfo.author))

	_renderDate: ->

		verticalPosition = if @description then @description.maxY else @credentials.maxY

		date = new Date(@shareInfo.date)
		months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

		@date = new ShareLayer
			parent: @info
			height: 10
			y: verticalPosition + 12
			html: "Shared on #{date.getDate()} #{months[date.getMonth()]} #{date.getFullYear()}"
			style:
				textTransform: "uppercase"
				fontSize: "11px"
				color: "#999"
				letterSpacing: ".2px"

	_enableUserSelect: (layer) ->
		layer.html = "" unless layer.html
		layer._elementHTML.style["-webkit-user-select"] = "auto"
		layer._elementHTML.style["cursor"] = "auto"

	_renderDescription: ->

		# See if there are any urls in the description and wrap them in anchor tags. Make sure linebreaks are wrapped in <br/ >'s.'
		parseDescription = (text) ->
			urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
			httpRegex = /^((http|https):\/\/)/
			lineBreakRegex = /(?:\r\n|\r|\n)/g
			removeAllTagsExceptBreaks = /<(?!br\s*\/?)[^>]+>/g

			text = _.escape(text)
			text = _.trimEnd(text)
			text = text.replace(lineBreakRegex, "<br>")

			urlified = text.replace urlRegex, (url) ->
				href = url
				href = "//#{url}" if not httpRegex.test(url)
				return "<a href='#{href}' style='-webkit-user-select: auto' target='_blank'>#{url}</a>"

		@description = new ShareLayer
			parent: @info
			y: @credentials.maxY + 10
			style:
				lineHeight: "1.5"
				wordWrap: "break-word"
				color: "#111"

		descriptionStyle =
			fontSize: "14px"
			fontFamily: "Roboto, Helvetica Neue, Helvetica, Arial, sans-serif"
			lineHeight: "1.5"
			wordWrap: "break-word"

		@descriptionSize = Utils.textSize(
			parseDescription(@shareInfo.description),
			descriptionStyle,
			{width: "#{@description.width}"}
		)

		showFullDescription = =>
			@options.truncatedDescription = false
			@description.height = @descriptionSize.height
			@description.html = parseDescription(@shareInfo.description)

			if @shareInfo.openInFramerURL
				@date?.y = @description.maxY + 12
				@buttons.y = (if @date then @date else @description).maxY + 18

			@_updateHeight()
			@_calculateAvailableSpace()
			@_enableUserSelect(@description)

		# Truncate if description is too long
		if @shareInfo.description.length > @options.maxDescriptionLength
			@options.truncatedDescription = true
			@options.shortDescription = _.truncate(@shareInfo.description, {"length": @options.maxDescriptionLength, "separator": " "})

			@descriptionTruncatedSize = Utils.textSize(
				parseDescription(@options.shortDescription),
				descriptionStyle,
				{width: "#{@description.width}"}
			)

			@description.height = @descriptionTruncatedSize.height
			@description.html = parseDescription(@options.shortDescription)

			@description.once(Events.TapEnd, showFullDescription)
			@_showPointer(@description)

		else
			@description.height = @descriptionSize.height
			@description.html = parseDescription(@shareInfo.description)
			@_enableUserSelect(@description)

	_renderButtons: ->

		if @date
			verticalPosition = @date.maxY
		else if @descripion
			verticalPosition = @descripion.maxY
		else
			verticalPosition = @credentials.maxY

		@buttons = new ShareLayer
			height: 33
			parent: @info
			y: verticalPosition + 16

		@buttonOpen = new Button
			url: @shareInfo.openInFramerURL
			newWindow: false
			html: "Open in Framer"
			color: "#FFF"
			parent: @buttons
			width: 139
			borderRadius: 3
			backgroundColor: "00AAFF"

		@buttonFacebook = new Button
			shareButton: true
			url: "https://www.facebook.com/sharer/sharer.php?u=#{window.location.href}"
			parent: @buttons
			borderWidth: 1
			borderColor: "#D5D5D5"
			width: 33
			x: @buttonOpen.maxX + 6
			style:
				borderRadius: "3px 0 0 3px"

		@buttonFacebookIcon = new Layer
			parent: @buttonFacebook
			width: 7
			height: 14
			point: Align.center()
			backgroundColor: null
			style:
				backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAABGdBTUEAALGPC/xhBQAAAO1JREFUOBFjZMABWltbJX///l0GlDYAYg1GRkZxIP3n////P4E0EyOQwABNTU05QAVtQMyLIQkVwNDY3Nzs9vfv3524NMDEmWAMED1z5kyuf//+zUEWw8VG0fjq1SsnoPNkcSlGFmdB5gA16SHzQWxgoPxnZma2UVNTOxkWFvYXJo+uUQwmAaOBhn2tqak5BuPDaBSnAhXJwySQaB4kNpyJohEoqgCXIcAgWyNjQ0PDfwKGY0gDA+w5uo0YirAJAMPiLFkagTaeIUsjExMTeTaCNGIkcmyBBRTDUEeWU0EBNqoRW7KBio0GDi0CBwAHJ0YrwGtXbwAAAABJRU5ErkJggg==')"

		# Generate tweet
		tweet = ""

		if @shareInfo.twitter or @shareInfo.author
			if @shareInfo.twitter
				tweet += "A prototype by @#{@shareInfo.twitter}. Design without limitations in @framerjs — "
			else if @shareInfo.author
				tweet += "A prototype by #{@shareInfo.author}. Design without limitations in @framerjs — "
			else
				tweet += "A @framerjs prototype by @#{@shareInfo.author}. Design without limitations — "

		tweet += window.location.href
		tweet = encodeURIComponent(tweet)

		@buttonTwitter = new Button
			shareButton: true
			url: "https://twitter.com/home?status=#{tweet}"
			parent: @buttons
			borderWidth: 1
			borderColor: "#D5D5D5"
			width: 33
			x: @buttonFacebook.maxX - 1
			style:
				borderRadius: "0 3px 3px 0"

		@buttonTwitterIcon = new Layer
			parent: @buttonTwitter
			width: 14
			height: 11
			point: Align.center()
			backgroundColor: null
			style:
				backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAWCAYAAADTlvzyAAAABGdBTUEAALGPC/xhBQAAAr5JREFUSA2tlUloU1EUhpuhITFCAnUTR1zVgsQUF1pw4UbETUAq7tTiogUDKkiJSUjaTBvdFCliF5KVazdKigu3BYsjlEIcIOKEEgewTVoz+J2HCa8378UOuXC494z/O+e8e4+lZ4srk8kcq1arVywWyxChvI1Go8g573Q6p8Lh8IdmeOyO1uv1vZamYDN7MpnMABDB16r6A1qGLlut1gIfFOfsHhgYOK4BplKpq6APut3uS+Pj40uqsxGPzyg+M0Y6VQbYS4CHsfc3v+w5RueXl5efEuiw6qDy6XR6P5lNqXIT/hW2c4Dle3t7FzRA0N+JMYp+FE8mJydz1HyXSQCxOwe5zPSK3E+Gw9CFaDRa0AAB2a0zEtkIdS/Qo9tGGQN2Vmff8QjQfX6gQCKRmBNDrYe5XM5ZLBY/w3tNvF/g+BDdPM7zlUplGtDTJrZrxD6fzzE2NvanKbTLoVQqbaesN8k021QoewCAgMjK5bKi6syurKxI6VuAWkkR7iTgGRSPO7tvXEs1tum9tAwdDscXeuZHYdMru3Be9Xg8JX0cLUPu3lcyzOsV3TjT90V9/ySmBqgdrNbr7K2nSGRdWM/UGC1AftsFl8t1BINpvuytarhJ/p7q1wIUBY/tJzbpZVX4La4CSbT9hGsABYDsluhn/xbBJM4NqKHGaQPkPsqo+aUabpB/NDExcdfIpw0wHo+/ttlshzC+A72Bfhs5dpB9t9vtF830HechD/g+7uctnINmAfRyKvMNOknvZPoYLkNAgPbUarVreIzSz3VNBYA+0o4TVGjREOmf0MI0GMT4J7yDtzQIQBB+iH29r04d+xleq1gkEvnRCUx08rStks0Iu4ycA5DMO9n+tyoYzDJU07FYrO2CmzmvKWk2m/XTs1MAymQ4CO2AvGQgr73cUaH38LN9fX0PQqHQRn+onr9RuQfzn9jjeAAAAABJRU5ErkJggg==')"


	_openIfEnoughSpace: =>
		# Open or close sheet based on available space
		if @availableSpace < @threshold and not @options.fixed
			@_closeSheet()
		else
			@_openSheet()

	_calculateAvailableSpace: _.debounce ->
		@__calculateAvailableSpace()
	, 100, {maxWait: 100}

	__calculateAvailableSpace: =>
		device = Framer.Device
		@threshold = @options.minAvailableSpaceFullScreen
		@availableSpace = Canvas.width

		# When device is selected, us the device's
		# position to calculate available space
		if device.deviceType isnt "fullscreen"
			@threshold = @options.minAvailableSpace
			@availableSpace = Screen.canvasFrame.x

		# If verticalSpace is less then sheet height, make sheet scrollable
		canvasHeight = Canvas.height - @options.padding

		if @description and canvasHeight < @sheet.maxHeight and canvasHeight > @sheet.minHeight
			@sheet.height = canvasHeight

			# Make the description scrollable
			verticalSpace = @sheet.height - @cta.height - @credentials.height

			if @shareInfo.openInFramerURL
				verticalSpace -= @buttons.height
				verticalSpace -= @date.height
				verticalSpace -= 95
			else
				verticalSpace -= 36

			@description.height = verticalSpace
			@description.style.overflow = "scroll"

			if @shareInfo.openInFramerURL
				@date.y = @description.maxY + 12
				@buttons.y = @date.maxY + 18

		if @description and canvasHeight > @sheet.maxHeight
			@sheet.height = @sheet.maxHeight

			if @options.truncatedDescription
				@description.height = @descriptionTruncatedSize.height
			else
				@description.height = @descriptionSize.height

			@description.style.overflow = "visible"

			if @shareInfo.openInFramerURL
				@date.y = @description.maxY + 12
				@buttons.y = @date.maxY + 18


	_startListening: ->
		@_calculateAvailableSpace()

		# Show regular cursor on sheet
		@sheet.onMouseOver ->
			@style =
				cursor: "default"

		@close.onClick =>
			@_closeSheet()
			@options.fixed = true
			localStorage?.setItem("framerShareSheetState-#{@options.id}", "closed")

		# Disable events propagating up to block unintented interactions
		@sheet.onTouchStart (event) -> event.stopPropagation()
		@sheet.onTouchEnd (event) -> event.stopPropagation()
		@sheet.onTouchMove (event) -> event.stopPropagation()

		@open.onClick (event) =>
			event.stopPropagation()
			@_openSheet()
			@options.fixed = true
			localStorage?.setItem("framerShareSheetState-#{@options.id}", "open")

		# When the window resizes evaluate if the sheet needs to be hidden
		Canvas.onResize =>
			@_calculateAvailableSpace()
			@_openIfEnoughSpace() unless @options.fixed

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

exports.ShareComponent = ShareComponent
