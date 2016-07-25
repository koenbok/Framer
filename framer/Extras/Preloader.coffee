{BaseClass} = require "../BaseClass"
{Context} = require "../Context"

class Preloader extends BaseClass

	constructor: (options={}) ->

		@_media = []
		@_mediaLoaded = []
		@_isLoading = false

		@timeout = 30

		@context = new Context({parent: Framer.CurrentContext, name: "Preloader"})

		@context.run =>

			@cover = new Layer
				frame: @context
				backgroundColor: "white"
				opacity: 0

			@progressIndicator = new CircularProgressComponent
				size: 160
				point: Align.center
				parent: @cover

			@progressIndicator.railsColor = Color.grey(0, 0.1)
			@progressIndicator.progressColor = "rgb(75,169,248)"

			@brand = new Layer
				width: 96
				height: 96
				point: Align.center
				parent: @cover
				backgroundColor: null

			# Set directly via style, to avoid inclusion in the preloader list
			@brand.style["background-image"] = "url('framer/images/preloader-icon.png')"

			do layout = =>
				screen = Framer.Device?.screen
				scale = screen?.frame.width / screen?.canvasFrame.width
				@progressIndicator.scale = scale
				@brand.scale = scale

			Canvas.onResize(layout)

			@start()

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

	addImagesFromContext: (context) ->
		_.pluck(context.layers, "image").map(@addImage)

	addPlayersFromContext: (context) ->
		_.pluck(context.layers, "player").map(@addPlayer)

	addImage: (image) =>
		if image and image not in @_media
			@_media.push(image)
			# We simply count failed images as loaded for now so that we avoid
			# being in some loading state forever.
			Utils.loadImage image, (error) =>
				@_mediaLoaded.push(image)
				@_handleProgress()

	addPlayer: (player) =>
		if player and player.readyState? and player not in @_media
			if player.readyState < 3
				@_media.push(player)
				# Wait until there is enough data for playback to start
				Events.wrap(player).addEventListener "canplay", =>
					@_mediaLoaded.push(player)
					@_handleProgress()

	start: =>

		# A static delay avoids the progress from being shown if the loading
		# took less then the delay. So if all images were cached then we don't
		# hope to see a loading screen at all.
		Utils.delay(0.2, @_start)

	_start: =>

		return if @isLoading

		@_isLoading = true
		@_startTime = Date.now()

		@emit("start")

		# By default we take the image from the prototype and the device
		@addImagesFromContext(Framer.DefaultContext)
		@addImagesFromContext(Framer.CurrentContext)
		@addPlayersFromContext(Framer.DefaultContext)
		@addPlayersFromContext(Framer.CurrentContext)

		# If we don't need any images to be preloaded we can stop
		if not @_media.length
			return @end()

		# Only now show the cover
		@cover.opacity = 1

		# Make sure we always show the prototype after n seconds, even if not
		# all the images managed to load at all.
		Utils.delay(@timeout, @_handleTimeout)

	end: =>
		return unless @isLoading
		@emit("end")
		@_isLoading = false
		@context.destroy()

	_handleProgress: =>
		@emit("progress", @progress)
		@progressIndicator.setProgress(@progress, false)
		@_handleLoaded() if @isReady

	_handleLoaded: ->
		if @time > 0.5
			Utils.delay(0.5, @end)
		else
			@end()

	_handleTimeout: =>
		return unless @isLoading
		console.warn("Preloader timeout, ending")
		@end()

exports.enable = ->
	Framer.Preloader ?= new Preloader()

exports.disable = ->
	return unless Framer.Preloader
	Framer.Preloader.end()
	Framer.Preloader = null

exports.addImage = (url) ->
	Framer.Preloader?.addImage(url)
