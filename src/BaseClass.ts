export class BaseClass {

	private _dirty = {}

	emit(name, value) {
		// TODO: Emitter
	}

	_updateProperty(name: string, value: any) {
		this.emit(`change:${name}`, value)
		this._dirty[name] = value
	}

	isDirty() {
		return Object.keys(this._dirty).length > 0
	}

	flush() {
		const result = this._dirty
		this._dirty = {}
		return result
	}
}