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

let _validEventCache = {}
let _validEventCacheElements = {}
/** Returns if  certain event is a valid dome event for this element type. */
export const validEvent = (tagName: string, eventName: string) => {

	if (_validEventCache[tagName]) {
		return true
	}

	if (eventName in ["touchstart", "touchmove", "touchend"]) {
		return true
	}

	let element = _validEventCacheElements[tagName]

	if (!element) {
		element = document.createElement(tagName)
		_validEventCacheElements[tagName] = element
	}

	let result = (typeof element[`on${eventName.toLowerCase()}`] !== undefined)
	_validEventCache[tagName] = result

	return result
}
