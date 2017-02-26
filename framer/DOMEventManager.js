import { _ } from "./Underscore";
import { EventEmitter } from "./EventEmitter";

import Utils from "./Utils";

let EventManagerIdCounter = 0;

class DOMEventManagerElement extends EventEmitter {
	static initClass() {
	
		// Keep the DOM API working
		this.prototype.addEventListener = this.prototype.addListener;
		this.prototype.removeEventListener = this.prototype.removeListener;
	
		// Keep the Node API working
		this.prototype.on = this.prototype.addListener;
		this.prototype.off = this.prototype.removeListener;
	}

	constructor(element) {
		this.element = element;
	}

	addListener(eventName, listener, capture) {
		if (capture == null) { capture = false; }
		listener.capture = capture; // Make sure we store capture too
		super.addListener(eventName, listener);
		return this.element.addEventListener(eventName, listener, capture);
	}

	removeListener(eventName, listener, capture) {
		if (capture == null) { capture = false; }
		super.removeListener(eventName, listener);
		return this.element.removeEventListener(eventName, listener, listener.capture);
	}
}
DOMEventManagerElement.initClass();


export let DOMEventManager = class DOMEventManager {

	constructor(element) {
		this.wrap = this.wrap.bind(this);
		this._elements = {};
	}

	wrap(element) {

		if (!element._eventManagerId) {
			element._eventManagerId = EventManagerIdCounter++;
		}

		if (!this._elements[element._eventManagerId]) {
			this._elements[element._eventManagerId] = new DOMEventManagerElement(element);
		}

		return this._elements[element._eventManagerId];
	}

	reset() {
		return (() => {
			let result = [];
			for (let element in this._elements) {
				let elementEventManager = this._elements[element];
				result.push(elementEventManager.removeAllListeners());
			}
			return result;
		})();
	}
};
