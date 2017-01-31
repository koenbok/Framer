import {AnimationLoop} from "AnimationLoop"
import {Context} from "Context"
import {Layer} from "Layer"
import {getLayerStyles} from "render/css"
import {render} from "render/react/ReactRenderer"

export class Renderer {

	private _loop: AnimationLoop
	private _dirtyStructure = false
	private _dirtyStyle: Set<Layer> = new Set()
	private _renderStructureCount = 0
	private _renderStyleCount = 0

	constructor(loop: AnimationLoop) {
		this._loop = loop
	}

	get renderStructureCount() {
		return this._renderStructureCount
	}

	get renderStyleCount() {
		return this._renderStyleCount
	}

	updateStructure() {
		// if (this._dirtyStructure) { return }
		this._loop.schedule("render", this.renderStructure)
		// this._dirtyStructure = true
	}

	updateStyle(layer: Layer, key, value) {

		// console.log("updateStyle");
		// debugger;


		if (this._dirtyStyle.size == 0) {
			this._loop.schedule("render", this.renderStyle)
		}

		this._dirtyStyle.add(layer)

	}

	renderStructure = () => {

		this._renderStructureCount++
		console.log("renderStructure", this.renderStructureCount);

		render(Context.Default)
		// this._dirtyStructure = false
		// this._dirtyStyle = new Set()

	}

	renderStyle = () => {

		if (this._dirtyStyle.size == 0) { return }

		this._renderStyleCount++
		// console.log("renderStyle", this.renderStyleCount);


		for (let layer of this._dirtyStyle) {
			if (layer._element) {
				// TODO: Maybe not all the styles?
				getLayerStyles(layer, layer._element.style as any)
			}
		}

		this._dirtyStyle = new Set()

	}
}
