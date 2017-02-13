import {Layer, LayerOptions} from "../Layer"

const LayerStyles = {
	position: (layer: Layer) => "absolute",
	transform: (layer: Layer) => `translate(${layer.x}px, ${layer.y}px)`,
	width: (layer: Layer) => `${layer.width}px`,
	height: (layer: Layer) => `${layer.height}px`,
	backgroundColor: (layer: Layer) => layer.backgroundColor
}

// type LayerStyleKey = keyof typeof LayerStyles
// type FramerStyles = {[index: LayerStyleKey]: [string]}



const LayerStyleUpdateMap = {
	x: "transform",
	y: "transform",
	width: "width",
	height: "height",
	backgroundColor: "backgroundColor",
}

// TODO: Harden this with types
export const updateLayerStyles = (
	layer: Layer,
	property: keyof typeof LayerStyleUpdateMap,
	styles: Object) => {
	const cssName = LayerStyleUpdateMap[property]
	styles[cssName] = LayerStyles[cssName](layer)
}

export const getLayerStyles = (layer: Layer, styles = {}) => {

	for (const name in LayerStyles) {
		styles[name] = LayerStyles[name](layer)
	}

	return styles
}