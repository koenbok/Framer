{BaseClass} = require "../BaseClass"
{Context} = require "../Context"

class Preloader extends BaseClass

	constructor: (options={}) ->

		@_media = []
		@_mediaLoaded = []
		@_isLoading = false

		@timeout = 30

		@start()

	setupContext: ->
		@context = new Context({name: "Preloader"})
		@context.run(@_setupContext)

	@define "progress",
		get: -> @_mediaLoaded.length / @_media.length or 0

	@define "time",
		get: -> (Date.now() - @_startTime) / 1000

	@define "isLoading",
		get: -> @_isLoading

	@define "isReady",
		get: ->
			return false if not @isLoading
			return @_mediaLoaded.length is @_media.length

	setLogo: (url) =>
		@_logo = url
		# Set directly via style, to avoid inclusion in the preloader list
		@brand.style["background-image"] = "url('#{url}')" if @brand

	addImagesFromContext: (context) ->
		_.map(context.layers, "image").map(@addImage)

	addPlayersFromContext: (context) ->
		_.map(context.layers, "player").map(@addPlayer)

	addImage: (image) =>
		return if image instanceof Gradient
		if image and image not in @_media
			@_media.push(image)
			# We simply count failed images as loaded for now so that we avoid
			# being in some loading state forever.
			Utils.loadImage image, (error) =>
				@_mediaLoaded.push(image)
				@_handleProgress()

	addPlayer: (player) =>
		return unless player and player not in @_media
		return unless player.src? and player.getAttribute('src') isnt "undefined"
		return unless player.readyState? and player.readyState < 3
		# … else
		@_media.push(player)
		# Wait until there is enough data for playback to start playing
		Events.wrap(player).addEventListener "canplaythrough", =>
			@_mediaLoaded.push(player)
			@_handleProgress()

	start: =>
		return if @isLoading

		@_isLoading = true
		@_startTime = Date.now()

		@emit("start")
		@setupContext()

		# We need a little delay for the contexts to build up so we can
		# actually find the images in it.
		Utils.delay(0.2, @_start)

	_start: =>

		# Another bit of delay to find out if the images are already cached
		# so we avoid a mini flickr of the progress indicator.
		Utils.delay 0.2, =>
			@progressIndicator.visible = true
			@brand.visible = true

		# By default we take the image from the prototype and the device
		@addImagesFromContext(Framer.DefaultContext)
		@addImagesFromContext(Framer.CurrentContext)
		@addPlayersFromContext(Framer.DefaultContext)
		@addPlayersFromContext(Framer.CurrentContext)

		# If we don't need any images to be preloaded we can stop
		if not @_media.length
			return @end()

		# Make sure we always show the prototype after n seconds, even if not
		# all the images managed to load at all.
		Utils.delay(@timeout, @_handleTimeout)

	end: =>
		return unless @isLoading
		@_end()

	_end: (animated=true) =>

		Framer.DefaultContext.visible = true

		finalize = =>
			@emit("end")
			@_isLoading = false
			@context?.destroy()

		if @progressIndicator?.visible and animated
			@cover?.animate
				properties: {opacity: 0}
				time: 0.13
			@cover.onAnimationDidEnd(finalize)
		else
			finalize()

	_handleProgress: =>
		@emit("progress", @progress)
		@progressIndicator?.setProgress(@progress)
		@_handleLoaded() if @isReady

	_handleLoaded: ->
		if @time > 0.5
			Utils.delay(0.2, @end)
		else
			@end()

	_handleTimeout: =>
		return unless @isLoading
		console.warn("Preloader timeout, ending")
		@end()

	_setupContext: =>

		@cover = new Layer
			frame: Canvas
			backgroundColor: "white"

		@progressIndicator = new CircularProgressComponent
			size: 160
			point: Align.center
			parent: @cover
			visible: false

		@progressIndicator.railsColor = Color.grey(0, 0.1)
		@progressIndicator.progressColor = "rgb(75, 169, 248)"
		@progressIndicator.setProgress(@progress)

		@brand = new Layer
			size: 96
			parent: @cover
			backgroundColor: null
			visible: false
			style:
				backgroundSize: "50%"

		# We display it a tad larger on mobile
		if Utils.isMobile()
			@progressIndicator.scale = 1.25
			@brand.scale = 1.25

		if @_logo
			@setLogo(@_logo)
		else
			# Use the online logo, make sure we don't use the file:// protocol
			logoUrl = "//resources.framerjs.com/static/images/preloader/framer-logo.png"
			logoUrl = "http:" + logoUrl if _.startsWith(window.location.href, "file://")
			@setLogo(logoUrl)

		do layout = =>
			@cover.frame = Canvas
			@progressIndicator.point = Align.center
			@brand.x = Align.center
			@brand.y = Align.center(2)

		Canvas.onResize(layout)

exports.enable = ->
	Framer.Preloader ?= new Preloader()

exports.disable = ->
	return unless Framer.Preloader
	Framer.Preloader._end(false)
	Framer.Preloader = null

exports.addImage = (url) ->
	Framer.Preloader?.addImage(url)

exports.setLogo = (url) ->
	Framer.Preloader?.setLogo(url)
