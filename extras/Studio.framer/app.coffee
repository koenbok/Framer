# Use desktop cursor
document.body.style.cursor = "auto"

# Project Info
# This info is presented in a widget when you share.
# http://framerjs.com/docs/#info.info

Framer.Info =
	title: ""
	author: "Benjamin den Boer"
	twitter: ""
	description: ""


# Include Component
{WindowComponent} = require "WindowComponent"

# Background
bg = new BackgroundLayer
	image: "images/bg.jpg"

# App Window
app = new WindowComponent
	minWidth: 800
	clip: true
	
app.toolbar.style.background = "#fff"
app.toolbar.shadowY = 0


left = new Layer
	parent: app 
	width: app.width / 2
	height: app.height
	index: 1
	backgroundColor: "transparent"
	
right = new Layer
	parent: app 
	width: app.width / 2
	height: app.height
	x: left.width
	backgroundColor: "#111"
		
# Labels
labelHeight = 30

leftLabel = new Layer
	parent: left
	width: left.width	
	height: labelHeight
	y: left.height - labelHeight
	backgroundColor: "rgba(0,0,0,0.1)"
		
leftLabelText = new TextLayer 
	parent: leftLabel 
	fontSize: 11
	lineHeight: "#{labelHeight}px"
	x: 15
	height: labelHeight
	y: Align.center
	text: "Edit"

rightLabel = new Layer
	parent: right
	width: right.width	
	height: labelHeight
	y: right.height - labelHeight
	backgroundColor: "rgba(0,0,0,0.7)"
	
		
rightLabelText = new TextLayer 
	parent: rightLabel 
	fontSize: 11
	lineHeight: "#{labelHeight}px"
	color: "rgba(255,255,255,0.3)"
	x: 15
	height: labelHeight
	y: Align.center
	text: "Preview"

# On resize
app.onResize (window, content) ->
	left.width = app.width / 2
	left.height = app.height
	right.width = app.width / 2
	right.height = app.height
	right.x = left.width
	leftLabel.width = left.width
	leftLabel.y = left.height - labelHeight
	rightLabel.width = right.width 
	rightLabel.y = right.height - labelHeight
	field.width = left.width - 40
	field.height = left.height - 100
	field.input.width = field.width - 80
	preview.width = right.width - 100
	
	
# placeholder bug
# input layer size bug

		
field = new InputLayer
	parent: app 
	x: 20
	y: 50
	width: left.width - 40
	height: left.height - 150
	fontSize: 20
	text: "Type here"
	multiLine: true


preview = new TextLayer
	parent: right 
	x: 50
	y: 80
	width: right.width - 100
	height: right.height - 160
	fontSize: 20
	fontFamily: Utils.webFont("Droid Serif")
	text: " "
	color: "#FFF"
	

field.onInputChange ->
	
	# Enters to TextLayer
	value = @value.replace(/(\r\n|\n|\r)/gm, "<br>")
	
	# Set text
	preview.text = value
		

	
	
	
	
	
	
	
	
	
