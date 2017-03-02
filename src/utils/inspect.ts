import * as _ from "lodash"

const extractObjectName = (str: string) => {
	if (!str) { return null }

	const regex = /\[object (\w+)\]/
	const match = regex.exec(str)

	if (match) { return match[1] }
	return null
}

export const inspectObjectType = (item: any) => {

	// This is a hacky way to get nice object names, it tries to
	// parse them from the .toString methods for objects.

	if (
		item.constructor &&
		item.constructor.name &&
		item.constructor.name !== "Object") {
			return item.constructor.name
		}

	if (item.toString) {
		const className = extractObjectName(item.toString())
		if (className) { return className }
	}

	if (
		item.constructor &&
		item.constructor.toString) {
			const className = extractObjectName(item.constructor.toString())
			if (className) { return className.replace("Constructor", "") }
		}

	return "Object"
}

export const inspect = (item: any, max= 5, level= 0): string => {

	if (item === null) { return "null" }
	if (item === undefined) { return "undefined" }

	if (_.isFunction(item.describe)) {
		return item.describe()
	}

	if (_.isString(item)) {
		return `"${item}"`
	}

	if (_.isNumber(item)) {
		return `${item}`
	}

	if (_.isFunction(item)) {
		let code = item.toString()
		// code = ["function ".length..].replace(/\n/g, "").replace(/\s+/g, " ")
		// We limit the size of a function body if it's in a strucutre
		let limit = 50
		// code = "#{_.trimEnd(code[..limit])}… }" if code.length > limit and l > 0
		return `<Function ${code}>`
	}

	if (_.isArray(item)) {
		if (level > max) { return "[...]" }
		return "[" + _.map(item, (i) => inspect(i, max, level + 1)).join(", ") + "]"
	}

	if (_.isObject(item)) {
		const objectType = inspectObjectType(item)
		let objectInfo: string

		// We should not loop over dom trees because we will have a bad time
		if (/HTML\w+?Element/.test(objectType)) {
			return `<${objectType}>`
		}

		if (level > max) {
			objectInfo = "{...}"
		}
		else {
			objectInfo = "{" + _.map(item, (v, k) => `${k}:${inspect(v, max, level + 1)}`).join(", ") + "}"
		}

		if (objectType === "Object") {
			return objectInfo
		}

		return "<#{objectType} #{objectInfo}>"
	}

	return "#{item}"

}

export const inspectAll = (...args): string => {
	return args.map(item => inspect(item)).join(" ")
}


