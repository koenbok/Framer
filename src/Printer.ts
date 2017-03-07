import * as utils from "Utils"

import {Layer} from "Layer"
import {Context} from "Context"
import {BaseClass} from "BaseClass"


type BaseClassOptions = {
	height?: number
	prefix?: string
}

export class Printer extends BaseClass<null> {

	private _context = new Context("print")
	private _layer?: Layer
	private _lines: string[] = []
	private _keys = {
		height: 300,
		prefix: "» "
	}

	print(...args: any[]) {

		if (!this._layer) {
			this._context.run(this._setup)
		}

		this._context.run(() => {
			const line = new Layer({
				parent: this._layer,
				text: this._keys.prefix + utils.inspect.inspectAll(...args),
				styles: {
					position: "relative",
					display: "block-inline",
					font: "12px/1.35em Menlo",
					margin: "4px 8px",
					width: "auto",
					height: "auto"
				}
			})
		})



	}

	private _setup() {

		const background = new Layer({
			x: 0,
			y: window.innerHeight - this._keys.height,
			width: window.innerWidth,
			height: this._keys.height,
			backgroundColor: "white",
			styles: {
				"font": "12px/1.35em Menlo, Consolas, monospace",
				"color": "rgba(0, 0, 0, .7)",
				"border-top": "1px solid #d9d9d9",
				overflow: "scroll",
			}
		})

		this._layer = new Layer({
			parent: background,
			width: window.innerWidth,
			height: this._keys.height,
			styles: {
				overflow: "scroll",
				height: "auto"
			}
		})

	}
}

const printer = new Printer()
export const print = printer.print