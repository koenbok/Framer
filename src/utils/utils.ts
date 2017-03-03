import * as _ from "lodash"

/** Generate an Array with a range of n. */
export const range = (a: number, b?: number) => {
	let start: number, end: number
	if (_.isNumber(a) && _.isNumber(b)) { start = a; end = b}
	else { start = 0; end = a}
	return Array.from({length: end}, (value, key) => key + start)
}

const randomColorValue = () => Math.round(Math.random() * 255)

/** Generate a random rgba color with optional alpha. */
export const randomColor = (alpha= 1) => {
	return `rgba(${randomColorValue()}, ${randomColorValue()}, ${randomColorValue()}, ${alpha})`
}

export const delay = (time= 0, f: Function) => { setTimeout(f, time * 1000) }

export const orderedForEach = (
	obj: any,
	order: string[],
	f: (key: string, value: any) => void) => {

	const keys = Object.keys(obj)
	const ordr = _.intersection(keys, order)
	const rest = _.difference(keys, order)

	for (let key of ordr) { f(key, obj[key]) }
	for (let key of rest) { f(key, obj[key]) }
}

export const assignOrdered = (
	target: any,
	options: Object,
	order: string[]= []) => {
	orderedForEach(options, order, (key, value) => {
		target[key] = value
	})
}

const hasher = (x: any) => {
	if (arguments.length <= 1) {
		return x
	} else {
		return Array.prototype.slice.call(arguments);
	}
}
/** memoize function that defaults to hashing all arguments */
export const memoize = (fn: Function) => {
	return _.memoize(fn, hasher)
}