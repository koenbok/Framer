/// <reference path="framer.d.ts" />

import * as framerlib from "src/Framer"
// export {_, utils, print, Config, Screen, Layer, Curve, Context} from "src/Framer"

declare global {
	const Framer: typeof framerlib
	const _: typeof framerlib._
	const Layer: typeof framerlib.Layer
	const Utils: typeof framerlib.utils
}