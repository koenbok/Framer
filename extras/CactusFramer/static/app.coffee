Framer.Device = new Framer.DeviceView()
Framer.Device.setupContext()

Framer.Device.deviceType = "desktop-browser-1440"

f = false
l = new Layer

l.on Events.Click, ->
	if f is true
		Framer.Device.deviceType = "desktop-browser-1440"
		f = false
	else
		Framer.Device.deviceType = "fullscreen"
		f = true