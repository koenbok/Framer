window.chai = require("chai")
window.should = require("should")

window.console.debug = (v) ->
window.console.warn = (v) ->

mocha.setup({ui:"bdd", bail:true, reporter:"dot"})
mocha.globals(["__import__"])

require "./tests/EventEmitterTest"
require "./tests/UtilsTest"
require "./tests/BaseClassTest"
require "./tests/LayerTest"
require "./tests/LayerStatesTest"
require "./tests/VideoLayerTest"
require "./tests/ImporterTest"
require "./tests/LayerAnimationTest"
require "./tests/ContextTest"
require "./tests/ScrollComponentTest"
require "./tests/VersionTest"

mocha.run()