import {Layer, LayerOptions} from "../Layer"

const getStyle = {
	pointerEvents: (layer: Layer) => {
		if (layer.ignoreEvents) {
			return "none"
		} else {
			return "auto"
		}
	},
	position: (layer: Layer) => "absolute",
	transform: (layer: Layer) => `translate3d(${layer.x}px, ${layer.y}px, ${layer.z}px)`,
	width: (layer: Layer) => `${layer.width}px`,
	height: (layer: Layer) => `${layer.height}px`,
	backgroundColor: (layer: Layer) => layer.backgroundColor
}

const styleMap = {
	ignoreEvents: ["pointerEvents"],
	x: ["transform"],
	y: ["transform"],
	width: ["width"],
	height: ["height"],
	backgroundColor: ["backgroundColor"]
}

export const assignStyles = (
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

export const assignAllStyles = (layer: Layer, styles= {}) => {

	for (let property in getStyle) {
		styles[property] = getStyle[property](layer)
	}

	return styles
}