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
		return `
			translate3d(
				${layer.context.dpr(layer.x)}px,
				${layer.context.dpr(layer.y)}px,
				${layer.context.dpr(layer.z)}px)
			scale(${layer.scale})`
	},
	width: (layer: Layer) => `${layer.context.dpr(layer.width)}px`,
	height: (layer: Layer) => `${layer.context.dpr(layer.height)}px`,
	backgroundColor: (layer: Layer) => layer.backgroundColor,
	backgroundImage: (layer: Layer) => {
		const image = layer.image
		if (image) {
			if (image.startsWith("url(")) {
				return image
			} else {
				return `url(${image})`
			}
		}
		return null
	},
	backgroundRepeat: (layer: Layer) => "no-repeat",
	backgroundPosition: (layer: Layer) => "center",
	backgroundSize: (layer: Layer) => "cover",
	opacity: (layer: Layer) => layer.opacity,
	visibility: (layer: Layer) => {
		if (layer.visible) { return "visible" }
		else { return "hidden" }
	},
	"-webkit-overflow-scrolling": (layer: Layer) => "touch",
	"-webkit-box-sizing": (layer: Layer) => "border-box",
	"-webkit-user-select": (layer: Layer) => "none"
}

const styleMap = {
	ignoreEvents: ["pointerEvents"],
	x: ["transform"],
	y: ["transform"],
	scale: ["transform"],
	width: ["width"],
	height: ["height"],
	backgroundColor: ["backgroundColor"],
	image: ["backgroundImage"],
	visible: ["visibility"],
	opacity: ["opacity"]
}

export const assignStyles = (
	layer: Layer,
	keys: (keyof LayerOptions)[],
	styles: any = {}) => {

	for (let key of keys) {
		for (let cssProperty of (styleMap as any)[key]) {
			styles[cssProperty] = (getStyle as any)[cssProperty](layer)
		}
	}

	return styles
}

export const assignAllStyles = (layer: Layer, styles: any = {}) => {

	for (let property in getStyle) {
		styles[property] = (getStyle as any)[property](layer)
	}

	return styles
}