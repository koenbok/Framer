enum Handler {
	Original,
	Wrapped,
}

interface EE {
	fn: Function
	handler: Function
	context: any
	once: boolean
}

export class EventEmitter<EventName> {

	private _events: { [index: string]: EE[] } = {}
	private _eventCount = 0

	on(eventName: EventName, fn: Function, once=false) {

		const name = eventName as any as string

		if (!this._events[name]) {
			this._events[name] = []
		}

		this._events[name].push({
			fn: fn,
			handler: this.wrapEventListener(eventName, fn),
			context: this,
			once: once
		})

		this._eventCount++
	}

	off(eventName: EventName, fn: Function) {
		this.removeEventListeners(eventName, fn)
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
		this._events[name] = this._events[name].filter((handlers) => {
			if (handlers.fn !== fn) {
				this._eventCount -= 1
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

	once(eventName: EventName, handler: Function) {
		this.on(eventName, handler, true)
	}

	schedule(eventName: EventName, fn: Function): boolean {

		const name = eventName as any as string

		// Don't add this event if it already exists
		if (this._events[name]) {
			for (let handler of this._events[name]) {
				if (handler.handler === fn) {
					return false
				}
			}
		}

		this.once(eventName, fn)

		return true
	}

	emit(eventName: EventName, ...args: any[]) {

		const name = eventName as any as string

		if (!this._events[name]) {
			return
		}

		let events: EE[] = []

		for (let i=0, len=this._events[name].length; i<len; i++) {
			const handler = this._events[name][i]

			handler.handler.apply(handler.context, args)

			if (!handler.once) {
				events.push(handler)
			}
		}

		if (events.length !== this._events[name].length) {
			this._eventCount += events.length - this._events[name].length
			this._events[name] = events
		}
	}

	destroy() {
		this.removeEventListeners()
	}

}