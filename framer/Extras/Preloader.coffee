{BaseClass} = require "../BaseClass"
{Context} = require "../Context"

class Preloader extends BaseClass

	constructor: (options={}) ->

		@_media = []
		@_mediaLoaded = []
		@_isLoading = false

		@timeout = 5

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
			@progressIndicator.progressColor = Color.grey(0, 0.8)

			@brand = new Layer
				width: 100
				height: 100
				point: Align.center
				parent: @cover
				backgroundColor: null
				clip: true
			@brand.style["background-image"] = "url('data:image/png;base64,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')"

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
		_.pluck(context.layers, "image").map @addImage

	addPlayersFromContext: (context) ->
		_.pluck(context.layers, "player").map @addPlayer

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

		@_media = []
		@_mediaLoaded = []

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
		@progressIndicator.setProgress(@progress)
		@_handleLoaded() if @isReady

	_handleLoaded: ->
		if @time > 0.5
			Utils.delay(0.5, @end)
		else
			@end()

	_handleTimeout: =>
		return unless @isLoading
		console.error "Preloader timeout, ending"
		@end()

exports.enable = ->
	Framer.Preloader ?= new Preloader()

exports.disable = ->
	return unless Framer.Preloader
	Framer.Preloader.end()
	Framer.Preloader = null

exports.addImage = (url) ->
	Framer.Preloader?.addImage url

exports.addLogo = (layer) ->
	Framer.Preloader?.brand.addChild layer
	Framer.Preloader?.brand.style["background-image"] = null
