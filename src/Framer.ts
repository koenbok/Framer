import * as utils from "utils"
import {Layer} from "Layer"
import {Context} from "Context"
import {Renderer} from "render/Renderer"
import {AnimationLoop} from "AnimationLoop"
import {Curve} from "Curve"
import {Printer} from "Printer"

export const Framer = {
	Layer: Layer,
	Context: Context
}

// TODO: Is this needed?
export const Loop = new AnimationLoop()

const printer = new Printer()
export const print = printer.print

export {utils, Layer, Context, Renderer, Curve}


export interface Window {
	Framer: typeof Framer
}

declare var window: Window

window.Framer = Framer