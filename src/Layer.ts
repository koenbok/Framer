import {BaseClass} from "BaseClass"
import {Collection} from "Collection"
import {Context, DefaultContext, CurrentContext} from "Context"
import {AnimatableProperties} from "AnimationProperty"
import {Animation, AnimationEventTypes} from "Animation"
import {AnimationCurve} from "AnimationCurve"
import {Curve} from "Curve"

export interface LayerOptions {
		context?: Context
		parent?: Layer|null
		x?: number
		y?: number
		width?: number
		height?: number
		backgroundColor?: string
		opacity?: number
		image?: string|null
}

type LayerProperties = keyof LayerOptions

export type LayerEventPropertyTypes =
	"change:x" |
	"change:y" |
	"change:width" |
	"change:height"

export type LayerEventUserTypes =
	"click" |
	"doubleclick" |
	"mouseup" |
	"mousedown" |
	"mouseover" |
	"mouseout" |
	"mousemove" |
	"mousewheel"

export type LayerEventTypes =
	LayerEventPropertyTypes |
	LayerEventUserTypes |
	AnimationEventTypes


export class Layer extends BaseClass<LayerEventTypes> {

	private _context: Context
	private _parent: Layer|null
	private _properties = {
		x: 0,
		y: 0,
		width: 200,
		height: 200,
		backgroundColor: "rgba(255, 0, 0, 0.5)",
		opacity: 1,
		image: null
	}

	_forceUpdate = false
	_element: HTMLElement
	_animations = new Collection<Animation>()

	constructor(options: LayerOptions= {}) {
		super()

		this._setId(this.context.addLayer(this))

		// TODO: Maybe we store parent by id in properties?
		if (options.parent) {
			this.parent = options.parent
		}

		Object.assign(this._properties, options)

		this._updateStructure()
		this._forceFullUpdate()
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

		this._parent = value
		this._updateStructure()
		this._updateProperty("parent", value)

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
		if (!this._shouldUpdate("x", value)) { return }
		this._properties.x = value
		this._updateProperty("x", value)
		this._updateStyle("x", value)
	}

	get y() {
		return this._properties.y
	}

	set y(value) {
		if (!this._shouldUpdate("y", value)) { return }
		this._properties.y = value
		this._updateProperty("y", value)
		this._updateStyle("y", value)
	}

	get width() {
		return this._properties.width
	}

	set width(value) {
		if (!this._shouldUpdate("width", value)) { return }
		this._properties.width = value
		this._updateProperty("width", value)
		this._updateStyle("width", value)
	}

	get height() {
		return this._properties.height
	}

	set height(value) {
		if (!this._shouldUpdate("height", value)) { return }
		this._properties.height = value
		this._updateProperty("height", value)
		this._updateStyle("height", value)
	}

	get backgroundColor() {
		return this._properties.backgroundColor
	}

	set backgroundColor(value) {
		if (!this._shouldUpdate("backgroundColor", value)) { return }
		this._properties.backgroundColor = value
		this._updateProperty("backgroundColor", value)
		this._updateStyle("backgroundColor", value)
	}

	// Animations

	/** Start an animation. */
	animate = (
		properties: AnimatableProperties,
		curve: AnimationCurve= Curve.linear(1)
	) => {
		let animation = new Animation(this, properties, curve)
		animation.start()
		return animation
	}

	/** List of current running animations. */
	get animations() {
		return this._animations.items()
	}


	// Events

	onClick = (handler: Function) => { this.on("click", handler) }
	onDoubleClick = (handler: Function) => { this.on("doubleclick", handler) }

	onMouseUp = (handler: Function) => { this.on("mouseup", handler) }
	onMouseDown = (handler: Function) => { this.on("mousedown", handler) }
	onMouseOver = (handler: Function) => { this.on("mouseover", handler) }
	onMouseOut = (handler: Function) => { this.on("mouseout", handler) }
	onMouseMove = (handler: Function) => { this.on("mousemove", handler) }
	onMouseWheel = (handler: Function) => { this.on("mousewheel", handler) }

	onAnimationStart = (handler: Function) => { this.on("AnimationStart", handler) }
	onAnimationStop = (handler: Function) => { this.on("AnimationStop", handler) }
	onAnimationHalt = (handler: Function) => { this.on("AnimationHalt", handler) }
	onAnimationEnd = (handler: Function) => { this.on("AnimationEnd", handler) }
	onChange = (property: LayerProperties, handler: Function) => { this.on(`change:${property}` as any, handler) }

	// private _dirty = new Set()

	private _updateStyle(name: string, value: any) {
		this.context.renderer.updateStyle(this, name, value)
	}
	private _updateStructure() {
		this.context.renderer.updateStructure(this)
	}

	private _updateProperty(name: string, value: any) {
		(this.emit as any)(`change:${name}`, value)
		// this._dirty.add(name)
	}

	private _forceFullUpdate() {
		this._forceUpdate = true
		Object.assign(this, this._properties)
		this._forceUpdate = false
	}

	private _shouldUpdate(property, value) {
		return this._forceUpdate || this._properties[property] !== value
	}

	// isDirty() {
	// 	return this._dirty.size > 0
	// }

	// dirtyValues() {
	// 	return pick(this, Array.from(this._dirty))
	// }

	// flush() {
	// 	this._dirty.clear()
	// }

}

