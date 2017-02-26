import { _ } from "./Underscore";

import EventEmitter3 from "eventemitter3";

let EventKey = "_events";

export let EventEmitter = class EventEmitter extends EventEmitter3 {

	listenerEvents() {
		return _.keys(this[EventKey]);
	}

	removeAllListeners(eventName) {

		// We override this method to make the eventName optional. If none
		// is given we remove all listeners for all event names.

		let eventNames;
		if (eventName) {
			eventNames = [eventName];
		} else {
			eventNames = this.listenerEvents();
		}

		return (() => {
			let result = [];
			for (eventName of Array.from(eventNames)) {
				result.push(Array.from(this.listeners(eventName)).map((listener) =>
					this.removeListener(eventName, listener)));
			}
			return result;
		})();
	}
};
