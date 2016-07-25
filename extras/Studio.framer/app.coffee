# Info Fixture
Framer.Metadata =
	author: "Jorn van Dijk"
	twitter: "jornvandijk"
	title: "Android Tabs"
	description: """
		Here's a new Framer example. It's a little grid of photos, which you can scroll, click and pinch to zoom. Made to highlight some of our latest 		features: scroll and click separation, pinchable layers, event shortcuts and more.
		"""

# Setup
context = new Framer.Context({name: "Sharing"})

# Share layer with default behaviour
class ShareLayer extends Layer
	constructor: (options) ->
		super options
			
		defaultProps =
			backgroundColor: null
			width: options.parent.width if options.parent
			style:
				fontFamily: "Roboto, Helvetica Neue, Helvetica, Arial, sans-serif"
				fontSize: "14px"
				color: "#111"
				webkitUserSelect: "text"
		
		mergedProps = _.merge(defaultProps, options)
		@props = mergedProps

# Sheet
class ShareComponent

	constructor: (@shareInfo) ->
		@render()
		@_startListening()
			
	render: ->		
		@_renderSheet()
		@_renderToggleButtons()
		@_renderCTA()
		@_renderInfo()
		@_renderDescription()
		@_renderDownload()
		
		# Evaluate content and set height accordingly
		@_updateHeight()		
		
	# Render main sheet
	_renderSheet: ->
		@sheet = new Layer
			width: 250
			x: 10
			y: 10
			borderRadius: 4
			backgroundColor: "#FFF"
			style:
				boxShadow: "0 0 0 1px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08)"
	
	# Render buttons to open / close sheet
	_renderToggleButtons: ->
		@close = new Layer
			parent: @sheet
			width: 12
			height: 12
			x: 12
			y: 12
			image: "images/close.png"
			
		@framerButton = new Layer
			size: 30
			point: @sheet.point
			borderRadius: 4
			backgroundColor: "#FFF"
			visible: false
			style:
				boxShadow: "0 0 0 1px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08)"
				
		framerButtonLogo = new Layer
			parent: @framerButton
			width: 10
			height: 15
			image: "images/logo-button.png"
			y: Align.center(1)
			x: Align.center
	
	# Render CTA section
	_renderCTA: ->
		@cta = new ShareLayer
			parent: @sheet
			style:
				borderBottom: "1px solid #E8E8E8"
			height: 130
			
		ctaLogo = new Layer
			parent: @cta
			width: 16
			height: 24
			x: Align.center()
			y: 25
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
			width: @sheet.width-40
			y: @cta.maxY + 22
			x: 20

		@credentials = new ShareLayer
			parent: @info
			height: 16
				
		@credentialsTitle = new ShareLayer
			parent: @credentials
			width: @credentials.width - 50
			height: 18
			html: @shareInfo.title
			style:
				fontWeight: "500"
				lineHeight: "1"
				
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
					lineHeight: "1"
					color: "#808080"
					
			@_showPointer(@credentialsAuthor)
		
		# Check if avatar is available
		if @shareInfo.twitter
			@credentials.x = 50
		
			@avatar = new ShareLayer
				size: 40
				parent: @info
				borderRadius: 100
				image: "http://img.tweetimag.es/i/#{@shareInfo.twitter}_n"
			
			avatarBorder = new ShareLayer
				width: @avatar.width - 2
				height: @avatar.width - 2
				point: 1
				parent: @avatar
				borderRadius: 100
				style:
					boxShadow: "0 0 0 1px rgba(0,0,0,.1)"
			
			# See if author name is available, otherwise fallback to Twitter handle
			showAuthor(if @shareInfo.author then @shareInfo.author else "@#{@shareInfo.twitter}")
			
			@_showPointer(@avatar)
			
		if @shareInfo.author and !@shareInfo.twitter
			showAuthor(@shareInfo.author)
				
	_renderDescription: ->
		@description = new ShareLayer
			parent: @info
			y: @credentials.maxY + 10
			html: @shareInfo.description
			style:
				lineHeight: "1.5"
				
		descriptionTextSize = Utils.textSize(@shareInfo.description, {fontSize: "14px", fontFamily: "Roboto", lineHeight: "1.5"}, {width: "#{@description.width}"})
		
		@description.height = descriptionTextSize.height

	_renderDownload: ->
		@download = new ShareLayer
			parent: @info
			y: @description.maxY + 20
			height: 33
			borderRadius: 3
			backgroundColor: "00AAFF"
			html: "Open in Framer"
			style:
				fontWeight: "500"
				textAlign: "center"
				paddingTop: "2px"
				color: "#FFF"
				
		@_showPointer(@download)
				
	_startListening: ->
		# Show regular cursor on sheet
		@sheet.onMouseOver ->
			@style =
				cursor: "default"
		
		# Toggle sheet
		@close.onClick => @_closeSheet()
		@framerButton.onClick => @_openSheet()
	
	_showPointer: (layer) ->
		layer.onMouseOver ->
			@style = 
				cursor: "pointer"
				
	_updateHeight: ->
		@credentials.height = @credentials.contentFrame().height
		@info.height = @info.contentFrame().height
		@sheet.height = @sheet.contentFrame().height + 25
				
	_closeSheet: ->
		@sheet.visible = false
		@sheet.ignoreEvents = true
		@framerButton.visible = true
		@framerButton.ignoreEvents = false
		
	_openSheet: ->
		@sheet.visible = true
		@sheet.ignoreEvents = false
		@framerButton.visible = false
		@framerButton.ignoreEvents = true	

Utils.delay 0, ->
	context.run ->
		share = new ShareComponent(Framer.Metadata)
