{BaseClass} = require "../BaseClass"
{Context} = require "../Context"

class Preloader extends BaseClass

	constructor: (options={}) ->

		@_media = []
		@_mediaLoaded = []
		@_isLoading = false

		@timeout = 5

		@context = new Context({name: "Preloader"})

		@context.run =>

			@cover = new Layer
				size: 200
				backgroundColor: "white"
				opacity: 0

			@progressIndicator = new CircularProgressComponent
				size: 160
				parent: @cover

			@progressIndicator.railsColor = Color.grey(0, 0.1)
			@progressIndicator.progressColor = Color.grey(0, 0.8)

			@brand = new Layer
				width: 48
				height: 72
				parent: @cover
				backgroundColor: null
			@brand.style["background-image"] = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAACQCAYAAAD3Cm4hAAAABGdBTUEAALGPC/xhBQAAA5xJREFUeAHt3O9t2zAQh2EpyBbtUp2k3SDOBu2nbpHu0FmaOVzRDv0ntmSJPJJ3vJeAQcIOeNLvCekPMjj+ft/vhmF4mV60BgmMoSYIDZL/KHkAAEEBAAhtEE4rIJZnO4pJ1OlvAEJZEOqEH6rcBQgfgBBSKN9mAUJpEBoDgKAAAISyCItb0GVptqPLNOTGqwFCSRDkgo8zbQIAIcYm128GAEEu/DBTEgAIcgjJACDIIGQBgJCPkA0AQh6CCAAI6QhiACCkIYgCgLAdQRwAhG0IRQBAWI9QDACEdQhFAUB4jFAcAIRlhCoAIMwjVAMA4T5CVQAQbhGqA4BwjdAEAIQzQjMAEI4ITQFAyHgkeV5E+SPPv7ZovgIin1cENQBetyNVAB4R1AF4Q1AJ4AlBLYAXBNUAHhDUA/SOYAKgZwQzAL0imALoEcEcQG8IJgF6QjAL0AvC+OVtvw83Y7WN4/D679u4s3r9T1YvPF739O/z8vXP4dCp+Jap3jxASNsyQhcAlhG6AbCK0BWARYTuAKwhdAlgCaFbACsIXQNYQOgeQDuCCwDNCG4AtCK4AtCI4A5AG4JLAE0IbgG0ILgG0IDgHqA1AgBBYGqtHuoAcMy/GQIAFwBhWHslAPAJoDYCAHcAaiIAMANQCwGABYAaCAA8ACiNAMAKgJIIAKwEKIUAwAaAEggAbASQRgAgAUASAYBEACkEADIAJBAAyATIRQBAACAHAQAhgFQEAAQBUhAAEAbYigBAAYAtCAAUAliLAEBBgDUIABQGeIQAQAWAJQQAKgHMIQBQEeAeAgCVAT4jPDeoT8kpgY9f4A3P73+H12E68sVsKr+mE4MMt6fh53TY0XTokeF7MH3px+8AEJohnr+EQWiCcAYI5UGojnANAIICABCqItyugFie7SgmUbSfBwhlQSgafph8GSD8BQghhWLtMUAoDUJjABAUAIBQBGHdFnRZmu3oMo3s8XaAUBKE7ODjBGkAIMT8svt0ABCyww8T5AGAkI2QDwBCFoIMAAjJCHIAICQhyAKAsBlBHgCETQhlAEBYjVAOAIRVCGUBQHiIUB4AhEWEOgAgzCLUAwDhLkJdABBuEOoDgHCF0AYAhBNCOwAQDghtAUAQeCBzWkwZA8fPmNuvgOjmFEEPgNPtSBeAQwR9AM4QdAI4QtAL4ARBN4ADBP0AnSPYAOgYwQ5Apwi2ADpFCLdlr/3Y74bv06EvtIYJBATj7T+6xt5DGDRVPAAAAABJRU5ErkJggg==')"

			do layout = =>
				@cover.frame = Canvas
				@progressIndicator.point = Align.center
				@brand.point = Align.center

			Canvas.onResize(layout)

			@start()

	@define "progress",
		get: -> @_mediaLoaded.length / @_media.length or 0

	@define "time",
		get: -> (Date.now() - @_start) / 1000

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

		# A static delay avoids the progress from being shown if the loading
		# took less then the delay. So if all images were cached then we don't
		# hope to see a loading screen at all.
		Utils.delay(0.2, @_start)

	_start: =>

		return if @isLoading

		@_isLoading = true
		@_media = []
		@_mediaLoaded = []
		@_start = Date.now()

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
	return if Framer.Preloader
	Framer.Preloader = new Preloader()

exports.disable = ->
	return unless Framer.Preloader
	Framer.Preloader.end()
	Framer.Preloader = null

exports.addImage = (url) ->
	return unless Framer.Preloader
	Framer.Preloader.addImage url
