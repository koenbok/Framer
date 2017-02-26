import { BaseClass } from "./BaseClass";

export let LayerStateMachine = class LayerStateMachine extends BaseClass {
	static initClass() {
	
		this.define("layer",
			{get() { return this._layer; }});
	
		this.define("current",
			{get() { return this.currentName; }});
	
		this.define("previous",
			{get() { return this.previousName; }});
	
	
		this.define("currentName",
			{get() { return this._currentName; }});
	
		this.define("previousName",
			{get() { return _.last(this._previousNames) || "default"; }});
	
		this.define("stateNames",
			{get() { return Object.keys(this.states); }});
	
		this.define("states",
			{get() { return this._states; }});
	}

	constructor(_layer, _states) {
		this._layer = _layer;
		this._states = _states;
		super(...arguments);

		this.reset();
	}

	switchInstant(stateName) {
		return this.switchTo(stateName, {instant: true});
	}

	switchTo(stateName, options) {
		// Check if the state exists, if not this is a pretty serious error
		if (options == null) { options = {}; }
		if (!this.states[stateName]) { throw Error(`No such state: '${stateName}'`); }

		if (stateName === "previous") {
			stateName = this.previousName;
		}

		// Prep the properties and the options. The options come from the state, and can be overriden
		// with the function arguments here.
		let properties = _.clone(this.states[stateName]);
		options = _.clone(options);
		if (properties.animationOptions) { options = _.defaults({}, options, properties.animationOptions); }
		delete properties.animationOptions;

		let stateNameA = this.currentName;
		let stateNameB = stateName;

		// Note: even if the state is the current state we still want to switch because some properties
		// might be different as they could be set by hand on the layer object.

		// Grab the animation and make state switching have the same events (start, stop, end)
		let startAnimation = options.start != null ? options.start : true;
		options.start = false;
		let animation = this.layer.animate(properties, options);

		// In the case of instant: true, onStart and onStop are called from within animation.start()
		// This function is called once after animation.start() or in onStart, whichEver comes first.
		// We could fix this by adding another event that fires before a delayed animation is started
		let stateSwitched = false;
		let switchState = () => {
			if (stateSwitched) { return; }
			stateSwitched = true;
			this._previousNames.push(stateNameA);
			return this._currentName = stateNameB;
		};

		let onStart = () => {
			this.emit(Events.StateSwitchStart, stateNameA, stateNameB, this);
			return switchState();
		};

		let onStop = () => {
			return this.emit(Events.StateSwitchStop, stateNameA, stateNameB, this);
		};

		let onEnd = () => {
			let instantProperties = _.difference(
				_.keys(properties),
				_.keys(animation.properties));

			for (let k of Array.from(instantProperties)) {
				this.layer[k] = properties[k];
			}
			return this.emit(Events.StateSwitchEnd, stateNameA, stateNameB, this);
		};

		animation.on(Events.AnimationStart, onStart);
		animation.on(Events.AnimationStop, onStop);
		animation.on(Events.AnimationEnd, onEnd);

		if (startAnimation) {
			let started = animation.start();
			if (!started) {
				// When the animation didn't even start, the animation events will not be emitted,
				// so call the handlers manually
				onStart();
				onStop();
				onEnd();
			}
		}

		switchState();

		return animation;
	}

	next(states) {
		if (!states.length) {
			states = this.stateNames;
		}
		return Utils.arrayNext(states, this.currentName);
	}

	emit(...args) {
		super.emit(...arguments);
		// Also emit this to the layer with self as argument
		return this._layer.emit(...args);
	}

	reset() {

		for (let k of Array.from(_.keys(this.states))) {
			if (k !== "default") { delete this.states[k]; }
		}

		this._previousNames = [];
		return this._currentName = "default";
	}

	// _namedState: (name) ->
	// 	return _.extend(_.clone(@states[name]), {name: name})

	toInspect(constructor) {
		return `<${this.constructor.name} id:${this.id} layer:${this.layer.id} current:'${this.currentName}'>`;
	}
};
undefined.initClass();
