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

Device.nextHand()

# Events
Events.DeviceTypeDidChange
Events.DeviceFullScreenDidChange


###

# _.extend Events,
# 	DeviceTypeDidChange: "change:deviceType"
# 	DeviceScaleDidChange: "change:deviceScale"
# 	DeviceContentScaleDidChange: "change:contentScale"
# 	DeviceFullScreenDidChange: ""

centerLayer = (layer, snapToPixels = false) ->
	frame = layer.frame
	if layer.parent
		Utils.frameSetMidX(frame, (layer.parent.width  / 2.0) - layer.parent.borderWidth)
		Utils.frameSetMidY(frame, (layer.parent.height / 2.0) - layer.parent.borderWidth)
	else
		Utils.frameSetMidX(frame, layer._context.innerWidth  / 2.0)
		Utils.frameSetMidY(frame, layer._context.innerHeight / 2.0)

	if snapToPixels
		frame.x = Math.round(frame.x)
		frame.y = Math.round(frame.y)
	layer.frame = frame

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

		@Type =
			Tablet: "tablet"
			Phone: "phone"
			Computer: "computer"

	_setup: ->

		if @_setupDone
			return

		@_setupDone = true

		@background = new Layer
		@background.clip = true
		@background.backgroundColor = "transparent"
		@background.classList.add("DeviceBackground")

		@hands    = new Layer name: "hands"
		@handsImageLayer = new Layer parent: @hands, name: "handsImage"
		@phone    = new Layer parent: @hands, name: "phone"
		# This background is made slightly bigger than the screen to prevent the background shining through cracks
		@screenBackground = new Layer parent: @hands, name: "screenBackground", backgroundColor: "black"
		@screen   = new Layer parent: @hands, name: "phone"
		@viewport = new Layer parent: @screen, name: "screen"
		@content  = new Layer parent: @viewport, name: "viewport"
		@screenMask = new Layer parent: @screen, name: "mask", backgroundColor: null

		@content.classList.add("DeviceContent")

		@hands.backgroundColor = "transparent"
		@hands._alwaysUseImageCache = true
		@handsImageLayer.backgroundColor = "transparent"
		@hands.classList.add("DeviceHands")

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

		Framer.CurrentContext.domEventManager.wrap(window).addEventListener("resize", @_update) unless Utils.isMobile()
		Framer.CurrentContext.domEventManager.wrap(window).addEventListener("resize", @_orientationChange) if Utils.isMobile()

		# This avoids rubber banding on mobile
		for layer in [@background, @phone, @viewport, @content, @screen, @screenMask]
			layer.on "touchmove", (event) -> event.preventDefault()

		@screenMask.ignoreEvents = true
		@phone.ignoreEvents = true

		@_context = new Framer.Context(parent: @content, name: "DeviceScreen")
		@_context.perspective = 1200
		@_context.device = @
		@on "change:orientation", ->
			if Screen.size isnt Screen.height
				Screen.emit("resize")

	_update: =>

		# Todo: pixel align at zoom level 1, 0.5

		contentScaleFactor = @contentScale
		contentScaleFactor = 1 if contentScaleFactor > 1
		screenSizeChanged = false
		if @_shouldRenderFullScreen()

			width = document.documentElement.clientWidth / contentScaleFactor
			height = document.documentElement.clientHeight / contentScaleFactor
			screenSizeChanged = @content.width isnt width or @content.height isnt height
			for layer in [@background, @hands, @phone, @viewport, @content, @screen, @screenMask]
				layer.x = layer.y = 0
				layer.width = width
				layer.height = height
				layer.scale = 1

			@content.scale = contentScaleFactor
			if @deviceType isnt "fullscreen" or Utils.isMobile()
				screenSizeChanged = screenSizeChanged or @_context.devicePixelRatio isnt window.devicePixelRatio
				@_context.devicePixelRatio = window.devicePixelRatio
			@screenBackground.visible = @deviceType isnt "fullscreen"

			if Utils.isMobile()
				@screenMask.visible = false
			else
				@_updateMaskImage()
		else
			backgroundOverlap = 100

			@background.x = 0 - backgroundOverlap
			@background.y = 0 - backgroundOverlap
			@background.width  = window.innerWidth  + (2 * backgroundOverlap)
			@background.height = window.innerHeight + (2 * backgroundOverlap)

			@_updateDeviceImage()
			@_updateMaskImage()
			@screenMask.visible = @hideBezel
			@hands.scale = @_calculatePhoneScale()
			centerLayer(@hands, true)
			centerLayer(@phone)

			[width, height] = @_getOrientationDimensions(
				@_device.screenWidth / contentScaleFactor,
				@_device.screenHeight / contentScaleFactor)

			@screenMask.width = @screen.width = @viewport.width = @_device.screenWidth
			@screenMask.height = @screen.height = @viewport.height = @_device.screenHeight
			screenSizeChanged = @content.width isnt width or @content.height isnt height
			@content.width  = width
			@content.height = height
			@screenBackground.width = @screen.width + 40
			@screenBackground.height = @screen.height + 40
			@setHand(@selectedHand) if @selectedHand and @_orientation is 0
			centerLayer(@screenBackground)
			centerLayer(@screen)
			centerLayer(@screenMask)

			pixelRatio = @_device.devicePixelRatio ? 1
			screenSizeChanged = screenSizeChanged or @_context.devicePixelRatio isnt pixelRatio
			@_context.devicePixelRatio = pixelRatio
			if window.devicePixelRatio is pixelRatio and Utils.isDesktop()
				# On desktop rendering natively without scaling looks better, so do that
				@_context.renderUsingNativePixelRatio = true
				@content.scale = pixelRatio
			else
				@_context.renderUsingNativePixelRatio = false
				@content.scale = 1

		if screenSizeChanged
			Screen.emit("resize")

	_shouldRenderFullScreen: ->

		if not @_device
			return true

		if @fullScreen is true
			return true

		if @deviceType is "fullscreen"
			return true

		if Utils.isInsideIframe()
			return false

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

	platform: ->
		if /google|nexus|htc|samsung|sony-smartwatch/.test(@deviceType)
			return "Android"
		if /iphone|ipad/.test(@deviceType)
			return "iOS"
		if /apple-watch|applewatch/.test(@deviceType)
			return "watchOS"
		if /apple|safari/.test(@deviceType)
			return "macOS"
		if /microsoft|dell/.test(@deviceType)
			return "Windows"
		return null

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
		@_updateMaskImage()

		@_update()
		@emit("change:fullScreen")

	@define "screenSize",
		get: ->
			if @_shouldRenderFullScreen()
				size = Canvas.size
			else if @isLandscape
				size =
					width: @_device.screenHeight
					height: @_device.screenWidth
			else
				size =
					width: @_device.screenWidth
					height: @_device.screenHeight
			size.width /= @_context.devicePixelRatio
			size.height /= @_context.devicePixelRatio
			return size

	###########################################################################
	# DEVICE TYPE

	customize: (deviceProps) =>
		Devices.custom = _.defaults deviceProps, Devices.custom
		@deviceType = "custom"
		@_update()

	@define "deviceType",
		get: ->
			@_deviceType
		set: (deviceType) ->

			if deviceType is @_deviceType and deviceType isnt "custom"
				return

			device = null

			if _.isString(deviceType)
				lDevicetype = deviceType.toLowerCase()
				for key in _.keys(Devices)
					lKey = key.toLowerCase()
					device = Devices[key] if lDevicetype is lKey

			if not device
				throw Error "No device named #{deviceType}. Options are: #{_.keys Devices}"

			if @_device is device
				return

			# If we switch from fullscreen to a device, we should zoom to fit
			shouldZoomToFit = @_deviceType is "fullscreen"

			@screen.backgroundColor = "black"
			@screen.backgroundColor = device.backgroundColor if device.backgroundColor?

			if device.deviceType is "computer"
				Utils.domComplete ->
					document.body.style.cursor = "auto"

			@_device = _.clone(device)
			@_deviceType = deviceType
			@fullscreen = false
			@_updateDeviceImage()
			@_updateMaskImage()
			@_update()
			@emit("change:deviceType")

			@viewport.point = @_viewportOrientationOffset()

			if shouldZoomToFit
				@deviceScale = "fit"

	_updateDeviceImage: =>

		if /PhantomJS/.test(navigator.userAgent)
			return

		if @_shouldRenderFullScreen() or @hideBezel
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

	_updateMaskImage: =>
		if @_device.screenMask
			@phone.bringToFront()
			@screenMask.image = @_deviceImageUrl(@_device.screenMask)
			@screenMask.visible = true
		else
			@screenMask.image = null
			@screenMask.visible = false
			@phone.placeBehind(@screen)

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
		if @_deviceType not in BuiltInDevices or @_deviceType is "custom"
			return name

		# We want to get these image from our public resources server
		resourceUrl = "//resources.framerjs.com/static/DeviceResources"

		# If we are running a local copy of Framer from the drive, get the resource online
		if Utils.isFileUrl(window.location.href)
			resourceUrl = "http:#{resourceUrl}"

		# If we're running Framer Studio and have local files, we'd like to use those.
		# For now we always use jp2 inside framer stusio
		if Utils.isFramerStudio() and window.FramerStudioInfo
			if @_device.minStudioVersion and Utils.framerStudioVersion() >= @_device.minStudioVersion or not @_device.minStudioVersion
				if @_device.maxStudioVersion and Utils.framerStudioVersion() <= @_device.maxStudioVersion or not @_device.maxStudioVersion
					resourceUrl = window.FramerStudioInfo.deviceImagesUrl
					return "#{resourceUrl}/#{name.replace(".png", ".jp2")}"

		# We'd like to use jp2/webp if possible, or check if we don't for this specific device
		if @_device.deviceImageCompression is true
			if Utils.isWebPSupported()
				return "#{resourceUrl}/#{name.replace(".png", ".webp")}"
			if Utils.isJP2Supported()
				return "#{resourceUrl}/#{name.replace(".png", ".jp2")}"

		return "#{resourceUrl}/#{name}"

	@define "hideBezel",
		get: ->
			return false if not Utils.isFramerStudio()
			return (@_hideBezel ? false)
		set: (hideBezel) ->
			return if not Utils.isFramerStudio()
			@_hideBezel = hideBezel
			@_update()

	###########################################################################
	# DEVICE ZOOM

	@define "deviceScale",
		get: ->
			if @_shouldRenderFullScreen()
				return 1
			return @_deviceScale or 1
		set: (deviceScale) -> @setDeviceScale(deviceScale, false)

	setDeviceScale: (deviceScale, animate=false) ->

		if deviceScale is "fit" or deviceScale < 0
			deviceScale = "fit"
		else
			deviceScale = parseFloat(deviceScale)

		if deviceScale is @_deviceScale
			return

		@_deviceScale = deviceScale

		if @_shouldRenderFullScreen()
			return

		if deviceScale is "fit"
			phoneScale = @_calculatePhoneScale()
		else
			phoneScale = deviceScale

		@hands.animateStop()

		if animate
			@hands.animate _.extend @animationOptions,
				properties: {scale: phoneScale}
		else
			@hands.scale = phoneScale
			centerLayer(@hands, true)

		@emit("change:deviceScale")


	_calculatePhoneScale: ->

		# Calculates a phone scale that fits the screen unless a fixed value is set
		dimension = if @hideBezel then @screen else @phone

		[width, height] = @_getOrientationDimensions(dimension.width, dimension.height)

		if @hideBezel
			padding = 0
		else
			paddingOffset = @_device?.paddingOffset or 0
			padding = (@padding + paddingOffset) * 2

		phoneScale = _.min([
			(window.innerWidth  - padding) / width,
			(window.innerHeight - padding) / height
		])

		# Only scale in fixed steps, to reduce blurriness, and pixel cracks
		phoneScale = Math.floor(phoneScale * 1024.0) / 1024.0
		phoneScale = 1 / 64.0 if phoneScale < 1 / 64.0

		unless Utils.isFramerStudio() and @hideBezel
			# If close to a nice round scaling, snap to it
			if 30/64 < phoneScale < 35/64
				phoneScale = 32/64
			else if 15/64 < phoneScale < 18/64
				phoneScale = 16/64

		# Never scale the phone beyond 100%
		phoneScale = 1 if phoneScale > 1 and not @hideBezel

		@emit("change:phoneScale", phoneScale)

		# If the device has a set scale we use that one
		if @_deviceScale and @_deviceScale isnt "fit"
			return @_deviceScale

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
		get: ->
			return window.orientation if Utils.isMobile()
			return @_orientation or 0

		set: (orientation) -> @setOrientation(orientation, false)

	setOrientation: (orientation, animate=false) ->

		orientation *= -1 if Utils.framerStudioVersion() is oldDeviceMaxVersion

		if orientation is "portrait"
			orientation = 0

		if orientation is "landscape"
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
			rotationZ: -@_orientation
			scale: @_calculatePhoneScale()

		contentProperties = @_viewportOrientationOffset()

		@hands.animateStop()
		@viewport.animateStop()

		if animate
			animation = @hands.animate _.extend @animationOptions,
				properties: phoneProperties
			@viewport.animate _.extend @animationOptions,
				properties: contentProperties

			animation.on Events.AnimationEnd, =>
				@_update()

		else
			@hands.props = phoneProperties
			@viewport.props = contentProperties
			@_update()

		@handsImageLayer.image = "" if @_orientation isnt 0

		@emit("change:orientation", @_orientation)

	_viewportOrientationOffset: =>

		[width, height] = @_getOrientationDimensions(@_device.screenWidth, @_device.screenHeight)

		@content.width = width
		@content.height = height

		offset = (@screen.width - width) / 2
		offset *= -1 if @_orientation is -90

		[x, y] = [0, 0]

		if @isLandscape
			x = offset
			y = offset

		return contentProperties =
			rotationZ: @_orientation
			x: x
			y: y

	_orientationChange: =>
		@_orientation = window.orientation
		@_update()
		@emit("change:orientation", window.orientation)

	@define "isPortrait", get: -> Math.abs(@orientation) % 180 is 0
	@define "isLandscape", get: -> not @isPortrait

	@define "orientationName",
		get: ->
			return "portrait" if @isPortrait
			return "landscape" if @isLandscape
		set: (orientationName) -> @setOrientation(orientationName, false)

	rotateLeft: (animate=true) ->
		return if @orientation is 90
		@setOrientation(@orientation + 90, animate)

	rotateRight: (animate=true) ->
		return if @orientation is -90
		@setOrientation(@orientation - 90, animate)

	_getOrientationDimensions: (width, height) ->
		if @isLandscape then [height, width] else [width, height]

	###########################################################################
	# HANDS

	handSwitchingSupported: ->
		return @_device.hands isnt undefined and not @hideBezel

	nextHand: ->
		return if @hands.rotationZ isnt 0
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
		return @handsImageLayer.image = "" if not hand or not @handSwitchingSupported()

		handData = @_device.hands[hand]
		if handData
			@hands.width = handData.width
			@hands.height = handData.height
			centerLayer(@hands, true)
			centerLayer(@phone)
			@handsImageLayer.size = @hands.size
			@handsImageLayer.y = 0
			@handsImageLayer.y = handData.offset if handData.offset
			@handsImageLayer.image = @handImageUrl(hand)
			return hand

	handImageUrl: (hand) ->

		# We want to get these image from our public resources server
		resourceUrl = "//resources.framerjs.com/static/DeviceResources"

		# If we are running a local copy of Framer from the drive, get the resource online
		if Utils.isFileUrl(window.location.href)
			resourceUrl = "http://#{resourceUrl}"

		# If we're running Framer Studio and have local files, we'd like to use those
		if Utils.isFramerStudio() and window.FramerStudioInfo and Utils.framerStudioVersion() >= newDeviceMinVersion
			resourceUrl = window.FramerStudioInfo.deviceImagesUrl
			return "#{resourceUrl}/#{hand}.png"

		if Utils.isWebPSupported()
			return "#{resourceUrl}/#{hand}.webp"
		if Utils.isJP2Supported()
			return "#{resourceUrl}/#{hand}.jp2"

		return "#{resourceUrl}/#{hand}.png"

	toInspect: ->
		return "<Device '#{@deviceType}' #{@screenSize.width}x#{@screenSize.height}>"


###########################################################################
# DEVICE CONFIGURATIONS

iPhoneXReleaseVersion = 105
googlePixelReleaseVersion = 75
desktopReleaseVersion = 70
newDeviceMinVersion = 53
oldDeviceMaxVersion = 52
redesignMaxVersion = 92

iPadAir2BaseDevice =
	deviceImageWidth: 1856
	deviceImageHeight: 2608
	deviceImageCompression: true
	screenWidth: 1536
	screenHeight: 2048
	devicePixelRatio: 2
	deviceType: "tablet"
	minStudioVersion: newDeviceMinVersion

iPadMini4BaseDevice =
	deviceImageWidth: 1936
	deviceImageHeight: 2688
	deviceImageCompression: true
	screenWidth: 1536
	screenHeight: 2048
	devicePixelRatio: 2
	deviceType: "tablet"
	minStudioVersion: newDeviceMinVersion

iPadProBaseDevice =
	deviceImageWidth: 2448
	deviceImageHeight: 3432
	deviceImageCompression: true
	screenWidth: 2048
	screenHeight: 2732
	devicePixelRatio: 2
	deviceType: "tablet"
	minStudioVersion: newDeviceMinVersion

iPhoneXBaseDevice =
	deviceImageWidth: 1405
	deviceImageHeight: 2796
	deviceImageCompression: true
	screenWidth: 1125
	screenHeight: 2436
	devicePixelRatio: 3
	deviceType: "phone"
	minStudioVersion: iPhoneXReleaseVersion
	screenMask: "apple-iphone-x-mask.svg"
	hands:
		"iphone-hands-2":
			width: 3567
			height: 5558
			offset: -15
		"iphone-hands-1":
			width: 3567
			height: 5558
			offset: -15

iPhone8BaseDevice =
	deviceImageWidth: 871
	deviceImageHeight: 1776
	deviceImageCompression: true
	screenWidth: 750
	screenHeight: 1334
	devicePixelRatio: 2
	deviceType: "phone"
	minStudioVersion: iPhoneXReleaseVersion
	hands:
		"iphone-hands-2":
			width: 2399
			height: 3738
		"iphone-hands-1":
			width: 2399
			height: 3738

iPhone8PlusBaseDevice =
	deviceImageWidth: 1436
	deviceImageHeight: 2876
	deviceImageCompression: true
	screenWidth: 1242
	screenHeight: 2208
	devicePixelRatio: 3
	deviceType: "phone"
	minStudioVersion: iPhoneXReleaseVersion
	hands:
		"iphone-hands-2":
			width: 3949
			height: 6154
			offset: -15
		"iphone-hands-1":
			width: 3949
			height: 6154
			offset: -15

iPhone7BaseDevice =
	deviceImageWidth: 874
	deviceImageHeight: 1792
	deviceImageCompression: true
	screenWidth: 750
	screenHeight: 1334
	devicePixelRatio: 2
	deviceType: "phone"
	minStudioVersion: 71
	maxStudioVersion: iPhoneXReleaseVersion - 1
	hands:
		"iphone-hands-2":
			width: 2400
			height: 3740
		"iphone-hands-1":
			width: 2400
			height: 3740

iPhone7PlusBaseDevice =
	deviceImageWidth: 1452
	deviceImageHeight: 2968
	deviceImageCompression: true
	screenWidth: 1242
	screenHeight: 2208
	devicePixelRatio: 3
	deviceType: "phone"
	minStudioVersion: 71
	maxStudioVersion: iPhoneXReleaseVersion - 1
	hands:
		"iphone-hands-2":
			width: 3987
			height: 6212
		"iphone-hands-1":
			width: 3987
			height: 6212

iPhone6BaseDevice =
	deviceImageWidth: 874
	deviceImageHeight: 1792
	deviceImageCompression: true
	screenWidth: 750
	screenHeight: 1334
	devicePixelRatio: 2
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	maxStudioVersion: redesignMaxVersion
	hands:
		"iphone-hands-2":
			width: 2400
			height: 3740
		"iphone-hands-1":
			width: 2400
			height: 3740

iPhone6PlusBaseDevice =
	deviceImageWidth: 1452
	deviceImageHeight: 2968
	deviceImageCompression: true
	screenWidth: 1242
	screenHeight: 2208
	devicePixelRatio: 3
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	maxStudioVersion: redesignMaxVersion
	hands:
		"iphone-hands-2":
			width: 3987
			height: 6212
		"iphone-hands-1":
			width: 3987
			height: 6212

iPhoneSEBaseDevice =
	deviceImageWidth: 768
	deviceImageHeight: 1610
	deviceImageCompression: true
	screenWidth: 640
	screenHeight: 1136
	devicePixelRatio: 2
	deviceType: "phone"
	minStudioVersion: iPhoneXReleaseVersion
	hands:
		"iphone-hands-2":
			width: 2098
			height: 3269
			offset: 19
		"iphone-hands-1":
			width: 2098
			height: 3269
			offset: 19

iPhone5BaseDevice =
	deviceImageWidth: 768
	deviceImageHeight: 1612
	deviceImageCompression: true
	screenWidth: 640
	screenHeight: 1136
	devicePixelRatio: 2
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	hands:
		"iphone-hands-2":
			width: 2098
			height: 3269
			offset: 19
		"iphone-hands-1":
			width: 2098
			height: 3269
			offset: 19

iPhone5CBaseDevice =
	deviceImageWidth: 776
	deviceImageHeight: 1620
	deviceImageCompression: true
	screenWidth: 640
	screenHeight: 1136
	devicePixelRatio: 2
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	hands:
		"iphone-hands-2":
			width: 2098
			height: 3269
			offset: 28
		"iphone-hands-1":
			width: 2098
			height: 3269
			offset: 28

Nexus4BaseDevice =
	deviceImageWidth: 860
	deviceImageHeight: 1668
	deviceImageCompression: true
	screenWidth: 768
	screenHeight: 1280
	devicePixelRatio: 2
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	maxStudioVersion: iPhoneXReleaseVersion - 1
	hands:
		"iphone-hands-2":
			width: 2362
			height: 3681
			offset: -52
		"iphone-hands-1":
			width: 2362
			height: 3681
			offset: -52

Nexus5BaseDevice =
	deviceImageWidth: 1204
	deviceImageHeight: 2432
	deviceImageCompression: true
	screenWidth: 1080
	screenHeight: 1920
	devicePixelRatio: 3
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	hands:
		"iphone-hands-2":
			width: 3292
			height: 5130
			offset: 8
		"iphone-hands-1":
			width: 3292
			height: 5130
			offset: 8

Nexus6BaseDevice =
	deviceImageWidth: 1576
	deviceImageHeight: 3220
	deviceImageCompression: true
	screenWidth: 1440
	screenHeight: 2560
	devicePixelRatio: 3.5
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	hands:
		"iphone-hands-2":
			width: 4304
			height: 6707
			offset: 8
		"iphone-hands-1":
			width: 4304
			height: 6707
			offset: 8

PixelBaseDevice =
	deviceImageWidth: 1224
	deviceImageHeight: 2492
	deviceImageCompression: true
	screenWidth: 1080
	screenHeight: 1920
	devicePixelRatio: 2.627
	deviceType: "phone"
	minStudioVersion: googlePixelReleaseVersion
	maxStudioVersion: iPhoneXReleaseVersion - 1
	hands:
		"iphone-hands-2":
			width: 3344
			height: 5211
			offset: 23
		"iphone-hands-1":
			width: 3344
			height: 5211
			offset: 23

Pixel2BaseDevice =
	deviceImageWidth: 1210
	deviceImageHeight: 2513
	deviceImageCompression: true
	screenWidth: 1080
	screenHeight: 1920
	devicePixelRatio: 2.627
	deviceType: "phone"
	minStudioVersion: iPhoneXReleaseVersion
	hands:
		"iphone-hands-2":
			width: 3316
			height: 5167
		"iphone-hands-1":
			width: 3316
			height: 5167

Pixel2XLBaseDevice =
	deviceImageWidth: 1650
	deviceImageHeight: 3364
	deviceImageCompression: true
	screenWidth: 1440
	screenHeight: 2880
	devicePixelRatio: 4
	deviceType: "phone"
	minStudioVersion: iPhoneXReleaseVersion
	screenMask: "google-pixel-2-xl-mask.svg"
	hands:
		"iphone-hands-2":
			width: 4530
			height: 7059
		"iphone-hands-1":
			width: 4521
			height: 7045



Nexus9BaseDevice =
	deviceImageWidth: 1896
	deviceImageHeight: 2648
	deviceImageCompression: true
	screenWidth: 1536
	screenHeight: 2048
	devicePixelRatio: 2
	deviceType: "tablet"
	minStudioVersion: newDeviceMinVersion

HTCa9BaseDevice =
	deviceImageWidth: 1252
	deviceImageHeight: 2592
	deviceImageCompression: true
	screenWidth: 1080
	screenHeight: 1920
	devicePixelRatio: 3
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	hands:
		"iphone-hands-2":
			width: 3436
			height: 5354
			offset: 36
		"iphone-hands-1":
			width: 3436
			height: 5354
			offset: 36

HTCm8BaseDevice =
	deviceImageWidth: 1232
	deviceImageHeight: 2572
	deviceImageCompression: true
	screenWidth: 1080
	screenHeight: 1920
	devicePixelRatio: 3
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	hands:
		"iphone-hands-2":
			width: 3436
			height: 5354
			offset: 12
		"iphone-hands-1":
			width: 3436
			height: 5354
			offset: 12

MSFTLumia950BaseDevice =
	deviceImageWidth: 1660
	deviceImageHeight: 3292
	deviceImageCompression: true
	screenWidth: 1440
	screenHeight: 2560
	devicePixelRatio: 4
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	hands:
		"iphone-hands-2":
			width: 4494
			height: 7003
			offset: -84
		"iphone-hands-1":
			width: 4494
			height: 7003
			offset: -84

SamsungGalaxyNote5BaseDevice =
	deviceImageWidth: 1572
	deviceImageHeight: 3140
	deviceImageCompression: true
	screenWidth: 1440
	screenHeight: 2560
	devicePixelRatio: 4
	deviceType: "phone"
	minStudioVersion: newDeviceMinVersion
	hands:
		"iphone-hands-2":
			width: 4279
			height: 6668
			offset: -24
		"iphone-hands-1":
			width: 4279
			height: 6668
			offset: -84


SamsungGalaxyS8BaseDevice =
	deviceImageWidth: 1536
	deviceImageHeight: 3334
	deviceImageCompression: true
	screenWidth: 1440
	screenHeight: 2960
	devicePixelRatio: 4
	deviceType: "phone"
	minStudioVersion: iPhoneXReleaseVersion
	screenMask: "samsung-galaxy-s8-mask.svg"
	hands:
		"iphone-hands-2":
			width: 4210
			height: 6560
		"iphone-hands-1":
			width: 4210
			height: 6560


AppleWatchSeries242Device =
	deviceImageWidth: 512
	deviceImageHeight: 990
	deviceImageCompression: true
	screenWidth: 312
	screenHeight: 390
	devicePixelRatio: 2
	minStudioVersion: 71

AppleWatchSeries238Device =
	deviceImageWidth: 472
	deviceImageHeight: 772
	deviceImageCompression: true
	screenWidth: 272
	screenHeight: 340
	devicePixelRatio: 2
	minStudioVersion: 71

AppleWatch42Device =
	deviceImageWidth: 512
	deviceImageHeight: 990
	deviceImageCompression: true
	screenWidth: 312
	screenHeight: 390
	devicePixelRatio: 2
	minStudioVersion: newDeviceMinVersion
	maxStudioVersion: redesignMaxVersion

AppleWatch38Device =
	deviceImageWidth: 472
	deviceImageHeight: 772
	deviceImageCompression: true
	screenWidth: 272
	screenHeight: 340
	devicePixelRatio: 2
	minStudioVersion: newDeviceMinVersion
	maxStudioVersion: redesignMaxVersion

AppleWatch38BlackLeatherDevice =
	deviceImageWidth: 472
	deviceImageHeight: 796
	deviceImageCompression: true
	screenWidth: 272
	screenHeight: 340
	devicePixelRatio: 2
	minStudioVersion: newDeviceMinVersion
	maxStudioVersion: redesignMaxVersion

SonySmartwatch3Base =
	deviceImageWidth: 444
	deviceImageHeight: 780
	deviceImageCompression: true
	screenWidth: 320
	screenHeight: 320
	devicePixelRatio: 1.5
	minStudioVersion: iPhoneXReleaseVersion

AppleMacBook =
	deviceImageWidth: 3084
	deviceImageHeight: 1860
	deviceImageCompression: true
	screenWidth: 2304
	screenHeight: 1440
	devicePixelRatio: 2
	deviceType: "computer"
	minStudioVersion: desktopReleaseVersion

AppleMacBookAir =
	deviceImageWidth: 2000
	deviceImageHeight: 1220
	deviceImageCompression: true
	screenWidth: 1440
	screenHeight: 900
	devicePixelRatio: 1
	deviceType: "computer"
	minStudioVersion: desktopReleaseVersion

AppleMacBookPro =
	deviceImageWidth: 3820
	deviceImageHeight: 2320
	deviceImageCompression: true
	screenWidth: 2880
	screenHeight: 1800
	devicePixelRatio: 2
	deviceType: "computer"
	minStudioVersion: desktopReleaseVersion

AppleIMac =
	deviceImageWidth: 5600
	deviceImageHeight: 5880
	deviceImageCompression: true
	screenWidth: 5120
	screenHeight: 2880
	devicePixelRatio: 2
	deviceType: "computer"
	minStudioVersion: desktopReleaseVersion

AppleThunderboltDisplay =
	deviceImageWidth: 2788
	deviceImageHeight: 2580
	deviceImageCompression: true
	screenWidth: 2560
	screenHeight: 1440
	devicePixelRatio: 1
	deviceType: "computer"
	minStudioVersion: iPhoneXReleaseVersion


DellXPS =
	deviceImageWidth: 5200
	deviceImageHeight: 3040
	deviceImageCompression: true
	screenWidth: 3840
	screenHeight: 2160
	devicePixelRatio: 2
	deviceType: "computer"
	minStudioVersion: desktopReleaseVersion

SonyW85OC =
	deviceImageWidth: 1320
	deviceImageHeight: 860
	deviceImageCompression: true
	screenWidth: 1280
	screenHeight: 720
	devicePixelRatio: 1
	minStudioVersion: desktopReleaseVersion

MicrosoftSurfaceBook =
	deviceImageWidth: 4102
	deviceImageHeight: 2474
	deviceImageCompression: true
	screenWidth: 3000
	screenHeight: 2000
	devicePixelRatio: 2
	deviceType: "computer"
	minStudioVersion: iPhoneXReleaseVersion

MicrosoftSurfacePro3 =
	deviceImageWidth: 2472
	deviceImageHeight: 1704
	deviceImageCompression: true
	screenWidth: 2160
	screenHeight: 1440
	devicePixelRatio: 1.5
	deviceType: "tablet"
	minStudioVersion: iPhoneXReleaseVersion

MicrosoftSurfacePro4 =
	deviceImageWidth: 3064
	deviceImageHeight: 2120
	deviceImageCompression: true
	screenWidth: 2736
	screenHeight: 1824
	devicePixelRatio: 2
	deviceType: "tablet"
	minStudioVersion: iPhoneXReleaseVersion



###########################################################################
# OLD DEVICE CONFIGURATIONS

old_iPhone6BaseDevice =
	deviceImageWidth: 870
	deviceImageHeight: 1738
	deviceImageCompression: true
	screenWidth: 750
	screenHeight: 1334
	devicePixelRatio: 2
	deviceType: "phone"
	maxStudioVersion: oldDeviceMaxVersion

old_iPhone6BaseDeviceHand = _.extend {}, old_iPhone6BaseDevice,
	deviceImageWidth: 1988
	deviceImageHeight: 2368
	deviceImageCompression: true
	paddingOffset: -150
	maxStudioVersion: oldDeviceMaxVersion

old_iPhone6PlusBaseDevice =
	deviceImageWidth: 1460
	deviceImageHeight: 2900
	deviceImageCompression: true
	screenWidth: 1242
	screenHeight: 2208
	devicePixelRatio: 3
	deviceType: "phone"
	maxStudioVersion: oldDeviceMaxVersion

old_iPhone6PlusBaseDeviceHand = _.extend {}, old_iPhone6PlusBaseDevice,
	deviceImageWidth: 3128
	deviceImageHeight: 3487
	deviceImageCompression: true
	paddingOffset: -150
	maxStudioVersion: oldDeviceMaxVersion

old_iPhone5BaseDevice =
	deviceImageWidth: 780
	deviceImageHeight: 1608
	deviceImageCompression: true
	screenWidth: 640
	screenHeight: 1136
	devicePixelRatio: 2
	deviceType: "phone"
	maxStudioVersion: oldDeviceMaxVersion

old_iPhone5BaseDeviceHand = _.extend {}, old_iPhone5BaseDevice,
	deviceImageWidth: 1884
	deviceImageHeight: 2234
	deviceImageCompression: true
	paddingOffset: -200
	maxStudioVersion: oldDeviceMaxVersion

old_iPhone5CBaseDevice =
	deviceImageWidth: 776
	deviceImageHeight: 1612
	deviceImageCompression: true
	screenWidth: 640
	screenHeight: 1136
	devicePixelRatio: 2
	deviceType: "phone"
	maxStudioVersion: oldDeviceMaxVersion

old_iPhone5CBaseDeviceHand = _.extend {}, old_iPhone5CBaseDevice,
	deviceImageWidth: 1894
	deviceImageHeight: 2244
	deviceImageCompression: true
	paddingOffset: -200
	maxStudioVersion: oldDeviceMaxVersion

old_iPadMiniBaseDevice =
	deviceImageWidth: 872
	deviceImageHeight: 1292
	deviceImageCompression: true
	screenWidth: 768
	screenHeight: 1024
	devicePixelRatio: 1
	deviceType: "tablet"
	maxStudioVersion: oldDeviceMaxVersion

old_iPadMiniBaseDeviceHand = _.extend {}, old_iPadMiniBaseDevice,
	deviceImageWidth: 1380
	deviceImageHeight: 2072
	deviceImageCompression: true
	paddingOffset: -120
	maxStudioVersion: oldDeviceMaxVersion

old_iPadAirBaseDevice =
	deviceImageWidth: 1769
	deviceImageHeight: 2509
	deviceImageCompression: true
	screenWidth: 1536
	screenHeight: 2048
	devicePixelRatio: 2
	deviceType: "tablet"
	maxStudioVersion: oldDeviceMaxVersion

old_iPadAirBaseDeviceHand = _.extend {}, old_iPadAirBaseDevice,
	deviceImageWidth: 4744
	deviceImageHeight: 4101
	deviceImageCompression: true
	paddingOffset: -120
	maxStudioVersion: oldDeviceMaxVersion

old_Nexus5BaseDevice =
	deviceImageWidth: 1208
	deviceImageHeight: 2440
	deviceImageCompression: true
	screenWidth: 1080
	screenHeight: 1920
	devicePixelRatio: 3
	deviceType: "phone"
	maxStudioVersion: oldDeviceMaxVersion

old_Nexus5BaseDeviceHand = _.extend {}, old_Nexus5BaseDevice, # 2692 × 2996
	deviceImageWidth: 2692
	deviceImageHeight: 2996
	deviceImageCompression: true
	paddingOffset: -120
	maxStudioVersion: oldDeviceMaxVersion

old_Nexus9BaseDevice =
	deviceImageWidth: 1733
	deviceImageHeight: 2575
	deviceImageCompression: true
	screenWidth: 1536
	screenHeight: 2048
	devicePixelRatio: 2
	deviceType: "tablet"
	maxStudioVersion: oldDeviceMaxVersion

old_AppleWatch42Device =
	deviceImageWidth: 552
	deviceImageHeight: 938
	deviceImageCompression: true
	screenWidth: 312
	screenHeight: 390
	devicePixelRatio: 2
	maxStudioVersion: oldDeviceMaxVersion

old_AppleWatch38Device =
	deviceImageWidth: 508
	deviceImageHeight: 900
	deviceImageCompression: true
	screenWidth: 272
	screenHeight: 340
	devicePixelRatio: 2
	maxStudioVersion: oldDeviceMaxVersion

Devices =

	"fullscreen":
		name: "Fullscreen"
		deviceType: "desktop"
		backgroundColor: "transparent"

	"custom":
		name: "Custom"
		deviceImageWidth: 874
		deviceImageHeight: 1792
		screenWidth: 750
		screenHeight: 1334
		devicePixelRatio: 2
		deviceType: "phone"

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

	# iPhone X
	"apple-iphone-x-silver": _.clone(iPhoneXBaseDevice)
	"apple-iphone-x-space-gray": _.clone(iPhoneXBaseDevice)

	# iPhone 8
	"apple-iphone-8-silver": _.clone(iPhone8BaseDevice)
	"apple-iphone-8-gold": _.clone(iPhone8BaseDevice)
	"apple-iphone-8-space-gray": _.clone(iPhone8BaseDevice)

	# iPhone 8 Plus
	"apple-iphone-8-plus-silver": _.clone(iPhone8PlusBaseDevice)
	"apple-iphone-8-plus-gold": _.clone(iPhone8PlusBaseDevice)
	"apple-iphone-8-plus-space-gray": _.clone(iPhone8PlusBaseDevice)

	# iPhone 7
	"apple-iphone-7-gold": _.clone(iPhone7BaseDevice)
	"apple-iphone-7-rose-gold": _.clone(iPhone7BaseDevice)
	"apple-iphone-7-silver": _.clone(iPhone7BaseDevice)
	"apple-iphone-7-black": _.clone(iPhone7BaseDevice)
	"apple-iphone-7-jet-black": _.clone(iPhone7BaseDevice)

	# iPhone 7 Plus
	"apple-iphone-7-plus-gold": _.clone(iPhone7PlusBaseDevice)
	"apple-iphone-7-plus-rose-gold": _.clone(iPhone7PlusBaseDevice)
	"apple-iphone-7-plus-silver": _.clone(iPhone7PlusBaseDevice)
	"apple-iphone-7-plus-black": _.clone(iPhone7PlusBaseDevice)
	"apple-iphone-7-plus-jet-black": _.clone(iPhone7PlusBaseDevice)

	# iPhone 6s
	"apple-iphone-6s-gold": _.clone(iPhone6BaseDevice)
	"apple-iphone-6s-rose-gold": _.clone(iPhone6BaseDevice)
	"apple-iphone-6s-silver": _.clone(iPhone6BaseDevice)
	"apple-iphone-6s-space-gray": _.clone(iPhone6BaseDevice)

	# iPhone 6s Plus
	"apple-iphone-6s-plus-gold": _.clone(iPhone6PlusBaseDevice)
	"apple-iphone-6s-plus-rose-gold": _.clone(iPhone6PlusBaseDevice)
	"apple-iphone-6s-plus-silver": _.clone(iPhone6PlusBaseDevice)
	"apple-iphone-6s-plus-space-gray": _.clone(iPhone6PlusBaseDevice)

	# iPhone SE
	"apple-iphone-se-gold": _.clone(iPhoneSEBaseDevice)
	"apple-iphone-se-silver": _.clone(iPhoneSEBaseDevice)
	"apple-iphone-se-space-gray": _.clone(iPhoneSEBaseDevice)
	"apple-iphone-se-rose-gold": _.clone(iPhoneSEBaseDevice)

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

	# Apple Watch Series 2 38mm
	"apple-watch-series-2-38mm-black-steel-black": _.clone(AppleWatchSeries238Device)
	"apple-watch-series-2-38mm-edition": _.clone(AppleWatchSeries238Device)
	"apple-watch-series-2-38mm-rose-gold-aluminum-midnight-blue": _.clone(AppleWatchSeries238Device)
	"apple-watch-series-2-38mm-silver-aluminum-cocoa": _.clone(AppleWatchSeries238Device)
	"apple-watch-series-2-38mm-silver-aluminum-concrete": _.clone(AppleWatchSeries238Device)
	"apple-watch-series-2-38mm-silver-aluminum-ocean-blue": _.clone(AppleWatchSeries238Device)
	"apple-watch-series-2-38mm-silver-aluminum-red": _.clone(AppleWatchSeries238Device)
	"apple-watch-series-2-38mm-silver-aluminum-turquoise": _.clone(AppleWatchSeries238Device)
	"apple-watch-series-2-38mm-silver-aluminum-white": _.clone(AppleWatchSeries238Device)
	"apple-watch-series-2-38mm-silver-aluminum-yellow": _.clone(AppleWatchSeries238Device)
	"apple-watch-series-2-38mm-space-gray-aluminum-black": _.clone(AppleWatchSeries238Device)
	"apple-watch-series-2-38mm-sport-aluminum-walnut": _.clone(AppleWatchSeries238Device)
	"apple-watch-series-2-38mm-steel-white": _.clone(AppleWatchSeries238Device)

	# Apple Watch Series 2 42mm
	"apple-watch-series-2-42mm-edition": _.clone(AppleWatchSeries242Device)
	"apple-watch-series-2-42mm-gold-aluminum-cocoa": _.clone(AppleWatchSeries242Device)
	"apple-watch-series-2-42mm-rose-gold-aluminum-midnight-blue": _.clone(AppleWatchSeries242Device)
	"apple-watch-series-2-42mm-silver-aluminum-concrete": _.clone(AppleWatchSeries242Device)
	"apple-watch-series-2-42mm-silver-aluminum-green": _.clone(AppleWatchSeries242Device)
	"apple-watch-series-2-42mm-silver-aluminum-light-pink": _.clone(AppleWatchSeries242Device)
	"apple-watch-series-2-42mm-silver-aluminum-ocean-blue": _.clone(AppleWatchSeries242Device)
	"apple-watch-series-2-42mm-silver-aluminum-pink-sand": _.clone(AppleWatchSeries242Device)
	"apple-watch-series-2-42mm-silver-aluminum-red": _.clone(AppleWatchSeries242Device)
	"apple-watch-series-2-42mm-silver-aluminum-turquoise": _.clone(AppleWatchSeries242Device)
	"apple-watch-series-2-42mm-silver-aluminum-white": _.clone(AppleWatchSeries242Device)
	"apple-watch-series-2-42mm-silver-aluminum-yellow": _.clone(AppleWatchSeries242Device)
	"apple-watch-series-2-42mm-space-black-steel-black": _.clone(AppleWatchSeries242Device)
	"apple-watch-series-2-42mm-space-gray-aluminum-black": _.clone(AppleWatchSeries242Device)
	"apple-watch-series-2-42mm-steel-white": _.clone(AppleWatchSeries242Device)

	# Apple Watch Nike+ 38mm
	"apple-watch-nike-plus-38mm-silver-aluminum-flat-silver-volt": _.clone(AppleWatchSeries238Device)
	"apple-watch-nike-plus-38mm-silver-aluminum-flat-silver-white": _.clone(AppleWatchSeries238Device)
	"apple-watch-nike-plus-38mm-space-gray-aluminum-black-cool-gray": _.clone(AppleWatchSeries238Device)
	"apple-watch-nike-plus-38mm-space-gray-aluminum-black-volt": _.clone(AppleWatchSeries238Device)

	# Apple Watch Nike+ 42mm
	"apple-watch-nike-plus-42mm-silver-aluminum-flat-silver-volt": _.clone(AppleWatchSeries242Device)
	"apple-watch-nike-plus-42mm-silver-aluminum-flat-silver-white": _.clone(AppleWatchSeries242Device)
	"apple-watch-nike-plus-42mm-space-gray-aluminum-black-cool-gray": _.clone(AppleWatchSeries242Device)
	"apple-watch-nike-plus-42mm-space-gray-aluminum-black-volt": _.clone(AppleWatchSeries242Device)

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

	# Sony SmartWatch 3
	"sony-smartwatch-3-black": _.clone(SonySmartwatch3Base)
	"sony-smartwatch-3-white": _.clone(SonySmartwatch3Base)

	# NEXUS
	"google-nexus-4": _.clone(Nexus4BaseDevice)
	"google-nexus-5x": _.clone(Nexus5BaseDevice)
	"google-nexus-6p": _.clone(Nexus6BaseDevice)
	"google-nexus-9": _.clone(Nexus9BaseDevice)

	# Pixel
	"google-pixel-quite-black": _.clone(PixelBaseDevice)
	"google-pixel-really-blue": _.clone(PixelBaseDevice)
	"google-pixel-very-silver": _.clone(PixelBaseDevice)

	# Pixel 2
	"google-pixel-2-clearly-white": _.clone(Pixel2BaseDevice)
	"google-pixel-2-just-black": _.clone(Pixel2BaseDevice)
	"google-pixel-2-kinda-blue": _.clone(Pixel2BaseDevice)
	"google-pixel-2-xl-black-and-white": _.clone(Pixel2XLBaseDevice)
	"google-pixel-2-xl-just-black": _.clone(Pixel2XLBaseDevice)

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

	#Samsug Galaxy S8
	"samsung-galaxy-s8-orchid-gray": _.clone(SamsungGalaxyS8BaseDevice)
	"samsung-galaxy-s8-midnight-black": _.clone(SamsungGalaxyS8BaseDevice)
	"samsung-galaxy-s8-maple-gold": _.clone(SamsungGalaxyS8BaseDevice)
	"samsung-galaxy-s8-coral-blue": _.clone(SamsungGalaxyS8BaseDevice)
	"samsung-galaxy-s8-arctic-silver": _.clone(SamsungGalaxyS8BaseDevice)

	# Notebooks
	"apple-macbook": _.clone(AppleMacBook)
	"apple-macbook-air": _.clone(AppleMacBookAir)
	"apple-macbook-pro": _.clone(AppleMacBookPro)
	"dell-xps": _.clone(DellXPS)

	# Desktops
	"apple-imac": _.clone(AppleIMac)
	"apple-thunderbolt-display": _.clone(AppleThunderboltDisplay)
	"microsoft-surface-book": _.clone(MicrosoftSurfaceBook)
	"microsoft-surface-pro-3": _.clone(MicrosoftSurfacePro3)
	"microsoft-surface-pro-4": _.clone(MicrosoftSurfacePro4)

	# TV
	"sony-w85Oc": _.clone(SonyW85OC)

	# OLD DEVICES
	"desktop-safari-1024-600":
		deviceType: "browser"
		name: "Desktop Safari 1024 x 600"
		screenWidth: 1024
		screenHeight: 600
		devicePixelRatio: 1
		deviceImageWidth: 1136
		deviceImageHeight: 760
		deviceImageCompression: true
		backgroundColor: "white"
	"desktop-safari-1280-800":
		deviceType: "browser"
		name: "Desktop Safari 1280 x 800"
		screenWidth: 1280
		screenHeight: 800
		devicePixelRatio: 1
		deviceImageWidth: 1392
		deviceImageHeight: 960
		deviceImageCompression: true
		backgroundColor: "white"
	"desktop-safari-1440-900":
		deviceType: "browser"
		name: "Desktop Safari 1440 x 900"
		screenWidth: 1440
		screenHeight: 900
		devicePixelRatio: 1
		deviceImageWidth: 1552
		deviceImageHeight: 1060
		deviceImageCompression: true
		backgroundColor: "white"

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
	"iphone-5s-spacegray-hand": _.clone(old_iPhone5BaseDeviceHand)
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
