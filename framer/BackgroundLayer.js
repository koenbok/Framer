import { Layer } from "./Layer";

`\
Todo: make it work in a parent layer\
`;

export let BackgroundLayer = class BackgroundLayer extends Layer {

	constructor(options) {
		this.layout = this.layout.bind(this);
		if (options == null) { options = {}; }
		if (options.backgroundColor == null) { options.backgroundColor = "#fff"; }
		console.warn(`BackgroundLayer is deprecated, please use\n\nScreen.backgroundColor = \"${options.backgroundColor}\"\n\ninstead.`);

		super(options);

		this.sendToBack();
		this.layout();
		this._context.domEventManager.wrap(window).addEventListener("resize", this.layout);
		if (Framer.Device != null) {
			Framer.Device.on("change:orientation", this.layout);
		}
	}

	layout() {
		if (this.parent) {
			return this.frame = this.parent.frame;
		} else {
			return this.frame = this._context.frame;
		}
	}
};
