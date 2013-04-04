css = require "./css"
utils = require "./utils"
debug = require "./debug"

{View} = require "./views/view"
{ViewList} = require "./views/view"
{ScrollView} = require "./views/scrollview"
# {CollectionView} = require "./views/collectionview"
{ImageView} = require "./views/imageview"
# {TextView} = require "./views/textview"
{Animation} = require "./animation"

{Frame} = require "./primitives/frame"
{Matrix} = require "./primitives/matrix"

Global = {}
Global.View = View
Global.ScrollView = ScrollView
# Global.CollectionView = CollectionView
Global.ImageView = ImageView
# Global.TextView = TextView
Global.Animation = Animation
Global.Frame = Frame
Global.Matrix = Matrix

Global.utils = utils
Global.ViewList = ViewList
Global.debug = debug.debug
Global.css = css


if window
	window.Framer = Global
	window._ = require "underscore"
	
	for k, v of Global
		window[k] = v

# Alert if not WebKit
if not utils.isWebKit()
	alert "Sorry, only WebKit browsers are currently supported. \
See https://github.com/koenbok/Framer/issues/2 for more info."
