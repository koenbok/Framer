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

# Sheet
class ShareComponent

	constructor: (@shareInfo) ->
		@render()
		
	render: ->
		@sheet = new Layer
			width: 250
			x: 10
			y: 10
			borderRadius: 4
			backgroundColor: "#FFF"
			style:
				boxShadow: "0 0 0 1px rgba(0,0,0,.1), 0 1px 1px rgba(0,0,0,.08)"
		
		@_renderCTA()
		@info = new ShareInfo(@shareInfo, @sheet, @cta.maxY)
		
		# Set height based on children
		@sheet.height = @sheet.contentFrame().height
		
	_renderCTA: ->
		@cta = new Layer
			width: @sheet.width
			parent: @sheet
			backgroundColor: null
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
			
		ctaSlogan = new Layer
			parent: @cta
			y: ctaLogo.y + 35
			width: @cta.width
			height: 30
			backgroundColor: null
			html: "Start prototyping today"
			style:
				textAlign: "center"
				color: "#111"
				fontSize: "18px"
				fontFamily: "Roboto"
				fontWeight: "400"
				
		ctaLink = new Layer
			parent: @cta
			y: ctaSlogan.y + 24
			width: @cta.width
			height: 30
			backgroundColor: null
			html: "Try Framer for Free"
			style:
				textAlign: "center"
				color: "#111"
				fontSize: "14px"
				color: "#00AAFF"
				fontFamily: "Roboto"
				fontWeight: "400"
			

class ShareInfo
	constructor: (@info, @shareSheet, @positionY) ->
		@_validateInfo()
		@render()
		 
	render: ->
		
		# Check if an avatar needs to be rendered
		# Twitter avatar link --> https://pbs.twimg.com/profile_images/2284174872/7df3h38zabcvjylnyfe3_bigger.png
		
		shareInfo = new Layer
			parent: @shareSheet
			width: @shareSheet.width-40
			backgroundColor: null
			y: @positionY
			x: 20
			
		credentials = new Layer
			parent: shareInfo
			width: shareInfo.width
			y: 30
			backgroundColor: null

		credentialsAvatar = new Layer
			size: 40
			parent: credentials
			backgroundColor: "00AAFF"
			borderRadius: 100
			image: "http://img.tweetimag.es/i/#{@info.twitter}_n"
			backgroundColor: null
			
		credentialsAvatarBorder = new Layer
			size: credentialsAvatar.size
			point: credentialsAvatar.point
			parent: credentials
			borderRadius: 100
			backgroundColor: null
			style:
				boxShadow: "0 0 0 1px rgba(0,0,0,.1)"
			
		credentialsTitle = new Layer
			parent: credentials
			width: credentials.width - 50
			height: 20
			backgroundColor: null
			y: 4
			x: 50
			html: @info.title
			style:
				fontFamily: "Roboto"
				fontSize: "16px"
				fontWeight: "500"
				color: "#111"
				lineHeight: "1"
				
		credentialsAuthor = new Layer
			backgroundColor: "null"
			parent: credentials
			width: credentials.width - 50
			x: 50
			height: 18
			y: credentialsTitle.maxY
			html: @info.author
			style:
				fontSize: "14px"
				lineHeight: "1"
				color: "#808080"
			
		credentials.height = credentials.contentFrame().height
				
		
	_validateInfo: ->

context.run ->
	share = new ShareComponent(shareInfo)

