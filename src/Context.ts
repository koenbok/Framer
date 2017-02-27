
import {Renderable} from "Renderable"
import {Layer} from "Layer"
import {Collection} from "Collection"
import {AnimationLoop} from "AnimationLoop"
import {Renderer} from "render/Renderer"
import {Screen} from "Screen"

export interface ContextOptions {
	name?: string,
	parent?: Layer|Context|null,
	backgroundColor?: string,
	loop?: AnimationLoop,
	pixelRatio?: number
}

export type ContextEventTypes =
	"reset"

export class Context extends Renderable<ContextEventTypes> {

	static get Default() {
		return DefaultContext
	}

	static get Current() {
		return CurrentContext
	}

	static set Current(context: Context) {
		CurrentContext = context
	}

	private _layers = new Collection<Layer>()
	private _renderer: Renderer

	private _properties = {
		name: "",
		parent: null,
		backgroundColor: "rgba(255, 0, 0, 0.5)",
		loop: AnimationLoop.Default,
		pixelRatio: 1
	}

	constructor(name: string, options: ContextOptions= {}) {
		super()

		options.name = name

		Object.assign(this._properties, options)
		this._renderer = new Renderer(this, this._properties.loop)
	}

	get name() {
		return this._properties.name
	}

	get pixelRatio() {
		return this._properties.pixelRatio
	}

	set pixelRatio(value) {
		if (value === this._properties.pixelRatio) { return }
		this._properties.pixelRatio = value
		if (this.renderer.counters.renderStructure === 0) { return }
		this.layers.map(this.renderer.forceRenderAllStyles)
	}

	dpr = (value: number) => {
		return this.pixelRatio * value
	}

	addLayer(layer: Layer) {
		return this._layers.add(layer)
	}

	get layers() {
		return this._layers.items()
	}

	get children() {
		return this.layers.filter((layer) => { return !layer.parent })
	}

	get renderer() {
		return this._renderer
	}

	reset() {
		this._layers = new Collection<Layer>()
		this.renderer.updateStructure()
	}

	destroy() {
		this.renderer.destroy()
	}

	run(f: Function) {
		let context = CurrentContext
		CurrentContext = this
		f()
		CurrentContext = context
	}

	// get x() { return 0 }
	// get y() { return 0 }
	// get width() { return Screen.width }
	// get height() { return Screen.height }

}


export const DefaultContext = new Context("default", AnimationLoop.Default)
export let CurrentContext = DefaultContext