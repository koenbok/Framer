context = new Framer.Context({name: "Sharing"})
# Canvas.backgroundColor = "#00AAFF"

# Info
shareInfo =
	author: "Jorn van Dijk"
	twitter: "jornvandijk"
	title: "Android Tabs"
	description: """
		Here's a new Framer example. It's a little grid of photos, which you can scroll, click and pinch to zoom. Made to highlight some of our latest 		features: scroll and click separation, pinchable layers, event shortcuts and more.
		"""

class ShareLayer extends Layer
	constructor: (options) ->
		super options
			
		defaultProps =
			backgroundColor: null
			width: options.parent.width if options.parent
			style:
				fontFamily: "Roboto"
				fontSize: "14px"
				color: "#111"
		
		mergedProps = _.merge(defaultProps, options)
		@props = mergedProps

# Sheet
class ShareComponent

	constructor: (@shareInfo) ->
		@render()
		@opened = true
		
	render: ->
		@sheet = new Layer
			width: 250
			x: 10
			y: 10
			borderRadius: 4
			backgroundColor: "#FFF"
			style:
				boxShadow: "0 0 0 1px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08)"
		
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
				
		@closeLogo = new Layer
			parent: @framerButton
			width: 10
			height: 15
			image: "images/logo-button.png"
			y: Align.center(1)
			x: Align.center
			
		@_renderCTA()
		@info = new ShareInfo(@shareInfo, @sheet, @cta.maxY)
		
		# Set height based on children
		@sheet.height = @sheet.contentFrame().height + 100
		
		@sheet.onMouseOver ->
			@style =
				cursor: "default"
				pointerEvents: "all"
				
		@close.onClick => @_closeSheet()
		@framerButton.onClick => @_openSheet()
		
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
			
class ShareInfo
	constructor: (@info, @shareSheet, @positionY) ->
		@render()
		 
	render: ->
		shareInfo = new Layer
			parent: @shareSheet
			width: @shareSheet.width-40
			backgroundColor: null
			y: @positionY
			x: 20
			
		credentials = new Layer
			parent: shareInfo
			width: shareInfo.width
			y: 22
			backgroundColor: null

		credentialsAvatar = new Layer
			size: 40
			parent: credentials
			backgroundColor: "00AAFF"
			borderRadius: 100
			image: "http://img.tweetimag.es/i/#{@info.twitter}_n"
			backgroundColor: null
			
		credentialsAvatarBorder = new Layer
			width: credentialsAvatar.width - 2
			height: credentialsAvatar.width - 2
			x: 1
			y: 1
			parent: credentialsAvatar
			borderRadius: 100
			backgroundColor: null
			style:
				boxShadow: "0 0 0 1px rgba(0,0,0,.1)"
			
		credentialsTitle = new Layer
			parent: credentials
			width: credentials.width - 50
			height: 18
			backgroundColor: null
			y: 4
			x: 50
			html: @info.title
			style:
				fontFamily: "Roboto"
				fontSize: "14px"
				fontWeight: "500"
				color: "#111"
				lineHeight: "1"
				
		credentialsAuthor = new ShareLayer
			parent: credentials
			width: credentials.width - 50
			x: 50
			height: 18
			y: credentialsTitle.maxY
			html: "<a href='http://twitter.com/#{@info.twitter}' style='text-decoration: none'>#{@info.author}</a>"
			style:
				lineHeight: "1"
				color: "#808080"
		
		credentialsAuthor.onMouseOver ->
			@style =
				cursor: "pointer"
		
		credentials.height = credentials.contentFrame().height
				
		# Description
		description = new ShareLayer
			parent: shareInfo
			y: credentials.maxY + 10
			html: @info.description
			style:
				lineHeight: "1.5"
				
		descriptionTextSize = Utils.textSize(@info.description, {fontSize: "14px", fontFamily: "Roboto", lineHeight: "1.5"}, {width: "#{description.width}"})
		
		description.height = descriptionTextSize.height
		shareInfo.height = shareInfo.contentFrame().height
		
		download = new ShareLayer
			parent: shareInfo
			y: description.maxY + 20
			height: 33
			borderRadius: 3
			backgroundColor: "00AAFF"
			html: "Open in Framer"
			style:
				fontWeight: "500"
				textAlign: "center"
				paddingTop: "2px"
				color: "#FFF"
				
		download.onMouseOver ->
			@style = 
				cursor: "pointer"
			

context.run ->
	share = new ShareComponent(shareInfo)
