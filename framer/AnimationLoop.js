import { _ } from "./Underscore";
import Utils from "./Utils";
import { Config } from "./Config";
import { EventEmitter } from "./EventEmitter";

// if window.performance
// 	getTime = -> window.performance.now()
// else
// 	getTime = -> Date.now()

let getTime = () => Utils.getTime() * 1000;


// Make the time ticks a "fixed" 1/60 of a second.
// Framer.Loop.delta = 1/60

// Include workaround for a WebKit2 browser bug
// Framer.Loop.raf = false

export let AnimationLoop = class AnimationLoop extends EventEmitter {

	constructor() {

		// For now we set the delta to a fixed time because using performance.now plus
		// raf seems to cause weird issues.
		this.start = this.start.bind(this);
		this.delta = 1/60;
		this.raf = true;

		// Workaraound for RAF bug on 10.10
		// https://bugs.webkit.org/show_bug.cgi?id=137599

		if ((Utils.webkitVersion() > 600) && (Utils.webkitVersion() < 601)) {
			if (Utils.isFramerStudio() || Utils.isDesktop()) {
				this.raf = false;
			}
		}

		// To avoid event emitter warning
		this.maximumListeners = Infinity;
	}

	start() {

		let animationLoop = this;
		let _timestamp = getTime();

		let update = function() {

			let delta;
			if (animationLoop.delta) {
				({ delta } = animationLoop);
			} else {
				let timestamp = getTime();
				delta = (timestamp - _timestamp) / 1000;
				_timestamp = timestamp;
			}

			animationLoop.emit("update", delta);
			return animationLoop.emit("render", delta);
		};

		var tick = function(timestamp) {

			if (animationLoop.raf) {
				window.requestAnimationFrame(tick);
				return update();
			} else {
				return window.setTimeout(function() {
					window.requestAnimationFrame(tick);
					return update();
				}
				, 0);
			}
		};

		return tick();
	}
};
