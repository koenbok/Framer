type wrappedFunction = Function

interface EE {
	fn: Function
	handler: Function
	context: any
	once: boolean
}

export class EventEmitter<EventName> {

	private _events: { [index: string]: EE[] } = {}
	private _eventCount = 0

	eventListeners() {

		const listeners = {}

		for (let key in this._events) {
			listeners[key] = this._events[key].map((listener) => listener.fn)
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

		const name = eventName as any as string

		if (!this._events[name]) {
			this._events[name] = []
		}

		this._events[name].push({
			fn: fn,
			handler: this.wrapEventListener(eventName, fn),
			context: context,
			once: once
		})

		this._eventCount++
	}



	wrapEventListener(eventName: EventName, fn: Function) {
		return fn
	}

	removeEventListeners(eventName?: EventName, fn?: Function): void {

		// Remove all the event listeners at once
		if (!eventName && !fn) {
			this.removeAllEventListeners()
			return
		}

		const name = eventName as any as string

		// Remove all event listeners for an event
		if (eventName && !fn) {
			this._eventCount -= this._events[name].length
			this._events[name] = []
			return
		}

		// Remove a specific handler for an event
		this._events[name] = this._events[name].filter((handler: EE) => {
			if (handler.fn === fn) {
				this._eventCount -= 1
				return false
			} else {
				return true
			}
		})
	}

	removeAllEventListeners() {
		this._events = {}
		this._eventCount = 0
	}

	countEventListeners(eventName?: EventName, handler?: Function): number {

		const name = eventName as any as string

		if (!eventName) {
			return this._eventCount
		}

		if (!this._events[name]) {
			return 0
		}

		return this._events[name].length
	}



	schedule(eventName: EventName, fn: Function): boolean {

		const name = eventName as any as string

		// Don't add this event if it already exists
		if (this._events[name]) {
			for (let handler of this._events[name]) {
				if (handler.fn === fn) {
					return false
				}
			}
		}

		this.once(eventName, fn)

		return true
	}

	emit(eventName: EventName, ...args: any[]) {

		const name = eventName as any as string
		let removes: number[] = []

		if (!this._events[name]) {
			return
		}

		this._events[name].forEach((listener, index) => {

			listener.handler.apply(this, args)

			if (listener.once == true) {
				this._eventCount--
				removes.push(index)
			}
		})

		removes.forEach((index) => this._events[name].splice(index, 1))

		// this._events[name] = this._events[name].filter((handler) => {

		// 	handler.handler.apply(this, args)

		// 	if (handler.once) {
		// 		this._eventCount--
		// 		return false
		// 	} else {
		// 		return true
		// 	}
		// })
	}

	destroy() {
		this.removeEventListeners()
	}

}