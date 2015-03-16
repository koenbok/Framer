window.console.debug = (v) ->

mocha.setup('bdd')
mocha.globals(['__import__'])

assert = chai.assert

require "./tests/EventEmitterTest"
require "./tests/UtilsTest"
require "./tests/BaseClassTest"
require "./tests/LayerTest"
require "./tests/LayerStatesTest"
require "./tests/VideoLayerTest"
require "./tests/ImporterTest"
require "./tests/LayerAnimationTest"
require "./tests/ContextTest"

# Start mocha
if window.mochaPhantomJS
	mochaPhantomJS.run()
else
	mocha.run()
