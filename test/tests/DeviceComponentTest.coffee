describe "DeviceComponent", ->

	it "should default to iphone 5s spacegray", ->

		comp = new DeviceComponent()
		comp.deviceType.should.equal "iphone-5s-spacegray"

	it "should use build in image for default device", ->

		comp = new DeviceComponent()
		localUrl = "resources.framerjs.com/static/DeviceResources/"
		imageUrl = comp._deviceImageUrl(comp._deviceImageName())

		result = imageUrl.indexOf(localUrl)

		result.should.not.equal -1

	it "should use the deviceImage string as is for custom devices", ->

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
