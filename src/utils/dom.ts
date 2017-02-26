import * as _ from "lodash-es"

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


export const validEvent = (tagName: string, eventName: string) => {
	let element = document.createElement(tagName)
	return element[`on${eventName.toLowerCase()}`] !== undefined
}

// export const validEvent = _.memoize(_validEvent)

export const assignStyles = (element: HTMLElement, style: Object) => {

	// if (!element) {
	// 	console.warn("Woops could not set style.")
	// 	return
	// }

	// TODO: Find fastest way to update css
	Object.assign(element.style, style)
}