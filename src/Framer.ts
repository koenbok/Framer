import {Layer} from "./Layer"
import {Context} from "./Context"
import {AnimationLoop} from "./AnimationLoop"

export const Framer = {
	Layer: Layer,
	Context: Context
}

export const Loop = new AnimationLoop()

export {Layer, Context}


interface Window {
	Framer: typeof Framer
}

declare var window: Window

window.Framer = Framer