import {BaseClass} from "./BaseClass"
import {Context} from "./Context"

interface LayerOptions {
		parent?: Layer|Context|null,
		x?: number,
		y?: number,
		width?: number,
		height?: number,
		backgroundColor?: string
}

export class Layer extends BaseClass {

	private _properties: LayerOptions = {
		parent: null,
		x: 0,
		y: 0,
		width: 200,
		height: 200,
		backgroundColor: "rgba(255, 0, 0, 0.5)"
	}

	constructor(options: LayerOptions={}) {
		super()
		Object.assign(this, options)
	}

	get x() {
		return this._properties.x
	}

	set x(value) {
		this._updateProperty("x", value)
		this._properties.x = value
	}

	get y() {
		return this._properties.y
	}

	set y(value) {
		this._updateProperty("y", value)
		this._properties.y = value
	}

	get width() {
		return this._properties.width
	}

	set width(value) {
		this._updateProperty("width", value)
		this._properties.width = value
	}

	get height() {
		return this._properties.height
	}

	set height(value) {
		this._updateProperty("height", value)
		this._properties.height = value
	}

	animate(options={}) {

	}


}


