import { _ } from "./Underscore";

import Utils from "./Utils";

import { Config } from "./Config";
import { Defaults } from "./Defaults";

import { BaseClass } from "./BaseClass";
import { DOMEventManager } from "./DOMEventManager";

/*

An easy way to think of the context is a bucket of things related to a set of layers. There
is always at least one context on the screen, but often many more. For example, the device has
a special context and replaces the default one (so it renders in the screen), and the print
function uses on to draw the console.

The default context lives under Framer.DefaultContext and the current one in
Framer.CurrentContext. You can create layers in any context by using the run function.

A context keeps track of everyting around those layers, so it can clean it up again. We use
this a lot in Framer Studio's autocomplete function. Async things like running animations and
timers get stopped too.

Contexts can live inside another context (with a layer as a parent) so you can only reload
a part of a prototype. This is mainly how device works.

Another feature is to temporarily freeze/resume a context. If you freeze it, all user event
will temporarily get blocked so in theory nothing will change in the context. You can restore
these at any time.

*/

let Contexts = [];

export let Context = class Context extends BaseClass {
	static initClass() {
	
		this.define("parent", {get() { return this._parent; }});
	
		this.define("element", {get() { return this._element; }});
	
		//#############################################################
		// Collections
	
		// Layers
		this.define("layers", {get() { return _.clone(this._layers); }});
		this.define("layerCounter", {get() { return this._layerCounter; }});
		this.define("rootLayers", {get() { return _.filter(this._layers, layer => layer.parent === null); }});
	
		this.define("visible", {
			get() { return this._visible || true; },
			set(value) {
				if (value === this._visible) { return; }
				if (this._element != null) {
					this._element.style.visibility = value ? "visible" : "hidden";
				}
				return this._visible = value;
			}
		}
		);
	
		// Animations
		this.define("animations", {get() { return _.clone(this._animations); }});
	
		// Timers
		this.define("timers", {get() { return _.clone(this._timers); }});
	
	
		// Intervals
		this.define("intervals", {get() { return _.clone(this._intervals); }});
	
	
		//#############################################################
		// Geometry
	
		// Remember the context doesn't really have height. These are just a reference
		// to it's parent or document.
	
		this.define("width", {
			get() {
				if (this.parent != null) { return this.parent.width; }
				return window.innerWidth;
			}
		}
		);
	
		this.define("height", {
			get() {
				if (this.parent != null) { return this.parent.height; }
				return window.innerHeight;
			}
		}
		);
	
		this.define("frame", {get() { return {x: 0, y: 0, width: this.width, height: this.height}; }});
		this.define("size",  {get() { return _.pick(this.frame, ["width", "height"]); }});
		this.define("point", {get() { return _.pick(this.frame, ["x", "y"]); }});
		this.define("canvasFrame", {
			get() {
				if ((this.parent == null)) { return this.frame; }
				return this.parent.canvasFrame;
			}
		}
		);
	
		this.define("backgroundColor", {
			get() {
				if (Color.isColor(this._backgroundColor)) { return this._backgroundColor; }
				return "transparent";
			},
			set(value) {
				if (Color.isColor(value)) {
					this._backgroundColor = value;
					return (this._element != null ? this._element.style["backgroundColor"] = new Color(value.toString()) : undefined);
				}
			}
		}
		);
	
		this.define("perspective", {
			get() {
				return this._perspective;
			},
			set(value) {
				if (_.isNumber(value)) {
					this._perspective = value;
					return (this._element != null ? this._element.style["webkitPerspective"] = this._perspective : undefined);
				}
			}
		}
		);
	
		this.define("perspectiveOriginX", {
			get() {
				if (_.isNumber(this._perspectiveOriginX)) { return this._perspectiveOriginX; }
				return 0.5;
			},
			set(value) {
				if (_.isNumber(value)) {
					this._perspectiveOriginX = value;
					return this._updatePerspective();
				}
			}
		}
		);
	
		this.define("perspectiveOriginY", {
			get() {
				if (_.isNumber(this._perspectiveOriginY)) { return this._perspectiveOriginY; }
				return .5;
			},
			set(value) {
				if (_.isNumber(value)) {
					this._perspectiveOriginY = value;
					return this._updatePerspective();
				}
			}
		}
		);
	
		this.define("index", {
			get() { return (this._element != null ? this._element.style["z-index"] : undefined) || 0 || 0; },
			set(value) {
				if (!this._element) { return; }
				return this._element.style["z-index"] = value;
			}
		}
		);
	}

	static all() { return _.clone(Contexts); }

	constructor(options) {

		if (options == null) { options = {}; }
		options = Defaults.getDefaults("Context", options);

		super(...arguments);

		if (!options.name) {
			throw Error("Contexts need a name");
		}

		this._parent = options.parent;
		this._name = options.name;

		this.perspective = options.perspective;
		this.perspectiveOriginX = options.perspectiveOriginX;
		this.perspectiveOriginY = options.perspectiveOriginY;

		this.reset();

		if (options.hasOwnProperty("index")) {
			this.index = options.index;
		} else {
			this.index = this.id;
		}

		Contexts.push(this);
	}

	reset() {

		this._createDOMEventManager();
		this._createRootElement();

		this.resetFrozenEvents();
		this.resetLayers();
		this.resetAnimations();
		this.resetTimers();
		this.resetIntervals();

		return this.emit("reset", this);
	}

	destroy() {
		this.reset();
		this._destroyRootElement();
		return _.remove(Contexts, this);
	}

	addLayer(layer) {
		if (Array.from(this._layers).includes(layer)) { return; }
		this._layerCounter++;
		return this._layers.push(layer);
	}

	removeLayer(layer) {
		return this._layers = _.without(this._layers, layer);
	}

	resetLayers() {
		this.resetGestures();
		this._layers = [];
		return this._layerCounter = 0;
	}

	layerForId(layerId) {
		for (let layer of Array.from(this._layers)) {
			if (layer.id === layerId) { return layer; }
		}
		return null;
	}

	_layerForElement(element) {
		for (let layer of Array.from(this._layers)) {
			if (layer._element === element) { return layer; }
		}
		return null;
	}

	layerForElement(element) {
		// Returns the framer layer containing the element
		if (!element) { return null; }
		let layer = this._layerForElement(element);
		if (layer) { return layer; }
		return this.layerForElement(element.parentNode);
	}

	addAnimation(animation) {
		if (Array.from(this._animations).includes(animation)) { return; }
		return this._animations.push(animation);
	}

	removeAnimation(animation) {
		return this._animations = _.without(this._animations, animation);
	}

	resetAnimations() {
		this.stopAnimations();
		return this._animations = [];
	}

	stopAnimations() {
		if (!this._animations) { return; }
		return this._animations.map(animation => animation.stop(true));
	}

	resetFrozenEvents() {
		return delete this._frozenEvents;
	}

	addTimer(timer) {
		if (Array.from(this._timers).includes(timer)) { return; }
		return this._timers.push(timer);
	}

	removeTimer(timer) {
		window.clearTimeout(timer);
		return this._timers = _.without(this._timers, timer);
	}

	resetTimers() {
		if (this._timers) { this._timers.map(window.clearTimeout); }
		return this._timers = [];
	}

	addInterval(interval) {
		if (Array.from(this._intervals).includes(interval)) { return; }
		return this._intervals.push(interval);
	}

	removeInterval(interval) {
		return this._intervals = _.without(this._intervals, interval);
	}

	resetIntervals() {
		if (this._intervals) { this._intervals.map(window.clearInterval); }
		return this._intervals = [];
	}

	// Gestures
	resetGestures() {
		if (!this._layers) { return; }
		for (let layer of Array.from(this._layers)) {
			if (layer._gestures) {
				layer._gestures.destroy();
			}
		}

	}

	//#############################################################
	// Run

	run(fn) {
		let previousContext = Framer.CurrentContext;
		Framer.CurrentContext = this;
		fn();
		return Framer.CurrentContext = previousContext;
	}


	//#############################################################
	// Freezing

	freeze() {

		if (this._frozenEvents != null) {
			throw new Error("Context is already frozen");
		}

		this._frozenEvents = {};

		for (let layer of Array.from(this._layers)) {

			let layerListeners = {};

			for (let eventName of Array.from(layer.listenerEvents())) {
				layerListeners[eventName] = layer.listeners(eventName);
			}

			layer.removeAllListeners();
			let layerId = this._layers.indexOf(layer);

			this._frozenEvents[layerId] = layerListeners;
		}

		this.stopAnimations();

		// TODO: It would be nice to continue at least intervals after a resume
		this.resetTimers();
		return this.resetIntervals();
	}

	resume() {

		if ((this._frozenEvents == null)) {
			throw new Error("Context is not frozen, cannot resume");
		}

		for (let layerId in this._frozenEvents) {
			let events = this._frozenEvents[layerId];
			let layer = this._layers[layerId];
			for (let eventName in events) {
				let listeners = events[eventName];
				for (let listener of Array.from(listeners)) {
					layer.on(eventName, listener);
				}
			}
		}

		return this.resetFrozenEvents();
	}


	//#############################################################
	// DOM

	_createDOMEventManager() {

		// This manages all dom events for any node in this context centrally,
		// so we can clean them up on a reset, avoiding memory leaks and whatnot.

		if (this.domEventManager != null) {
			this.domEventManager.reset();
		}
		return this.domEventManager = new DOMEventManager;
	}

	_createRootElement() {

		// Everything under the context lives in a single div that we either insert
		// directly on the root, or attach to the parent layer. The element append
		// can be pending if the document isn't ready yet.

		this._destroyRootElement();

		this._element = document.createElement("div");
		this._element.id = `FramerContextRoot-${this._name}`;
		this._element.classList.add("framerContext");
		this._element.style["webkitPerspective"] = this.perspective;
		this._element.style["backgroundColor"] = this.backgroundColor;

		this.__pendingElementAppend = () => {
			let parentElement = this._parent != null ? this._parent._element : undefined;
			if (parentElement == null) { parentElement = document.body; }
			return parentElement.appendChild(this._element);
		};

		return Utils.domComplete(this.__pendingElementAppend);
	}

	_destroyRootElement() {

		// This removes the context element and cancels async insertion if the
		// document wasn't ready yet.

		if (this._element != null ? this._element.parentNode : undefined) {
			this._element.parentNode.removeChild(this._element);
		}

		if (this.__pendingElementAppend) {
			Utils.domCompleteCancel(this.__pendingElementAppend);
			this.__pendingElementAppend = null;
		}

		return this._element = null;
	}

	_updatePerspective() {
		return (this._element != null ? this._element.style["webkitPerspectiveOrigin"] = `${this.perspectiveOriginX * 100}% ${this.perspectiveOriginY * 100}%` : undefined);
	}

	ancestors(...args) {
		return (this._parent != null ? this._parent.ancestors(...args) : undefined) || [];
	}

	toInspect() {

		let round = function(value) {
			if (parseInt(value) === value) {
				return parseInt(value);
			}
			return Utils.round(value, 1);
		};

		return `<${this.constructor.name} id:${this.id} name:${this._name} ${round(this.width)}x${round(this.height)}>`;
	}
};
undefined.initClass();
