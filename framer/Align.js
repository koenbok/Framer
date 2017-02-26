let pixelRound = parseInt;

let center = function(layer, property, offset) {

	if (offset == null) { offset = 0; }
	let parent = Screen;
	if (layer.parent) { ({ parent } = layer); }

	let { borderWidth } = parent;
	if (borderWidth == null) { borderWidth = 0; }

	let x = pixelRound(((parent.width / 2) - (layer.width / 2) - borderWidth) + offset);
	let y = pixelRound(((parent.height / 2) - (layer.height / 2) - borderWidth) + offset);

	if (property === "x") { return x; }
	if (property === "y") { return y; }
	if (property === "point") { return {x, y}; }
	return 0;
};

let left = function(layer, property, offset) {
	if (offset == null) { offset = 0; }
	if (property !== "x") { throw Error("Align.left only works for x"); }
	let parent = Screen;
	if (layer.parent) { ({ parent } = layer); }
	return pixelRound(0 + offset);
};

let right = function(layer, property, offset) {
	if (offset == null) { offset = 0; }
	if (property !== "x") { throw Error("Align.right only works for x"); }
	let parent = Screen;
	if (layer.parent) { ({ parent } = layer); }
	let { borderWidth } = parent;
	if (borderWidth == null) { borderWidth = 0; }
	return pixelRound((parent.width - (2 * borderWidth) - layer.width) + offset);
};

let top = function(layer, property, offset) {
	if (offset == null) { offset = 0; }
	if (property !== "y") { throw Error("Align.top only works for y"); }
	let parent = Screen;
	if (layer.parent) { ({ parent } = layer); }
	return pixelRound(0 + offset);
};

let bottom = function(layer, property, offset) {
	if (offset == null) { offset = 0; }
	if (property !== "y") { throw Error("Align.bottom only works for y"); }
	let parent = Screen;
	if (layer.parent) { ({ parent } = layer); }
	let { borderWidth } = parent;
	if (borderWidth == null) { borderWidth = 0; }
	return pixelRound((parent.height - (2 * borderWidth) - layer.height) + offset);
};

// Helper to see if we are dealing with a function or result of a function
let wrapper = function(f, name) {
	let align = function(a, b) {
		if ((a == null) || _.isNumber(a)) { return ((l, p) => f(l, p, a)); }
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
