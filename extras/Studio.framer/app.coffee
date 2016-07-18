# Basic setup ------------------------------------------
Framer.Defaults.Animation = curve: "spring()"
bg = new BackgroundLayer backgroundColor: "#F3F3F3"

moviesColor = new Color("#1E88E5")
showsColor = new Color("#388E3C")
upcomingColor = new Color("#3F51B5")
watchColor = new Color("#546E7A")

offSet = 20
touchBarHeight = 320
systemBarHeight = 140
fontSize = 36
spacingUnit = 48

Framer.Device.background.states.add
	moviesColor: backgroundColor: moviesColor
	showsColor: backgroundColor: showsColor
	upcomingColor: backgroundColor: upcomingColor
	watchColor: backgroundColor: watchColor
Framer.Device.background.states.animationOptions =
	curve: "linear"
	time: 0.35
Framer.Device.background.states.switchInstant("moviesColor")

# Page component setup ---------------------------------
page = new PageComponent
	size: Screen.size
	scrollVertical: false
	scrollHorizontal: false

# Content -----------------------------------------------
mediaInfo = require "mediaInfo"

for layer, title of mediaInfo
	moviesTitle = title.movies.name
	moviesDescription = title.movies.description
	showsTitle = title.shows.name
	showsDescription = title.shows.description
	upcomingTitle = title.upcoming.name
	upcomingDescription = title.upcoming.description
	watchTitle = title.watch.name
	watchDescription = title.watch.description

movieScroll = new ScrollComponent
showsScroll = new ScrollComponent
upcomingScroll = new ScrollComponent
watchScroll = new ScrollComponent

for scroll in [movieScroll, showsScroll, upcomingScroll, watchScroll]
	scroll.props =
		size: Screen.size
		scrollHorizontal: false	
		opacity: 1
		contentInset:
			top: 220
			bottom: systemBarHeight + spacingUnit
	scroll.states.add
		hide:
			opacity: 0

mediaContent = (mediaParent, mediaWidth, mediaType, mediaTitle, mediaDescription) ->
	for i in [0...10]
		card = new Layer
			parent: mediaParent
			height: 340
			width: Screen.width - spacingUnit
			midX: Screen.width / 2
			y: 368 * i
			backgroundColor: "#FFF"
			borderRadius: 8
			shadowY: 1, shadowBlur: 2
			clip: true
		posters = new Layer
			parent: card
			width: mediaWidth, height: card.height
			image: "images/#{mediaType}/#{i+1}.jpg?cache=#{Date.now()}"
		title = new Layer
			parent: card
			html: mediaTitle[i]
			backgroundColor: null
			x: mediaWidth + spacingUnit
			y: spacingUnit
			width: card.width - mediaWidth - spacingUnit
			style:
				"color": "#111"
				"text-align": "left"
				"font-size": "80px"
				"font-weight": "300"
				"line-height": "1"
		description = new Layer
			parent: card
			html: mediaDescription[i]
			backgroundColor: null
			x: mediaWidth + spacingUnit
			y: 170
			width: card.width - mediaWidth - spacingUnit * 2
			clip: true
			style:
				"color": "#999"
				"text-align": "left"
				"font-size": "34px"
				"font-weight": "300"
				"line-height": "1.3"

mediaContent(movieScroll.content, 220, "movies", moviesTitle, moviesDescription)
mediaContent(showsScroll.content, 220,"shows", showsTitle, showsDescription)
mediaContent(upcomingScroll.content, 220, "upcoming", upcomingTitle, upcomingDescription)
mediaContent(watchScroll.content, 220, "watch", watchTitle, watchDescription)

movieScroll.parent = page.content
page.addPage(showsScroll)
page.addPage(upcomingScroll)
page.addPage(watchScroll)

# Navigation bar setup ---------------------------------
touchBar = new Layer
	height: touchBarHeight
	clip: true
	backgroundColor: moviesColor
	width: Screen.width
	maxY: Screen.height + offSet
	force2d: true
tabBar = new Layer
	backgroundColor: null
	width: Screen.width
	height: touchBar.height
	maxY: Screen.height + offSet

for layer in [touchBar, tabBar]
	layer.states.add
		hide:
			minY: Screen.height
	layer.states.animationOptions = curve: "spring(750,50,0)"

systemBar = new Layer
	height: systemBarHeight
	backgroundColor: "rgba(0,0,0,0.35)"
	width: Screen.width
	maxY: Screen.height
systemIcons = new Layer
	height: 120
	width: 670
	image: "images/systemIcons.svg"
	parent: systemBar
	midX: Screen.width / 2
	y: Align.center

tabUnit = touchBar.height - systemBar.height - offSet

# Status bar and time ----------------------------------
statusBarHeight = 52

statusBar = new Layer
	height: statusBarHeight
	width: Screen.width
	backgroundColor: "rgba(0,0,0,0.35)"
time = new Layer
	parent: statusBar
	width: 120
	height: statusBarHeight / 2
	x: Align.right(-20)
	y: Align.center
	backgroundColor: null
	style:
		"font-weight":"500"
		"font-size": "32px"
		"line-height": "0.8"
		"text-align": "right"
getTime = ->
	currentTime = new Date()
	hours = "#{if currentTime.getHours() < 10 then 0 else ''}#{currentTime.getHours()}"
	min = "#{if currentTime.getMinutes() < 10 then 0 else ''}#{currentTime.getMinutes()}"
	return "#{hours}:#{min}"
setTime = ->
	time.html = getTime()
	Utils.delay 60, ->
		setTime()
setTime()
statusIcons = new Layer
	height: 28
	width: 100
	parent: statusBar
	image: "images/statusIcons.svg"
	y: 10
	x: 858

# Search bar ------------------------------------------
searchBar = new Layer
	backgroundColor: "#FFF"
	width: Screen.width - spacingUnit
	height: 120
	x: Align.center
	minY: statusBar.height + 20
	borderRadius: 3
	shadowY: 1, shadowBlur: 2
	index: 4
searchBar.states.add
	hide:
		maxY: -100
searchBar.states.animationOptions = curve: "spring(750,50,0)"

searchLabel = new Layer
	parent: searchBar
	width: 160, height: 44
	midY: searchBar.height/2
	x: 120
	html: "Search"
	style:
		"color": "#AAA"
		"font-size": "42px"
		"line-height": "1"
		"font-weight": "300"
	backgroundColor: null
searchIcon = new Layer
	parent: searchBar
	width: 120, height: 120
	midY: searchBar.height/2
	image: "images/mdMenu.svg"
moreIcon = new Layer
	parent: searchBar
	width: 120, height: 120
	x: Align.right
	midY: searchBar.height/2
	image: "images/mdMore.svg"

# Tab items function -----------------------------------
tabSize = Screen.width / 4
tabContent = []

tabItem = (tabName, tabColor) ->
	tab = new Layer
		name: "#{tabName}"
		parent: tabBar
		x: tabContent.length * tabSize
		backgroundColor: null
		width: tabSize
		height: tabUnit

	tab.label = new Layer
		name: "#{tabName}Label"
		backgroundColor: null
		html: "#{tabName}"
		parent: tab
		width: tab.width
		opacity: 0
		y: Align.center(-10)
		height: 25
		style:
			"font-size": "#{fontSize}px"
	tab.label.states.add
		active:
			opacity: 1
			y: Align.center(12)

	tab.icon = new Layer
		name: "#{tabName}Icon"
		image: "images/md#{tabName}.svg"
		parent: tab
		backgroundColor: null
		width: tabSize / 4.5
		height: tabSize / 4.5
		x: Align.center()
		y: Align.center()
		opacity: 0.25
	tab.icon.states.add
		active:
			y: Align.center(-tabSize / 10)
			opacity: 1

	tab.touch = new Layer
		name: "#{tabName}Touch"
		backgroundColor: tabColor
		width: Screen.width * 3
		height: Screen.width * 3
		borderRadius: Screen.width * 1.5
		midX: tab.midX
		midY: tab.midY
		parent: touchBar
		scale: 0
	tab.touch.states.add
		active:
			scale: 1
	tab.touch.states.animationOptions =
		curve: "linear"
		time: 0.35

	tabContent.push(tab)
	return tab

movies = tabItem("Movies", moviesColor)
shows = tabItem("Shows", showsColor)
upcoming = tabItem("Upcoming", upcomingColor)
watch = tabItem("Watch", watchColor)

for layer in [movies.touch, movies.label, movies.icon]
	layer.states.switchInstant("active")

# Scroll logic --------------------------------------------------
page.onSwipeUpEnd ->
	for layer in [tabBar, touchBar, searchBar]
		layer.states.switch("hide")
page.onSwipeDownEnd ->
	for layer in [tabBar, touchBar, searchBar]
		layer.states.switch("default")

# Tab configuration ------------------------------
tabConf = (moviesConf, showsConf, upcomingConf, watchConf) ->

	for layer in [movies.label, movies.icon, movies.touch]
		layer.states.switch(moviesConf)
	for layer in [shows.label, shows.icon, shows.touch]
		layer.states.switch(showsConf)
	for layer in [upcoming.label, upcoming.icon, upcoming.touch]
		layer.states.switch(upcomingConf)
	for layer in [watch.label, watch.icon, watch.touch]
		layer.states.switch(watchConf)

# Events -----------------------------------------
movies.onTap ->
	tabConf("active", "default", "default", "default")
	page.snapToPage(movieScroll, true)
	Framer.Device.background.states.switchInstant("moviesColor")
	movies.touch.bringToFront()
shows.onTap ->
	tabConf("default", "active", "default", "default")
	page.snapToPage(showsScroll, true)
	Framer.Device.background.states.switchInstant("showsColor")
	shows.touch.bringToFront()
upcoming.onTap ->
	tabConf("default", "default", "active", "default")
	page.snapToPage(upcomingScroll, true)
	Framer.Device.background.states.switchInstant("upcomingColor")
	upcoming.touch.bringToFront()
watch.onTap ->
	tabConf("default", "default", "default", "active")
	page.snapToPage(watchScroll, true)
	Framer.Device.background.states.switchInstant("watchColor")
	watch.touch.bringToFront()
