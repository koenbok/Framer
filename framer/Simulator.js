import Utils from "./Utils";

import { _ } from "./Underscore";
import { Config } from "./Config";
import { BaseClass } from "./BaseClass";

export let Simulator = class Simulator extends BaseClass {
	static initClass() {
	
		`\
The simulator class runs a physics simulation based on a set of input values
at setup({input values}), and emits an output state {x, v}\
`;
	
		this.define("state", {
			get() { return _.clone(this._state); },
			set(state) { return this._state = _.clone(state); }
		}
		);
	}


	constructor(options) {
		if (options == null) { options = {}; }
		this._state = {x: 0, v: 0};
		this.options = null;
		this.setup(options);
	}

	setup(options) {
		throw Error("Not implemented");
	}

	next(delta) {
		throw Error("Not implemented");
	}

	finished() {
		throw Error("Not implemented");
	}

	setState(state) {
		return this._state = state;
	}
};
undefined.initClass();
