import { BaseClass } from "./BaseClass";
import { Events } from "./Events";

class Canvas extends BaseClass {
	static initClass() {
	
		this.define("width",  {get() { return window.innerWidth; }});
		this.define("height", {get() { return window.innerHeight; }});
		this.define("size", {get() { return Utils.size(this); }});
		this.define("frame", {get() { return Utils.frame(this); }});
	
		this.define("backgroundColor", {
			importable: false,
			exportable: false,
			get() { return Framer.Device.background.backgroundColor; },
			set(value) { return Framer.Device.background.backgroundColor = value; }
		}
		);
	
		this.define("image", {
			importable: false,
			exportable: false,
			get() { return Framer.Device.background.image; },
			set(value) { return Framer.Device.background.image = value; }
		}
		);
	}

	constructor(options) {
		this._handleResize = this._handleResize.bind(this);
		if (options == null) { options = {}; }
		super(options);
		Events.wrap(window).addEventListener("resize", this._handleResize);
	}

	onResize(cb) { return this.on("resize", cb); }

	_handleResize(event) {
		this.emit("resize");
		this.emit("change:width");
		this.emit("change:height");
		this.emit("change:size");
		return this.emit("change:frame");
	}

	toInspect() {
		return `<${this.constructor.name} ${this.width}x${this.height}>`;
	}

	// Point Conversion

	convertPointToLayer(point, layer) {
		return Utils.convertPointFromContext(point, layer, true, true);
	}

	convertPointToScreen(point) {
		let ctx = Framer.Device.context;
		return Utils.convertPointFromContext(point, ctx, true, true);
	}
}
Canvas.initClass();

export { Canvas };
