import * as _ from "lodash"
import * as Utils from "Utils"
import { GestureEvents } from "../Events"

export const isGestureEvent = (event: string) => {
	return _.includes(_.values(GestureEvents), event)
}

export const interactiveEvents = (events: string[]) => {
	return events.filter(event => {

		if (Utils.dom.validEvent("div", event)) { return true }
		if (isGestureEvent(event)) { return true }

		return false
	})
}