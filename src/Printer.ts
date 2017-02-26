import {Layer} from "Layer"
import {Context} from "Context"
import {BaseClass} from "BaseClass"


type BaseClassOptions = {
	height?: number
}

export class Printer extends BaseClass<null> {

	private _context = new Context("print")
	private _layer?: Layer
	private _properties = {
		height: 300
	}


	readonly print = () => {

		if (!this._layer) {
			this._context.run(this._setup)
		}


	}

	private _setup = () => {

		const background = new Layer({
			x: 0,
			y: window.innerHeight - this._properties.height,
			width: window.innerWidth,
			height: this._properties.height,
			backgroundColor: "white"
		})

		this._layer = new Layer({
			parent: background,
			frame: background.frame
		})
	}
}