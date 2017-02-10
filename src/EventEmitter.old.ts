enum Handler {
	Original,
	Wrapped,
}

export class EventEmitter<EventName> {

	private _events: { [index: string]: [Function, Function][] } = {}

	on(eventName: EventName, handler: Function, once= false) {

		const name = eventName as any as string

		if (!this._events[name]) {
			this._events[name] = []
		}

		let actualHandler = handler

		if (once) {
			actualHandler = (...args) => {
				handler(...args)
				this.off(eventName, handler)
			}
		}

		this._events[name].push([handler, this.wrapEventListener(eventName, actualHandler)])
	}

	off(eventName: EventName, handler: Function) {
		this.removeEventListeners(eventName, handler)
	}

	wrapEventListener(eventName: EventName, handler: Function) {
		return handler
	}

	removeEventListeners(eventName?: EventName, handler?: Function): void {

		if (!eventName && !handler) {
			this._events = {}
			return
		}

		const name = eventName as any as string

		if (eventName && !handler) {
			this._events[name] = []
			return
		}

		if (eventName && handler) {
			this._events[name] = this._events[name].filter(
				(handlers) => handlers[Handler.Original] !== handler)
			return
		}
	}

	countEventListeners(eventName: EventName, handler?: Function): number {

		const name = eventName as any as string

		if (!this._events[name]) {
			return 0
		}

		if (!this._events[name]) {
			return 0
		}

		return this._events[name].length
	}

	once(eventName: EventName, handler: Function) {
		this.on(eventName, handler, true)
	}

	schedule(eventName: EventName, handler: Function): boolean {

		const name = eventName as any as string

		if (this._events[name]) {
			for (let handlers of this._events[name]) {
				if (handlers[Handler.Original] === handler) {
					return false
				}
			}
		}

		this.once(eventName, handler)
		return true
	}

	emit(eventName: EventName, ...args) {

		const name = eventName as any as string
		let removes: number[] = []

		if (!this._events[name]) {
			return
		}

		this._events[name].forEach((handlers, index) => {

			handlers[Handler.Wrapped].apply(this, args)

			if (handlers[Handler.Original]["once"] == true) {
				removes.push(index)
			}
		})

		removes.forEach((index) => this._events[name].splice(index, 1))
	}

	destroy() {
		this.removeEventListeners()
	}

}