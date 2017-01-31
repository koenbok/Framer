
import {BaseClass} from "BaseClass"
import {Layer} from "Layer"
import {Collection} from "Collection"
import {AnimationLoop} from "AnimationLoop"
import {Renderer} from "render/Renderer"

interface ContextOptions {
	parent: Layer|Context|null,
	backgroundColor: string
}

type ContextEventTypes =
	"reset"

export class Context extends BaseClass<ContextEventTypes> {

	static get Default() {
		return DefaultContext
	}

	static get Current() {
		return CurrentContext
	}

	private _layers = new Collection<Layer>()
	private _renderer: Renderer

	private _properties: ContextOptions = {
		parent: null,
		backgroundColor: "rgba(255, 0, 0, 0.5)"
	}

	constructor(renderer: Renderer, options: ContextOptions|{}={}) {
		super()
		this._renderer = renderer
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

}


export const DefaultRenderer = new Renderer(AnimationLoop.Default)
export const DefaultContext = new Context(DefaultRenderer)
export let CurrentContext = DefaultContext