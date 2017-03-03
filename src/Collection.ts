import {findKey} from "lodash"

const add = (array: any[], item: any) => {
	array = array.slice(0)
	array.push(item)
	Object.freeze(array)
	return array
}

const remove = (array: any[], item: any) => {
	array = array.slice(0)
	array.splice(array.indexOf(item), 1)
	Object.freeze(array)
	return array
}

export class Collection<T> {

	private _items: T[] = []
	private _added = 0
	private _count = 0
	private _ids: {[index: string]: T} = {}

	contains(item: T): boolean {
		return this._items.indexOf(item) !== -1
	}

	add(item: T, addId= false): number {

		if (this.contains(item)) {
			return this.getId(item)
		}

		this._count += 1
		this._added += 1
		this._ids[this._added] = item

		this._items = add(this._items, item)

		return this._added
	}

	remove(item: T): number {
		if (!this.contains(item)) { return -1 }
		let id = this.getId(item)

		this._items = remove(this._items, item)

		delete this._ids[id]

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

		return parseInt(findKey(this._ids, item))
	}

	// find(key: string, value: any): T[] {

	// 	if (this._maps[key]) {
	// 		return this._maps[key][value]
	// 	}

	// 	return []
	// }

	get count() {
		return this._count
	}

	items() {
		return this._items
	}
}