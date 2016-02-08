describe "DeviceComponent", ->

	it "should default to iphone 5s spacegray", ->

		comp = new DeviceComponent()
		comp.deviceType.should.equal "apple-iphone-6s-silver"

	it "should use images on server for built in devices when not in Studio", ->

		comp = new DeviceComponent()
		localUrl = "resources.framerjs.com/static/DeviceResources/"
		imageUrl = comp._deviceImageUrl(comp._deviceImageName())

		result = imageUrl.indexOf(localUrl)

		result.should.not.equal -1

	it "should use the deviceImage string as is for custom devices when not in Studio", ->

		comp = new DeviceComponent()

		DeviceComponent.Devices["test"] =
			"deviceType": "phone"
			"screenWidth": 720
			"screenHeight": 1000
			"deviceImage": "images/framer-icon.png"
			"deviceImageWidth": 800
			"deviceImageHeight": 1203

		# Set custom device
		comp.deviceType = "test"

		comp.deviceType.should.equal "test"
		comp._deviceImageUrl(comp._deviceImageName()).should.eql "images/framer-icon.png"

	it "should use the local file url when run in Studio with built in device", ->

		# stub isFramerStudio helper
		_originalIsFramerStudio = Utils.isFramerStudio
		Utils.isFramerStudio = ->
			return true
		Utils.isFramerStudio().should.be.true

		# stub framerStudioVersion

		_originalIsFramerStudioVersion = Utils.framerStudioVersion
		Utils.framerStudioVersion = ->
			return Number.MAX_VALUE

		# example url
		localFileUrl = "file:///Users/name/Library/Developer/Xcode/DerivedData/Framer_Studio/Build/Products/Debug/Framer%20Studio.app/Contents/Resources/DeviceImages/"

		window.FramerStudioInfo = new Object()
		window.FramerStudioInfo.deviceImagesUrl = localFileUrl

		window.FramerStudioInfo.deviceImagesUrl.should.equal(localFileUrl)

		comp = new DeviceComponent()
		imageUrl = comp._deviceImageUrl(comp._deviceImageName())

		result = imageUrl.indexOf(localFileUrl)
		result.should.not.equal -1

		# reset stubs
		Utils.isFramerStudio = _originalIsFramerStudio
		Utils.framerStudioVersion = _originalIsFramerStudioVersion

	it "should use deviceImageName when a custom device is used in Studio", ->

		# stub isFramerStudio helper
		_originalIsFramerStudio = Utils.isFramerStudio
		Utils.isFramerStudio = ->
			return true
		Utils.isFramerStudio().should.be.true

		comp = new DeviceComponent()

		DeviceComponent.Devices["test"] =
			"deviceType": "phone"
			"screenWidth": 720
			"screenHeight": 1000
			"deviceImage": "images/framer-icon.png"
			"deviceImageWidth": 800
			"deviceImageHeight": 1203

		# Set custom device
		comp.deviceType = "test"

		comp.deviceType.should.equal "test"

		imageUrl = comp._deviceImageUrl(comp._deviceImageName())

		imageUrl.should.equal "images/framer-icon.png"

		# reset stubs
		Utils.isFramerStudio = _originalIsFramerStudio

	it "should influence screen", ->

		device = new DeviceComponent()
		device.context.run ->
			Screen.size.should.eql {width:750, height:1334}
			Utils.inspect(Screen).should.equal "<Screen 750x1334>"

		device.deviceType = "nexus-5-black"
		device.context.run ->
			Screen.size.should.eql {width:1080, height:1920}
			Utils.inspect(Screen).should.equal "<Screen 1080x1920>"