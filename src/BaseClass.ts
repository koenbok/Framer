import * as _ from "lodash"
import {EventEmitter} from "events"

export class BaseClass extends EventEmitter {

	private _dirty = new Set()


	_updateProperty(name: string, value: any) {
		this.emit(`change:${name}`, value)
		this._dirty.add(name)
	}

	isDirty() {
		return this._dirty.size > 0
	}

	dirtyValues() {
		return _.pick(this, Array.from(this._dirty))
	}

	flush() {
		this._dirty.clear()
	}
}