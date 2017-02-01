import {AnimationLoop} from "AnimationLoop"
import {Context} from "Context"
import {Layer} from "Layer"
import {getLayerStyles} from "render/css"
import {render} from "render/react/ReactRenderer"

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

		document.addEventListener("DOMContentLoaded", () => {
			document.body.appendChild(this.element)
		})
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

	updateStructure() {
		if (this._dirtyStructure) { return }
		if (!this.manual) { this.loop.schedule("render", this.render) }
		this._dirtyStructure = true
	}

	updateStyle(layer: Layer, key, value) {

		if (this._dirtyStructure) {
			return
		}

		if (this._dirtyStyle.size == 0) {
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
			return this.renderStructure()
		}

		if (this.dirtyStyle) {
			return this.renderStyle()
		}

	}

	renderStructure = () => {
		this._renderStructureCount++
		render(this.context, this._element)
		this._dirtyStructure = false
		this._dirtyStyle = new Set()
	}

	renderStyle = () => {
		this._renderStyleCount++

		for (let layer of this._dirtyStyle) {
			// getLayerStyles(layer, layer._element.style as any)

			if (layer._element) {
				// TODO: Maybe not all the styles?
				console.log("snif");

				getLayerStyles(layer, layer._element.style as any)
			}
		}
		this._dirtyStyle = new Set()
	}
}
