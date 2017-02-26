import * as Utils from "Utils"
import {AnimationLoop} from "AnimationLoop"
import {Context} from "Context"
import {Layer} from "Layer"
import {CSSStyles} from "Types"
import {assignStyles, assignAllStyles} from "render/css"
import {render} from "render/PreactRenderer"


const createRendererElement = () => {

	const element = document.createElement("div")

	element.classList.add("renderer")

	Utils.dom.assignStyles(element, {
		position: "absolute",
		top: "0px",
		right: "0px",
		bottom: "0px",
		left: "0px",
	})

	return element
}

export class Renderer {

	manual = false

	private _loop: AnimationLoop
	private _context: Context
	private _hasDirtyStructure = false
	private _dirtyStyleItems: Set<Layer> = new Set()
	private counters = {
		updateKeyStyle: 0,
		updateCustomStyles: 0,
		updateStructure: 0,
		renderStyle: 0,
		renderStructure: 0
	}

	private _element = createRendererElement()

	constructor(context: Context, loop: AnimationLoop) {

		this._context = context
		this._loop = loop

		Utils.dom.whenReady(() => {
			document.body.appendChild(this.element)
		})
	}

	destroy() {
		Utils.dom.detach(this._element)
	}

	get element() {
		return this._element
	}

	get html() {
		return this._element.innerHTML
	}

	get context() {
		return this._context
	}

	get loop() {
		return this._loop
	}

	getDirtyStyles = (layer: Layer) => {
		if (!layer["_dirty"]) { layer["_dirty"] = {} }
		return layer["_dirty"]
	}

	flushDirtyStyles = (layer: Layer) => {
		let dirtyStyles = this.getDirtyStyles(layer)
		layer["_dirty"] = {}
		return dirtyStyles
	}


	get hasDirtyStructure() {
		return this._hasDirtyStructure
	}

	get hasDirtyStyleItems() {
		return this._dirtyStyleItems.size > 0
	}

	requestRender = () => {
		if (this.manual) { return }
		if (this.hasDirtyStyleItems || this.hasDirtyStructure) {
			this.loop.schedule("render", this.render)
		}
	}

	// Update

	updateStructure(layer: Layer | Context) {
		this.counters.updateStructure++
		if (this._hasDirtyStructure) { return }
		this._hasDirtyStructure = true
		this.requestRender()
	}

	updateKeyStyle(layer: Layer, key, value) {
		this.counters.updateKeyStyle++
		let styles = this.getDirtyStyles(layer)
		assignStyles(layer, [key], styles)
		this._dirtyStyleItems.add(layer)
		this.requestRender()
	}

	updateCustomStyles(layer: Layer, styles: CSSStyles) {
		this.counters.updateCustomStyles++
		Object.assign(this.getDirtyStyles(layer), styles)
		this._dirtyStyleItems.add(layer)
		this.requestRender()
	}

	render = () => {

		if (this.hasDirtyStructure) {
			this.renderStructure()
		}

		if (this.hasDirtyStyleItems) {
			return this.renderStyle()
		}

	}

	renderStructure = () => {
		this.counters.renderStructure++
		render(this.context, this._element)
		this._hasDirtyStructure = false
	}

	renderStyle = () => {

		// We always need to have structure before we can apply style.
		// if (this.renderStructureCount === 0) {
		// 	this.renderStructure()
		// 	return
		// }

		this.counters.renderStyle++

		for (let layer of this._dirtyStyleItems) {
			Utils.dom.assignStyles(layer._element, this.flushDirtyStyles(layer))
		}

		this._dirtyStyleItems.clear()
	}


	componentWillMount(layer: Layer) {

	}

	componentDidMount(layer: Layer) {
		// On a full mount we want all styles to be applied to the dom node
		Utils.dom.assignStyles(layer._element, assignAllStyles(layer))
		Utils.dom.assignStyles(layer._element, layer.styles)
	}

	componentWillUnmount(layer: Layer) {

	}
}
