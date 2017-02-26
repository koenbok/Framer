import { _ } from "./Underscore";

import Utils from "./Utils";
import { BaseClass } from "./BaseClass";
import { Events } from "./Events";

Events.EventBufferReset   = "eventbufferreset";
Events.EventBufferUpdated = "eventbufferupdated";

// TODO: Replace Date.now() with Utils.getTime()

export let EventBuffer = class EventBuffer extends BaseClass {
	static initClass() {
	
		this.define("length",
			{get() { return this._events.length; }});
	
		this.define("first",
			{get() { return this._events[0]; }});
	
		this.define("offset", {
			get() {
				let offset;
				if (events.length < 2) { return {x: 0, y: 0}; }
				let current = events[events.length - 1];
				let first   = events[0];
				return offset = {
					x: current.x - first.x,
					y: current.y - first.y
				};
			}
		}
		);
	
		this.define("events", {
			get() {
				let timeout = Date.now() - this.options.velocityTimeout;
				return _.filter(this._events, event => event.t > timeout);
			}
		}
		);
	
		this.define("angle", {
			get() {
				let { events } = this;
				if (events.length < 2) { return 0; }
				let p1 = events[0];
				let p2 = events[1];
				return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
			}
		}
		);
	
		this.define("velocity", {
			get() {
				let { events } = this;
	
				if (events.length < 2) { return {x: 0, y: 0}; }
	
				let current = events[events.length - 1];
				let first   = events[0];
				let time    = current.t - first.t;
	
				let velocity = {
					x: (current.x - first.x) / time,
					y: (current.y - first.y) / time
				};
	
				if (velocity.x === Infinity) { velocity.x = 0; }
				if (velocity.y === Infinity) { velocity.y = 0; }
	
				return velocity;
			}
		}
		);
	}

	constructor(options) {
		if (options == null) { options = {}; }
		this.options = _.defaults(options,
			{velocityTimeout: 100});
		this._events = [];
	}

	push(event) {
		this._events.push(event);
		return this.emit(Events.EventBufferUpdated, event);
	}

	reset() {
		this._events.length = 0;
		return this.emit(Events.EventBufferReset);
	}
};
undefined.initClass();
