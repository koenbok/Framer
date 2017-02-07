import {Layer} from "./Layer"
import {Context} from "./Context"
import {Renderer} from "./render/Renderer"
import {AnimationLoop} from "./AnimationLoop"
import {Linear} from "./AnimationCurve"
import * as Utils from "utils/index"

export const Framer = {
	Layer: Layer,
	Context: Context
}

export const Loop = new AnimationLoop()

export {Layer, Context, Utils, Renderer, Linear}


interface Window {
	Framer: typeof Framer
}

declare var window: Window

window.Framer = Framer