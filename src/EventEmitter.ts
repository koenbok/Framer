class EventEmitter<EventName> {

	private _events: { [index: string]: [Function, Function][] } = {}

	on(eventName: EventName, handler: Function) {

		const name = eventName as any as string

		if (!this._events[name]) {
			this._events[name] = []
		}

		this._events[name].push([handler, this.wrapEventListener(eventName, handler)])
	}

	off(eventName: EventName, handler: Function) {
		this.removeEventListeners(eventName, handler)
	}

	wrapEventListener(eventName: EventName, handler: Function) {
		return handler
	}

	removeEventListeners(eventName?: EventName, handler?: Function) {

		if (!eventName && !handler) {
			return this._events = {}
		}

		const name = eventName as any as string

		if (eventName && !handler) {
			return this._events[name] = []
		}

		if (eventName && handler) {
			return this._events[name] = this._events[name].filter((handlers) =>
				handlers[0] === handler)
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
		handler["once"] = true
		this.on(eventName, handler)
	}

	schedule(eventName: EventName, handler: Function): boolean {

		const name = eventName as any as string

		if (!this._events[name]) {
			return false
		}

		for (let handlers of this._events[name]) {
			if (handlers[0] === handler) {
				return false
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

			handlers[1].apply(this, args)

			if (handlers[0]["once"] == true) {
				removes.push(index)
			}
		})

		removes.forEach((index) => this._events[name].splice(index, 1))
	}

}