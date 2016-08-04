# Project Info
# This info is presented in a widget when you share.
# http://framerjs.com/docs/#info.info

Framer.Info =
	title: "Test Prototype"
	author: "Floris Verloop"
	twitter: "fverloop"
	description: "I wonder if we should make Framer.Extras.Preloader.enable() a public feature then, ‘cause people will pretty much never be able to make that preloader show? I wonder if we should make Framer.Extras.Preloader.enable() a public feature then, ‘cause people will pretty much never be able to make that preloader show?"

Screen.backgroundColor = "black"

Framer.Extras.Preloader.enable()

grid = new GridComponent
	size: Screen

grid.renderCell = (layer) ->
	layer.image = Utils.randomImage(layer) #+ "?cache=#{Date.now()}"
