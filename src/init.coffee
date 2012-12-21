require "./css"

utils = require "./utils"

{View} = require "./views/view"
{ViewList} = require "./views/view"
{ScrollView} = require "./views/scrollview"
# {CollectionView} = require "./views/collectionview"
{ImageView} = require "./views/imageview"
# {TextView} = require "./views/textview"
{Animation} = require "./animation"

{Frame} = require "./primitives/frame"

Global = {}
Global.View = View
Global.ScrollView = ScrollView
# Global.CollectionView = CollectionView
Global.ImageView = ImageView
# Global.TextView = TextView
Global.Animation = Animation
Global.Frame = Frame

Global.utils = utils
Global.ViewList = ViewList

if window
	window.Framer = Global
	
	for k, v of Global
		window[k] = v



Global.debug = (value) ->
	for view in ViewList
		if value is true
			colorValue = -> parseInt(Math.random() * 255)
			debugStyle = 
				backgroundImage: ""
				backgroundColor: "rgba(0,100,255,0.2)"
				# border: "2px solid rgba(0,100,255,0.1)"
			view._debugStyle = {}
			for key of debugStyle
				view._debugStyle[key] = view.style[key]
			view.style = debugStyle
		else if value is false
			view.style = view._debugStyle
		else return
	Global._debug = value

toggler = utils.toggle true, false

window.addEventListener "keydown", (e) ->
	if e.keyCode is 68 and e.shiftKey
		Global.debug toggler()
