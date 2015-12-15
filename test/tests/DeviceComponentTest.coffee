describe "DeviceComponent", ->

	it "should default to iphone 5s spacegray", ->

		comp = new DeviceComponent()
		comp.deviceType.should.equal "iphone-5s-spacegray"

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
