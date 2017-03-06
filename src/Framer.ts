// import * as GlobalEventListener from "hacks/GlobalEventListener"
// GlobalEventListener.setup()

import * as lodash from "lodash"
import * as utils from "Utils"

import {Config} from "Config"
import {Layer} from "Layer"
import {Context} from "Context"
import {Curve} from "Curve"
import {print} from "Printer"
import {Screen} from "Screen"

export {lodash as _, utils, print, Config, Screen, Layer, Curve, Context}

export const Framer = {
	_: lodash,
	utils: utils,
	print: print,
	Screen: Screen,
	Layer: Layer,
	Curve: Curve,
	Context: Context
}

Object.assign(window, Framer)
Object.assign(window, { Framer: Framer })

// These are needed to generate the d.ts file
import {ScreenClass} from "Screen"
import {AnimationCurveLinear} from "AnimationCurve/Linear"
import {AnimationCurveSpringRK4} from "AnimationCurve/SpringRK4"
