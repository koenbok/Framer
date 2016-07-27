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

		@_checkData()
		@render()
		@_startListening()

	render: ->
		@_renderSheet()
		@_renderToggleButtons()
		@_renderCTA()
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

	_checkData: ->

		# Twitter handle
		if @shareInfo.twitter and @shareInfo.twitter.charAt(0) is "@"
			@shareInfo.twitter = @shareInfo.twitter.substring(1)

		# Truncate title if too long
		if @shareInfo.twitter and @shareInfo.title.length > 26
			@shareInfo.title = @shareInfo.title.substr(0, 25).trim() + "&hellip;"
		else if @shareInfo.title.length > 34
			@shareInfo.title = @shareInfo.title.substr(0, 33).trim() + "&hellip;"

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
			backgroundColor: null
			style:
				backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABGdBTUEAALGPC/xhBQAAAZdJREFUSA2tlt9OgzAUh6UkRrLMCfgnwWwPoXcmBk32Crvfo+1+76A3Jt4SX8Bk8VYBkagJAc+P7CyMUWiHvYCepv2+0p42GNPpdFQUxdV4PH5eLBY/B/9QZrPZYRiGN6ZpvgjAiXm+Wq3u5/P5UV8+4FEU3RH3Isuya4GZU/BpGMZxXwnD8zy3ifflOM6TGQRB5vv+WxzHHiR4I0a7ztfU4bZtPyyXy28TkL4SGRzsUtBH0gbfEuwj6YLvCHQkKvBGgYpEFQ6WgYes4FwgdZFdSOXJZPKYpmmOPOdU5GyRMVoFGFSVEDQRQuTUPEKed8ExfpNFCJoKpzDN+pLgQ+qD057SISrzvGlMtU1UA1kdy7KeedkF9cFgUMj6V9s7v4A3lPbghAamBP+lpRqqnvhWAcN5Q7Esruu+6lwrUkEdzhvKe6IqaRTI4Ly2OpIdQRdcV7IlUIXrSDYCXbiqpBTsC1eRGH3hLMG7eq3w3WV6nndLwanq3VIF1uv17EqS5Ezg14I6fnCe1wfpxvj1wa1LE363LCv4A+knGKYRZVX+AAAAAElFTkSuQmCC')"

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
			backgroundColor: null
			style:
				backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAeCAYAAAAsEj5rAAAABGdBTUEAALGPC/xhBQAAANRJREFUSA2t1dENgjAQBuA7wqsuoEs5hi5Bu4RsoQs4jiygvtceCgRoubZ3f0JI2t5HAy3FtnMGABp/qQRJ0UR7UBMdQS10BmqgK1CKBkEJGgVL0U2wBGXBXBQPN+eoiAsi2OcJDTeu4gYM/f6xzfHeb9OhKXhPBqk6Bc0CU9BskEOLwC20GIyhIjCEisElWlODRv5LCuru8bF+gfFnSrtP2qYVXHcGEK3GLMn4vUNFdPooSugE0nwV0DmogK5BIRoGhSiVx3N5Gzi/kv7qcWTZQ2hivjMmakz6/b3iAAAAAElFTkSuQmCC')"
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
			height: 18
			html: @shareInfo.title or fallbackTitle
			style:
				fontWeight: "500"

		@credentialsTitle.width = @credentials - 50 if @shareInfo.twitter

		# Check what info is available and render layers accordingly
		showAuthor = (content = @shareInfo.author) =>
			@credentials.height = 40
			@credentialsTitle.y = 4

			@credentialsAuthor = new ShareLayer
				parent: @credentials
				html: content
				y: @credentialsTitle.maxY
				height: 18
				style:
					color: "#808080"

			@credentialsAuthor.width = @credentials - 50 if @shareInfo.twitter
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

		date = new Date(@shareInfo.date)
		months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

		@date = new ShareLayer
			parent: @info
			height: 10
			y: verticalPosition + 16
			html: "Shared on #{date.getDate()} #{months[date.getMonth()]} #{date.getFullYear()}"
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

		@descriptionSize = Utils.textSize(
			parseDescription(@shareInfo.description),
			descriptionStyle,
			{width: "#{@description.width}"}
		)

		showFullDescription = =>

			@options.truncated = false

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
			@description.height = @descriptionSize.height
			@description.html = parseDescription(@shareInfo.description)


	_renderButtons: ->
		@buttons = new ShareLayer
			height: 33
			parent: @info
			y: @date.maxY + 20

		@buttonDownload = new Button
			url: @shareInfo.openInFramerURL
			html: "Open in Framer"
			color: "#FFF"
			parent: @buttons
			width: 139
			borderRadius: 3
			backgroundColor: "00AAFF"

		@buttonFacebook = new Button
			url: "https://www.facebook.com/sharer/sharer.php?u=#{window.location.href}"
			parent: @buttons
			borderWidth: 1
			borderColor: "#D5D5D5"
			width: 33
			x: @buttonDownload.maxX + 6
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

		@buttonTwitter = new Button
			url: """
				https://twitter.com/home?status=Check%20out%20my%20design%20made%20in%20%40framerjs%20%E2%80%94%20#{window.location.href}
			"""
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

		if @description and canvasHeight < @sheet.maxHeight and canvasHeight > @sheet.minHeight
			@sheet.height = canvasHeight

			# Make the description scrollable
			verticalSpace = @sheet.height - @cta.height - @credentials.height - @buttons.height - @date.height - 95

			@description.height = verticalSpace
			@description.style.overflow = "scroll"

			@date.y = @description.maxY + 20
			@buttons.y = @date.maxY + 20

		if @description and canvasHeight > @sheet.maxHeight
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

exports.ShareComponent = ShareComponent
