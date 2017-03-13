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

// interface HTMLElement extends HTMLElement {
// 	style: CSSStyleDeclaration;
// }

export const assignStyles = (element: HTMLElement, style: any) => {
	Object.assign(element.style, style)
}

/**
 * Insert a style element to head of the document.
 * @param css css stylesheet contents.
 */
export const insertStyleSheet = (css: string) => {

	const style = document.createElement("style");
	style.appendChild(document.createTextNode(css));

	whenReady(() => {
		document.head.appendChild(style);
	})
}