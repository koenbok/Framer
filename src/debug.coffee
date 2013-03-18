utils = require "./utils"

exports.debug = ->
	
	
	console.log "Framer.debug"
	
	# Safari bug: https://bugs.webkit.org/show_bug.cgi?id=78206
	if window._togglingDebug is true
		return
	
	window._togglingDebug = true
	
	View.Views.map (view, i) ->
			
		if view._debug
			view._element.removeChild view._debug.node
			view.style = view._debug.style
			# view.clip = view._debug.clip
				
			delete view._debug
				
		else
			
			color = "rgba(50,150,200,.35)"
			# color = utils.randomColor(.2)
			
			node = document.createElement "div"
			node.innerHTML = "#{view.name or view.id}"
			
			if view.superView
				node.innerHTML += " <span style='opacity:.5'>
					in #{view.superView.name or view.superView.id}
				</span>"
				
			node.style.position = "absolute"
			node.style.padding = "3px"

			view._debug =
				style: utils.extend {}, view.style
				node: node
				# clip: view.clip
					
			view._element.appendChild node
			view.style =
				color: "white"
				margin: "-1px"
				font: "10px/1em Monaco"
				backgroundColor: "#{color}"
				# boxShadow: "inset 0 0 1px rgba(50,150,200,.8)";
				border: "1px solid #{color}"
				backgroundImage: null
			# view.clip = false
	
	window._togglingDebug = false

	

window.document.onkeydown = (event) ->
	if event.keyCode == 27 # Escape
		exports.debug()
		


# window.onerror = (e) ->
# 	errorView = new View x:20, y:20, width:350, height:60
# 	errorView.html = "<b>Javascript Error</b>
# 		<br>Inspect the error console for more info."
# 	errorView.style =
# 		font: "13px/1.3em Menlo, Monaco"
# 		backgroundColor: "rgba(255,0,0,0.5)"
# 		padding: "12px"
# 		border: "1px solid rgba(255,0,0,0.5)"
# 		borderRadius: "5px"
# 	errorView.scale = 0.5
# 	errorView.animate
# 		properties: {scale:1.0}
# 		curve: "spring(150,8,1500)"
