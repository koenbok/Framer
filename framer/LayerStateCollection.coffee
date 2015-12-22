{_} = require "./Underscore"

{BaseClass} = require "./BaseClass"

class exports.LayerStateCollection extends BaseClass

	constructor: (layers...) ->
		super
		@_layers = []
		for layer in layers
			@addLayer(layer)
		@_currentState = "default"

	@define "layers", get: -> @_layers
	@define "currentState", get: -> @_currentState
	@define "state", get: -> @_currentState
	
	addLayer: (layers...) ->
		for layer in layers
			if _.isArray(layer)
				for item in layer
					@addLayer(item)
			else if layer instanceof Layer
				@_layers.push(layer) unless layer in @_layers
	
	removeLayer: (layer) ->
		if _.isArray(layer)
			for item in layer
				@removeLayer(item)
		else if layer instanceof Layer
			index = @_layers.indexOf(layer)
			if index >= 0
				@_layers.splice(index, 1)
	
	switchState: (newState, animationOptions, instant = false) ->
		for layer in @_layers
			nextState = newState
			
			for key in _.keys(layer.states._states)
				values = layer.states._states[key]

				if values["superState"] == nextState
					nextState = key
					break

			if nextState in _.keys layer.states._states
				layer.states.switch(nextState, animationOptions, instant)
				if nextState == newState
					@_currentState = newState
