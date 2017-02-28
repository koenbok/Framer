/// <reference path="framer.d.ts" />

// Make sure these always match the ones in Framer.ts

import * as framerlib from "src/Framer"

declare global {
	// Global Framer library
	const Framer: typeof framerlib
	// Lodash library
	const _: typeof framerlib._
	// Global Framer objects
	const print: typeof framerlib.print
	const Config: typeof framerlib.Config
	const Screen: typeof framerlib.Screen
	const Layer: typeof framerlib.Layer
	const Curve: typeof framerlib.Curve
	const Context: typeof framerlib.Context
}