import * as _ from "lodash"
import * as Types from "Types"
import * as Utils from "Utils"

import { DOMEventManager } from "DOMEventManager"
import { Context } from "Context"
import { Screen } from "Screen"

let GestureInputLongPressTime = 0.5
let GestureInputDoubleTapTime = 0.25
let GestureInputSwipeThreshold = 30
let GestureInputEdgeSwipeDistance = 30
let GestureInputVelocityTime = 0.1
let GestureInputForceTapDesktop = (MouseEvent as any)["WEBKIT_FORCE_AT_FORCE_MOUSE_DOWN"]
let GestureInputForceTapMobile = 0.7
let GestureInputForceTapMobilePollTime = 1 / 30
let GestureInputMinimumFingerDistance = 30

interface WebkitTouchEvent extends TouchEvent {
	webkitForce?: number
}

export interface GestureEvent extends WebkitTouchEvent {

	eventCount: number

	time: number // Current time √

	point: Types.Point // Current point √
	start: Types.Point // Start point √
	previous: Types.Point // Previous point √

	offset: Types.Point // Offset since start √
	offsetTime: number // Time since start √
	offsetAngle: number // Angle from start √
	offsetDirection: null | Types.Direction // Direction from start (up down left right) √

	delta: Types.Point // Offset since last event √
	deltaTime: number // Time since last event √
	deltaAngle: number // Angle from last event √
	deltaDirection: null | Types.Direction // Direction from last event √

	force: number // 3d touch or force touch iOS/Mac only √
	velocity: Types.Point // Velocity average over the last few events √

	fingers: number // Number of fingers used √
	touchCenter: Types.Point // Center between two fingers √
	touchCenterStart: Types.Point // The starting center between two fingers √
	touchOffset: Types.Point // Offset between two fingers √
	touchDistance: number // Distance between two fingers √
	scale: number // Scale value from two fingers √
	scaleDirection: null | Types.VerticalDirection // Direction for scale: up or down √
	rotation: Types.Degrees

}

interface GestureEventSession {
	eventCount: number
	startEvent: GestureEvent
	lastEvent?: GestureEvent
	startMultiEvent?: GestureEvent
	startTime: number
	pressTimer: number
	started: {
		pinch?: GestureEvent
		forcetap?: GestureEvent
		longpress?: GestureEvent
		pan?: GestureEvent
		swipe?: GestureEvent
		swipedirection?: GestureEvent
		edgeswipedirection?: GestureEvent
	},
	force?: number
	events: GestureEvent[]
}

export class GestureEventRecognizer {

	session: null | GestureEventSession
	em = new DOMEventManager()
	doubleTapTime?: number

	constructor() {
		this.em.wrap(window).addEventListener("mousedown", this.domMouseDown)
		this.em.wrap(window).addEventListener("touchstart", this.domTouchStart)
	}

	destroy() {
		// return this.em.removeAllListeners()
	}

	cancel() {
		if (!this.session) { return }
		window.clearTimeout(this.session.pressTimer)
		this.session = null
	}

	// All DOM event handlers

	// Mouse

	domMouseDown = (event: MouseEvent) => {
		if (this.session) { return }
		this.em.wrap(window).addEventListener("mousemove", this.domMouseMove)
		this.em.wrap(window).addEventListener("mouseup", this.domMouseUp)
		this.touchstart(this._getTouchEvent(event))
	}

	domMouseMove = (event: MouseEvent) => {
		this.touchmove(this._getGestureEvent(this._getTouchEvent(event)))
	}

	domMouseUp = (event: MouseEvent) => {
		this.em.wrap(window).removeEventListener("mousemove", this.domTouchMove)
		this.em.wrap(window).removeEventListener("mouseup", this.domTouchEnd)
		this.touchend(this._getGestureEvent(this._getTouchEvent(event)))
	}

	// Touch

	domTouchStart = (event: WebkitTouchEvent) => {
		if (this.session) { return }
		this.em.wrap(window).addEventListener("touchmove", this.domTouchMove)
		this.em.wrap(window).addEventListener("touchend", this.domTouchEnd)
		this.touchstart(event)
	}

	domTouchMove = (event: WebkitTouchEvent) => {
		this.touchmove(this._getGestureEvent(event))
	}

	domTouchEnd = (event: WebkitTouchEvent) => {

		if (!this.session) { return }

		// Only fire if there are no fingers left on the screen
		if (event.touches != null) {
			if (Utils.environment.isTouch()) {
				if (event.touches.length !== 0) { return }
			} else {
				if (event.touches.length !== event.changedTouches.length) { return }
			}
		}

		this.em.wrap(window).removeEventListener("touchmove", this.domTouchMove)
		this.em.wrap(window).removeEventListener("touchend", this.domTouchEnd)
		this.em.wrap(window).removeEventListener("webkitmouseforcechanged", this._updateMacForce)

		this.touchend(this._getGestureEvent(event))
	}

	reset() {
		if (!this.session) { return }
		if (!this.session.lastEvent) { return }
		this.domTouchEnd(this.session.lastEvent)
	}


	// Touch

	touchstart = (_event: WebkitTouchEvent) => {

		// Only fire if we are not already in a session
		if (this.session) { return }

		this.em.wrap(window).addEventListener("webkitmouseforcechanged", this._updateMacForce)

		const event = this._getGestureEvent(_event)

		this.session = {
			startEvent: event,
			// lastEvent: null,
			// startMultiEvent: null,
			startTime: Date.now(),
			pressTimer: window.setTimeout(this.longpressstart, GestureInputLongPressTime * 1000),
			started: {},
			events: [],
			eventCount: 0
		}

		this.tapstart(event)

		if (this.doubleTapTime && (Date.now() - this.doubleTapTime) < (GestureInputDoubleTapTime * 1000)) {
			this.doubletap(event)
		} else {
			this.doubleTapTime = Date.now()
		}

		this._process(event)

		if (Utils.environment.isTouch()) {
			this._updateTouchForce()
		}
	}

	touchmove = (event: GestureEvent) => {
		this._process(event)
	}

	touchend = (event: GestureEvent) => {
		if (!this.session) { return }

		for (let eventName in this.session.started) {
			switch (eventName) {
				case "pinch": this.pinchend(event); break
				case "forcetap": this.forcetapend(event); break
				// case "longpress": this.longpress(event); break
				case "pan": this.panend(event); break
				case "swipe": this.swipeend(event); break
				case "swipedirection": this.swipedirectionend(event); break
				case "edgeswipedirection": this.edgeswipedirectionend(event); break
			}
		}

		// We only want to fire a tap event if the original target is the same
		// as the release target, so buttons work the way you expect if you
		// release the mouse outside.
		if (!(this.session != null ? this.session.startEvent : undefined)) {
			this.tap(event)
		} else if (this.session.startEvent.target === event.target) {
			this.tap(event)
		}

		this.tapend(event)
		this.cancel()
	}

	// Tap

	tap = (event: GestureEvent) => {
		return this._dispatchEvent("tap", event)
	}

	tapstart = (event: GestureEvent) => {
		return this._dispatchEvent("tapstart", event)
	}

	tapend = (event: GestureEvent) => {
		return this._dispatchEvent("tapend", event)
	}

	doubletap = (event: GestureEvent) => {
		return this._dispatchEvent("doubletap", event)
	}

	// Press

	// Started from a timer, so no event here
	longpressstart = () => {
		if (!this.session) { return }
		if (this.session.started.longpress) { return }
		this.session.started.longpress = this.session.startEvent
		this._dispatchEvent("longpressstart", this.session.startEvent)
		this._dispatchEvent("longpress", this.session.startEvent)
	}

	// longpressend(event: GestureEvent) {
	// 	this._dispatchEvent("longpressend", event)
	// }

	// ForceTap

	_updateTouchForce() {
		if (!this.session) { return }
		if (!this.session.lastEvent) { return }
		if (!this.session.lastEvent.touches) { return }
		if (!this.session.lastEvent.touches.length) { return }

		this.session.force = (this.session.lastEvent.touches[0] as any).force || 0
		let event = this._getGestureEvent(this.session.lastEvent)
		this.forcetapchange(event)

		if (this.session.force && this.session.force >= GestureInputForceTapMobile) {
			this.forcetapstart(event)
		} else {
			this.forcetapend(event)
		}

		return setTimeout(this._updateTouchForce, GestureInputForceTapMobilePollTime)
	}

	_updateMacForce(_event: WebkitTouchEvent) {
		if (!this.session) { return }
		if (!_event.webkitForce) { return }

		this.session.force = Utils.math.modulate(_event.webkitForce, [0, 3], [0, 1])

		const event = this._getGestureEvent(_event)
		this.forcetapchange(this._getGestureEvent(event))

		// Trigger a force touch if we reach the desktop threshold
		if (_event.webkitForce >= GestureInputForceTapDesktop) {
			this.forcetapstart(event)
		} else {
			this.forcetapend(event)
		}
	}

	forcetapchange(event: GestureEvent) {
		return this._dispatchEvent("forcetapchange", event)
	}

	forcetapstart(event: GestureEvent) {
		if (!this.session) { return }
		if (this.session.started.forcetap) { return }
		this.session.started.forcetap = event
		this._dispatchEvent("forcetapstart", event)
		return this._dispatchEvent("forcetap", event)
	}

	forcetapend(event: GestureEvent) {
		if (!this.session) { return }
		if (!this.session.started.forcetap) { return }
		delete this.session.started.forcetap
		return this._dispatchEvent("forcetapend", event)
	}

	// Pan

	panstart(event: GestureEvent) {
		if (!this.session) { return }
		this.session.started.pan = event
		return this._dispatchEvent("panstart", event, event.target)
	}

	pan(event: GestureEvent) {
		if (!this.session || !this.session.started.pan) { return }
		this._dispatchEvent("pan", event, this.session.started.pan.target)
		let direction = this._getDirection(event.delta)
		if (direction) { return (this as any)[`pan${direction}`](event) }
	}

	panend(event: GestureEvent) {
		if (!this.session || !this.session.started.pan) { return }
		this._dispatchEvent("panend", event, this.session.started.pan.target)
		delete this.session.started.pan
	}

	panup(event: GestureEvent) {
		if (!this.session || !this.session.started.pan) { return }
		return this._dispatchEvent("panup", event, this.session.started.pan.target)
	}

	pandown(event: GestureEvent) {
		if (!this.session || !this.session.started.pan) { return }
		return this._dispatchEvent("pandown", event, this.session.started.pan.target)
	}

	panleft(event: GestureEvent) {
		if (!this.session || !this.session.started.pan) { return }
		return this._dispatchEvent("panleft", event, this.session.started.pan.target)
	}

	panright(event: GestureEvent) {
		if (!this.session || !this.session.started.pan) { return }
		return this._dispatchEvent("panright", event, this.session.started.pan.target)
	}

	// Pinch

	pinchstart(event: GestureEvent) {
		if (!this.session || !this.session.started.pan) { return }
		this.session.started.pinch = event
		this.scalestart(event)
		this.rotatestart(event)
		this._dispatchEvent("pinchstart", event)
	}

	pinch(event: GestureEvent) {
		if (!this.session) { return }
		if (!this.session.started.pinch) { return }
		this._dispatchEvent("pinch", event)
		this.scale(event)
		this.rotate(event)
	}

	pinchend(event: GestureEvent) {
		if (!this.session) { return }
		if (!this.session.started.pinch) { return }
		this._dispatchEvent("pinchend", event)
		this.scaleend(event)
		this.rotateend(event)
		delete this.session.started.pinch
	}


	scalestart(event: GestureEvent) {
		return this._dispatchEvent("scalestart", event)
	}

	scale(event: GestureEvent) {
		return this._dispatchEvent("scale", event)
	}

	scaleend(event: GestureEvent) {
		return this._dispatchEvent("scaleend", event)
	}

	rotatestart(event: GestureEvent) {
		return this._dispatchEvent("rotatestart", event)
	}

	rotate(event: GestureEvent) {
		return this._dispatchEvent("rotate", event)
	}

	rotateend(event: GestureEvent) {
		return this._dispatchEvent("rotateend", event)
	}

	// Swipe

	swipestart(event: GestureEvent) {
		if (!this.session) { return }
		if (!this.session.started.swipe) { return }
		this._dispatchEvent("swipestart", event)
		this.session.started.swipe = event
		return this.swipedirectionstart(event)
	}

	swipe(event: GestureEvent) {
		this._dispatchEvent("swipe", event)
		return this.swipedirection(event)
	}

	swipeend(event: GestureEvent) {
		return this._dispatchEvent("swipeend", event)
	}

	// Direction swipe

	swipedirectionstart(event: GestureEvent) {
		if (!event.offsetDirection) { return }
		if (!this.session) { return }
		if (this.session.started.swipedirection) { return }
		this.session.started.swipedirection = event
		let direction = this.session.started.swipedirection.offsetDirection
		this._dispatchEvent(`swipe${direction}start`, event)

		let swipeEdge = this._edgeForSwipeDirection(direction)

		if ((swipeEdge === "top") && 0 < event.start.y && event.start.y < GestureInputEdgeSwipeDistance) {
			this.edgeswipedirectionstart(event)
		}

		if ((swipeEdge === "right") && Screen.width - GestureInputEdgeSwipeDistance < event.start.x && event.start.x < Screen.width) {
			this.edgeswipedirectionstart(event)
		}

		if ((swipeEdge === "bottom") && Screen.height - GestureInputEdgeSwipeDistance < event.start.y && event.start.y < Screen.height) {
			this.edgeswipedirectionstart(event)
		}

		if ((swipeEdge === "left") && 0 < event.start.x && event.start.x < GestureInputEdgeSwipeDistance) {
			return this.edgeswipedirectionstart(event)
		}
	}

	swipedirection(event: GestureEvent) {
		if (!this.session) { return }
		if (!this.session.started.swipedirection) { return }
		let direction = this.session.started.swipedirection.offsetDirection
		this._dispatchEvent(`swipe${direction}`, event)
		if (this.session.started.edgeswipedirection) { return this.edgeswipedirection(event) }
	}

	swipedirectionend(event: GestureEvent) {
		if (!this.session) { return }
		if (!this.session.started.swipedirection) { return }
		let direction = this.session.started.swipedirection.offsetDirection
		return this._dispatchEvent(`swipe${direction}end`, event)
	}

	// Edge swipe

	edgeswipedirection(event: GestureEvent) {
		if (!this.session) { return }
		if (!this.session.started.edgeswipedirection) { return }
		let swipeEdge = this._edgeForSwipeDirection(this.session.started.edgeswipedirection.offsetDirection)
		Screen.emit("edgeswipe", this._createEvent("edgeswipe", event))
		Screen.emit(`edgeswipe${swipeEdge}` as any, this._createEvent(`edgeswipe${swipeEdge}`, event))
	}

	edgeswipedirectionstart(event: GestureEvent) {
		if (!this.session) { return }
		if (this.session.started.edgeswipedirection) { return }
		this.session.started.edgeswipedirection = event
		let swipeEdge = this._edgeForSwipeDirection(this.session.started.edgeswipedirection.offsetDirection)
		Screen.emit("edgeswipestart", this._createEvent("edgeswipestart", event))
		Screen.emit(`edgeswipe${swipeEdge}start` as any, this._createEvent(`edgeswipe${swipeEdge}start` as any, event))
	}

	edgeswipedirectionend(event: GestureEvent) {
		if (!this.session) { return }
		if (!this.session.started.edgeswipedirection) { return }
		let swipeEdge = this._edgeForSwipeDirection(this.session.started.edgeswipedirection.offsetDirection)
		Screen.emit("edgeswipeend", this._createEvent("edgeswipeend", event))
		Screen.emit(`edgeswipe${swipeEdge}end` as any, this._createEvent(`edgeswipe${swipeEdge}end`, event))
	}


	// Utilities

	_process(event: GestureEvent) {
		if (!this.session) { return }

		this.session.events.push(event)
		event.eventCount = this.session.eventCount++

		// Detect pan events

		// See if there was any movement
		if ((Math.abs(event.delta.x) > 0) || (Math.abs(event.delta.y) > 0)) {
			if (!this.session.started.pan) {
				this.panstart(event)
			} else {
				this.pan(event)
			}
		}

		// Detect pinch, rotate and scale events

		// Stop panning if we go from 2 to 1 finger
		if (this.session.started.pinch && (event.fingers === 1)) {
			this.pinchend(event)
		// If we did not start yet and get two fingers, start
		} else if (!this.session.started.pinch && (event.fingers === 2)) {
			this.pinchstart(event)
		// If we did start send pinch events
		} else if (this.session.started.pinch) {
			this.pinch(event)
		}

		// Detect swipe events

		// If we did not start but moved more then the swipe threshold, start
		if (!this.session.started.swipe && (
			(Math.abs(event.offset.x) > GestureInputSwipeThreshold) ||
			(Math.abs(event.offset.y) > GestureInputSwipeThreshold))) {
				this.swipestart(event)
		// If we did start send swipe events
		} else if (this.session.started.swipe) {
			this.swipe(event)
		}

		return this.session.lastEvent = event
	}

	_getTouchEvent(_event: MouseEvent): WebkitTouchEvent {

		const event = Object.assign(_event, {
			changedTouches: [] as any as TouchList,
			targetTouches: [] as any as TouchList,
			touches: [{
				identifier: Date.now(),
				target: _event.target,
				clientX: _event.pageX,
				clientY: _event.pageX,
				radiusX: 0,
				radiusY: 0,
				rotationAngle: 0,
				force: -1
			}] as any as TouchList,
			charCode: -1,
			keyCode: -1
		})

		return event
	}

	_getGestureEvent(_event: WebkitTouchEvent): GestureEvent {

		// Convert the point to the current context
		// TODO: Handle within layer context, I think

		const eventPoint = this._getTouchPoint(_event, 0)

		Object.assign(_event, {
			time: Date.now(), // Current time √

			point: eventPoint, // Current point √
			start: eventPoint, // Start point √
			previous: eventPoint, // Previous point √

			offset: {x: 0, y: 0}, // Offset since start √
			offsetTime: 0, // Time since start √
			offsetAngle: 0, // Angle from start √
			offsetDirection: null, // Direction from start (up, down, left, right) √

			delta: {x: 0, y: 0}, // Offset since last event √
			deltaTime: 0, // Time since last event √
			deltaAngle: 0, // Angle from last event √
			deltaDirection: null, // Direction from last event √

			force: 0, // 3d touch or force touch, iOS/Mac only √
			velocity: {x: 0, y: 0}, // Velocity average over the last few events √

			fingers: 0, // Number of fingers used √
			touchCenterStart: {x: 0, y: 0},
			touchCenter: eventPoint, // Center between two fingers √
			touchOffset: {x: 0, y: 0}, // Offset between two fingers √
			touchDistance: 0, // Distance between two fingers √
			scale: 1, // Scale value from two fingers √
			scaleDirection: null, // Direction for scale: up or down √
			rotation: 0 // Rotation value from two fingers √
		})

		// Now we have all the keys, we are a gesture event
		let event = _event as any as GestureEvent

		if (event["touches"]) {
			event.fingers = event["touches"].length
		}

		(event.touches != null ? event.touches.length : undefined) || 0

		// Properties relative to a start event
		if (this.session && this.session.startEvent) {
			event.start = this.session.startEvent.point
			event.offset = Utils.point.subtract(event.point, event.start)
			event.offsetTime = event.time - this.session.startEvent.time
			event.offsetAngle = Utils.point.angle(this.session.startEvent.point, event.point)
			event.offsetDirection = this._getDirection(event.offset)
			event.touchCenterStart = this.session.startEvent.touchCenter
		}

		// Properties relative to the previous event
		if (this.session && this.session.lastEvent) {
			event.previous = this.session.lastEvent.point
			event.deltaTime = event.time - this.session.lastEvent.time
			event.delta = Utils.point.subtract(event.point, this.session.lastEvent.point)
			event.deltaAngle = Utils.point.angle(event.point, this.session.lastEvent.point)
			event.deltaDirection = this._getDirection(event.delta)
		}

		// Properties related to multi touch
		if (event.fingers > 1) {
			let touchPointA = this._getTouchPoint(event, 0)
			let touchPointB = this._getTouchPoint(event, 1)
			event.touchCenter = Utils.point.center(touchPointB, touchPointA)
			event.touchOffset = Utils.point.subtract(touchPointB, touchPointA)
			event.touchDistance = _.max([GestureInputMinimumFingerDistance, Utils.point.distance(touchPointA, touchPointB)])
			event.rotation = Utils.point.angle(touchPointA, touchPointB)
		}

		// Special cases

		// Velocity
		if (this.session && this.session.events) {
			let events = _.filter(this.session.events, (e) => {
				if (e.eventCount === 0) { return false }
				return e.time > (event.time - (GestureInputVelocityTime * 1000))
			})

			event.velocity = this._getVelocity(events)
		}

		// Scale can only be set after we started a pinch session
		if (this.session && this.session.started.pinch) {

			event.scale = event.touchDistance / this.session.started.pinch.touchDistance

			if (this.session && this.session.lastEvent) {
				event.scaleDirection = this._getScaleDirection(event.scale - this.session.lastEvent.scale)

				// If this is a pinch end event, there was no movement so we use the last one
				if (!event.scaleDirection) {
					event.scaleDirection = this.session.lastEvent.scaleDirection
				}
			}
		}

		// For delta we switch to center-compare if there are two fingers
		if (this.session && this.session.lastEvent) {
			// If we just switched fingers, we skip the delta event entirely
			if (event.fingers !== this.session.lastEvent.fingers && this.session.lastEvent.fingers === 2) {
				event.delta = {x: 0, y: 0}
			}
			// If we are having two finger events, we use the touchCenter as base for delta
			if ((event.fingers === 2) && (this.session.lastEvent.fingers === 2)) {
				event.delta = Utils.point.subtract(event.touchCenter, this.session.lastEvent.touchCenter)
			}
		}

		// Force touch
		if (this.session && this.session.lastEvent) {
			if (this.session.force) {
				event.force = this.session.force
			}
		}

		// Convert point style event properties to dom style:
		// event.delta -> event.deltaX, event.deltaY
		// const __event = event as any

		// for (let pointKey of ["point", "start", "previous", "offset", "delta", "velocity", "touchCenter", "touchOffset"]) {
		// 	if (!_.has(__event, `${pointKey}X`)) { __event[`${pointKey}X`] = __event[pointKey].x }
		// 	if (!_.has(__event, `${pointKey}Y`)) { __event[`${pointKey}Y`] = __event[pointKey].y }
		// }

		return event
	}

	_getTouchPoint(event: WebkitTouchEvent, index: number): Types.Point {

		if (!event.touches[index]) {
			return Utils.point.zero()
		}

		return {
			x: event.touches[index].pageX,
			y: event.touches[index].pageY
		}
	}

	_getDirection(offset: Types.Point) {
		if (Math.abs(offset.x) > Math.abs(offset.y)) {
			if (offset.x > 0) { return "right" }
			if (offset.x < 0) { return "left" }
		}
		if (Math.abs(offset.x) < Math.abs(offset.y)) {
			if (offset.y < 0) { return "up" }
			if (offset.y > 0) { return "down" }
		}
		return null
	}

	_edgeForSwipeDirection(direction: Types.Direction | null): null | Types.Edge {
		if (direction === "down") { return "top" }
		if (direction === "left") { return "right" }
		if (direction === "up") { return "bottom" }
		if (direction === "right") { return "left" }
		return null
	}

	_getScaleDirection(offset: number): null | Types.VerticalDirection {
		if (offset > 0) { return "up" }
		if (offset < 0) { return "down" }
		return null
	}

	_createEvent(type: string, _event: GestureEvent | WebkitTouchEvent | MouseEvent) {

		let event = _event as any
		let touchEvent = document.createEvent("MouseEvent") as any


		touchEvent.initMouseEvent(type, true, true, window,
			event.detail, event.screenX, event.screenY,
			event.clientX, event.clientY,
			event.ctrlKey, event.shiftKey, event.altKey, event.metaKey,
			event.button, event.relatedTarget) as any as WebkitTouchEvent

		touchEvent.touches = event["touches"]
		touchEvent.changedTouches = event["touches"]
		touchEvent.targetTouches = event["touches"]

		// for (let k in event) {
		// 	let v = event[k]
		// 	touchEvent[k] = v
		// }

		return touchEvent as WebkitTouchEvent
	}

	_dispatchEvent(
		type: string,
		event: GestureEvent,
		target: EventTarget | null = null) {

		let touchEvent = this._createEvent(type, event as any as MouseEvent)

		// By default we want to send the event to the target at the beginning
		// of this session, so we catch tap ends etc when the mouse is released
		// outside of the original target.
		if (target == null && this.session && this.session.startEvent && this.session.startEvent.target) {
			target = this.session.startEvent.target
		}

		if (target == null) {
			target = event.target
		}

		console.log("_dispatchEvent", type, target, touchEvent)

		target.dispatchEvent(touchEvent)
	}

	_getVelocity(events: GestureEvent[]) {

		if (events.length < 2) { return {x: 0, y: 0} }

		let current = events[events.length - 1]
		let first = events[0]
		let time = current.time - first.time

		let velocity = {
			x: (current.point.x - first.point.x) / time,
			y: (current.point.y - first.point.y) / time
		}

		if (velocity.x === Infinity) { velocity.x = 0 }
		if (velocity.y === Infinity) { velocity.y = 0 }

		return velocity
	}
}