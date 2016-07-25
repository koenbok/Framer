context = new Framer.Context({name: "Sharing"})
Canvas.backgroundColor = "#00AAFF"

# Info
shareInfo =
	name: "Jonas Treub"
	twitter: "jonastreub"
	title: "Medium App"
	description: """
		Here's a new Framer example. It's a little grid of photos, which you can scroll, click and pinch to zoom. Made to highlight some of our latest 		features: scroll and click separation, pinchable layers, event shortcuts and more.
		"""

# Sheet
class ShareComponent

	constructor: ->
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
		
	_renderCTA: ->
		@cta = new Layer
			width: @sheet.width
			superLayer: @sheet
			backgroundColor: null
			style:
				borderBottom: "1px solid #E8E8E8"
			height: 130
			
		ctaLogo = new Layer
			superLayer: @cta
			width: 16
			height: 24
			x: Align.center()
			y: 25
			image: "images/logo.png"
			
		ctaSlogan = new Layer
			superLayer: @cta
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
			superLayer: @cta
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
			

context.run ->
	share = new ShareComponent

