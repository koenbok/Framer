Utils = require "./Utils"
{_}   = require "./Underscore"

DeviceViewHostedImagesUrl = ""
DeviceViewDefaultDevice = "iphone-5s-spacegray"

{BaseClass} = require "./BaseClass"
{Layer} = require "./Layer"
{Defaults} = require "./Defaults"

###

Device._setup()
Device._update()
Device._setupContext()

Device.fullScreen bool
Device.deviceType str
Device.padding int

Device.orientation(orientation:float)
Device.orientationName landscape|portrait|unknown
Device.rotateLeft()
Device.rotateRight()

Device.setDeviceZoom(zoom:float, animate:bool)
Device.setContentZoom(zoom:float, animate:bool)

Device.keyboard bool
Device.setKeyboard(visible:bool, animate:bool)
Device.showKeyboard(animate:bool)
Device.hideKeyboard(animate:bool)
Device.toggleKeyboard(animate:bool)


# Events
Events.DeviceTypeDidChange
Events.DeviceFullScreenDidChange
Events.DeviceKeyboardWillShow
Events.DeviceKeyboardDidShow


###


class exports.Device extends BaseClass

	constructor: (options={}) ->

		defaults = Defaults.getDefaults("Device", options)
		
		@_setup()
		
		@animationOptions = defaults.animationOptions
		@resourceUrl = defaults.resourceUrl

		_.extend @, Utils.setDefaultProperties(options, defaults)


	_setup: ->
		
		if @_setupDone
			return
			
		@_setupDone = true
		
		@background = new Layer
		@background.clip = true
		@background.backgroundColor = "white"

		@phone = new Layer superLayer:@background
		#@phone = new Layer
		@screen   = new Layer superLayer:@phone
		@viewport = new Layer superLayer:@screen
		@content  = new Layer superLayer:@viewport

		@screen.backgroundColor = "white"
		@viewport.backgroundColor = "white"
		@content.backgroundColor = "white"

		@content.originX = 0
		@content.originY = 0

		@keyboardLayer = new Layer superLayer:@viewport
		@keyboardLayer.on "click", => @toggleKeyboard()
		
		Screen.on "resize", @_update
		
		
	_update: =>
		
		# Todo: pixel align at zoom level 1, 0.5

		@background.width  = Screen.width
		@background.height = Screen.height

		@phone.scale = @_calculatePhoneScale()
		@phone.center()

		[width, height] = @_getOrientationDimensions(@_device.screenWidth, @_device.screenHeight)

		@screen.width  = @_device.screenWidth
		@screen.height = @_device.screenHeight

		@viewport.width  = @content.width  = width
		@viewport.height = @content.height = height
		@screen.center()

	_setupContext: ->
		# Sets this device up as the default context
		@_context = new Framer.Context(parentElement:@content._element, name:"Device")
		Framer.CurrentContext = @_context
		
	_deviceImageUrl: (name) ->
		return "#{@resourceUrl}/#{name}" 

	###########################################################################
	# DEVICE TYPE

	@define "deviceType",
		get: ->
			@_deviceType
		set: (deviceType) ->
			
			if deviceType is @_deviceType
				return
			
			if _.isString(deviceType)
				device = Devices[deviceType.toLowerCase()]
			
			if not device
				throw Error "No device named #{deviceType}. Options are: #{_.keys Devices}"
			
			@_device = device
	
			@phone.image  = @_deviceImageUrl(device.deviceImage)
			@phone.width  = @_device.deviceImageWidth
			@phone.height = @_device.deviceImageHeight
	
			@_update()
			@_renderKeyboard()


	###########################################################################
	# DEVICE ZOOM
	
	@define "deviceZoom",
		get: -> @_deviceZoom
		set: (deviceZoom) -> @setDeviceZoom(deviceZoom, false)
	
	setDeviceZoom: (deviceZoom, animate=false) ->
		
		if deviceZoom == "fit" or deviceZoom < 0
			deviceZoom = "fit"
		else
			deviceZoom = parseFloat(deviceZoom)
			
		if deviceZoom == @_deviceZoom
			return

		@_deviceZoom = deviceZoom
		
		if deviceZoom == "fit"
			phoneScale = @_calculatePhoneScale()
		else
			phoneScale = deviceZoom
			
		@phone.animateStop()

		if animate
			@phone.animate _.extend @animationOptions,
				properties: {scale:phoneScale}
		else
			@phone.scale = phoneScale
			@phone.center()
			

	_calculatePhoneScale: ->
		
		# Calculates a phone scale that fits the screen unless a fixed value is set
		
		if @_deviceZoom and @_deviceZoom isnt "fit"
			return @_deviceZoom

		[width, height] = @_getOrientationDimensions(@phone.width, @phone.height)

		phoneScale = _.min([
			(Screen.width -  (@padding * 2)) / width,
			(Screen.height - (@padding * 2)) / height
		])
		
		return phoneScale

	###########################################################################
	# CONTENT ZOOM

	@define "contentZoom",
		get: -> @_contentZoom
		set: (contentZoom) -> @setContentZoom(contentZoom, false)
	
	setContentZoom: (contentZoom, animate=false) ->
		
		contentZoom = parseFloat(contentZoom)
	
		if contentZoom is @_contentZoom
			return
		
		@_contentZoom = contentZoom
		
		if animate
			@content.animate _.extend @animationOptions,
				properties: {scale: @_contentZoom}
		else
			@content.scale = @_contentZoom


	###########################################################################
	# PHONE ORIENTATION

	@define "orientation",
		get: -> @_orientation
		set: (orientation) -> @setOrientation(orientation, false)

	setOrientation: (orientation, animate=false) ->

		if orientation == "portrait"
			orientation = 0
					
		if orientation == "landscape"
			orientation = 90
		
		orientation = parseInt(orientation)
		
		if orientation not in [0, 90, -90]
			return
		
		if orientation is @_orientation
			return
		
		@_orientation = orientation
		
		# Calculate properties for the phone
		phoneProperties =
			rotationZ: @_orientation
			scale: @_calculatePhoneScale()
		
		[width, height] = @_getOrientationDimensions(@_device.screenWidth, @_device.screenHeight)
		[x, y] = [(@screen.width - width) / 2, (@screen.height - height) / 2]
		
		contentProperties =
			rotationZ: -@_orientation
			width:  width
			height: height
			x: x
			y: y
		
		_hadKeyboard = @keyboard
		
		if _hadKeyboard
			@hideKeyboard(false)

		@phone.animateStop()
		@viewport.animateStop()

		if animate
			animation = @phone.animate _.extend @animationOptions,
				properties: phoneProperties
			@viewport.animate _.extend @animationOptions,
				properties: contentProperties
			
			if _hadKeyboard
				animation.on Events.AnimationEnd, =>
					@showKeyboard(true)
		else
			@phone.properties = phoneProperties
			@viewport.properties = contentProperties
			
			if _hadKeyboard
				@showKeyboard(true)
			
		@_renderKeyboard()
	
	isPortrait: -> Math.abs(@_orientation) != 90
	isLandscape: -> !@isPortrait()

	@define "orientationName",
		get: ->
			return "portrait" if @isPortrait()
			return "landscape" if @isLandscape()
		set: (orientationName) -> @setOrientation(orientationName, false)

	rotateLeft: (animate=true) ->
		return if @orientation is 90
		@setOrientation(@orientation + 90, animate)

	rotateRight: (animate=true) ->
		return if @orientation is -90
		@setOrientation(@orientation - 90, animate)
		
	_getOrientationDimensions: (width, height) ->
		if @isLandscape() then [height, width] else [width, height]


	###########################################################################
	# KEYBOARD

	@define "keyboard",
		get: -> @_keyboard
		set: (keyboard) -> @setKeyboard(keyboard, false)

	setKeyboard: (keyboard, animate=false) ->
		
		if _.isString(keyboard)
			if keyboard.toLowerCase() in ["1", "true"]
				keyboard = true
			else if keyboard.toLowerCase() in ["0", "false"]
				keyboard = false
			else
				return
		
		if not _.isBool(keyboard)
			return
		
		# print keyboard is @_keyboard, keyboard, @_keyboard
		
		if keyboard is @_keyboard
			return
		
		@_keyboard = keyboard
		
		if keyboard is true
			@_animateKeyboard(@viewport.height - @keyboardLayer.height, animate)
		else
			@_animateKeyboard(@viewport.height, animate)

		
	showKeyboard: (animate=true) ->
		@setKeyboard(true, animate)

	hideKeyboard: (animate=true) ->
		@setKeyboard(false, animate)

	toggleKeyboard: (animate=true) ->
		@setKeyboard(!@keyboard, animate)

	_renderKeyboard: ->
		@keyboardLayer.image  = @_deviceImageUrl @_device.keyboards[@orientationName].image
		@keyboardLayer.width  = @_device.keyboards[@orientationName].width
		@keyboardLayer.height = @_device.keyboards[@orientationName].height

	_animateKeyboard: (y, animate) =>
		@keyboardLayer.bringToFront()
		if animate is false
			@keyboardLayer.y = y
		else
			@keyboardLayer.animate _.extend @animationOptions, 
				properties: {y:y}


###########################################################################
# DEVICE CONFIGURATIONS

iPhone5BaseDevice =
	deviceImageWidth: 792
	deviceImageHeight: 1632
	screenWidth: 640
	screenHeight: 1136
	keyboards:
		portrait:
			image:  "ios-keyboard.png"
			width: 640
			height: 432
		landscape:
			image: "ios-keyboard-landscape-light.png"
			width: 1136
			height: 322

iPadMiniBaseDevice =
	deviceImageWidth: 920
	deviceImageHeight: 1328
	screenWidth: 768
	screenHeight: 1024
	keyboardImage: "ios-keyboard.png"
	keyboardWidth: 768
	keyboardHeight: 432

iPadAirBaseDevice =
	deviceImageWidth: 1856
	deviceImageHeight: 2584
	screenWidth: 1536
	screenHeight: 2048
	keyboardImage: "ios-keyboard.png"
	keyboardWidth: 0
	keyboardHeight: 0


Devices =

	# iPhone 5S
	"iphone-5s-spacegray": _.extend {}, iPhone5BaseDevice,
		name: "iPhone 5S Space Gray"
		deviceImage: "iphone-5S-spacegray.png"
	"iphone-5s–silver": _.extend {}, iPhone5BaseDevice,
		name: "iPhone 5S Silver"
		deviceImage: "iphone-5S–silver.png"
	"iphone-5s–gold": _.extend {}, iPhone5BaseDevice,
		name: "iPhone 5S Gold"
		deviceImage: "iphone-5S–gold.png"

	# iPhone 5C
	"iphone-5c–green": _.extend {}, iPhone5BaseDevice,
		name: "iPhone 5S Green"
		deviceImage: "iphone-5C–green.png"
	"iphone-5c–blue": _.extend {}, iPhone5BaseDevice,
		name: "iPhone 5S Blue"
		deviceImage: "iphone-5C–blue.png"
	"iphone-5c–yellow": _.extend {}, iPhone5BaseDevice,
		name: "iPhone 5S Yellow"
		deviceImage: "iphone-5C–yellow.png"
	"iphone-5c–pink": _.extend {}, iPhone5BaseDevice,
		name: "iPhone 5C Pink"
		deviceImage: "iphone-5C-pink.png"
	"iphone-5c–white": _.extend {}, iPhone5BaseDevice,
		name: "iPhone 5C White"
		deviceImage: "iphone-5C-white.png"

	# iPad Mini
	"ipad-mini-silver": _.extend {}, iPadMiniBaseDevice,
		name: "iPad Mini Silver"
		deviceImage: "ipad-mini-silver.png"
	"ipad-mini-spacegray": _.extend {}, iPadMiniBaseDevice,
		name: "iPad Mini Space Gray"
		deviceImage: "ipad-mini-spacegray.png"




