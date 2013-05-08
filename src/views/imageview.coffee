{View} = require "./view"
{config} = require "../config"

class exports.ImageView extends View
	
	constructor: (args) ->
		super
		
		args ?= {}
		
		# Behave like NSImage. Stretch to view size
		@style["background-repeat"] = "no-repeat"
		@style["background-size"] = "cover"
		
		@image = args.image

	@define "image",
		
		get: ->
			return @_image
		
		set: (value) ->

			if @_image is value
				return @emit "load", loader
			
			@_image = config.baseUrl + value
			
			# As an optimization, we will only use a loader
			# if something is explicitly listening to the load event
			
			if @events?.hasOwnProperty "load" or @events?.hasOwnProperty "error"
			
				loader = new Image()
				loader.name = @image
				loader.src = @image
			
				loader.onload = =>
					@style["background-image"] = "url('#{@image}')"
					@emit "load", loader
			
				loader.onerror = =>
					@emit "error", loader
			
			else
				@style["background-image"] = "url('#{@image}')"