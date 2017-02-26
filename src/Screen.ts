import * as Types from "Types"

import {BaseClass} from "BaseClass"

type ScreenEventTypes =
	"change:width" |
	"change:height" |
	"change:size" |
	"change:frame"

class Screen extends BaseClass<ScreenEventTypes> {

	constructor() {
		super()
		window.addEventListener("resize", this._onResize)
	}

	get width() {
		return window.innerWidth
	}

	get height() {
		return window.innerHeight
	}

	get size(): Types.Size {
		return {width: this.width, height: this.height}
	}

	get frame(): Types.Frame {
		return {x: 0, y: 0, width: this.width, height: this.height}
	}

	private _onResize = (event) => {
		this.emit("change:width")
		this.emit("change:height")
		this.emit("change:size")
		this.emit("change:frame")
	}
}