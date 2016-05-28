{BaseClass} = require "../BaseClass"
{Context} = require "../Context"

class Preloader extends BaseClass

	constructor: (options={}) ->

		@_images = []
		@_imagesLoaded = []
		@_isLoading = false
		
		@timeout = 5

		@context = new Context({name: "Preloader"})

		@context.run =>

			@cover = new Layer
				backgroundColor: "white"

			@progressIndicator = new CircularProgressComponent
				size: 160
				parent: @cover

			@progressIndicator.railsColor = Color.grey(0, 0.1)
			@progressIndicator.progressColor = Color.grey(0, 0.8)

			do layout = =>
				@cover.frame = Canvas
				@progressIndicator.point = Align.center

			Canvas.onResize(layout)

			@start()

	@define "progress",
		get: -> @_imagesLoaded.length / @_images.length or 0

	@define "time",
		get: -> (Date.now() - @_start) / 1000

	@define "isLoading",
		get: -> @_isLoading

	@define "isReady",
		get: -> 
			return false if not @isLoading
			return @_imagesLoaded.length is @_images.length

	addImagesFromContext: (context) ->
		@addImages(_.pluck(context.layers, "image"))

	addImages: (images) ->
		for image in images
			if image and image not in @_images
				@_images.push(image)

	start: =>

		# A static delay avoids the progress from being shown if the loading
		# took less then the delay. So if all images were cached then we don't
		# hope to see a loading screen at all.
		Utils.delay(0.2, @_start)
	
	_start: =>

		return if @isLoading

		@_isLoading = true
		@_images = []
		@_imagesLoaded = []
		@_start = Date.now()

		@emit("start")

		# By default we take the image from the prototype and the device
		@addImagesFromContext(Framer.DefaultContext)
		@addImagesFromContext(Framer.CurrentContext)		
		
		# If we don't need any images to be preloaded we can stop
		if not @_images.length
			return @end()

		# Load every image that we know of. We simply count failed images as loaded
		# for now so that we avoid being in some loading state forever.
		@_images.map (image) =>
			Utils.loadImage image, (error) =>
				@_imagesLoaded.push(image)
				@_handleProgress()

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

	_handleTimeout: ->
		return unless @isLoading
		console.error "Timeout"
		@end()

exports.enable = ->
	return if Framer.Preloader
	Framer.Preloader = new Preloader()

exports.disable = ->
	return unless Framer.Preloader
	Framer.Preloader.end()
	Framer.Preloader = null
