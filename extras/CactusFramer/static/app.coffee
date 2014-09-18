

layerA = new Layer

layerA.center()

window.el = layerA._element.parentElement

console.log window.el

# layerA.animate
# 	properties: {x:800}
# 	time: 8

# layer = new Layer

# Utils.interval 2, ->
# 	layer.animate
# 		properties:
# 			x: Math.random() * 500
# 			y: Math.random() * 500



# # Utils = require "./Utils"
# # {_}   = require "./Underscore"

# DeviceViewHostedImagesUrl = ""
# DeviceViewDefaultDevice = "iphone-5s-spacegray"

# # {BaseClass} = require "./BaseClass"
# # {Layer} = require "./Layer"
# # {Defaults} = require "./Defaults"
# # {Events} = require "./Events"

# exports = {}

# for klass in ["BaseClass", "Layer", "Defaults", "Events", "Utils"]
# 	window[klass] = Framer[klass]

# Defaults = Framer._Defaults

# Utils.insertCSS "body {overflow:hidden}"


# ###

# Device._setup()
# Device._update()
# Device._setupContext()

# Device.fullScreen bool
# Device.deviceType str
# Device.padding int

# Device.orientation(orientation:float)
# Device.orientationName landscape|portrait|unknown
# Device.rotateLeft()
# Device.rotateRight()

# Device.setDeviceScale(zoom:float, animate:bool)
# Device.setContentScale(zoom:float, animate:bool)

# Device.keyboard bool
# Device.setKeyboard(visible:bool, animate:bool)
# Device.showKeyboard(animate:bool)
# Device.hideKeyboard(animate:bool)
# Device.toggleKeyboard(animate:bool)


# # Events
# Events.DeviceTypeDidChange
# Events.DeviceFullScreenDidChange
# Events.DeviceKeyboardWillShow
# Events.DeviceKeyboardDidShow


# ###

# # _.extend Events,
# # 	DeviceTypeDidChange: "change:deviceType"
# # 	DeviceScaleDidChange: "change:deviceScale"
# # 	DeviceContentScaleDidChange: "change:contentScale"
# # 	DeviceFullScreenDidChange: ""

# class exports.DeviceView extends BaseClass

# 	constructor: (options={}) ->

# 		defaults = Defaults.getDefaults("DeviceView", options)
		
# 		@_setup()
		
# 		@animationOptions = defaults.animationOptions
# 		@resourceUrl = defaults.resourceUrl
# 		@deviceType = defaults.deviceType

# 		_.extend @, Utils.setDefaultProperties(options, defaults)


# 	_setup: ->
		
# 		if @_setupDone
# 			return
			
# 		@_setupDone = true
		
# 		@background = new Layer
# 		@background.clip = true
# 		@background.backgroundColor = "transparent"
# 		@background.classList.add("DeviceBackground")		

# 		# @phone = new Layer superLayer:@background
# 		@phone = new Layer
# 		@screen   = new Layer superLayer:@phone
# 		@viewport = new Layer superLayer:@screen
# 		@content  = new Layer superLayer:@viewport

# 		@screen.classList.add("DeviceScreen")
# 		@screen.backgroundColor = "transparent"
# 		@viewport.backgroundColor = "transparent"
# 		@content.backgroundColor = "transparent"

# 		@content.originX = 0
# 		@content.originY = 0

# 		@keyboardLayer = new Layer superLayer:@viewport
# 		@keyboardLayer.on "click", => @toggleKeyboard()
		
# 		Screen.on "resize", @_update
		
# 	_update: =>
		
# 		# # Todo: pixel align at zoom level 1, 0.5

# 		# if @_shouldRenderFullScreen()

# 		# 	for layer in [@background, @phone, @viewport, @content, @screen]
# 		# 		layer.x = layer.y = 0
# 		# 		layer.width = window.innerWidth
# 		# 		layer.height = window.innerHeight
# 		# 		# layer.scale = 1

# 		# else
# 		if @_shouldRenderFullScreen()
# 			for layer in [@background, @phone, @viewport, @content, @screen]
# 				layer.x = layer.y = 0
# 				layer.width = window.innerWidth
# 				layer.height = window.innerHeight
# 				layer.scale = 1

# 			@keyboardLayer.centerX()
# 			if @keyboard
# 				@_animateKeyboard(@_keyboardShowY(), false)
# 			else
# 				@_animateKeyboard(@_keyboardHideY(), false)

# 		else
# 			backgroundOverlap = 100

# 			@background.x = 0 - backgroundOverlap
# 			@background.y = 0 - backgroundOverlap
# 			@background.width  = Screen.width  + (2 * backgroundOverlap)
# 			@background.height = Screen.height + (2 * backgroundOverlap)

# 			@phone.scale = @_calculatePhoneScale()
# 			@phone.center()

# 			[width, height] = @_getOrientationDimensions(@_device.screenWidth, @_device.screenHeight)

# 			@screen.width  = @_device.screenWidth
# 			@screen.height = @_device.screenHeight

# 			@viewport.width  = @content.width  = width
# 			@viewport.height = @content.height = height
# 			@screen.center()

# 			@keyboardLayer.centerX()

# 	_shouldRenderFullScreen: ->
		
# 		if not @_device
# 			return true
		
# 		if @fullScreen
# 			return true
		
# 		if @deviceType is "fullscreen"
# 			return true

# 		return false


# 	_setupContext: ->
# 		# Sets this device up as the default context
# 		@_context = new Framer.Context(parentElement:@content._element, name:"Device")
# 		Framer.CurrentContext = @_context
		
# 	_deviceImageUrl: (name) ->
# 		return null unless name
# 		return "#{@resourceUrl}/#{name}" 

# 	###########################################################################
# 	# FULLSCREEN

# 	@define "fullScreen",
# 		get: ->
# 			@_fullScreen
# 		set: (fullScreen) ->
# 			@_setFullScreen(fullScreen)

# 	_setFullScreen: (fullScreen) ->

# 		if @_deviceType is "fullscreen"
# 			fullScreen = true

# 		if not _.isBool(fullScreen)
# 			return

# 		if fullScreen is @_fullScreen
# 			return

# 		@_fullScreen = fullScreen

# 		if fullScreen is true
# 			@phone.image = ""
# 		else
# 			@_updateDeviceImage()

# 		@_update()
# 		@keyboard = false
# 		@_animateKeyboard(@_keyboardHideY(), false)
# 		@emit("change:fullScreen")



# 	###########################################################################
# 	# DEVICE TYPE

# 	@define "deviceType",
# 		get: ->
# 			@_deviceType
# 		set: (deviceType) ->
			
# 			if deviceType is @_deviceType
# 				return
			
# 			device = null

# 			if _.isString(deviceType)
# 				device = Devices[deviceType.toLowerCase()]
			
# 			if not device
# 				throw Error "No device named #{deviceType}. Options are: #{_.keys Devices}"
			
# 			if @_device is device
# 				return

# 			@_device = device
# 			@_deviceType = deviceType
# 			@_updateDeviceImage()	
# 			@_update()
# 			@keyboard = false
# 			@emit("change:deviceType")

# 	_updateDeviceImage: =>
# 		if @_shouldRenderFullScreen()
# 			@phone.image  = ""
# 		else
# 			@phone.image  = @_deviceImageUrl(@_device.deviceImage)
# 			@phone.width  = @_device.deviceImageWidth
# 			@phone.height = @_device.deviceImageHeight


# 	###########################################################################
# 	# DEVICE ZOOM
	
# 	@define "deviceScale",
# 		get: -> @_deviceScale
# 		set: (deviceScale) -> @setDeviceScale(deviceScale, false)
	
# 	setDeviceScale: (deviceScale, animate=false) ->
		
# 		if deviceScale == "fit" or deviceScale < 0
# 			deviceScale = "fit"
# 		else
# 			deviceScale = parseFloat(deviceScale)
			
# 		if deviceScale == @_deviceScale
# 			return

# 		@_deviceScale = deviceScale
		
# 		if deviceScale == "fit"
# 			phoneScale = @_calculatePhoneScale()
# 		else
# 			phoneScale = deviceScale
			
# 		@phone.animateStop()

# 		if animate
# 			@phone.animate _.extend @animationOptions,
# 				properties: {scale:phoneScale}
# 		else
# 			@phone.scale = phoneScale
# 			@phone.center()

# 		@emit("change:deviceScale")
			

# 	_calculatePhoneScale: ->
		
# 		# Calculates a phone scale that fits the screen unless a fixed value is set
		
# 		if @_deviceScale and @_deviceScale isnt "fit"
# 			return @_deviceScale

# 		[width, height] = @_getOrientationDimensions(@phone.width, @phone.height)

# 		paddingOffset = @_device?.paddingOffset or 0

# 		phoneScale = _.min([
# 			(Screen.width -  ((@padding + paddingOffset) * 2)) / width,
# 			(Screen.height - ((@padding + paddingOffset) * 2)) / height
# 		])
		
# 		return phoneScale

# 	###########################################################################
# 	# CONTENT ZOOM

# 	@define "contentScale",
# 		get: -> @_contentScale
# 		set: (contentScale) -> @setContentScale(contentScale, false)
	
# 	setContentScale: (contentScale, animate=false) ->
		
# 		contentScale = parseFloat(contentScale)
	
# 		if contentScale is @_contentScale
# 			return
		
# 		@_contentScale = contentScale
		
# 		if animate
# 			@content.animate _.extend @animationOptions,
# 				properties: {scale: @_contentScale}
# 		else
# 			@content.scale = @_contentScale

# 		@emit("change:contentScale")


# 	###########################################################################
# 	# PHONE ORIENTATION

# 	@define "orientation",
# 		get: -> @_orientation
# 		set: (orientation) -> @setOrientation(orientation, false)

# 	setOrientation: (orientation, animate=false) ->

# 		if orientation == "portrait"
# 			orientation = 0
					
# 		if orientation == "landscape"
# 			orientation = 90
		
# 		orientation = parseInt(orientation)
		
# 		if orientation not in [0, 90, -90]
# 			return
		
# 		if orientation is @_orientation
# 			return
		
# 		@_orientation = orientation
		
# 		# Calculate properties for the phone
# 		phoneProperties =
# 			rotationZ: @_orientation
# 			scale: @_calculatePhoneScale()
		
# 		[width, height] = @_getOrientationDimensions(@_device.screenWidth, @_device.screenHeight)
# 		[x, y] = [(@screen.width - width) / 2, (@screen.height - height) / 2]
		
# 		contentProperties =
# 			rotationZ: -@_orientation
# 			width:  width
# 			height: height
# 			x: x
# 			y: y
		
# 		_hadKeyboard = @keyboard
		
# 		if _hadKeyboard
# 			@hideKeyboard(false)

# 		@phone.animateStop()
# 		@viewport.animateStop()

# 		if animate
# 			animation = @phone.animate _.extend @animationOptions,
# 				properties: phoneProperties
# 			@viewport.animate _.extend @animationOptions,
# 				properties: contentProperties
			
# 			if _hadKeyboard
# 				animation.on Events.AnimationEnd, =>
# 					@showKeyboard(true)
# 		else
# 			@phone.properties = phoneProperties
# 			@viewport.properties = contentProperties
			
# 			if _hadKeyboard
# 				@showKeyboard(true)
			
# 		@_renderKeyboard()

# 		@emit("change:orientation")
	
# 	isPortrait: -> Math.abs(@_orientation) != 90
# 	isLandscape: -> !@isPortrait()

# 	@define "orientationName",
# 		get: ->
# 			return "portrait" if @isPortrait()
# 			return "landscape" if @isLandscape()
# 		set: (orientationName) -> @setOrientation(orientationName, false)

# 	rotateLeft: (animate=true) ->
# 		return if @orientation is 90
# 		@setOrientation(@orientation + 90, animate)

# 	rotateRight: (animate=true) ->
# 		return if @orientation is -90
# 		@setOrientation(@orientation - 90, animate)
		
# 	_getOrientationDimensions: (width, height) ->
# 		if @isLandscape() then [height, width] else [width, height]


# 	###########################################################################
# 	# KEYBOARD

# 	@define "keyboard",
# 		get: -> @_keyboard
# 		set: (keyboard) -> @setKeyboard(keyboard, false)

# 	setKeyboard: (keyboard, animate=false) ->
		
# 		# Check if this device has a keyboard at all
# 		if not @_device.hasOwnProperty("keyboards")
# 			return

# 		if _.isString(keyboard)
# 			if keyboard.toLowerCase() in ["1", "true"]
# 				keyboard = true
# 			else if keyboard.toLowerCase() in ["0", "false"]
# 				keyboard = false
# 			else
# 				return
		
# 		if not _.isBool(keyboard)
# 			return
		
# 		if keyboard is @_keyboard
# 			return
		
# 		@_keyboard = keyboard

# 		@emit("change:keyboard")

# 		if keyboard is true
# 			@emit("keyboard:show:start")
# 			@_animateKeyboard @_keyboardShowY(), animate, =>
# 				@emit("keyboard:show:end")
# 		else
# 			@emit("keyboard:hide:start")
# 			@_animateKeyboard @_keyboardHideY(), animate, =>
# 				@emit("keyboard:hide:end")
		
# 	showKeyboard: (animate=true) ->
# 		@setKeyboard(true, animate)

# 	hideKeyboard: (animate=true) ->
# 		@setKeyboard(false, animate)

# 	toggleKeyboard: (animate=true) ->
# 		@setKeyboard(!@keyboard, animate)

# 	_renderKeyboard: ->
# 		return unless @_device.keyboards
# 		@keyboardLayer.image  = @_deviceImageUrl @_device.keyboards[@orientationName].image
# 		@keyboardLayer.width  = @_device.keyboards[@orientationName].width
# 		@keyboardLayer.height = @_device.keyboards[@orientationName].height

# 	_animateKeyboard: (y, animate, callback) =>
# 		@keyboardLayer.bringToFront()
# 		@keyboardLayer.animateStop()
# 		if animate is false
# 			@keyboardLayer.y = y
# 			callback?()
# 		else
# 			animation = @keyboardLayer.animate _.extend @animationOptions, 
# 				properties: {y:y}
# 			animation.on Events.AnimationEnd, callback

# 	_keyboardShowY: -> @viewport.height - @keyboardLayer.height
# 	_keyboardHideY: -> @viewport.height


# ###########################################################################
# # DEVICE CONFIGURATIONS

# iPhone5BaseDevice =
# 	deviceImageWidth: 792
# 	deviceImageHeight: 1632
# 	screenWidth: 640
# 	screenHeight: 1136
# 	keyboards:
# 		portrait:
# 			image:  "ios-keyboard.png"
# 			width: 640
# 			height: 432
# 		landscape:
# 			image: "ios-keyboard-landscape-light.png"
# 			width: 1136
# 			height: 322

# iPhone6BaseDevice =
# 	deviceImageWidth: 874
# 	deviceImageHeight: 1738
# 	screenWidth: 750
# 	screenHeight: 1334

# iPhone6BaseDeviceWithHand =
# 	deviceImageWidth: 2290
# 	deviceImageHeight: 2760
# 	screenWidth: 750
# 	screenHeight: 1334
# 	paddingOffset: -200

# iPadMiniBaseDevice =
# 	deviceImageWidth: 920
# 	deviceImageHeight: 1328
# 	screenWidth: 768
# 	screenHeight: 1024

# iPadAirBaseDevice =
# 	deviceImageWidth: 1856
# 	deviceImageHeight: 2584
# 	screenWidth: 1536
# 	screenHeight: 2048

# AppleWatchDevice =
# 	deviceImageWidth: 500
# 	deviceImageHeight: 820
# 	screenWidth: 320
# 	screenHeight: 320


# Devices =

# 	"fullscreen":
# 		name: "Fullscreen"

# 	# iPhone 5S
# 	"iphone-5s-spacegray": _.extend {}, iPhone5BaseDevice,
# 		name: "iPhone 5S Space Gray"
# 		deviceImage: "iphone-5S-spacegray.png"
# 	"iphone-5s-silver": _.extend {}, iPhone5BaseDevice,
# 		name: "iPhone 5S Silver"
# 		deviceImage: "iphone-5S-silver.png"
# 	"iphone-5s-gold": _.extend {}, iPhone5BaseDevice,
# 		name: "iPhone 5S Gold"
# 		deviceImage: "iphone-5S-gold.png"

# 	# iPhone 5C
# 	"iphone-5c-green": _.extend {}, iPhone5BaseDevice,
# 		name: "iPhone 5S Green"
# 		deviceImage: "iphone-5C-green.png"
# 	"iphone-5c-blue": _.extend {}, iPhone5BaseDevice,
# 		name: "iPhone 5S Blue"
# 		deviceImage: "iphone-5C-blue.png"
# 	"iphone-5c-yellow": _.extend {}, iPhone5BaseDevice,
# 		name: "iPhone 5S Yellow"
# 		deviceImage: "iphone-5C-yellow.png"
# 	"iphone-5c-pink": _.extend {}, iPhone5BaseDevice,
# 		name: "iPhone 5C Pink"
# 		deviceImage: "iphone-5C-pink.png"
# 	"iphone-5c-white": _.extend {}, iPhone5BaseDevice,
# 		name: "iPhone 5C White"
# 		deviceImage: "iphone-5C-white.png"

# 	# iPad Mini
# 	"ipad-mini-silver": _.extend {}, iPadMiniBaseDevice,
# 		name: "iPad Mini Silver"
# 		deviceImage: "ipad-mini-silver.png"
# 	"ipad-mini-spacegray": _.extend {}, iPadMiniBaseDevice,
# 		name: "iPad Mini Space Gray"
# 		deviceImage: "ipad-mini-spacegray.png"

# 	# Apple Watch
# 	"apple-watch-primary": _.extend {}, AppleWatchDevice,
# 		name: "Apple Watch"
# 		deviceImage: "apple-watch-primary.png"
# 	"apple-watch-sport": _.extend {}, AppleWatchDevice,
# 		name: "Apple Watch Sport"
# 		deviceImage: "apple-watch-sport.png"
# 	"apple-watch-edition": _.extend {}, AppleWatchDevice,
# 		name: "Apple Watch Edition"
# 		deviceImage: "apple-watch-edition.png"

# 	# iPhone 6 (Todo: 2 missing)
# 	"iphone-6-spacegray": _.extend {}, iPhone6BaseDevice,
# 		name: "iPhone 6 Space Gray"
# 		deviceImage: "iphone-6-spacegray.png"

# 	# iPhone 6 with Hand
# 	"iphone-6-spacegray-hand": _.extend {}, iPhone6BaseDeviceWithHand,
# 		name: "iPhone 6 Space Gray with Hand"
# 		deviceImage: "iphone-6-spacegray-hand.jpf"
# 	"iphone-6-silver-hand": _.extend {}, iPhone6BaseDeviceWithHand,
# 		name: "iphone-6-silver-hand.png"
# 		deviceImage: "iphone-6-silver-hand.png"
# 	"iphone-6-gold-hand": _.extend {}, iPhone6BaseDeviceWithHand,
# 		name: "iPhone 6 Gold with Hand"
# 		deviceImage: "iphone-6-gold-hand.png"

# exports.DeviceView.Devices = Devices



# # Framer.Device = new exports.DeviceView()
# # Framer.Device._setupContext()

# s = utils.cycle(true, false)

# layerA = new Layer
# layerA.on Events.Click, ->
# 	Framer.Device.fullScreen = s()


# layerB = new Layer x:100
# layerB.on Events.Click, ->
# 	Framer.Device.toggleKeyboard()







# #let's set up some layers!
# #this is the big white background
# background = new Layer 
#   width: 400
#   height: 550
#   y: 10
#   x: 100
# background.style.backgroundColor = "#fff"
# background.style.borderRadius = "20px"
# #this will be the bottom half of the "book", when you open it
# bottomhalf = new Layer
#   width: 200
#   height: 200
#   image: "http://fillmurray.com/g/200/300"
#   y: 200
#   x: 200
# #this is the top layer inside the book.
# top = new Layer
#   width: 200
#   height: 200
#   image: "http://fillmurray.com/g/200/300"
#   y: 0
#   x: 200
# #this is the fronting image, in color
# front = new Layer
#   width: 200
#   height: 200
#   image: "http://fillmurray.com/200/300"
#   y: 200
#   x: 200

# #let's make sure images are hidden when turned around
# top.style = "-webkit-backface-visibility": "visible"
# front.style = "-webkit-backface-visibility": "hidden"
# #set pivot points (0 = top, 1 = bottom, 0.5 = center)
# top.originY = 1
# front.originY = 0
# bottomhalf.originY = 0
# #flip the backside layer so it becomes hidden
# top.rotationX = 180

# openBook = (e) ->
  
#   # let's change property values based on the current location of the mouse (e.clientY)
#   # I'll use utils.modulate which is kind of similar to utils.mapRange but with a better syntax and a limiting option.
#   # see: https://github.com/koenbok/Framer/blob/master/framer/Utils.coffee
  
#   # Rotate!
#   front.rotationX = utils.modulate(e.clientY, [front.maxY, front.y], [0, 180], true)
#   top.rotationX = utils.modulate(e.clientY, [front.maxY, front.y], [-180, 0], true)
	
#   # Scale!
#   background.scale = utils.modulate(e.clientY, [front.y, front.maxY], [0.9, 1], true)
#   bottomhalf.scale = utils.modulate(e.clientY, [front.maxY, front.y], [1, 1.8], true)
#   top.scale = utils.modulate(e.clientY, [front.maxY, front.y], [1, 1.8], true)
#   front.scale = utils.modulate(e.clientY, [front.maxY, front.y], [1, 1.8], true)
  
#   # let's have the shadows move based on the location of the mouse
#   # start off with some variables..
#   opacity = utils.modulate(e.clientY, [front.y, front.midY], [0, 0.7], true)
#   shadowy = utils.modulate(e.clientY, [front.y, front.midY], [50, 300], true)
#   bshadowy = utils.modulate(e.clientY, [front.y+40, front.maxY], [0, 300], true)
#   bopacity = utils.modulate(e.clientY, [front.y+40, front.maxY], [0, 1], true)
#   copacity = utils.modulate(e.clientY, [front.maxY, front.y+40], [0, 0.7], true)
	
	
#   #... and add them to the CSS using string interpolation
#   top.style = 
#   "-webkit-box-shadow": "inset 0px #{shadowy}px 40px 20px rgba(0,0,0,#{opacity})"
#   bottomhalf.style = 
#   "-webkit-box-shadow": "inset 0px #{bshadowy}px 40px 10px rgba(0,0,0,#{bopacity}),0px 10px 40px 10px rgba(0,0,0,#{copacity})"
	
  
# front.draggable.enable = true # enable drag n drop
# front.draggable.speedX = 0 # We want the event, but not the movement
# front.draggable.speedY = 0 # We want the event, but not the movement
# front.on Events.DragMove, openBook # run the openBook function every time we drag the object.

# # Let's add the same code to the top layer, so we can easily close the book the same way
# top.draggable.enable = true 
# top.draggable.speedX = 0
# top.draggable.speedY = 0 
# top.on Events.DragMove, openBook 
