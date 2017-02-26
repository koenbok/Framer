import { EventEmitter } from "./EventEmitter";

/*
top, right, bottom, left, centerX, centerY, center
*/

let calculateFrame = function(layer, rules) {

	let val = function(rule) {
		let value = rules[rule];
		if (_.isFunction(value)) { value = value(); }
		return value;
	};

	let def = rule => _.isNumber(val(rule));

	if (def("center")) {
		rules["centerX"] = val("center");
		rules["centerY"] = val("center");
	}

	let parentSize = layer.parent;
	if (parentSize == null) { parentSize = Screen; }

	let { frame } = layer;

	if (def("left") && def("right")) {
		frame.x = val("left");
		frame.width = parentSize.width - val("left") - val("right");
	} else if (def("left")) {
		frame.x = val("left");
	} else if (def("right")) {
		frame.x = parentSize.width - frame.width - val("right");
	} else if (def("centerX")) {
		frame.x = ((parentSize.width / 2) - (frame.width / 2)) + val("centerX");
	}

	if (def("top") && def("bottom")) {
		frame.y = val("top");
		frame.height = parentSize.height - val("top") - val("bottom");
	} else if (def("top")) {
		frame.y = val("top");
	} else if (def("bottom")) {
		frame.y = parentSize.height - frame.height - val("bottom");
	} else if (def("centerY")) {
		frame.y = ((parentSize.height / 2) - (frame.height / 2)) + val("centerY");
	}

	return frame;
};


class LayerAnchor extends EventEmitter {

	constructor(layer, rules) {
		this._setupListener = this._setupListener.bind(this);
		this._addListener = this._addListener.bind(this);
		this._setNeedsUpdate = this._setNeedsUpdate.bind(this);
		this.layer = layer;
		this.updateRules(rules);
	}

		// TODO: We need to remove ourselves when something
		// changes the frame from the outside like an animation
		// @layer.on "change:frame", =>
		// 	print "change:frame"

	updateRules(rules) {
		this.rules = this._parseRules(rules);
		this.layer.on("change:parent", this._setupListener);
		this._setNeedsUpdate();
		// @_needsUpdate = false
		this._removeListeners();
		return this._setupListener();
	}

	_setupListener() {

		this._removeListeners();

		if (this.layer.parent) {
			return this._addListener(this.layer.parent, "change:frame", this._setNeedsUpdate);
		} else {
			return this._addListener(Canvas, "resize", this._setNeedsUpdate);
		}
	}

	_addListener(obj, eventName, listener) {
		obj.on(eventName, listener);
		if (this._currentListeners[obj] == null) { this._currentListeners[obj] = []; }
		return this._currentListeners[obj].push(eventName);
	}

	_removeListeners() {
		for (let obj in this._currentListeners) {
			let eventName = this._currentListeners[obj];
			obj.off(eventName, this._setNeedsUpdate);
		}
		return this._currentListeners = {};
	}

	_setNeedsUpdate() {
		return this.layer.frame = calculateFrame(this.layer, this.rules);
	}

	_parseRules() {
		return Utils.parseRect(Utils.arrayFromArguments(arguments));
	}
}


export { LayerAnchor };
