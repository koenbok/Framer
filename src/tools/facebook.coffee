facebook = {}

FacebookAccessTokenKey = "token"
FacebookBaseURL = "https://graph.facebook.com/me"

facebook.query = (query, callback) ->
	
	# Create a graphql query and get the data back. If there is no
	# access token, we will throw a dialog to get it from the user.
	
	facebook._token = localStorage.getItem FacebookAccessTokenKey

	# Throw the dialog
	if facebook._token in [undefined, ""]
		facebook._tokenDialog()
		return
	
	# Load zepto
	facebook._loadJQuery ->
		
		data = 
			fields: query
			method: "GET"
			format: "json"
			access_token: facebook._token
		
		# Make the request
		$.ajax
			url: FacebookBaseURL
			data: data
			dataType: "json"
			success: callback
			error: (error) ->
				console.log "error", error
				if error.status in [0, 400]
					facebook._tokenDialog()


facebook.logout = ->
	
	# Unset the token and refresh the page
	
	localStorage.setItem FacebookAccessTokenKey, ""
	document.location.reload()

facebook._loadJQuery = (callback) ->
	
	# Load zepto so we have a decent api to do ajax requests
	
	if typeof $ is "undefined"
		script = document.createElement "script"
		script.src = "http://cdnjs.cloudflare.com/ajax/libs/zepto/1.0/zepto.min.js"
		script.type = "text/javascript"
		document.getElementsByTagName("head")[0].appendChild(script)
		
		script.onload = callback
	else
		callback()


facebook._tokenDialog = ->
	
	# Show the user a simple dialog to add their access token
	
	view = new View 
		width:500, height:120, 
		midX:window.innerWidth/2, midY:window.innerHeight/2, 
	
	view.style = 
		padding: "20px"
		backgroundColor: "#e5e5e5"
		webkitBoxShadow: "0px 2px 10px 0px rgba(0,0,0,.2)"
		border: "1px solid rgba(0,0,0,.1)"
		borderRadius: "4px"
		
	
	view.html = "
		<input type='text' id='tokenDialog'
			placeholder='Paste Facebook Access Token' 
			style='font:16px/1em Menlo;width:440px;padding:10px 10px 5px 5px' 
			onpaste='tools.facebook._tokenDialogUpdate(this)'
			onkeyup='tools.facebook._tokenDialogUpdate(this)'
		>
		<div style='
			text-align:center;
			font-size:18px;
			font-weight:
			bold;
			padding-top:20px
		'>
			<a href='https://developers.facebook.com/tools/explorer' target='new'>
				Find access token here
			</a>
		</div
	"
	
	# Handle the input
	utils.delay 0, ->
		tokenInput = window.document.getElementById "tokenDialog"
		tokenInput.focus()
	

facebook._tokenDialogUpdate = (event) ->
	
	# Hanlde the user input. If this looks like a token, save it locally
	# and try to login. If that fails, we'll throw another dialog.
	
	if event.value.length > 50
		localStorage.setItem FacebookAccessTokenKey, event.value
		document.location.reload()


exports.facebook = facebook