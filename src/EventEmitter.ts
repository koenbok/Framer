import {EventEmitter as EventEmitter3} from "eventemitter3"

export class EventEmitter<EventName> {

	private _em = new EventEmitter3()

	eventNames() {
		return this._em.eventNames() as string[]
	}

	eventListeners() {

		const listeners: {[index: string]: EventEmitter.ListenerFn[]} = {}

		for (let eventName of this._em.eventNames()) {
			listeners[eventName] = this._em.listeners(eventName)
		}

		return listeners
	}

	on(eventName: EventName, fn: Function) {
		this.addEventListener(eventName, fn, false, this)
	}

	once(eventName: EventName, fn: Function) {
		this.addEventListener(eventName, fn, true, this)
	}

	off(eventName: EventName, fn: Function) {
		this.removeEventListeners(eventName, fn)
	}

	addEventListener(eventName: EventName, fn: Function, once: boolean, context: Object) {

		if (once === true) {
			this._em.once(eventName as any, fn as any, context)
		} else {
			this._em.addListener(eventName as any, fn as any, context)
		}
	}

	// wrapEventListener(eventName: EventName, fn: Function) {
	// 	return fn
	// }

	removeEventListeners(eventName?: EventName, fn?: Function): void {
		if (eventName) {
			this._em.removeListener(eventName as any, fn as any)
		} else {
			this.removeAllEventListeners()
		}
	}

	removeAllEventListeners() {
		this._em.removeAllListeners()
	}

	countEventListeners(eventName?: EventName, handler?: Function): number {

		if (eventName) {
			return this._em.listeners(eventName as any).length
		} else {

			let count = 0

			for (let eventName of this._em.eventNames()) {
				count += this._em.listeners(eventName).length
			}

			return count
		}
	}

	schedule(eventName: EventName, fn: Function): boolean {

		for (let handler of this._em.listeners(eventName as any)) {
			if (handler === fn) { return false }
		}

		this.once(eventName, fn)

		return true
	}

	emit(eventName: EventName, ...args: any[]) {
		this._em.emit(eventName as any, ...args)
	}

	destroy() {
		this.removeEventListeners()
	}

}