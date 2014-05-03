describe "ExternalDocument", ->

	describe "Defaults", ->

		it "should load", ->

			doc = new Framer.ExternalDocument "static/ExternalDocument/Test"
			
			layers = doc.load()

			dataA =  {
				"Background": {
					"frame": {
						"x": 0,
						"y": 0,
						"width": 320,
						"height": 568
					}
				},
				"Text2": {
					"frame": {
						"x": 6,
						"y": 129,
						"width": 157,
						"height": 26
					},
					"superLayerName": "Text"
				},
				"Text": {
					"frame": {
						"x": 75,
						"y": 260,
						"width": 168,
						"height": 26
					}
				}
			}

			dataB = {}

			for name, layer of layers
				dataB[name] =
					frame: layer.frame.properties
					superLayerName: layer.superLayer?.name

			jsonA = JSON.stringify dataA
			jsonB = JSON.stringify dataB

			jsonA.should.equal jsonB
