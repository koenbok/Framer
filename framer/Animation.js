import { _ } from "./Underscore";

import Utils from "./Utils";

import { Config } from "./Config";
import { Defaults } from "./Defaults";
import { BaseClass } from "./BaseClass";
import { Animator } from "./Animators/Animator";
import { LinearAnimator } from "./Animators/LinearAnimator";
import Curves from "./Animators/Curves";

let numberRE = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/;
let relativePropertyRE = new RegExp(`^(?:([+-])=|)(${numberRE.source})([a-z%]*)$`, "i");

let isRelativeProperty = v => _.isString(v) && relativePropertyRE.test(v);

let evaluateRelativeProperty = function(target, k, v) {
	let [match, sign, number, unit, ...rest] = Array.from(relativePropertyRE.exec(v));
	if (sign) { return target[k] + ((sign + 1) * number); }
	return +number;
};

export let Animation = class Animation extends BaseClass {
	static initClass() {
	
		this.define("layer",
			{get() { return this._layer; }});
	
		this.define("isPending", {get() { return (this._delayTimer != null); }});
	
		this.define("isAnimating",
			{get() { return Array.from(this.layer.animations()).includes(this); }});
	
		this.define("looping", {
			get() { return this.options.looping; },
			set(value) {
				if (this.options != null) {
					this.options.looping = value;
				}
				if ((this.options != null ? this.options.looping : undefined) && (this.layer != null) && !this.isAnimating) {
					return this.restart();
				}
			}
		}
		);
	
		this.define("isNoop", this.simpleProperty("isNoop", false));
	}

	constructor(...args) {

		// Old API detection

		// animationA = new Animation
		// 	layer: layerA
		// 	properties:
		// 		x: 100

		this.start = this.start.bind(this);
		this._instant = this._instant.bind(this);
		this._noop = this._noop.bind(this);
		this._start = this._start.bind(this);
		this.finish = this.finish.bind(this);
		this._update = this._update.bind(this);
		this._prepareUpdateValues = this._prepareUpdateValues.bind(this);
		this._updateValues = this._updateValues.bind(this);
		this._updateNumberValue = this._updateNumberValue.bind(this);
		this._updateColorValue = this._updateColorValue.bind(this);
		let layer = null;
		let properties = {};
		let options = {};

		// Actual current api
		if (arguments.length === 3) {
			layer = args[0];
			properties = args[1];

			options = {};

			if (properties.options != null) {
				options = _.clone(properties.options);
			}

			if (args[2]) {
				options = _.extend({}, options, args[2]);
			}
		}

		// Mix of current and old api
		if (arguments.length === 2) {
			layer = args[0];
			if (args[1].properties != null) {
				({ properties } = args[1]);
			} else {
				properties = args[1];
			}
			if (args[1].options != null) { ({ options } = args[1]); }
		}

		// Old api
		if (arguments.length === 1) {
			({ layer } = args[0]);
			({ properties } = args[0]);
			if (args[0].options != null) {
				({ options } = args[0]);
			} else {
				options = args[0];
			}
		}

		delete options.layer;
		delete options.properties;
		delete options.options;

		this.options = _.cloneDeep(Defaults.getDefaults("Animation", options));

		super(...arguments);

		this._layer = layer;

		if (!(layer instanceof _Layer)) {
			throw Error("Animation: missing layer");
		}

		this.properties = Animation.filterAnimatableProperties(properties);

		if (properties.origin) {
			console.warn("Animation.origin: please use layer.originX and layer.originY");
		}

		if (_.isString(this.options.curve)) {
			this.options.curve = Curves.fromString(this.options.curve);
		}
		if ((this.options.curve === Curves.Spring) || (this.options.curve === Curves.Bezier)) {
			this.options.curve = this.options.curve.call();
		}
		this._originalState = this._currentState();
		this._repeatCounter = this.options.repeat;
	}

	start() {
		let start, v;
		this._animator = this.options.curve(this.options);
		this._target = this.layer;
		this._stateA = this._currentState();
		this._stateB = {};

		for (var k in this.properties) {

			// Evaluate function properties
			v = this.properties[k];
			if (_.isFunction(v)) {
				v = v(this.layer, k);

			// Evaluate relative properties
			} else if (isRelativeProperty(v)) {
				v = evaluateRelativeProperty(this._target, k, v);
			}

			// Filter out the properties that are equal
			if (this._stateA[k] !== v) { this._stateB[k] = v; }
		}

		if (_.keys(this._stateA).length === 0) {
			console.warn("Animation: nothing to animate, no animatable properties");
			return this._noop();
		}

		if (_.isEqual(this._stateA, this._stateB)) {
			console.warn("Animation: nothing to animate, all properties are equal to what it is now");
			return this._noop();
		}

		if (_.keys(this._stateB).length === 0) {
			return this._noop();
		}

		// If this animation wants to animate a property that is already being animated, it stops
		// that currently running animation. If not, it allows them both to continue.
		let object = this._target.animatingProperties();
		for (let property in object) {

			let animation = object[property];
			if (this._stateA.hasOwnProperty(property)) {
				animation.stop();
			}

			// We also need to account for derivatives from x, y
			if ((property === "x") && (
				this._stateA.hasOwnProperty("minX") ||
				this._stateA.hasOwnProperty("midX") ||
				this._stateA.hasOwnProperty("maxX"))) {
					animation.stop();
				}

			if ((property === "y") && (
				this._stateA.hasOwnProperty("minY") ||
				this._stateA.hasOwnProperty("midY") ||
				this._stateA.hasOwnProperty("maxY"))) {
					animation.stop();
				}
		}

		if (this.options.debug) {
			console.log("Animation.start");
			for (k in this._stateB) { v = this._stateB[k]; console.log(`\t${k}: ${this._stateA[k]} -> ${this._stateB[k]}`); }
		}

		// Add the callbacks
		if (_.isFunction(this.options.onStart)) { this.on(Events.AnimationStart, this.options.onStart); }
		if (_.isFunction(this.options.onHalt)) { this.on(Events.AnimationHalt, this.options.onHalt); }
		if (_.isFunction(this.options.onStop)) { this.on(Events.AnimationStop, this.options.onStop); }
		if (_.isFunction(this.options.onEnd)) { this.on(Events.AnimationEnd, this.options.onEnd); }

		// See if we need to repeat this animation
		// Todo: more repeat behaviours:
		// 1) add (from end position) 2) reverse (loop between a and b)
		this.once("end", () => {
			if ((this._repeatCounter > 0) || this.looping) {
				this.restart();
				if (!this.looping) {
					return this._repeatCounter--;
				}
			}
		}
		);

		// Figure out what kind of values we have so we don't have to do it in
		// the actual update loop. This saves a lot of frame budget.
		this._prepareUpdateValues();

		// The option keywords animate and instant trigger an instant animation
		if ((this.options.animate === false) || (this.options.instant === true)) {
			// If animate is false we set everything immediately and skip the actual animation
			start = this._instant;
		} else {
			start = this._start;
		}

		this.layer.context.addAnimation(this);
		// If we have a delay, we wait a bit for it to start
		if (this.options.delay) {
			this._delayTimer = Utils.delay(this.options.delay, start);
		} else {
			start();
		}

		return true;
	}

	stop(emit) {
		if (emit == null) { emit = true; }
		if (this._delayTimer != null) {
			Framer.CurrentContext.removeTimer(this._delayTimer);
			this._delayTimer = null;
		}

		this.layer.context.removeAnimation(this);
		if (emit) { this.emit(Events.AnimationHalt); }
		if (emit) { this.emit(Events.AnimationStop); }
		return Framer.Loop.off("update", this._update);
	}

	reverse() {
		// TODO: Add some tests
		let properties = _.clone(this._originalState);
		let options = _.clone(this.options);
		return new Animation(this.layer, properties, options);
	}

	reset() {
		return (() => {
			let result = [];
			for (let k in this._stateA) {
				let v = this._stateA[k];
				result.push(this._target[k] = v);
			}
			return result;
		})();
	}

	restart() {
		this.reset();
		return this.start();
	}

	copy() {
		let properties = _.clone(this.properties);
		let options = _.clone(this.options);
		return new Animation(this.layer, properties, options);
	}

	// A bunch of common aliases to minimize frustration
	revert() { 	return this.reverse(); }
	inverse() { return this.reverse(); }
	invert() { 	return this.reverse(); }

	emit(event) {
		super.emit(...arguments);
		// Also emit this to the layer with self as argument
		return this.layer.emit(event, this);
	}

	animatingProperties() {
		return _.keys(this._stateA);
	}

	_instant() {
		this.emit(Events.AnimationStart);
		this._updateValues(1);
		this.emit(Events.AnimationStop);
		return this.emit(Events.AnimationEnd);
	}

	_noop() {
		this.isNoop = true;
		// We don't emit these so you can call layer.animate safely
		// from the same layers layer.onAnimationEnd handler
		// @emit(Events.AnimationStart)
		// @emit(Events.AnimationStop)
		// @emit(Events.AnimationEnd)
		return !this.isNoop;
	}

	_start() {
		this._delayTimer = null;
		this.emit(Events.AnimationStart);
		return Framer.Loop.on("update", this._update);
	}

	finish() {
		this.stop();
		return this._updateValues(1);
	}

	_update(delta) {
		if (this._animator.finished()) {
			let emit;
			this._updateValues(1);
			this.stop(emit=false);
			this.emit(Events.AnimationStop);
			return this.emit(Events.AnimationEnd);
		} else {
			return this._updateValues(this._animator.next(delta));
		}
	}

	_prepareUpdateValues() {
		this._valueUpdaters = {};

		return (() => {
			let result = [];
			for (let k in this._stateB) {
				let v = this._stateB[k];
				if (Color.isColorObject(v) || Color.isColorObject(this._stateA[k])) {
					result.push(this._valueUpdaters[k] = this._updateColorValue);
				} else {
					result.push(this._valueUpdaters[k] = this._updateNumberValue);
				}
			}
			return result;
		})();
	}

	_updateValues(value) {
		for (let k in this._stateB) { let v = this._stateB[k]; this._valueUpdaters[k](k, value); }
		return null;
	}

	_updateNumberValue(key, value) {
		return this._target[key] = Utils.mapRange(value, 0, 1, this._stateA[key], this._stateB[key]);
	}

	_updateColorValue(key, value) {
		return this._target[key] = Color.mix(this._stateA[key], this._stateB[key], value, false, this.options.colorModel);
	}

	_currentState() {
		return _.pick(this.layer, _.keys(this.properties));
	}

	static isAnimatable(v) {
		return _.isNumber(v) || _.isFunction(v) || isRelativeProperty(v) || Color.isColorObject(v);
	}

	static filterAnimatableProperties(properties) {
		// Function to filter only animatable properties out of a given set
		let animatableProperties = {};

		// Only animate numeric properties for now
		for (let k in properties) {
			let v = properties[k];
			if (["frame", "size", "point"].includes(k)) { // Derived properties
				var derivedKeys;
				switch (k) {
					case "frame": derivedKeys = ["x", "y", "width", "height"]; break;
					case "size": derivedKeys = ["width", "height"]; break;
					case "point": derivedKeys = ["x", "y"]; break;
					default: derivedKeys = [];
				}
				if (_.isObject(v)) {
					_.defaults(animatableProperties, _.pick(v, derivedKeys));
				} else if (_.isNumber(v)) {
					for (let derivedKey of Array.from(derivedKeys)) {
						animatableProperties[derivedKey] = v;
					}
				}
			} else if (this.isAnimatable(v)) {
				animatableProperties[k] = v;
			} else if (Color.isValidColorProperty(k, v)) {
				animatableProperties[k] = new Color(v);
			}
		}

		return animatableProperties;
	}

	toInspect() {
		return `<${this.constructor.name} id:${this.id} layer:${(this.layer != null ? this.layer.toName() : undefined)} [${_.keys(this.properties).join(", ")}] isAnimating:${this.isAnimating}>`;
	}


	//#############################################################
	//# EVENT HELPERS

	onAnimationStart(cb) { return this.on(Events.AnimationStart, cb); }
	onAnimationHalt(cb) { return this.on(Events.AnimationHalt, cb); }
	onAnimationStop(cb) { return this.on(Events.AnimationStop, cb); }
	onAnimationEnd(cb) { return this.on(Events.AnimationEnd, cb); }
	onAnimationDidStart(cb) { return this.on(Events.AnimationDidStart, cb); }
	onAnimationDidStop(cb) { return this.on(Events.AnimationDidStop, cb); }
	onAnimationDidEnd(cb) { return this.on(Events.AnimationDidEnd, cb); }
};
undefined.initClass();
