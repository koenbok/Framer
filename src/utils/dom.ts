import * as _ from "lodash"
import * as utils from "./utils"

import {Renderable} from "Renderable"

const __domCompleteState = "interactive"
let __domComplete: Function[] = []
let __domReady = false

if (document) {
	document.onreadystatechange = (event) => {
		if (document.readyState === __domCompleteState) {
			__domReady = true
			while (__domComplete.length) {
				let next = __domComplete.shift()
				if (next) { next() }
			}
		}
	}
}

export const whenReady = (f: Function) => {
	if (__domReady) {
		f()
	} else {
		__domComplete.push(f)
	}
}

export const detach = (node: Element) => {
	if (node.parentElement) {
		node.parentElement.removeChild(node)
	}
}

const _getValidEventTag = utils.memoize((tagName: string) => {
	return document.createElement(tagName)
})

const _validEvent = (tagName: string, eventName: string) => {
	const element = _getValidEventTag(tagName)
	return element[`on${eventName.toLowerCase()}`] !== undefined
}

export const validEvent = utils.memoize(_validEvent)

export const getDOMEventKeys = (item: Renderable<any>): string[] => {

		return Object.keys(item.eventListeners()).filter((eventName) => {

			// We support touch events on desktop for now
			if (
				eventName === "touchstart" ||
				eventName === "touchmove" ||
				eventName === "touchend") {
					return true
				}

			if (validEvent("div", eventName)) {
				return true
			}

			return false
		})
}

// interface HTMLElement extends HTMLElement {
// 	style: CSSStyleDeclaration;
// }

export const assignStyles = (element: HTMLElement, style: any) => {
	Object.assign(element.style, style)
}