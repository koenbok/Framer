
import {BaseClass} from "./BaseClass"
import {Layer} from "./Layer"

interface ContextOptions {
		parent: Layer|Context|null,
		backgroundColor: string
}

class Collection<T> {

	private _collection: T[] = []
	private _added = 0
	private _count = 0
	private _ids = {}
	private _maps = {}

	constructor(keys: string[]=[]) {
		
	}

	contains(item: T) {
		return this._collection.indexOf(item) !== -1
	}

	add(item: T, addId=false) {
		if (this.contains(item)) { return }
		this._count += 1
		this._added += 1
		this._ids[this._added]
		this._collection.push(item)
	}

	remove(item: T) {
		if (this.contains(item)) { return }
		this._collection.push(item)
	}

	find(key: string, value: any): T|null {

		return null
	}
}

export class Context extends BaseClass {

	_layers: Layer[] = []

	private _properties: ContextOptions = {
		parent: null,
		backgroundColor: "rgba(255, 0, 0, 0.5)"
	}

	constructor(options: ContextOptions|{}={}) {
		super()
	}

	get layers() {
		return this._layers
	}

}

export const DefaultContext = new Context()
export let CurrentContext = DefaultContext