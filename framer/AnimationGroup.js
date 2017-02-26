import { _ } from "./Underscore";

import { BaseClass } from "./BaseClass";

class AnimationGroup extends BaseClass {

	constructor(...args) {
		super(...arguments);
		this._animations = _.flatten(args);
		this.stopAnimations = true;
		this.stop();
	}
	
	start() {
		return this._start(this._animations);
	}

	stop() {
		this._stop();
		this._started = [];
		this._halted = [];
		this._stopped = [];
		return this._ended = [];
	}

	_start(animations) {
		
		this.stop();
		this._onStart();
		
		return animations.map(animation => {
			
			this._started.push(animation);

			animation.onAnimationHalt(() => {
				this._halted.push(animation);
				if (this._halted.length > 1) { return; }
				this._stop();
				return this._onHalt();
			}
			);
			
			animation.onAnimationStop(() => {
				this._stopped.push(animation);
				if (this._stopped.length === this._started.length) { return this._onStop(); }
			}
			);
			
			animation.onAnimationEnd(() => {
				this._ended.push(animation);
				if (this._ended.length === this._started.length) { return this._onEnd(); }
			}
			);

			return animation.start();
		}
		);
	}

	_stop() {
		if (!this._started) { return; }
		if (this.stopAnimations !== true) { return; }
		return this._started.map(function(a) { if (a.isAnimating) { return a.stop(); } });
	}
	
	_onStart() { return this.emit(Events.AnimationStart); }
	_onHalt() { return this.emit(Events.AnimationHalt); }
	_onStop() { return this.emit(Events.AnimationStop); }
	_onEnd() { return this.emit(Events.AnimationEnd); }

	onAnimationStart(cb) { return this.on(Events.AnimationStart, cb); }
	onAnimationHalt(cb) { return this.on(Events.AnimationHalt, cb); }
	onAnimationStop(cb) { return this.on(Events.AnimationStop, cb); }
	onAnimationEnd(cb) { return this.on(Events.AnimationEnd, cb); }

	onStart(cb) { return this.onAnimationStart(cb); }
	onHalt(cb) { return this.onAnimationHalt(cb); }
	onStop(cb) { return this.onAnimationStop(cb); }
	onEnd(cb) { return this.onAnimationEnd(cb); }
}


class AnimationStateGroup extends AnimationGroup {
	static initClass() {
	
		this.define("state",
			{get() { return this._state; }});
	
		this.define("states", {
			get() {
				let states = [];
	
				for (let layer of Array.from(this._layers)) {
					for (let state of Array.from(_.keys(layer.states))) {
						if (!Array.from(states).includes(state)) { states.push(state); }
					}
				}
	
				return states;
			}
		}
		);
	}

	constructor(...layers) {
		super(...arguments);
		this._layers = _.flatten(layers);
		this._state = "default";
	}

	animate(state) {
		let animations = [];

		for (let layer of Array.from(this._layers)) {
			if (layer.states[state]) {
				animations.push(layer.animate(state, {start: false}));
			}
		}

		if (!animations) { return; }

		this._start(animations);
		return this._state = state;
	}

	stateCycle(...args) {
		let states = _.flatten(args);
		if (!states.length) { ({ states } = this); }
		return this.animate(Utils.arrayNext(states, this.state));
	}
}
AnimationStateGroup.initClass();

export { AnimationGroup };
export { AnimationStateGroup };
