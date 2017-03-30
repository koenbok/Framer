import {isNumber} from "lodash"

import * as Types from "Types"

import {Screen} from "Screen"
import {Layer} from "Layer"

let pixelRound = Math.floor;

export type NumberOrPoint = number | Types.Point
type Aligning = (layer: Layer, property: string, offset: number | null) => NumberOrPoint
export type AlignFunction = (l: Layer, p: string) => NumberOrPoint
export type AlignInfo = AlignFunction | ((a?: number) => AlignFunction)

interface Alignable {
	width: number
	height: number
	borderWidth?: number
}

let center = function(layer: Layer, property: string, offset: number): NumberOrPoint {

	if (offset == null) { offset = 0; }
	let parent: Alignable = layer.parent ? layer.parent : Screen

	let { borderWidth } = parent;
	if (borderWidth == null) { borderWidth = 0; }

	let x = pixelRound(((parent.width / 2) - (layer.width / 2) - borderWidth) + offset);
	let y = pixelRound(((parent.height / 2) - (layer.height / 2) - borderWidth) + offset);

	if (property === "x") { return x; }
	if (property === "y") { return y; }
	if (property === "point") { return {x, y}; }
	return 0;
};

let left = function(layer: Layer, property: string, offset: number): number {
	if (offset == null) { offset = 0; }
	if (property !== "x") { throw Error("Align.left only works for x"); }
	let parent: Alignable = layer.parent ? layer.parent : Screen
	return pixelRound(0 + offset);
};

let right = function(layer: Layer, property: string, offset: number): number {
	if (offset == null) { offset = 0; }
	if (property !== "x") { throw Error("Align.right only works for x"); }
	let parent: Alignable = layer.parent ? layer.parent : Screen
	let { borderWidth } = parent;
	if (borderWidth == null) { borderWidth = 0; }
	return pixelRound((parent.width - (2 * borderWidth) - layer.width) + offset);
};

let top = function(layer: Layer, property: string, offset: number): number {
	if (offset == null) { offset = 0; }
	if (property !== "y") { throw Error("Align.top only works for y"); }
	let parent: Alignable = layer.parent ? layer.parent : Screen
	return pixelRound(0 + offset);
};

let bottom = function(layer: Layer, property: string, offset: number): number {
	if (offset == null) { offset = 0; }
	if (property !== "y") { throw Error("Align.bottom only works for y"); }
	let parent: Alignable = layer.parent ? layer.parent : Screen
	let { borderWidth } = parent;
	if (borderWidth == null) { borderWidth = 0; }
	return pixelRound((parent.height - (2 * borderWidth) - layer.height) + offset);
};

// Helper to see if we are dealing with a function or result of a function
let wrapper = function(f: Aligning, name: string): AlignInfo {
	let align: any = function(a?: Layer | number, b?: string) {
		if (isNumber(a)) {
			return ((l: Layer, p: string) => f(l, p, a))
		}
		if (!a || !b) {
			return ((l: Layer, p: string) => f(l, p, 0))
		}
		return f(a, b, 0);
	};
	align.toInspect = () => `Align.${name}`;
	return align;
};

export let Align = {
	center: wrapper(center, "center"),
	left: wrapper(left, "left"),
	right: wrapper(right, "right"),
	top: wrapper(top, "top"),
	bottom: wrapper(bottom, "bottom")
};

