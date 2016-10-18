exports.config =
	before: -> 
		# Called before every pages build 
	page: (path, file) ->
		# Called with every page build and is expecterd to return a context
		date: new Date()
		domain: "domain.com"
		path: path