import {Layer} from "./Layer"
import {Context} from "./Context"
import {Renderer} from "./render/Renderer"
import {AnimationLoop} from "./AnimationLoop"
import {Curve} from "./Curve"
import * as Utils from "utils/index"

export const Framer = {
	Layer: Layer,
	Context: Context
}

export const Loop = new AnimationLoop()

export {Layer, Context, Utils, Renderer, Curve}


interface Window {
	Framer: typeof Framer
}

declare var window: Window

window.Framer = Framer