css = require "./css"
{config} = require "./config"
utils = require "./utils"
debug = require "./debug"
{tools} = require "./tools/init"

{View} = require "./views/view"
{ViewList} = require "./views/view"
{ScrollView} = require "./views/scrollview"
{ImageView} = require "./views/imageview"
{Animation} = require "./animation"

{Frame} = require "./primitives/frame"
{Matrix} = require "./primitives/matrix"

Global = {}
Global.View = View
Global.ScrollView = ScrollView
Global.ImageView = ImageView
Global.Animation = Animation
Global.Frame = Frame
Global.Matrix = Matrix

Global.utils = utils
Global.tools = tools
Global.ViewList = ViewList
Global.debug = debug.debug
Global.css = css
Global.config = config


if window
	window.Framer = Global
	window._ = require "underscore"
	
	for k, v of Global
		window[k] = v

# Add underscore
window._ = require "underscore"

# Alert if not WebKit
if not utils.isWebKit()
	alert "Sorry, only WebKit browsers are currently supported. \
See https://github.com/koenbok/Framer/issues/2 for more info."
