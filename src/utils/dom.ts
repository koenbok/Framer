import * as _ from "lodash-es"
import * as utils from "./utils"

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

export const _validEvent = (tagName: string, eventName: string) => {
	let element = document.createElement(tagName)
	return element[`on${eventName.toLowerCase()}`] !== undefined
}

export const validEvent = utils.memoize(_validEvent)

export const assignStyles = (element: HTMLElement, style: Object) => {
	// TODO: Find fastest way to update css
	Object.assign(element.style, style)
}