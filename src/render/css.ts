import {Layer, LayerOptions} from "../Layer"

const getStyle = {
	position: (layer: Layer) => "absolute",
	transform: (layer: Layer) => `translate(${layer.x}px, ${layer.y}px)`,
	width: (layer: Layer) => `${layer.width}px`,
	height: (layer: Layer) => `${layer.height}px`,
	backgroundColor: (layer: Layer) => layer.backgroundColor
}

const styleMap = {
	x: ["transform"],
	y: ["transform"],
	width: ["width"],
	height: ["height"],
	backgroundColor: ["backgroundColor"]
}

export const getStyles = (
	layer: Layer,
	properties: (keyof LayerOptions)[],
	styles= {}) => {

	for (let property of properties) {
		for (let cssProperty of styleMap[property]) {
			styles[cssProperty] = getStyle[cssProperty](layer)
		}
	}

	return styles
}

export const getFullStyles = (layer: Layer, styles= {}) => {
	return getStyles(layer, Object.keys(styleMap) as (keyof LayerOptions)[], styles)
}