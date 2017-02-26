import { Layer } from "./Layer";

export let VideoLayer = class VideoLayer extends Layer {
	static initClass() {
	
		this.define("video", {
			get() { return this.player.src; },
			set(video) { return this.player.src = video; }
		}
		);
	}

	constructor(options) {

		// We need the player to exist before we add the options
		if (options == null) { options = {}; }
		this.player = document.createElement("video");
		this.player.setAttribute("webkit-playsinline", "true");
		this.player.setAttribute("playsinline", "");
		this.player.style.width = "100%";
		this.player.style.height = "100%";

		super(options);

		// Make it work with .on and .off
		// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
		this.player.on = this._context.domEventManager.wrap(this.player).addEventListener;
		this.player.off = this._context.domEventManager.wrap(this.player).removeEventListener;

		this.video = options.video;

		this._element.appendChild(this.player);
	}
};
undefined.initClass();

	// TODO: Maybe add event handler shortcuts here too
