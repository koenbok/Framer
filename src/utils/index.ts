import * as _ from "lodash-es"

import * as dom from "utils/dom"

export {dom}

/** Generate an Array with a range of n. */
export const range = n => Array.from({length: n}, (value, key) => key)

const randomColorValue = () => Math.round(Math.random() * 255)

/** Generate a random rgba color with optional alpha. */
export const randomColor = (alpha= 1) => {
	return `rgba(${randomColorValue()}, ${randomColorValue()}, ${randomColorValue()}, ${alpha})`
}

export const delay = (time= 0, f: Function) => { setTimeout(f, time) }

export const orderedForEach = (
	obj: Object,
	order: string[],
	f: (key: string, value: any) => void) => {

	const rest = _.difference(Object.keys(obj), order)

	for (let key of order) {
		f(key, obj[key])
	}

	for (let key of rest) {
		f(key, obj[key])
	}
}

export const assignOrdered = (
	target: Object,
	options: Object,
	order: string[]= []) => {
	orderedForEach(options, order, (key, value) => {
		target[key] = value
	})
}