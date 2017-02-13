import * as Utils from "Utils"
import {AnimationLoop} from "AnimationLoop"
import {Context} from "Context"
import {Layer} from "Layer"
import {getLayerStyles} from "render/css"
import {render} from "render/PreactRenderer"

export class Renderer {

	private _loop: AnimationLoop
	private _context: Context
	private _dirtyStructure = false
	private _dirtyStyle: Set<Layer> = new Set()
	private _renderStructureCount = 0
	private _renderStyleCount = 0
	private _element = document.createElement("div")

	manual = false

	constructor(context: Context, loop: AnimationLoop) {
		this._context = context
		this._loop = loop

		this._element.className = "context"
		this._element.style.position = "absolute"
		this._element.style.top = "0px"
		this._element.style.right = "0px"
		this._element.style.bottom = "0px"
		this._element.style.left = "0px"

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

	get renderStructureCount() {
		return this._renderStructureCount
	}

	get renderStyleCount() {
		return this._renderStyleCount
	}

	updateStructure(layer: Layer | Context) {
		if (this._dirtyStructure) { return }
		if (!this.manual) { this.loop.schedule("render", this.render) }
		this._dirtyStructure = true
	}

	updateStyle(layer: Layer, key, value) {

		if (this._dirtyStyle.size === 0) {
			if (!this.manual) { this.loop.schedule("render", this.render) }
		}

		this._dirtyStyle.add(layer)
	}

	get dirtyStructure() {
		return this._dirtyStructure
	}

	get dirtyStyle() {
		return this._dirtyStyle.size > 0
	}

	render = () => {

		if (this.dirtyStructure) {
			this.renderStructure()
		}

		if (this.dirtyStyle) {
			return this.renderStyle()
		}

	}

	renderStructure = () => {
		this._renderStructureCount++
		render(this.context, this._element)
		this._dirtyStructure = false

	}

	renderStyle = () => {
		this._renderStyleCount++

		console.log("renderStyle");


		for (let layer of this._dirtyStyle) {
			if (layer._element) {
				getLayerStyles(layer, layer._element.style as any)
			} else {
				console.log("renderer.renderStyle: could not update layer", layer.id)
			}
		}
		this._dirtyStyle = new Set()
	}
}
