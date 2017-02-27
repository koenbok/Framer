import {Config} from "Config"
import {Layer, LayerOptions} from "Layer"


const getStyle = {
	position: (layer: Layer) => "absolute",
	pointerEvents: (layer: Layer) => {
		if (layer.ignoreEvents) {
			return "none"
		} else {
			return "auto"
		}
	},
	transform: (layer: Layer) => {
		return `translate3d(
			${layer.context.dpr(layer.x)}px,
			${layer.context.dpr(layer.y)}px,
			${layer.context.dpr(layer.z)}px)`
	},
	width: (layer: Layer) => `${layer.context.dpr(layer.width)}px`,
	height: (layer: Layer) => `${layer.context.dpr(layer.height)}px`,
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