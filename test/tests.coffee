window.chai = require("chai")


previousReset = Framer.resetDefaults

Framer.resetDefaults = ->
	previousReset()
	# We don't want to update all the tests if we change these
	Framer.Defaults.Layer.width = 100
	Framer.Defaults.Layer.height = 100
	Framer.Defaults.Animation.time = 0.035
Framer.resetDefaults()


Framer.Device = new Framer.DeviceView()

window.TESTING = true
window.console.debug = (v) ->
window.console.warn = (v) ->

chai.should()
chai.config.truncateThreshold = 2
chai.config.showDiff = true

mocha.setup({ui: "bdd", bail: true, reporter: "dot"})
mocha.globals(["__import__"])

window.print = (args...) ->
	console.log "\n»", args.map((obj) -> Utils.inspect(obj)).join(", ")

require "./tests/AlignTest"
require "./tests/CurvesTest"
require "./tests/EventEmitterTest"
require "./tests/UtilsTest"
require "./tests/BaseClassTest"
require "./tests/LayerTest"
require "./tests/LayerEventsTest"
require "./tests/LayerStatesTest"
require "./tests/LayerStatesBackwardsTest"
require "./tests/LayerGesturesTest"
require "./tests/VideoLayerTest"
require "./tests/ImporterTest"
require "./tests/LayerAnimationTest"
require "./tests/LayerDraggableTest"
require "./tests/ContextTest"
require "./tests/ScrollComponentTest"
require "./tests/TextLayerTest"
require "./tests/SVGLayerTest"
require "./tests/PageComponentTest"
require "./tests/VersionTest"
require "./tests/ColorTest"
require "./tests/GradientTest"
require "./tests/DeviceComponentTest"
require "./tests/SliderComponentTest"
require "./tests/RangeSliderComponentTest"
require "./tests/FlowComponentTest"
require "./tests/PreloaderTest"

mocha.run()
