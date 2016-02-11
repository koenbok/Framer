Utils = require "../Utils"
{_}   = require "../Underscore"

{BaseClass} = require "../BaseClass"
{Layer} = require "../Layer"
{Defaults} = require "../Defaults"
{Events} = require "../Events"

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

class exports.DeviceComponent extends BaseClass

	@define "context", get: -> @_context

	constructor: (options={}) ->

		defaults = Defaults.getDefaults("DeviceComponent", options)

		# If we have defaults for DeviceView, we are likely using an older version of
		# Framer Studio. It's best to default to those then for now.
		if Framer.Defaults.hasOwnProperty("DeviceView")
			defaults = _.extend(defaults, Framer.Defaults.DeviceView)

		@_setup()

		@animationOptions = defaults.animationOptions
		@deviceType = defaults.deviceType

		_.extend(@, _.defaults(options, defaults))

	_setup: ->

		if @_setupDone
			return

		@_setupDone = true

		@background = new Layer
		@background.clip = true
		@background.backgroundColor = "transparent"
		@background.classList.add("DeviceBackground")

		@hands    = new Layer
		@handsImageLayer = new Layer parent:@hands
		@phone    = new Layer parent:@hands
		@screen   = new Layer parent:@phone
		@viewport = new Layer parent:@screen
		@content  = new Layer parent:@viewport

		@hands.backgroundColor = "transparent"
		@hands._alwaysUseImageCache = true
		@handsImageLayer.backgroundColor = "transparent"

		@phone.backgroundColor = "transparent"
		@phone.classList.add("DevicePhone")

		@screen.classList.add("DeviceScreen")
		@screen.clip = true

		@viewport.backgroundColor = "transparent"
		@viewport.classList.add("DeviceComponentPort")

		@content.backgroundColor = "transparent"
		@content.classList.add("DeviceContent")

		@content.originX = 0
		@content.originY = 0

		@keyboardLayer = new Layer parent:@viewport
		@keyboardLayer.on "click", => @toggleKeyboard()
		@keyboardLayer.classList.add("DeviceKeyboard")
		@keyboardLayer.backgroundColor = "transparent"

		Framer.CurrentContext.domEventManager.wrap(window).addEventListener("resize", @_update)

		# This avoids rubber banding on mobile
		for layer in [@background, @phone, @viewport, @content, @screen]
			layer.on "touchmove", (event) -> event.preventDefault()

		@_context = new Framer.Context(parent:@content, name:"Device")
		@_context.perspective = 1200

	_update: =>

		# Todo: pixel align at zoom level 1, 0.5

		contentScaleFactor = @contentScale
		contentScaleFactor = 1 if contentScaleFactor > 1

		if @_shouldRenderFullScreen()
			for layer in [@background, @hands, @phone, @viewport, @content, @screen]
				layer.x = layer.y = 0
				layer.width = window.innerWidth / contentScaleFactor
				layer.height = window.innerHeight / contentScaleFactor
				layer.scale = 1

			@content.scale = contentScaleFactor
			@_positionKeyboard()

			@screen.backgroundColor = "white"

		else
			backgroundOverlap = 100

			@background.x = 0 - backgroundOverlap
			@background.y = 0 - backgroundOverlap
			@background.width  = window.innerWidth  + (2 * backgroundOverlap)
			@background.height = window.innerHeight + (2 * backgroundOverlap)

			@hands.scale = @_calculatePhoneScale()
			@hands.center()
			@phone.center()

			[width, height] = @_getOrientationDimensions(
				@_device.screenWidth / contentScaleFactor,
				@_device.screenHeight / contentScaleFactor)

			@screen.width  = @_device.screenWidth
			@screen.height = @_device.screenHeight

			@viewport.width  = @content.width  = width
			@viewport.height = @content.height = height
			@screen.center()

			@setHand(@selectedHand) if @selectedHand && @_orientation == 0

			@screen.backgroundColor = "black"

	_shouldRenderFullScreen: ->

		if not @_device
			return true

		if @fullScreen is true
			return true

		if @deviceType is "fullscreen"
			return true

		if Utils.deviceType() is "phone" and Utils.deviceType() is @_device.deviceType
			return true

		if Utils.deviceType() is "tablet" and Utils.deviceType() is @_device.deviceType
			return true

		if Utils.deviceType() is "phone" and @_device.deviceType is "tablet"
			return true

		return false

	setupContext: ->
		# Sets this device up as the default context so everything renders
		# into the device screen
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

		if not _.isBoolean(fullScreen)
			return

		if fullScreen is @_fullScreen
			return

		@_fullScreen = fullScreen

		if fullScreen is true
			@phone.image = ""
			@hands.image = ""
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

		if /PhantomJS/.test(navigator.userAgent)
			return

		if @_shouldRenderFullScreen()
			@phone.image  = ""
			@hands.image  = ""
		else if not @_deviceImageUrl(@_deviceImageName())
			@phone.image  = ""
		else
			@phone._alwaysUseImageCache = true
			@phone.image  = @_deviceImageUrl(@_deviceImageName())
			@phone.width  = @_device.deviceImageWidth
			@phone.height = @_device.deviceImageHeight
			@hands.width  = @phone.width
			@hands.height = @phone.height

	_deviceImageName: ->
		if @_device.hasOwnProperty("deviceImage")
			return @_device.deviceImage
		return "#{@_deviceType}.png"

	_deviceImageUrl: (name) ->

		return null unless name

		# If the image is externally hosted, we'd like to use that
		if _.startsWith(name, "http://") or _.startsWith(name, "https://")
			return name

		# If this device is added by the user we use the name as it is
		if @_deviceType not in BuiltInDevices
			return name

		# We want to get these image from our public resources server
		resourceUrl = "//resources.framerjs.com/static/DeviceResources"

		# If we're running Framer Studio and have local files, we'd like to use those
		if Utils.isFramerStudio() and window.FramerStudioInfo

			if @_device.minStudioVersion and Utils.framerStudioVersion() >= @_device.minStudioVersion or !@_device.minStudioVersion

				if @_device.maxStudioVersion and Utils.framerStudioVersion() <= @_device.maxStudioVersion or !@_device.maxStudioVersion

					resourceUrl = window.FramerStudioInfo.deviceImagesUrl

		# We'd like to use jp2 if possible, or check if we don't for this specific device
		if Utils.isJP2Supported() and @_device.deviceImageJP2 is true
			return "#{resourceUrl}/#{name.replace(".png", ".jp2")}"

		return "#{resourceUrl}/#{name}"

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

		@hands.animateStop()

		if animate
			@hands.animate _.extend @animationOptions,
				properties: {scale:phoneScale}
		else
			@hands.scale = phoneScale
			@hands.center()

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

		# Never scale the phone beyond 100%
		phoneScale = 1 if phoneScale > 1

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

		@hands.animateStop()
		@viewport.animateStop()

		# FIXME: After a rotation we call _update() again to set all the right
		# dimensions, but these should be correctly animated instead of set after
		# the animation.

		if animate
			animation = @hands.animate _.extend @animationOptions,
				properties: phoneProperties
			@viewport.animate _.extend @animationOptions,
				properties: contentProperties

			animation.on Events.AnimationEnd, =>
				@_update()

			if _hadKeyboard
				animation.on Events.AnimationEnd, =>
					@showKeyboard(true)

		else
			@hands.props = phoneProperties
			@viewport.props = contentProperties
			@_update()

			if _hadKeyboard
				@showKeyboard(true)

		@handsImageLayer.image = "" if @_orientation != 0

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

		if not _.isBoolean(keyboard)
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
	# HANDS

	handSwitchingSupported: ->
		return @_device.hands != undefined

	nextHand: ->
		if @handSwitchingSupported()
			hands = _.keys(@_device.hands)
			if hands.length > 0
				nextHandIndex = hands.indexOf(@selectedHand) + 1
				nextHand = ""
				nextHand = hands[nextHandIndex] if nextHandIndex < hands.length
				hand = @setHand(nextHand)
				@_update()
				return hand
		return false

	setHand: (hand) ->
		@selectedHand = hand
		return @handsImageLayer.image = "" if !hand or !@handSwitchingSupported()

		handData = @_device.hands[hand]
		if handData
			@hands.width = handData.width
			@hands.height = handData.height
			@hands.center()
			@phone.center()
			@handsImageLayer.size = @hands.size
			@handsImageLayer.y = 0
			@handsImageLayer.y = handData.offset if handData.offset
			@handsImageLayer.image = @handImageUrl(hand)
			return hand

	handImageUrl: (hand) ->

		# We want to get these image from our public resources server
		resourceUrl = "//resources.framerjs.com/static/DeviceResources"

		# If we're running Framer Studio and have local files, we'd like to use those
		if Utils.isFramerStudio() and window.FramerStudioInfo and Utils.framerStudioVersion() >= newDeviceMinVersion
			resourceUrl = window.FramerStudioInfo.deviceImagesUrl

		# We'd like to use jp2 if possible, or check if we don't for this specific device
		# if Utils.isJP2Supported() and @_device.deviceImageJP2 is true
		# 	return "#{resourceUrl}/#{hand}.jp2"

		return "#{resourceUrl}/#{hand}.png"


###########################################################################
# DEVICE CONFIGURATIONS

newDeviceMinVersion = 53
oldDeviceMaxVersion = 52

iPadAir2BaseDevice =
	deviceImageWidth: 1856
	deviceImageHeight: 2608
	deviceImageJP2: true
	screenWidth: 1536
	screenHeight: 2048
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion

iPadMini4BaseDevice =
	deviceImageWidth: 1936
	deviceImageHeight: 2688
	deviceImageJP2: true
	screenWidth: 1536
	screenHeight: 2048
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion

iPadProBaseDevice =
	deviceImageWidth: 2448
	deviceImageHeight: 3432
	deviceImageJP2: true
	screenWidth: 2048
	screenHeight: 2732
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion

iPhone6BaseDevice =
	deviceImageWidth: 874
	deviceImageHeight: 1792
	deviceImageJP2: true
	screenWidth: 750
	screenHeight: 1334
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	hands:
		"iphone-hands-2":
			width:  2400
			height: 3740
		"iphone-hands-1":
			width:  2400
			height: 3740

iPhone6PlusBaseDevice =
	deviceImageWidth: 1452
	deviceImageHeight: 2968
	deviceImageJP2: true
	screenWidth: 1242
	screenHeight: 2208
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	hands:
		"iphone-hands-2":
			width:  3987
			height: 6212
		"iphone-hands-1":
			width:  3987
			height: 6212

iPhone5BaseDevice =
	deviceImageWidth: 768
	deviceImageHeight: 1612
	deviceImageJP2: true
	screenWidth: 640
	screenHeight: 1136
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	hands:
		"iphone-hands-2":
			width:  2098
			height: 3269
			offset: 19
		"iphone-hands-1":
			width:  2098
			height: 3269
			offset: 19

iPhone5CBaseDevice =
	deviceImageWidth: 776
	deviceImageHeight: 1620
	deviceImageJP2: true
	screenWidth: 640
	screenHeight: 1136
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	hands:
		"iphone-hands-2":
			width:  2098
			height: 3269
			offset: 28
		"iphone-hands-1":
			width:  2098
			height: 3269
			offset: 28

Nexus4BaseDevice =
	deviceImageWidth: 860
	deviceImageHeight: 1668
	deviceImageJP2: true
	screenWidth: 768
	screenHeight: 1280
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	hands:
		"iphone-hands-2":
			width:  2362
			height: 3681
			offset: -52
		"iphone-hands-1":
			width:  2362
			height: 3681
			offset: -52

Nexus5BaseDevice =
	deviceImageWidth: 1204
	deviceImageHeight: 2432
	deviceImageJP2: true
	screenWidth: 1080
	screenHeight: 1920
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	hands:
		"iphone-hands-2":
			width:  3292
			height: 5130
			offset: 8
		"iphone-hands-1":
			width:  3292
			height: 5130
			offset: 8

Nexus6BaseDevice =
	deviceImageWidth: 1576
	deviceImageHeight: 3220
	deviceImageJP2: true
	screenWidth: 1440
	screenHeight: 2560
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	hands:
		"iphone-hands-2":
			width:  4304
			height: 6707
			offset: 8
		"iphone-hands-1":
			width:  4304
			height: 6707
			offset: 8

Nexus9BaseDevice =
	deviceImageWidth: 1896
	deviceImageHeight: 2648
	deviceImageJP2: true
	screenWidth: 1536
	screenHeight: 2048
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion

HTCa9BaseDevice =
	deviceImageWidth: 1252
	deviceImageHeight: 2592
	deviceImageJP2: true
	screenWidth: 1080
	screenHeight: 1920
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	hands:
		"iphone-hands-2":
			width:  3436
			height: 5354
			offset: 36
		"iphone-hands-1":
			width:  3436
			height: 5354
			offset: 36

HTCm8BaseDevice =
	deviceImageWidth: 1232
	deviceImageHeight: 2572
	deviceImageJP2: true
	screenWidth: 1080
	screenHeight: 1920
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	hands:
		"iphone-hands-2":
			width:  3436
			height: 5354
			offset: 12
		"iphone-hands-1":
			width:  3436
			height: 5354
			offset: 12

MSFTLumia950BaseDevice =
	deviceImageWidth: 1660
	deviceImageHeight: 3292
	deviceImageJP2: true
	screenWidth: 1440
	screenHeight: 2560
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	hands:
		"iphone-hands-2":
			width:  4494
			height: 7003
			offset: -84
		"iphone-hands-1":
			width:  4494
			height: 7003
			offset: -84

SamsungGalaxyNote5BaseDevice =
	deviceImageWidth: 1572
	deviceImageHeight: 3140
	deviceImageJP2: true
	screenWidth: 1440
	screenHeight: 2560
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	hands:
		"iphone-hands-2":
			width:  4279
			height: 6668
			offset: -24
		"iphone-hands-1":
			width:  4279
			height: 6668
			offset: -84

AppleWatch42Device =
	deviceImageWidth: 512
	deviceImageHeight: 990
	deviceImageJP2: true
	screenWidth: 312
	screenHeight: 390
	minStudioVersion: newDeviceMinVersion

AppleWatch38Device =
	deviceImageWidth: 472
	deviceImageHeight: 772
	deviceImageJP2: true
	screenWidth: 272
	screenHeight: 340
	minStudioVersion: newDeviceMinVersion

AppleWatch38BlackLeatherDevice =
	deviceImageWidth: 472
	deviceImageHeight: 796
	deviceImageJP2: true
	screenWidth: 272
	screenHeight: 340
	minStudioVersion: newDeviceMinVersion

###########################################################################
# OLD DEVICE CONFIGURATIONS

old_iPhone6BaseDevice =
	deviceImageWidth: 870
	deviceImageHeight: 1738
	deviceImageJP2: true
	screenWidth: 750
	screenHeight: 1334
	deviceType: "phone"
	maxStudioVersion: oldDeviceMaxVersion

old_iPhone6BaseDeviceHand = _.extend {}, old_iPhone6BaseDevice,
	deviceImageWidth: 1988
	deviceImageHeight: 2368
	deviceImageJP2: true
	paddingOffset: -150
	maxStudioVersion: oldDeviceMaxVersion

old_iPhone6PlusBaseDevice =
	deviceImageWidth: 1460
	deviceImageHeight: 2900
	deviceImageJP2: true
	screenWidth: 1242
	screenHeight: 2208
	deviceType: "phone"
	maxStudioVersion: oldDeviceMaxVersion

old_iPhone6PlusBaseDeviceHand = _.extend {}, old_iPhone6PlusBaseDevice,
	deviceImageWidth: 3128
	deviceImageHeight: 3487
	deviceImageJP2: true
	paddingOffset: -150
	maxStudioVersion: oldDeviceMaxVersion

old_iPhone5BaseDevice =
	deviceImageWidth: 780
	deviceImageHeight: 1608
	deviceImageJP2: true
	screenWidth: 640
	screenHeight: 1136
	deviceType: "phone"
	maxStudioVersion: oldDeviceMaxVersion
	# keyboards:
	# 	portrait:
	# 		image:  "ios-keyboard.png"
	# 		width: 640
	# 		height: 432
	# 	landscape:
	# 		image: "ios-keyboard-landscape-light.png"
	# 		width: 1136
	# 		height: 322

old_iPhone5BaseDeviceHand = _.extend {}, old_iPhone5BaseDevice,
	deviceImageWidth: 1884
	deviceImageHeight: 2234
	deviceImageJP2: true
	paddingOffset: -200
	maxStudioVersion: oldDeviceMaxVersion

old_iPhone5CBaseDevice =
	deviceImageWidth: 776
	deviceImageHeight: 1612
	deviceImageJP2: true
	screenWidth: 640
	screenHeight: 1136
	deviceType: "phone"
	maxStudioVersion: oldDeviceMaxVersion
	# keyboards:
	# 	portrait:
	# 		image:  "ios-keyboard.png"
	# 		width: 640
	# 		height: 432
	# 	landscape:
	# 		image: "ios-keyboard-landscape-light.png"
	# 		width: 1136
	# 		height: 322

old_iPhone5CBaseDeviceHand = _.extend {}, old_iPhone5CBaseDevice,
	deviceImageWidth: 1894
	deviceImageHeight: 2244
	deviceImageJP2: true
	paddingOffset: -200
	maxStudioVersion: oldDeviceMaxVersion

old_iPadMiniBaseDevice =
	deviceImageWidth: 872
	deviceImageHeight: 1292
	deviceImageJP2: true
	screenWidth: 768
	screenHeight: 1024
	deviceType: "tablet"
	maxStudioVersion: oldDeviceMaxVersion

old_iPadMiniBaseDeviceHand = _.extend {}, old_iPadMiniBaseDevice,
	deviceImageWidth: 1380
	deviceImageHeight: 2072
	deviceImageJP2: true
	paddingOffset: -120
	maxStudioVersion: oldDeviceMaxVersion

old_iPadAirBaseDevice =
	deviceImageWidth: 1769
	deviceImageHeight: 2509
	deviceImageJP2: true
	screenWidth: 1536
	screenHeight: 2048
	deviceType: "tablet"
	maxStudioVersion: oldDeviceMaxVersion

old_iPadAirBaseDeviceHand = _.extend {}, old_iPadAirBaseDevice,
	deviceImageWidth: 4744
	deviceImageHeight: 4101
	deviceImageJP2: true
	paddingOffset: -120
	maxStudioVersion: oldDeviceMaxVersion

old_Nexus5BaseDevice =
	deviceImageWidth: 1208
	deviceImageHeight: 2440
	deviceImageJP2: true
	screenWidth: 1080
	screenHeight: 1920
	deviceType: "phone"
	maxStudioVersion: oldDeviceMaxVersion

old_Nexus5BaseDeviceHand = _.extend {}, old_Nexus5BaseDevice, # 2692 × 2996
	deviceImageWidth: 2692
	deviceImageHeight: 2996
	deviceImageJP2: true
	paddingOffset: -120
	maxStudioVersion: oldDeviceMaxVersion

old_Nexus9BaseDevice =
	deviceImageWidth: 1733
	deviceImageHeight: 2575
	deviceImageJP2: true
	screenWidth: 1536
	screenHeight: 2048
	deviceType: "tablet"
	maxStudioVersion: oldDeviceMaxVersion

old_AppleWatch42Device =
	deviceImageWidth: 552
	deviceImageHeight: 938
	deviceImageJP2: true
	screenWidth: 312
	screenHeight: 390
	maxStudioVersion: oldDeviceMaxVersion

old_AppleWatch38Device =
	deviceImageWidth: 508
	deviceImageHeight: 900
	deviceImageJP2: true
	screenWidth: 272
	screenHeight: 340
	maxStudioVersion: oldDeviceMaxVersion

Devices =

	"fullscreen":
		name: "Fullscreen"
		deviceType: "desktop"

	# iPad Air
	"apple-ipad-air-2-silver": _.clone(iPadAir2BaseDevice)
	"apple-ipad-air-2-gold": _.clone(iPadAir2BaseDevice)
	"apple-ipad-air-2-space-gray": _.clone(iPadAir2BaseDevice)

	# iPad Mini
	"apple-ipad-mini-4-silver": _.clone(iPadMini4BaseDevice)
	"apple-ipad-mini-4-gold": _.clone(iPadMini4BaseDevice)
	"apple-ipad-mini-4-space-gray": _.clone(iPadMini4BaseDevice)

	# iPad Pro
	"apple-ipad-pro-silver": _.clone(iPadProBaseDevice)
	"apple-ipad-pro-gold": _.clone(iPadProBaseDevice)
	"apple-ipad-pro-space-gray": _.clone(iPadProBaseDevice)

	# iPhone 6
	"apple-iphone-6s-gold": _.clone(iPhone6BaseDevice)
	"apple-iphone-6s-rose-gold": _.clone(iPhone6BaseDevice)
	"apple-iphone-6s-silver" : _.clone(iPhone6BaseDevice)
	"apple-iphone-6s-space-gray": _.clone(iPhone6BaseDevice)

	# iPhone 6+
	"apple-iphone-6s-plus-gold": _.clone(iPhone6PlusBaseDevice)
	"apple-iphone-6s-plus-rose-gold": _.clone(iPhone6PlusBaseDevice)
	"apple-iphone-6s-plus-silver": _.clone(iPhone6PlusBaseDevice)
	"apple-iphone-6s-plus-space-gray": _.clone(iPhone6PlusBaseDevice)

	# iPhone 5S
	"apple-iphone-5s-gold": _.clone(iPhone5BaseDevice)
	"apple-iphone-5s-silver": _.clone(iPhone5BaseDevice)
	"apple-iphone-5s-space-gray": _.clone(iPhone5BaseDevice)

	# iPhone 5C
	"apple-iphone-5c-blue": _.clone(iPhone5CBaseDevice)
	"apple-iphone-5c-green": _.clone(iPhone5CBaseDevice)
	"apple-iphone-5c-red": _.clone(iPhone5CBaseDevice)
	"apple-iphone-5c-white": _.clone(iPhone5CBaseDevice)
	"apple-iphone-5c-yellow": _.clone(iPhone5CBaseDevice)

	# Apple Watch 38mm

	"apple-watch-38mm-gold-black-leather-closed": _.clone(AppleWatch38BlackLeatherDevice)
	"apple-watch-38mm-rose-gold-black-leather-closed": _.clone(AppleWatch38BlackLeatherDevice)
	"apple-watch-38mm-stainless-steel-black-leather-closed": _.clone(AppleWatch38BlackLeatherDevice)

	"apple-watch-38mm-black-steel-black-closed": _.clone(AppleWatch38Device)
	"apple-watch-38mm-gold-midnight-blue-closed": _.clone(AppleWatch38Device)
	"apple-watch-38mm-rose-gold-lavender-closed": _.clone(AppleWatch38Device)
	"apple-watch-38mm-sport-aluminum-blue-closed": _.clone(AppleWatch38Device)
	"apple-watch-38mm-sport-aluminum-fog-closed": _.clone(AppleWatch38Device)
	"apple-watch-38mm-sport-aluminum-green-closed": _.clone(AppleWatch38Device)
	"apple-watch-38mm-sport-aluminum-red-closed": _.clone(AppleWatch38Device)
	"apple-watch-38mm-sport-aluminum-walnut-closed": _.clone(AppleWatch38Device)
	"apple-watch-38mm-sport-aluminum-white-closed": _.clone(AppleWatch38Device)
	"apple-watch-38mm-sport-aluminum-gold-antique-white-closed": _.clone(AppleWatch38Device)
	"apple-watch-38mm-sport-aluminum-rose-gold-stone-closed": _.clone(AppleWatch38Device)
	"apple-watch-38mm-sport-space-gray-black-closed": _.clone(AppleWatch38Device)

	# Apple Watch 42mm
	"apple-watch-42mm-black-steel-black-closed": _.clone(AppleWatch42Device)
	"apple-watch-42mm-gold-black-leather-closed": _.clone(AppleWatch42Device)
	"apple-watch-42mm-gold-midnight-blue-closed": _.clone(AppleWatch42Device)
	"apple-watch-42mm-rose-gold-black-leather-closed": _.clone(AppleWatch42Device)
	"apple-watch-42mm-rose-gold-lavender-closed": _.clone(AppleWatch42Device)
	"apple-watch-42mm-sport-aluminum-blue-closed": _.clone(AppleWatch42Device)
	"apple-watch-42mm-sport-aluminum-fog-closed": _.clone(AppleWatch42Device)
	"apple-watch-42mm-sport-aluminum-green-closed": _.clone(AppleWatch42Device)
	"apple-watch-42mm-sport-aluminum-red-closed": _.clone(AppleWatch42Device)
	"apple-watch-42mm-sport-aluminum-walnut-closed": _.clone(AppleWatch42Device)
	"apple-watch-42mm-sport-aluminum-white-closed": _.clone(AppleWatch42Device)
	"apple-watch-42mm-sport-aluminum-gold-antique-white-closed": _.clone(AppleWatch42Device)
	"apple-watch-42mm-sport-aluminum-rose-gold-stone-closed": _.clone(AppleWatch42Device)
	"apple-watch-42mm-sport-space-gray-black-closed": _.clone(AppleWatch42Device)
	"apple-watch-42mm-stainless-steel-black-leather-closed": _.clone(AppleWatch42Device)

	# NEXUS
	"google-nexus-4": _.clone(Nexus4BaseDevice)
	"google-nexus-5x": _.clone(Nexus5BaseDevice)
	"google-nexus-6p": _.clone(Nexus6BaseDevice)
	"google-nexus-9": _.clone(Nexus9BaseDevice)

	# HTC ONE A9
	"htc-one-a9-black": _.clone(HTCa9BaseDevice)
	"htc-one-a9-white": _.clone(HTCa9BaseDevice)

	# HTC ONE M8
	"htc-one-m8-black": _.clone(HTCm8BaseDevice)
	"htc-one-m8-gold": _.clone(HTCm8BaseDevice)
	"htc-one-m8-silver": _.clone(HTCm8BaseDevice)

	# MICROSOFT LUMIA 950
	"microsoft-lumia-950-black": _.clone(MSFTLumia950BaseDevice)
	"microsoft-lumia-950-white": _.clone(MSFTLumia950BaseDevice)

	# SAMSUNG NOTE 5
	"samsung-galaxy-note-5-black": _.clone(SamsungGalaxyNote5BaseDevice)
	"samsung-galaxy-note-5-gold": _.clone(SamsungGalaxyNote5BaseDevice)
	"samsung-galaxy-note-5-pink": _.clone(SamsungGalaxyNote5BaseDevice)
	"samsung-galaxy-note-5-silver-titanium": _.clone(SamsungGalaxyNote5BaseDevice)
	"samsung-galaxy-note-5-white": _.clone(SamsungGalaxyNote5BaseDevice)


	# OLD DEVICES

	# Desktop Browser
	"desktop-safari-1024-600":
		deviceType: "browser"
		name: "Desktop Safari 1024 x 600"
		screenWidth: 1024
		screenHeight: 600
		deviceImageWidth: 1136
		deviceImageHeight: 760
		deviceImageJP2: true
		maxStudioVersion: oldDeviceMaxVersion
	"desktop-safari-1280-800":
		deviceType: "browser"
		name: "Desktop Safari 1280 x 800"
		screenWidth: 1280
		screenHeight: 800
		deviceImageWidth: 1392
		deviceImageHeight: 960
		deviceImageJP2: true
		maxStudioVersion: oldDeviceMaxVersion
	"desktop-safari-1440-900":
		deviceType: "browser"
		name: "Desktop Safari 1440 x 900"
		screenWidth: 1440
		screenHeight: 900
		deviceImageWidth: 1552
		deviceImageHeight: 1060
		deviceImageJP2: true
		maxStudioVersion: oldDeviceMaxVersion

	# iPhone 6
	"iphone-6-spacegray": _.clone(old_iPhone6BaseDevice)
	"iphone-6-spacegray-hand": _.clone(old_iPhone6BaseDeviceHand)
	"iphone-6-silver": _.clone(old_iPhone6BaseDevice)
	"iphone-6-silver-hand": _.clone(old_iPhone6BaseDeviceHand)
	"iphone-6-gold": _.clone(old_iPhone6BaseDevice)
	"iphone-6-gold-hand": _.clone(old_iPhone6BaseDeviceHand)

	# iPhone 6+
	"iphone-6plus-spacegray": _.clone(old_iPhone6PlusBaseDevice)
	"iphone-6plus-spacegray-hand": _.clone(old_iPhone6PlusBaseDeviceHand)
	"iphone-6plus-silver": _.clone(old_iPhone6PlusBaseDevice)
	"iphone-6plus-silver-hand": _.clone(old_iPhone6PlusBaseDeviceHand)
	"iphone-6plus-gold": _.clone(old_iPhone6PlusBaseDevice)
	"iphone-6plus-gold-hand": _.clone(old_iPhone6PlusBaseDeviceHand)

	# iPhone 5S
	"iphone-5s-spacegray": _.clone(old_iPhone5BaseDevice)
	"iphone-5s-spacegray-hand":_.clone(old_iPhone5BaseDeviceHand)
	"iphone-5s-silver": _.clone(old_iPhone5BaseDevice)
	"iphone-5s-silver-hand": _.clone(old_iPhone5BaseDeviceHand)
	"iphone-5s-gold": _.clone(old_iPhone5BaseDevice)
	"iphone-5s-gold-hand": _.clone(old_iPhone5BaseDeviceHand)

	# iPhone 5C
	"iphone-5c-green": _.clone(old_iPhone5CBaseDevice)
	"iphone-5c-green-hand": _.clone(old_iPhone5CBaseDeviceHand)
	"iphone-5c-blue": _.clone(old_iPhone5CBaseDevice)
	"iphone-5c-blue-hand": _.clone(old_iPhone5CBaseDeviceHand)
	"iphone-5c-pink": _.clone(old_iPhone5CBaseDevice)
	"iphone-5c-pink-hand": _.clone(old_iPhone5CBaseDeviceHand)
	"iphone-5c-white": _.clone(old_iPhone5CBaseDevice)
	"iphone-5c-white-hand": _.clone(old_iPhone5CBaseDeviceHand)
	"iphone-5c-yellow": _.clone(old_iPhone5CBaseDevice)
	"iphone-5c-yellow-hand": _.clone(old_iPhone5CBaseDeviceHand)

	# iPad Mini
	"ipad-mini-spacegray": _.clone(old_iPadMiniBaseDevice)
	"ipad-mini-spacegray-hand": _.clone(old_iPadMiniBaseDeviceHand)
	"ipad-mini-silver": _.clone(old_iPadMiniBaseDevice)
	"ipad-mini-silver-hand": _.clone(old_iPadMiniBaseDeviceHand)

	# iPad Air
	"ipad-air-spacegray": _.clone(old_iPadAirBaseDevice)
	"ipad-air-spacegray-hand": _.clone(old_iPadAirBaseDeviceHand)
	"ipad-air-silver": _.clone(old_iPadAirBaseDevice)
	"ipad-air-silver-hand": _.clone(old_iPadAirBaseDeviceHand)

	# Nexus 5
	"nexus-5-black": _.clone(old_Nexus5BaseDevice)
	"nexus-5-black-hand": _.clone(old_Nexus5BaseDeviceHand)

	# Nexus 9
	"nexus-9": _.clone(old_Nexus9BaseDevice)

	# Apple Watch 38mm
	"applewatchsport-38-aluminum-sportband-black": _.clone(old_AppleWatch38Device)
	"applewatchsport-38-aluminum-sportband-blue": _.clone(old_AppleWatch38Device)
	"applewatchsport-38-aluminum-sportband-green": _.clone(old_AppleWatch38Device)
	"applewatchsport-38-aluminum-sportband-pink": _.clone(old_AppleWatch38Device)
	"applewatchsport-38-aluminum-sportband-white": _.clone(old_AppleWatch38Device)
	"applewatch-38-black-bracelet": _.clone(old_AppleWatch38Device)
	"applewatch-38-steel-bracelet": _.clone(old_AppleWatch38Device)
	"applewatchedition-38-gold-buckle-blue": _.clone(old_AppleWatch38Device)
	"applewatchedition-38-gold-buckle-gray": _.clone(old_AppleWatch38Device)
	"applewatchedition-38-gold-buckle-red": _.clone(old_AppleWatch38Device)
	"applewatchedition-38-gold-sportband-black": _.clone(old_AppleWatch38Device)
	"applewatchedition-38-gold-sportband-white": _.clone(old_AppleWatch38Device)

	# Apple Watch 42mm
	"applewatchsport-42-aluminum-sportband-black": _.clone(old_AppleWatch42Device)
	"applewatchsport-42-aluminum-sportband-blue": _.clone(old_AppleWatch42Device)
	"applewatchsport-42-aluminum-sportband-green": _.clone(old_AppleWatch42Device)
	"applewatchsport-42-aluminum-sportband-pink": _.clone(old_AppleWatch42Device)
	"applewatchsport-42-aluminum-sportband-white": _.clone(old_AppleWatch42Device)
	"applewatch-42-black-bracelet": _.clone(old_AppleWatch42Device)
	"applewatch-42-steel-bracelet": _.clone(old_AppleWatch42Device)
	"applewatchedition-42-gold-buckle-blue": _.clone(old_AppleWatch42Device)
	"applewatchedition-42-gold-buckle-gray": _.clone(old_AppleWatch42Device)
	"applewatchedition-42-gold-buckle-red": _.clone(old_AppleWatch42Device)
	"applewatchedition-42-gold-sportband-black": _.clone(old_AppleWatch42Device)
	"applewatchedition-42-gold-sportband-white": _.clone(old_AppleWatch42Device)


exports.DeviceComponent.Devices = Devices

BuiltInDevices = _.keys(Devices)
