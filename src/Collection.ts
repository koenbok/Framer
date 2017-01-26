import * as _ from "lodash"

export class Collection<T> {

	private _collection: T[] = []
	private _added = 0
	private _count = 0
	private _ids = {}
	private _maps = {}

	constructor(keys: string[]=[]) {
		keys.forEach((key) => {
			this._maps[key] = {}
		})
	}

	contains(item: T): boolean {
		return this._collection.indexOf(item) !== -1
	}

	add(item: T, addId=false): number {

		if (this.contains(item)) {
			return this.getId(item)
		}

		this._count += 1
		this._added += 1
		this._ids[this._added] = item
		this._collection.push(item)

		return this._added
	}

	remove(item: T): number {
		if (!this.contains(item)) { return -1 }
		let id = this.getId(item)
		this._collection.splice(this._collection.indexOf(item), 1)
		delete this._ids[id]
		console.log(id, this._ids);

		this._count--
		return id
	}

	get(id: number): T {
		return this._ids[id]
	}

	getId(item: T): number {

		// TODO: This is a fairly slow method.

		if (!this.contains(item)) {
			return -1
		}

		return parseInt(_.findKey(this._ids, item))
	}

	find(key: string, value: any): T[] {

		if (this._maps[key]) {
			return this._maps[key][value]
		}

		return []
	}

	get count() {
		return this._count
	}
}