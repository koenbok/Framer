import * as Utils from "Utils"
import * as Types from "Types"

import {AnimationLoop} from "AnimationLoop"
import {Context} from "Context"
import {Layer} from "Layer"
import {assignStyles, assignAllStyles} from "render/css"
import {render} from "render/PreactRenderer"

interface Renderable {
	_element: HTMLElement
	styles: Types.CSSStyles
}

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
	private _dirtyStyleItems: Set<Renderable> = new Set()
	private _counters = {
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

	get counters() {
		return Object.assign({}, this._counters)
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

	getDirtyStyles = (item: Renderable) => {
		if (!item["_dirty"]) { item["_dirty"] = {} }
		return item["_dirty"]
	}

	flushDirtyStyles = (item: Renderable) => {
		let dirtyStyles = this.getDirtyStyles(item)
		item["_dirty"] = {}
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

	updateStructure(item?: Renderable) {
		this._counters.updateStructure++
		if (this._hasDirtyStructure) { return }
		this._hasDirtyStructure = true
		this.requestRender()
	}

	updateKeyStyle(item: Renderable, key, value) {
		this._counters.updateKeyStyle++
		let styles = this.getDirtyStyles(item)
		assignStyles(item as Layer, [key], styles)
		this._dirtyStyleItems.add(item)
		this.requestRender()
	}

	updateCustomStyles(item: Renderable, styles: Types.CSSStyles) {
		this._counters.updateCustomStyles++
		Object.assign(this.getDirtyStyles(item), styles)
		this._dirtyStyleItems.add(item)
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
		this._counters.renderStructure++
		render(this.context, this._element)
		this._hasDirtyStructure = false
	}

	renderStyle = () => {

		// We always need to have structure before we can apply style.
		// if (this.renderStructureCount === 0) {
		// 	this.renderStructure()
		// 	return
		// }

		this._counters.renderStyle++

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
