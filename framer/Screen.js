import { BaseClass } from "./BaseClass";

class ScreenClass extends BaseClass {
	static initClass() {
	
		this.define("width", {  get() {
			if (this.device) { return this.device.screenSize.width; }
			return Canvas.width;
		}
	}
		);
		this.define("height", { get() {
			if (this.device) { return this.device.screenSize.height; }
			return Canvas.height;
		}
	}
		);
		this.define("canvasFrame", { get() {
			if (this.device) { return this.device.context.canvasFrame; }
			return this.frame;
		}
	}
		);
		this.define("midX", {get() { return Utils.frameGetMidX(this.frame); }});
		this.define("midY", {get() { return Utils.frameGetMidY(this.frame); }});
		this.define("size", {get() { return Utils.size(this); }});
		this.define("frame", {get() { return Utils.frame(this); }});
		this.define("device", {get() { return Framer.CurrentContext.device; }});
	
		this.define("backgroundColor", this.proxyProperty("device.screen.backgroundColor"));
		this.define("perspective", this.proxyProperty("device.context.perspective"));
		this.define("perspectiveOriginX", this.proxyProperty("device.context.perspectiveOriginX"));
		this.define("perspectiveOriginY", this.proxyProperty("device.context.perspectiveOriginY"));
	}

	toInspect() {
		return `<Screen ${Utils.roundWhole(this.width)}x${Utils.roundWhole(this.height)}>`;
	}

	// Point Conversion

	convertPointToLayer(point, layer) {
		return Utils.convertPointFromContext(point, layer, false, true);
	}

	convertPointToCanvas(point) {
		let ctx = Framer.Device.context;
		return Utils.convertPointToContext(point, ctx, true, false);
	}

	// Edge Swipe

	onEdgeSwipe(cb) { return this.on(Events.EdgeSwipe, cb); }
	onEdgeSwipeStart(cb) { return this.on(Events.EdgeSwipeStart, cb); }
	onEdgeSwipeEnd(cb) { return this.on(Events.EdgeSwipeEnd, cb); }

	onEdgeSwipeTop(cb) { return this.on(Events.EdgeSwipeTop, cb); }
	onEdgeSwipeTopStart(cb) { return this.on(Events.EdgeSwipeTopStart, cb); }
	onEdgeSwipeTopEnd(cb) { return this.on(Events.EdgeSwipeTopEnd, cb); }

	onEdgeSwipeRight(cb) { return this.on(Events.EdgeSwipeRight, cb); }
	onEdgeSwipeRightStart(cb) { return this.on(Events.EdgeSwipeRightStart, cb); }
	onEdgeSwipeRightEnd(cb) { return this.on(Events.EdgeSwipeRightEnd, cb); }

	onEdgeSwipeBottom(cb) { return this.on(Events.EdgeSwipeBottom, cb); }
	onEdgeSwipeBottomStart(cb) { return this.on(Events.EdgeSwipeBottomStart, cb); }
	onEdgeSwipeBottomEnd(cb) { return this.on(Events.EdgeSwipeBottomEnd, cb); }

	onEdgeSwipeLeft(cb) { return this.on(Events.EdgeSwipeLeft, cb); }
	onEdgeSwipeLeftStart(cb) { return this.on(Events.EdgeSwipeLeftStart, cb); }
	onEdgeSwipeLeftEnd(cb) { return this.on(Events.EdgeSwipeLeftEnd, cb); }
}
ScreenClass.initClass();

// We use this as a singleton
export let Screen = new ScreenClass;
