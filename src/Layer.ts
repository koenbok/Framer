import * as _ from "lodash"
import * as Types from "Types"
import * as utils from "Utils"

import {Renderable} from "Renderable"
import {Screen} from "Screen"
import {Collection} from "Collection"
import {Context, DefaultContext, CurrentContext} from "Context"
import {Animation, AnimationEventTypes} from "Animation"
import {AnimationCurve} from "AnimationCurve"
import {Curve} from "Curve"
import {Color} from "Color"
import {GestureEvent} from "GestureEventRecognizer"

export type LayerCallbackHandler = (this: Layer, event: GestureEvent) => void

export interface LayerOptions {
	context?: Context
	parent?: Layer|null
	ignoreEvents?: boolean
	x?: number
	y?: number
	z?: number
	minX?: number
	midX?: number
	maxX?: number
	minY?: number
	midY?: number
	maxY?: number
	top?: number
	right?: number
	bottom?: number
	left?: number
	width?: number
	height?: number
	backgroundColor?: string
	point?: Types.Point,
	size?: Types.Size,
	frame?: Types.Frame,
	opacity?: number
	image?: string | null,
	styles?: Types.CSSStyles,
	text?: string
}

export type LayerKey = keyof LayerOptions

export interface LayerAnimationKeys {
	x?: number
	y?: number
	width?: number,
	height?: number,
	backgroundColor?: string | Color
	minX?: number
	midX?: number
	maxX?: number
	minY?: number
	midY?: number
	maxY?: number
}

export type LayerEventKeyTypes =
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
	LayerEventKeyTypes |
	LayerEventUserTypes |
	AnimationEventTypes


export class Layer extends Renderable<LayerEventTypes> {

	private _context: Context = CurrentContext
	private _parent: Layer|null = null
	private _keys = {
		ignoreEvents: true,
		x: 0,
		y: 0,
		z: 0,
		width: 200,
		height: 200,
		backgroundColor: "rgba(255, 0, 0, 0.5)",
		opacity: 1,
		image: null,
		styles: {},
		text: ""
	}

	_initialized = false
	_element: HTMLElement

	constructor(options: LayerOptions= {}) {
		super()

		if (options.context) { this._context = options.context }
		this._setId(this.context.addLayer(this))

		if (options.parent) { this.parent = options.parent }

		utils.assignOrdered(this, options, [
			"frame", "size", "point",
			"top", "right", "bottom", "left",
			"minX", "midX", "maxX",
			"minY", "midY", "maxY"
		])

		this._initialized = true
		this.context.renderer.updateStructure(this)

	}

	get initialized() {
		return this._initialized
	}

	get context(): Context {
		return this._context
	}

	get parent() {
		return this._parent
	}

	set parent(value: Layer | null) {

		if (this.parent === value) {
			return
		}

		if (value === this) {
			throw Error("A parent cannot be itself.")
		}

		if (value && (value.context !== this.context)) {
			throw Error("A parent has to have the same context.")
		}

		this._parent = value
		this.context.renderer.updateStructure(this)
		this._didChangeKey("parent", value)

	}

	get children(): Layer[] {
		return this.context.layers.filter(layer => layer.parent === this)
	}

	get ignoreEvents() {
		return this._keys.ignoreEvents
	}

	set ignoreEvents(value) {
		if (!this._shouldChangeKey("ignoreEvents", value)) { return }
		this._keys.ignoreEvents = value
		this._didChangeKey("ignoreEvents", value)
		this.context.renderer.updateKeyStyle(this, "ignoreEvents", value)
	}

	get x() {
		return this._keys.x
	}

	set x(value) {
		if (!this._shouldChangeKey("x", value)) { return }
		this._keys.x = value
		this._didChangeKey("x", value)
		this.context.renderer.updateKeyStyle(this, "x", value)
	}

	get y() {
		return this._keys.y
	}

	set y(value) {
		if (!this._shouldChangeKey("y", value)) { return }
		this._keys.y = value
		this._didChangeKey("y", value)
		this.context.renderer.updateKeyStyle(this, "y", value)
	}

	get z() {
		return this._keys.z
	}

	set z(value) {
		if (!this._shouldChangeKey("z", value)) { return }
		this._keys.y = value
		this._didChangeKey("z", value)
		this.context.renderer.updateKeyStyle(this, "z", value)
	}

	get width() {
		return this._keys.width
	}

	set width(value) {
		if (!this._shouldChangeKey("width", value)) { return }
		this._keys.width = value
		this._didChangeKey("width", value)
		this.context.renderer.updateKeyStyle(this, "width", value)
	}

	get height() {
		return this._keys.height
	}

	set height(value) {
		if (!this._shouldChangeKey("height", value)) { return }
		this._keys.height = value
		this._didChangeKey("height", value)
		this.context.renderer.updateKeyStyle(this, "height", value)
	}

	get point(): Types.Point {
		return {x: this.x, y: this.y}
	}

	set point(point: Types.Point) {
		Object.assign(this, point)
	}

	get size(): Types.Size {
		return {width: this.width, height: this.height}
	}

	set size(size: Types.Size) {
		Object.assign(this, size)
	}

	get frame(): Types.Frame {
		return {
			x: this.width,
			y: this.height,
			width: this.width,
			height: this.height
		}
	}

	set frame(frame: Types.Frame) {
		Object.assign(this, frame)
	}

	get minX() { return utils.frame.getMinX(this) }
	set minX(value) { utils.frame.setMinX(this, value) }

	get midX() { return utils.frame.getMidX(this) }
	set midX(value) { utils.frame.setMidX(this, value) }

	get maxX() { return utils.frame.getMaxX(this) }
	set maxX(value) { utils.frame.setMaxX(this, value) }

	get minY() { return utils.frame.getMinY(this) }
	set minY(value) { utils.frame.setMinY(this, value) }

	get midY() { return utils.frame.getMidY(this) }
	set midY(value) { utils.frame.setMidY(this, value) }

	get maxY() { return utils.frame.getMaxY(this) }
	set maxY(value) { utils.frame.setMaxY(this, value) }


	get top() { return utils.frame.getTop(this, this.parent ? this.parent : Screen) }
	set top(value) { utils.frame.setTop(this, this.parent ? this.parent : Screen, value) }

	get right() { return utils.frame.getRight(this, this.parent ? this.parent : Screen) }
	set right(value) { utils.frame.setRight(this, this.parent ? this.parent : Screen, value) }

	get bottom() { return utils.frame.getBottom(this, this.parent ? this.parent : Screen) }
	set bottom(value) { utils.frame.setBottom(this, this.parent ? this.parent : Screen, value) }

	get left() { return utils.frame.getLeft(this, this.parent ? this.parent : Screen) }
	set left(value) { utils.frame.setLeft(this, this.parent ? this.parent : Screen, value) }


	get backgroundColor() {
		return this._keys.backgroundColor
	}

	set backgroundColor(value) {
		if (!this._shouldChangeKey("backgroundColor", value)) { return }
		this._keys.backgroundColor = value
		this._didChangeKey("backgroundColor", value)
		this.context.renderer.updateKeyStyle(this, "backgroundColor", value)
	}

	get styles() {
		return this._keys.styles
	}

	set styles(styles: Types.CSSStyles) {
		this.updateStyles(styles)
	}

	updateStyles(styles: Types.CSSStyles) {
		if (_.isEmpty(styles)) { return }
		Object.assign(this._keys.styles, styles)
		this.context.renderer.updateCustomStyles(this, styles)
	}

	get text() {
		return this._keys.text
	}

	set text(value) {
		if (!this._shouldChangeKey("text", value)) { return }
		this._keys.text = value
		this._didChangeKey("text", value)
		this.context.renderer.updateStructure(this)
	}

	// Animations

	/** Start an animation. */
	animate(
		keys: LayerAnimationKeys,
		curve: AnimationCurve= Curve.linear(1)
	): Animation<Layer, LayerAnimationKeys> {
		let animation = new Animation<Layer, LayerAnimationKeys>(this.context, this, keys, curve)
		animation.start()
		return animation
	}

	/** List of current running animations. */
	get animations() {
		return this.context.animationsForTarget(this)
	}


	// Events

	onClick(fn: LayerCallbackHandler) { this.on("click", fn) }
	onDoubleClick(fn: LayerCallbackHandler) { this.on("doubleclick", fn) }

	onMouseUp(fn: LayerCallbackHandler) { this.on("mouseup", fn) }
	onMouseDown(fn: LayerCallbackHandler) { this.on("mousedown", fn) }
	onMouseOver(fn: LayerCallbackHandler) { this.on("mouseover", fn) }
	onMouseOut(fn: LayerCallbackHandler) { this.on("mouseout", fn) }
	onMouseMove(fn: LayerCallbackHandler) { this.on("mousemove", fn) }
	onMouseWheel(fn: LayerCallbackHandler) { this.on("mousewheel", fn) }

	onAnimationStart(fn: LayerCallbackHandler) { this.on("AnimationStart", fn) }
	onAnimationStop(fn: LayerCallbackHandler) { this.on("AnimationStop", fn) }
	onAnimationHalt(fn: LayerCallbackHandler) { this.on("AnimationHalt", fn) }
	onAnimationEnd (fn: LayerCallbackHandler) { this.on("AnimationEnd", fn) }
	onChange(key: LayerKey, fn: LayerCallbackHandler) { this.on(`change:${key}` as any, fn) }

	addEventListener(eventName: LayerEventTypes, fn: LayerCallbackHandler, once: boolean, context: Object) {
		super.addEventListener(eventName, fn, once, context)

		// If we added a dom event listener, turn off ignoreEvents
		if (utils.dom.getDOMEventKeys(this).length) { this.ignoreEvents = false }

		this.context.renderer.updateStructure()
	}


	// Keys

	private _shouldChangeKey(key: LayerKey, value: any) {
		return (this._keys as any)[key] !== value
	}

	private _didChangeKey(key: string, value: any) {
		(this.emit as any)(`change:${key}`, value)
	}

	describe() {
		return `<Layer ${this.id} (${this.x}, ${this.y}) ${this.width} x ${this.height}>`
	}

}

