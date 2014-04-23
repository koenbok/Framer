runTest = (name, f, iterations=1000) ->

	console.log "Running perf test for #{name}"
	
	t1 = Utils.getTime()

	for i in [1..iterations]
		f()

	t2 = Utils.getTime()

	took = (t2 - t1) / iterations

	console.log "Took: #{took}ms"

	# console.profile()
	# console.profileEnd()


runTest "Layer style set", ->

	layer = new Layer width:100, height:100