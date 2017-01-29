import {Layer} from "./Layer"
import {Context} from "./Context"

export const Framer = {
	Layer: Layer,
	Context: Context
}

export {Layer, Context}


interface Window {
	Framer: typeof Framer
}

declare var window: Window

window.Framer = Framer