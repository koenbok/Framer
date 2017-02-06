import {BaseClass} from "BaseClass"
import {Context, DefaultContext, CurrentContext} from "Context"
import {AnimatableProperties} from "AnimationProperty"
import {Animation} from "Animation"
import {AnimationCurve, Linear} from "AnimationCurve"

interface LayerOptions {
		context?: Context
		parent?: Layer|null,
		x?: number,
		y?: number,
		width?: number,
		height?: number,
		backgroundColor?: string,
		opacity?: number
}

type LayerEventTypes =
	"change:x" |
	"change:y" |
	"change:width" |
	"change:height"

export class Layer extends BaseClass<LayerEventTypes> {

	private _context: Context
	private _parent: Layer|null
	private _id = -1
	private _properties = {
		x: 0,
		y: 0,
		width: 200,
		height: 200,
		backgroundColor: "rgba(255, 0, 0, 0.5)",
		opacity: 1
	}

	_element: HTMLElement | null

	constructor(options: LayerOptions={}) {
		super()
		Object.assign(this, options)

		this._id = this.context.addLayer(this)

		// TODO: Maybe we store parent by id in properties?
		if (options.parent) {
			this.parent = options.parent
		}

		this.context.renderer.updateStructure()
		this.context.renderer.updateStyle(this, "a", "b")
	}

	_updateProperty(name: string, value: any) {
		super._updateProperty(name, value)
		this.context.renderer.updateStyle(this, name, value)
	}

	get id() {
		return this._id
	}

	get context(): Context {
		return this._context || CurrentContext
	}

	get parent() {
		return this._parent
	}

	set parent(value) {

		if (this.parent === value) {
			return
		}

		this.context.renderer.updateStructure()
		this._updateProperty("parent", value)
		this._parent = value
	}

	get children(): Layer[] {
		return this.context.layers.filter((layer) => {
			return layer.parent === this
		})
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

	get backgroundColor() {
		return this._properties.backgroundColor
	}

	set backgroundColor(value) {
		this._updateProperty("backgroundColor", value)
		this._properties.backgroundColor = value
	}

	animate(properties: AnimatableProperties, curve: AnimationCurve=Linear(1), callback?: Function) {
		let animation = new Animation(this, properties, curve)
		animation.start()
	}


}


