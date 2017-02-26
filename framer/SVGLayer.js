import { _ } from "./Underscore";

import { Layer } from "./Layer";

export let SVGLayer = class SVGLayer extends Layer {

	constructor(options) {

		if (options == null) { options = {}; }
		super(_.defaults(options,
			{backgroundColor: null})
		);

		this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this.svg.setAttribute("width", "100%");
		this.svg.setAttribute("height", "100%");
		this.svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	}

	addShape(type) {
		let shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		this.svg.appendChild(shape);
		return shape;
	}
};
