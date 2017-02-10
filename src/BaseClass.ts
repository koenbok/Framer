import {pick} from "lodash-es"
import {EventEmitter} from "EventEmitter"

export class BaseClass<EventType> extends EventEmitter<EventType> {

	private _dirty = new Set()

	_updateProperty(name: string, value: any) {
		(this.emit as any)(`change:${name}`, value)
		this._dirty.add(name)
	}

	isDirty() {
		return this._dirty.size > 0
	}

	dirtyValues() {
		return pick(this, Array.from(this._dirty))
	}

	flush() {
		this._dirty.clear()
	}
}