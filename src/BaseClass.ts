import {pick} from "lodash"
import {EventEmitter} from "EventEmitter"

let BaseClassCounter = 0
let BaseClassCounters = {}

const getGlobalId = () => {
	return BaseClassCounter++
}

const getObjectId = (obj: Object) => {

	const className = obj.constructor.name

	if (!BaseClassCounters[className]) {
		BaseClassCounters[className] = 0
	}

	return BaseClassCounters[className]++
}

export class BaseClass<EventType> extends EventEmitter<EventType> {

	private _id = -1
	private _globalId = -1

	constructor() {
		super()
		this._globalId = getGlobalId()
		this._id = getObjectId(this)
	}

	get id() {
		return this._id
	}

	get globalId() {
		return this._globalId
	}

	_setId(id: number) {
		this._id = id
	}

	describe() {
		return `<${this.constructor.name} ${this.id}>`
	}

}