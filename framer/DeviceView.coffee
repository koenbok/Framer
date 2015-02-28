Utils = require "./Utils"
{_}   = require "./Underscore"

DeviceViewDefaultDevice = "iphone-6-silver"

{BaseClass} = require "./BaseClass"
{Layer} = require "./Layer"
{Defaults} = require "./Defaults"
{Events} = require "./Events"

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

Device.setDeviceScale(zoom:float, animate:bool)
Device.setContentScale(zoom:float, animate:bool)

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

# _.extend Events,
# 	DeviceTypeDidChange: "change:deviceType"
# 	DeviceScaleDidChange: "change:deviceScale"
# 	DeviceContentScaleDidChange: "change:contentScale"
# 	DeviceFullScreenDidChange: ""

class exports.DeviceView extends BaseClass

	constructor: (options={}) ->

		defaults = Defaults.getDefaults("DeviceView", options)
		
		@_setup()
		
		@animationOptions = defaults.animationOptions
		@deviceType = defaults.deviceType

		_.extend @, Utils.setDefaultProperties(options, defaults)

	_setup: ->
		
		if @_setupDone
			return
			
		@_setupDone = true
		
		@background = new Layer
		@background.clip = true
		@background.backgroundColor = "transparent"
		@background.classList.add("DeviceBackground")		

		# @phone = new Layer superLayer:@background
		@phone = new Layer
		@screen   = new Layer superLayer:@phone
		@viewport = new Layer superLayer:@screen
		@content  = new Layer superLayer:@viewport

		@phone.backgroundColor = "transparent"
		@phone.classList.add("DevicePhone")
		
		@screen.backgroundColor = "transparent"
		@screen.classList.add("DeviceScreen")

		@viewport.backgroundColor = "transparent"
		@viewport.classList.add("DeviceViewPort")

		@content.backgroundColor = "transparent"
		@content.classList.add("DeviceContent")

		@content.originX = 0
		@content.originY = 0

		@keyboardLayer = new Layer superLayer:@viewport
		@keyboardLayer.on "click", => @toggleKeyboard()
		@keyboardLayer.classList.add("DeviceKeyboard")
		@keyboardLayer.backgroundColor = "transparent"
		
		Framer.CurrentContext.eventManager.wrap(window).addEventListener("resize", @_update)
		
		# This avoids rubber banding on mobile
		for layer in [@background, @phone, @viewport, @content, @screen]
			layer.on "touchmove", (event) -> event.preventDefault()

	_update: =>
		
		# # Todo: pixel align at zoom level 1, 0.5

		contentScaleFactor = @contentScale
		contentScaleFactor = 1 if contentScaleFactor > 1

		if @_shouldRenderFullScreen()
			for layer in [@background, @phone, @viewport, @content, @screen]
				layer.x = layer.y = 0
				layer.width = window.innerWidth / contentScaleFactor
				layer.height = window.innerHeight / contentScaleFactor
				layer.scale = 1
			
			@content.scale = contentScaleFactor
			@_positionKeyboard()

		else
			backgroundOverlap = 100

			@background.x = 0 - backgroundOverlap
			@background.y = 0 - backgroundOverlap
			@background.width  = window.innerWidth  + (2 * backgroundOverlap)
			@background.height = window.innerHeight + (2 * backgroundOverlap)

			@phone.scale = @_calculatePhoneScale()
			@phone.center()

			[width, height] = @_getOrientationDimensions(
				@_device.screenWidth / contentScaleFactor, 
				@_device.screenHeight / contentScaleFactor)

			@screen.width  = @_device.screenWidth
			@screen.height = @_device.screenHeight

			@viewport.width  = @content.width  = width
			@viewport.height = @content.height = height
			@screen.center()

	_shouldRenderFullScreen: ->
		
		if not @_device
			return true
		
		if @fullScreen is true
			return true
		
		if @deviceType is "fullscreen"
			return true

		if Utils.deviceType() is @_device.deviceType
			return true

		return false
		
	_deviceImageUrl: (name) ->
		return null unless name

		if Utils.isFramerStudio() && window.FramerStudioInfo
			resourceUrl = window.FramerStudioInfo.deviceImagesUrl
		else
			resourceUrl = "//resources.framerjs.com/static/DeviceResources"

		# return "#{resourceUrl}/#{name}" 

		if (Utils.isJP2Supported())
			return "#{resourceUrl}/#{name.replace(".png", ".jp2")}" 
		else
			return "#{resourceUrl}/#{name}" 

	setupContext: ->
		# Sets this device up as the default context so everything renders
		# into the device screen
		@_context = new Framer.Context(parentLayer:@content, name:"Device")
		Framer.CurrentContext = @_context

	###########################################################################
	# FULLSCREEN

	@define "fullScreen",
		get: ->
			@_fullScreen
		set: (fullScreen) ->
			@_setFullScreen(fullScreen)

	_setFullScreen: (fullScreen) ->

		if @_deviceType is "fullscreen"
			return

		if not _.isBool(fullScreen)
			return

		if fullScreen is @_fullScreen
			return

		@_fullScreen = fullScreen

		if fullScreen is true
			@phone.image = ""
		else
			@_updateDeviceImage()

		@_update()
		@keyboard = false
		@_positionKeyboard()
		@emit("change:fullScreen")



	###########################################################################
	# DEVICE TYPE

	@define "deviceType",
		get: ->
			@_deviceType
		set: (deviceType) ->
			
			if deviceType is @_deviceType
				return
			
			device = null

			if _.isString(deviceType)
				device = Devices[deviceType.toLowerCase()]
			
			if not device
				throw Error "No device named #{deviceType}. Options are: #{_.keys Devices}"
			
			if @_device is device
				return

			# If we switch from fullscreen to a device, we should zoom to fit
			shouldZoomToFit = @_deviceType is "fullscreen"

			@_device = _.clone(device)
			@_deviceType = deviceType
			@fullscreen = false
			@_updateDeviceImage()	
			@_update()
			@keyboard = false
			@_positionKeyboard()
			@emit("change:deviceType")

			if shouldZoomToFit
				@deviceScale = "fit"

	_updateDeviceImage: =>
		if @_shouldRenderFullScreen()
			@phone.image  = ""
		else
			@phone._cacheImage = true
			@phone.image  = @_deviceImageUrl("#{@_deviceType}.png")
			@phone.width  = @_device.deviceImageWidth
			@phone.height = @_device.deviceImageHeight


	###########################################################################
	# DEVICE ZOOM
	
	@define "deviceScale",
		get: ->
			if @_shouldRenderFullScreen()
				return 1 
			return @_deviceScale or 1
		set: (deviceScale) -> @setDeviceScale(deviceScale, false)
	
	setDeviceScale: (deviceScale, animate=false) ->

		if deviceScale == "fit" or deviceScale < 0
			deviceScale = "fit"
		else
			deviceScale = parseFloat(deviceScale)
			
		if deviceScale == @_deviceScale
			return

		@_deviceScale = deviceScale

		if @_shouldRenderFullScreen()
			return
		
		if deviceScale == "fit"
			phoneScale = @_calculatePhoneScale()
		else
			phoneScale = deviceScale
			
		@phone.animateStop()

		if animate
			@phone.animate _.extend @animationOptions,
				properties: {scale:phoneScale}
		else
			@phone.scale = phoneScale
			@phone.center()

		@emit("change:deviceScale")
			

	_calculatePhoneScale: ->
		
		# Calculates a phone scale that fits the screen unless a fixed value is set
		
		if @_deviceScale and @_deviceScale isnt "fit"
			return @_deviceScale

		[width, height] = @_getOrientationDimensions(@phone.width, @phone.height)

		paddingOffset = @_device?.paddingOffset or 0

		phoneScale = _.min([
			(window.innerWidth  - ((@padding + paddingOffset) * 2)) / width,
			(window.innerHeight - ((@padding + paddingOffset) * 2)) / height
		])
		
		return phoneScale

	###########################################################################
	# CONTENT SCALE

	@define "contentScale",
		get: -> @_contentScale or 1
		set: (contentScale) -> @setContentScale(contentScale, false)
	
	setContentScale: (contentScale, animate=false) ->
		
		contentScale = parseFloat(contentScale)

		if contentScale <= 0
			return

		if contentScale is @_contentScale
			return
		
		@_contentScale = contentScale
		
		if animate
			@content.animate _.extend @animationOptions,
				properties: {scale: @_contentScale}
		else
			@content.scale = @_contentScale

		@_update()

		@emit("change:contentScale")


	###########################################################################
	# PHONE ORIENTATION

	@define "orientation",
		get: -> @_orientation or 0
		set: (orientation) -> @setOrientation(orientation, false)

	setOrientation: (orientation, animate=false) ->

		if orientation == "portrait"
			orientation = 0
					
		if orientation == "landscape"
			orientation = 90

		if @_shouldRenderFullScreen()
			return
		
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

		# FIXME: After a rotation we call _update() again to set all the right
		# dimensions, but these should be correctly animated instead of set after
		# the animation.

		if animate
			animation = @phone.animate _.extend @animationOptions,
				properties: phoneProperties
			@viewport.animate _.extend @animationOptions,
				properties: contentProperties

			animation.on Events.AnimationEnd, =>
				@_update()
			
			if _hadKeyboard
				animation.on Events.AnimationEnd, =>
					@showKeyboard(true)
					
		else
			@phone.properties = phoneProperties
			@viewport.properties = contentProperties
			@_update()

			if _hadKeyboard
				@showKeyboard(true)
			
		@_renderKeyboard()

		@emit("change:orientation")
	
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
		
		# Check if this device has a keyboard at all
		if not @_device.hasOwnProperty("keyboards")
			return

		if _.isString(keyboard)
			if keyboard.toLowerCase() in ["1", "true"]
				keyboard = true
			else if keyboard.toLowerCase() in ["0", "false"]
				keyboard = false
			else
				return
		
		if not _.isBool(keyboard)
			return
		
		if keyboard is @_keyboard
			return
		
		@_keyboard = keyboard

		@emit("change:keyboard")

		if keyboard is true
			@emit("keyboard:show:start")
			@_animateKeyboard @_keyboardShowY(), animate, =>
				@emit("keyboard:show:end")
		else
			@emit("keyboard:hide:start")
			@_animateKeyboard @_keyboardHideY(), animate, =>
				@emit("keyboard:hide:end")
		
	showKeyboard: (animate=true) ->
		@setKeyboard(true, animate)

	hideKeyboard: (animate=true) ->
		@setKeyboard(false, animate)

	toggleKeyboard: (animate=true) ->
		@setKeyboard(!@keyboard, animate)

	_renderKeyboard: ->
		return unless @_device.keyboards
		@keyboardLayer.image  = @_deviceImageUrl @_device.keyboards[@orientationName].image
		@keyboardLayer.width  = @_device.keyboards[@orientationName].width
		@keyboardLayer.height = @_device.keyboards[@orientationName].height

	_positionKeyboard: ->
		@keyboardLayer.centerX()
		if @keyboard
			@_animateKeyboard(@_keyboardShowY(), false)
		else
			@_animateKeyboard(@_keyboardHideY(), false)

	_animateKeyboard: (y, animate, callback) =>
		@keyboardLayer.bringToFront()
		@keyboardLayer.animateStop()
		if animate is false
			@keyboardLayer.y = y
			callback?()
		else
			animation = @keyboardLayer.animate _.extend @animationOptions, 
				properties: {y:y}
			animation.on Events.AnimationEnd, callback

	_keyboardShowY: -> @viewport.height - @keyboardLayer.height
	_keyboardHideY: -> @viewport.height


###########################################################################
# DEVICE CONFIGURATIONS

iPhone6BaseDevice =
	deviceImageWidth: 870
	deviceImageHeight: 1738
	screenWidth: 750
	screenHeight: 1334
	deviceType: "phone"

iPhone6BaseDeviceHand = _.extend {}, iPhone6BaseDevice,
	deviceImageWidth: 1988
	deviceImageHeight: 2368
	paddingOffset: -150

iPhone6PlusBaseDevice =
	deviceImageWidth: 1280
	deviceImageHeight: 2524
	screenWidth: 1080
	screenHeight: 1920
	deviceType: "phone"

iPhone6PlusBaseDeviceHand = _.extend {}, iPhone6PlusBaseDevice,
	deviceImageWidth: 2720
	deviceImageHeight: 3032
	paddingOffset: -150


iPhone5BaseDevice =
	deviceImageWidth: 780
	deviceImageHeight: 1608
	screenWidth: 640
	screenHeight: 1136
	deviceType: "phone"
	# keyboards:
	# 	portrait:
	# 		image:  "ios-keyboard.png"
	# 		width: 640
	# 		height: 432
	# 	landscape:
	# 		image: "ios-keyboard-landscape-light.png"
	# 		width: 1136
	# 		height: 322

iPhone5BaseDeviceHand = _.extend {}, iPhone5BaseDevice,
	deviceImageWidth: 1884
	deviceImageHeight: 2234
	paddingOffset: -200


iPhone5CBaseDevice =
	deviceImageWidth: 776
	deviceImageHeight: 1612
	screenWidth: 640
	screenHeight: 1136
	deviceType: "phone"
	# keyboards:
	# 	portrait:
	# 		image:  "ios-keyboard.png"
	# 		width: 640
	# 		height: 432
	# 	landscape:
	# 		image: "ios-keyboard-landscape-light.png"
	# 		width: 1136
	# 		height: 322

iPhone5CBaseDeviceHand = _.extend {}, iPhone5CBaseDevice,
	deviceImageWidth: 1894
	deviceImageHeight: 2244
	paddingOffset: -200


iPadMiniBaseDevice =
	deviceImageWidth: 872
	deviceImageHeight: 1292
	screenWidth: 768
	screenHeight: 1024
	deviceType: "tablet"

iPadMiniBaseDeviceHand = _.extend {}, iPadMiniBaseDevice,
	deviceImageWidth: 1380
	deviceImageHeight: 2072
	paddingOffset: -120


iPadAirBaseDevice =
	deviceImageWidth: 1769
	deviceImageHeight: 2509
	screenWidth: 1536
	screenHeight: 2048
	deviceType: "tablet"

iPadAirBaseDeviceHand = _.extend {}, iPadAirBaseDevice,
	deviceImageWidth: 4744
	deviceImageHeight: 4101
	paddingOffset: -120


Nexus5BaseDevice =
	deviceImageWidth: 1208
	deviceImageHeight: 2440
	screenWidth: 1080
	screenHeight: 1920
	deviceType: "phone"

Nexus5BaseDeviceHand = _.extend {}, Nexus5BaseDevice, # 2692 × 2996
	deviceImageWidth: 2692
	deviceImageHeight: 2996
	paddingOffset: -120

AppleWatch42Device =
	deviceImageWidth: 552
	deviceImageHeight: 938
	screenWidth: 312
	screenHeight: 390

AppleWatch38Device =
	deviceImageWidth: 508
	deviceImageHeight: 900
	screenWidth: 272
	screenHeight: 340

Devices =

	"fullscreen":
		name: "Fullscreen"
		deviceType: "desktop"

	# Desktop Browser
	"desktop-safari-1024-600":
		deviceType: "browser"
		name: "Desktop Safari 1024 x 600"
		screenWidth: 1024
		screenHeight: 600
		deviceImageWidth: 1136
		deviceImageHeight: 760
	"desktop-safari-1280-800":
		deviceType: "browser"
		name: "Desktop Safari 1280 x 800"
		screenWidth: 1280
		screenHeight: 800
		deviceImageWidth: 1392
		deviceImageHeight: 960
	"desktop-safari-1440-900":
		deviceType: "browser"
		name: "Desktop Safari 1440 x 900"
		screenWidth: 1440
		screenHeight: 900
		deviceImageWidth: 1552
		deviceImageHeight: 1060

	# iPhone 6
	"iphone-6-spacegray": iPhone6BaseDevice
	"iphone-6-spacegray-hand": iPhone6BaseDeviceHand
	"iphone-6-silver": iPhone6BaseDevice
	"iphone-6-silver-hand": iPhone6BaseDeviceHand
	"iphone-6-gold": iPhone6BaseDevice
	"iphone-6-gold-hand": iPhone6BaseDeviceHand

	# iPhone 6+
	"iphone-6plus-spacegray": iPhone6PlusBaseDevice
	"iphone-6plus-spacegray-hand": iPhone6PlusBaseDeviceHand
	"iphone-6plus-silver": iPhone6PlusBaseDevice
	"iphone-6plus-silver-hand": iPhone6PlusBaseDeviceHand
	"iphone-6plus-gold": iPhone6PlusBaseDevice
	"iphone-6plus-gold-hand": iPhone6PlusBaseDeviceHand

	# iPhone 5S
	"iphone-5s-spacegray": iPhone5BaseDevice
	"iphone-5s-spacegray-hand":iPhone5BaseDeviceHand
	"iphone-5s-silver": iPhone5BaseDevice
	"iphone-5s-silver-hand": iPhone5BaseDeviceHand
	"iphone-5s-gold": iPhone5BaseDevice
	"iphone-5s-gold-hand": iPhone5BaseDeviceHand

	# iPhone 5C
	"iphone-5c-green": iPhone5CBaseDevice
	"iphone-5c-green-hand": iPhone5CBaseDeviceHand
	"iphone-5c-blue": iPhone5CBaseDevice
	"iphone-5c-blue-hand": iPhone5CBaseDeviceHand
	"iphone-5c-pink": iPhone5CBaseDevice
	"iphone-5c-pink-hand": iPhone5CBaseDeviceHand
	"iphone-5c-white": iPhone5CBaseDevice
	"iphone-5c-white-hand": iPhone5CBaseDeviceHand
	"iphone-5c-yellow": iPhone5CBaseDevice
	"iphone-5c-yellow-hand": iPhone5CBaseDeviceHand

	# iPad Mini
	"ipad-mini-spacegray": iPadMiniBaseDevice
	"ipad-mini-spacegray-hand": iPadMiniBaseDeviceHand
	"ipad-mini-silver": iPadMiniBaseDevice
	"ipad-mini-silver-hand": iPadMiniBaseDeviceHand

	# iPad Air
	"ipad-air-spacegray": iPadAirBaseDevice
	"ipad-air-spacegray-hand": iPadAirBaseDeviceHand
	"ipad-air-silver": iPadAirBaseDevice
	"ipad-air-silver-hand": iPadAirBaseDeviceHand

	# Nexus 5
	"nexus-5-black": Nexus5BaseDevice
	"nexus-5-black-hand": Nexus5BaseDeviceHand

	# Apple Watch 38mm
	"applewatchsport-38-aluminum-sportband-black": AppleWatch38Device
	"applewatchsport-38-aluminum-sportband-blue": AppleWatch38Device
	"applewatchsport-38-aluminum-sportband-green": AppleWatch38Device
	"applewatchsport-38-aluminum-sportband-pink": AppleWatch38Device
	"applewatchsport-38-aluminum-sportband-white": AppleWatch38Device
	"applewatch-38-black-bracelet": AppleWatch38Device
	"applewatch-38-steel-bracelet": AppleWatch38Device
	"applewatchedition-38-gold-buckle-blue": AppleWatch38Device
	"applewatchedition-38-gold-buckle-gray": AppleWatch38Device
	"applewatchedition-38-gold-buckle-red": AppleWatch38Device
	"applewatchedition-38-gold-sportband-black": AppleWatch38Device
	"applewatchedition-38-gold-sportband-white": AppleWatch38Device

	# Apple Watch 42mm
	"applewatchsport-42-aluminum-sportband-black": AppleWatch42Device
	"applewatchsport-42-aluminum-sportband-blue": AppleWatch42Device
	"applewatchsport-42-aluminum-sportband-green": AppleWatch42Device
	"applewatchsport-42-aluminum-sportband-pink": AppleWatch42Device
	"applewatchsport-42-aluminum-sportband-white": AppleWatch42Device
	"applewatch-42-black-bracelet": AppleWatch42Device
	"applewatch-42-steel-bracelet": AppleWatch42Device
	"applewatchedition-42-gold-buckle-blue": AppleWatch42Device
	"applewatchedition-42-gold-buckle-gray": AppleWatch42Device
	"applewatchedition-42-gold-buckle-red": AppleWatch42Device
	"applewatchedition-42-gold-sportband-black": AppleWatch42Device
	"applewatchedition-42-gold-sportband-white": AppleWatch42Device



exports.DeviceView.Devices = Devices