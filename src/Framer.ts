// import * as GlobalEventListener from "hacks/GlobalEventListener"
// GlobalEventListener.setup()

import * as _ from "lodash-es"
import * as utils from "utils"

import {Config} from "Config"
import {Layer} from "Layer"
import {Context} from "Context"
import {Curve} from "Curve"
import {Printer} from "Printer"
import {Screen} from "Screen"

const printer = new Printer()
const print = printer.print

export {_, utils, print, Config, Screen, Layer, Curve, Context}