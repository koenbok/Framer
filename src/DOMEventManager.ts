
import { BaseClass } from "BaseClass";

export type DOMEventManagerEventType = keyof DocumentEventMap | "webkitmouseforcechanged"

export class DOMEventManagerElement {

	private _element: EventTarget

	constructor(element: EventTarget) {
		this._element = element
	}

	addEventListener(eventName: DOMEventManagerEventType, fn: EventListener, useCapture=false) {
		this._element.addEventListener(eventName, fn, useCapture)
	}

	removeEventListener(eventName: DOMEventManagerEventType, fn: EventListener, useCapture=false) {
		this._element.removeEventListener(eventName, fn, useCapture)
	}
}

export class DOMEventManager {

	wrap(_element: EventTarget): DOMEventManagerElement {

		const element = _element as any

		if (!element["_domEventManager"]) {
			element["_domEventManager"] = new DOMEventManagerElement(element)
		}

		return element["_domEventManager"]
	}
}
