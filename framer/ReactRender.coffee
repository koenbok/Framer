React = require "React"

{LayerStyle} = require "./LayerStyle"


LayerComponent = React.createClass

	getInitialState: ->
		return {x:100}

	componentDidMount: ->
		console.log "componentDidMount"

	componentDidUpdate: ->
		console.log "componentDidUpdate"

	shouldComponentUpdate: (nextProps, nextState) ->
		return true

	calculateStyleProperties: ->

	setStyleProperties: (properties) ->
		node = React.findDOMNode(@)
		return unless node
		_.extend(node.style, properties)
		return null

	render: ->
		React.createElement('div', reactPropsForLayer(@props.layer), 
			_.map(@props.layer.subLayers, reactElementForLayer))

framerGetStyleProperties = (layer) ->

	css = {}

	for k, v of LayerStyle
		css[k] = LayerStyle[k](layer)

	return css


framerGetRootLayersForContext = (context) ->
	return _.filter context._layerList, (layer) -> layer.superLayer is null

reactElementForContext = (context) ->

	props =
		key: context.id
		className: "framerContext"

	return React.createElement "div", props, 
		_.map(framerGetRootLayersForContext(context), reactElementForLayer)


reactPropsForLayer = (layer) ->
	props =
		key: layer.id
		className: "framerLayer"
		style: framerGetStyleProperties(layer)
		onMouseDown: (e) -> layer.emit(Events.MouseDown, e); return null
		onMouseUp: (e) -> layer.emit(Events.MouseUp, e); return null
		onMouseMove: (e) -> layer.emit(Events.MouseMove, e); return null

reactElementForLayer = (layer) ->

	if layer.childContext
		return reactElementForContext(layer.childContext)	

	if not layer._reactElement
		layer._reactElement = React.createElement LayerComponent, {key:layer.id, layer:layer}

	return layer._reactElement

mountNode = null

render = ->


	React.render(reactElementForContext(Framer.DefaultContext), mountNode)

	setTimeout(render, 200)

	# console.log "render"

	# requestAnimationFrame(render)

document.addEventListener "DOMContentLoaded", ->

	mountNode = document.createElement("div")

	document.body.appendChild(mountNode)

	render()
