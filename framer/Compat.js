import { Layer } from "./Layer";

let compatWarning = msg => console.warn(msg);

let compatProperty = (name, originalName) =>
	({
		enumerable: false,
		get() {
			compatWarning(`${originalName} is a deprecated property`);
			return this[name];
		},
		set(value) {
			compatWarning(`${originalName} is a deprecated property`);
			return this[name] = value;
		}
	})
;

let addSubView = undefined;
let removeSubView = undefined;
class CompatLayer extends Layer {
	static initClass() {
	
		this.define("superView", compatProperty("parent", "superView"));
		this.define("subViews", compatProperty("children", "subViews"));
		this.define("siblingViews", compatProperty("siblingLayers", "siblingViews"));
	
		addSubView = function(layer) { return this.addChild(layer); };
		removeSubView = function(layer) { return this.removeChild(layer); };
	}

	constructor(options) {

		if (options == null) { options = {}; }
		if (options.hasOwnProperty("superView")) {
			options.parent = options.superView;
		}

		super(options);
	}
}
CompatLayer.initClass();

class CompatView extends CompatLayer {

	constructor(options) {
		if (options == null) { options = {}; }
		compatWarning("Views are now called Layers");
		super(options);
	}
}

class CompatImageView extends CompatView {}

class CompatScrollView extends CompatView {
	constructor() {
		super(...arguments);
		this.scroll = true;
	}
}

window.Layer = CompatLayer;
window.Framer.Layer = CompatLayer;

window.View = CompatView;
window.ImageView = CompatImageView;
window.ScrollView = CompatScrollView;

// Utils were utils in Framer 2
window.utils = window.Utils;
