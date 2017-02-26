import Utils from "./Utils";
import { Context } from "./Context";

class Printer {

	constructor() {
		this.createLayer = this.createLayer.bind(this);
		this.resize = this.resize.bind(this);
		this.print = this.print.bind(this);
		this.scrollToBottom = this.scrollToBottom.bind(this);
		this._context = new Context({name: "PrintConsole"});
		this._context.run(() => Events.wrap(window).addEventListener("resize", this.resize));
	}

	createLayer() {

		if (this._printLayer) { return this._printLayer; }

		this._context.run(() => {
			this._container = new Layer({
				backgroundColor: null});
			this._container.style.zIndex = 999; // Always stay on top

			this._printLayer = new Layer({
				parent: this._container});

			this._printLayer.scrollVertical = true;
			this._printLayer.ignoreEvents = false;
			this._printLayer.html = "";
			this._printLayer.style = {
				"font": "12px/1.35em Menlo, Consolas, monospace",
				"color": "rgba(0, 0, 0, .7)",
				"padding": "8px",
				"padding-bottom": "30px",
				"border-top": "1px solid #d9d9d9"
			};

			this._printLayer.opacity = 0.9;
			this._printLayer.visible = true;
			this._printLayer.backgroundColor = "white";

			this._closeButton = new Layer({
				parent: this._container,
				html: '<svg><g stroke="#B8B8B8"><path d="M1,1 L8,8"></path><path d="M1,8 L8,1"></path></g></svg>',
				y: 9,
				width: 9,
				height: 9,
				backgroundColor: null
			});
			this._closeButton.style["cursor"] = "auto";
			return this._closeButton.onClick(() => {
				return this.hide();
			}
			);
		}
		);
		this.resize();

		return this._printLayer;
	}

	resize() {
		if (!this._printLayer) { return; }
		this._container.width = window.innerWidth;
		this._container.height = 160;
		this._container.maxY = window.innerHeight;

		this._printLayer.size = this._container.size;
		return this._closeButton.maxX = (this._container.maxX - this._closeButton.y) + 1;
	}

	hide() {
		return this._context.visible = false;
	}

	print(...args) {

		this.createLayer();
		this._context.visible = true;
		let printPrefix = "» ";

		let printNode = document.createElement("div");
		printNode.style["-webkit-user-select"] = "text";
		printNode.style["cursor"] = "auto";
		printNode.innerHTML = _.escape(printPrefix + args.map(obj => Utils.inspect(obj)).join(", ")) + "<br>";

		this._printLayer._element.appendChild(printNode);

		this.scrollToBottom();
		return Utils.delay(0, this.scrollToBottom);
	}

	scrollToBottom() {
		if (!this._printLayer) { return; }
		return this._printLayer._element.scrollTop = this._printLayer._element.scrollHeight;
	}
}

let _printer = null;

export function print(...args) {
	if (_printer == null) { _printer = new Printer; }
	return _printer.print(...args);
}
