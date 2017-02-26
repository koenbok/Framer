import { _ } from "./Underscore";

import Utils from "./Utils";

import { Config } from "./Config";
import { Defaults } from "./Defaults";
import { BaseClass } from "./BaseClass";
import { Events } from "./Events";

import { SpringSimulator } from "./Simulators/SpringSimulator";
import { FrictionSimulator } from "./Simulators/FrictionSimulator";
import { MomentumBounceSimulator } from "./Simulators/MomentumBounceSimulator";

Events.SimulationStart = "simulationStart";
Events.SimulationStep = "simulationStep";
Events.SimulationStop = "simulationStop";

let SimulatorClasses = {
	"spring": SpringSimulator,
	"friction": FrictionSimulator,
	"inertial-scroll": MomentumBounceSimulator
};

export let Simulation = class Simulation extends BaseClass {
	static initClass() {
	
		//#############################################################
		// Passthrough to simulator
	
		this.define("simulator",
			{get() { return this._simulator; }});
	}

	constructor(options) {

		// options = Defaults.getDefaults "Simulation", options

		this.start = this.start.bind(this);
		this._start = this._start.bind(this);
		this._update = this._update.bind(this);
		if (options == null) { options = {}; }
		super(options);

		this.options = _.defaults(options, {
			layer: null,
			properties: {},
			model: "spring",
			modelOptions: {},
			delay: 0,
			debug: false
		}
		);
		this.layer = this.options.layer;
		this.properties = this.options.properties;
		this._running = false;

		let SimulatorClass = SimulatorClasses[this.options.model] || SpringSimulator;

		this._simulator = new SimulatorClass(this.options.modelOptions);
	}

	// Though properties aren't modified directly by the simulation, it's still
	// necessary to return them so that conflicting animations/simulations can
	// detect one another and not run at the same time.
	animatingProperties() {
		return _.keys(this.properties);
	}

	start() {

		if (this.layer === null) {
			console.error("Simulation: missing layer");
		}

		if (this.options.debug) {
			console.log(`Simulation.start ${this._simulator.constructor.name}`, this.options.modelOptions);
		}

		let animatingProperties = this.animatingProperties();
		let object = this.layer.animatingProperties();
		for (let property in object) {
			let animation = object[property];
			if (Array.from(animatingProperties).includes(property)) {
				animation.stop();
			}
		}

		if (this.options.delay) {
			Utils.delay(this.options.delay, this._start);
		} else {
			this._start();
		}

		return true;
	}

	stop(emit) {
		if (emit == null) { emit = true; }
		if (!this._running) { return; }

		this._running = false;

		this.layer.context.removeAnimation(this);

		if (emit) { this.emit(Events.SimulationStop); }
		return Framer.Loop.off("update", this._update);
	}

	// copy: -> return new Simulation(_.clone(@options))

	emit(event) {
		super.emit(...arguments);
		// Also emit this to the layer with self as argument
		return this.layer.emit(event, this);
	}

	_start() {
		if (this._running) { return; }

		this._running = true;

		this.layer.context.addAnimation(this);

		this.emit(Events.SimulationStart);
		return Framer.Loop.on("update", this._update);
	}

	_update(delta) {
		let emit;
		if (this._simulator.finished()) {
			this.stop(emit=false);
			this.emit("end");
			return this.emit(Events.SimulationStop);
		} else {
			let result = this._simulator.next(delta);
			return this.emit(Events.SimulationStep, result, delta);
		}
	}

	finished() { return this._simulator.finished(); }
};
undefined.initClass();
