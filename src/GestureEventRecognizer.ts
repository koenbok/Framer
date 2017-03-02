import * as Types from "Types"
import * as Utils from "Utils"

import { DOMEventManager } from "DOMEventManager"
import { Context } from "Context"


let GestureInputLongPressTime = 0.5;
let GestureInputDoubleTapTime = 0.25;
let GestureInputSwipeThreshold = 30;
let GestureInputEdgeSwipeDistance = 30;
let GestureInputVelocityTime = 0.1;
let GestureInputForceTapDesktop = MouseEvent["WEBKIT_FORCE_AT_FORCE_MOUSE_DOWN"]
let GestureInputForceTapMobile = 0.7;
let GestureInputForceTapMobilePollTime = 1/30;
let GestureInputMinimumFingerDistance = 30;

// import { DOMEventManager } from "DOMEventManager";



interface GestureEvent extends TouchEvent {

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
	touchOffset: Types.Point // Offset between two fingers √
	touchDistance: number // Distance between two fingers √
	scale: number // Scale value from two fingers √
	scaleDirection: Types.VerticalDirection // Direction for scale: up or down √
	rotation: Types.Rotation

}

interface GestureEventSession {
	startEvent: GestureEvent
	lastEvent: null | GestureEvent,
	startMultiEvent: null,
	startTime: number,
	pressTimer: number,
	started: {},
	events: GestureEvent[],
	eventCount: number
}

export class GestureEventRecognizer {

	session: null | GestureEventSession
	em = new DOMEventManager()
	doubleTapTime?: number

	constructor() {
		// this.startMouse = this.startMouse.bind(this);
		// this.startTouch = this.startTouch.bind(this);
		// this.touchstart = this.touchstart.bind(this);
		// this.touchmove = this.touchmove.bind(this);
		// this.touchend = this.touchend.bind(this);
		// this.reset = this.reset.bind(this);
		// this.tap = this.tap.bind(this);
		// this.tapstart = this.tapstart.bind(this);
		// this.tapend = this.tapend.bind(this);
		// this.doubletap = this.doubletap.bind(this);
		// this.longpressstart = this.longpressstart.bind(this);
		// this.longpressend = this.longpressend.bind(this);
		// this._updateTouchForce = this._updateTouchForce.bind(this);
		// this._updateMacForce = this._updateMacForce.bind(this);
		// this.forcetapchange = this.forcetapchange.bind(this);
		// this.forcetapstart = this.forcetapstart.bind(this);
		// this.forcetapend = this.forcetapend.bind(this);
		// this.panstart = this.panstart.bind(this);
		// this.pan = this.pan.bind(this);
		// this.panend = this.panend.bind(this);
		// this.panup = this.panup.bind(this);
		// this.pandown = this.pandown.bind(this);
		// this.panleft = this.panleft.bind(this);
		// this.panright = this.panright.bind(this);
		// this.pinchstart = this.pinchstart.bind(this);
		// this.pinch = this.pinch.bind(this);
		// this.pinchend = this.pinchend.bind(this);
		// this.scalestart = this.scalestart.bind(this);
		// this.scale = this.scale.bind(this);
		// this.scaleend = this.scaleend.bind(this);
		// this.rotatestart = this.rotatestart.bind(this);
		// this.rotate = this.rotate.bind(this);
		// this.rotateend = this.rotateend.bind(this);
		// this.swipestart = this.swipestart.bind(this);
		// this.swipe = this.swipe.bind(this);
		// this.swipeend = this.swipeend.bind(this);
		// this.swipedirectionstart = this.swipedirectionstart.bind(this);
		// this.swipedirection = this.swipedirection.bind(this);
		// this.swipedirectionend = this.swipedirectionend.bind(this);
		// this.edgeswipedirection = this.edgeswipedirection.bind(this);
		// this.edgeswipedirectionstart = this.edgeswipedirectionstart.bind(this);
		// this.edgeswipedirectionend = this.edgeswipedirectionend.bind(this);
		// this._process = this._process.bind(this);

		this.em.wrap(window).addEventListener("mousedown", this.startMouse);
		this.em.wrap(window).addEventListener("touchstart", this.startTouch);

	}

	destroy() {
		// TODO
		// return this.em.removeAllListeners();
	}

	cancel() {
		if (!this.session) { return }
		window.clearTimeout(this.session.pressTimer)
		this.session = null
	}

	startMouse = (event) => {
		if (this.session) { return; }
		this.em.wrap(window).addEventListener("mousemove", this.touchmove);
		this.em.wrap(window).addEventListener("mouseup", this.touchend);
		this.touchstart(event);
	}

	startTouch = (event) => {
		if (this.session) { return; }
		this.em.wrap(window).addEventListener("touchmove", this.touchmove);
		this.em.wrap(window).addEventListener("touchend", this.touchend);
		this.touchstart(event);
	}

	touchstart = (event: TouchEvent) => {

		// Only fire if we are not already in a session
		if (this.session) { return; }

		this.em.wrap(window).addEventListener("webkitmouseforcechanged", this._updateMacForce);

		this.session = {
			startEvent: this._getGestureEvent(event),
			lastEvent: null,
			startMultiEvent: null,
			startTime: Date.now(),
			pressTimer: window.setTimeout(this.longpressstart, GestureInputLongPressTime * 1000),
			started: {},
			events: [],
			eventCount: 0
		};

		event = this._getGestureEvent(event);

		this.tapstart(event);

		if ((Date.now() - this.doubleTapTime) < (GestureInputDoubleTapTime * 1000)) {
			this.doubletap(event);
		} else {
			this.doubleTapTime = Date.now();
		}

		this._process(event);
		if (Utils.isTouch()) { return this._updateTouchForce(); }
	}

	touchmove(event) {
		return this._process(this._getGestureEvent(event));
	}

	touchend(event) {

		// Only fire if there are no fingers left on the screen

		if (event.touches != null) {
			if (Utils.isTouch()) {
				if (event.touches.length !== 0) { return; }
			} else {
				if (event.touches.length !== event.changedTouches.length) { return; }
			}
		}

		this.em.wrap(window).removeEventListener("mousemove", this.touchmove);
		this.em.wrap(window).removeEventListener("mouseup", this.touchend);
		this.em.wrap(window).removeEventListener("touchmove", this.touchmove);
		this.em.wrap(window).removeEventListener("touchend", this.touchend);
		this.em.wrap(window).removeEventListener("webkitmouseforcechanged", this._updateMacForce);

		event = this._getGestureEvent(event);

		for (let eventName in this.session.started) {
			let value = this.session.started[eventName];
			if (value) { this[`${eventName}end`](event); }
		}

		// We only want to fire a tap event if the original target is the same
		// as the release target, so buttons work the way you expect if you
		// release the mouse outside.
		if (!(this.session != null ? this.session.startEvent : undefined)) {
			this.tap(event);
		} else if (this.session.startEvent.target === event.target) {
			this.tap(event);
		}

		this.tapend(event);
		return this.cancel();
	}

	reset() {
		if (!this.session) { return; }
		return this.touchend(this.session.lastEvent);
	}

	// Tap

	tap(event) { return this._dispatchEvent("tap", event); }
	tapstart(event) { return this._dispatchEvent("tapstart", event); }
	tapend(event) { return this._dispatchEvent("tapend", event); }
	doubletap(event) { return this._dispatchEvent("doubletap", event); }

	// Press

	longpressstart() {
		if (!this.session) { return; }
		if (this.session.started.longpress) { return; }
		let event = this._getGestureEvent(this.session.startEvent);
		this.session.started.longpress = event;
		this._dispatchEvent("longpressstart", event);
		return this._dispatchEvent("longpress", event);
	}

	longpressend(event) {
		return this._dispatchEvent("longpressend", event);
	}

	// ForceTap

	_updateTouchForce() {
		if (!__guard__(__guard__(this.session != null ? this.session.lastEvent : undefined, x1 => x1.touches), x => x.length)) { return; }
		this.session.force = this.session.lastEvent.touches[0].force || 0;
		let event = this._getGestureEvent(this.session.lastEvent);
		this.forcetapchange(event);

		if (this.session.force >= GestureInputForceTapMobile) {
			this.forcetapstart(event);
		} else {
			this.forcetapend(event);
		}

		return setTimeout(this._updateTouchForce, GestureInputForceTapMobilePollTime);
	}

	_updateMacForce(event) {
		if (!this.session) { return; }
		this.session.force = Utils.modulate(event.webkitForce, [0, 3], [0, 1]);
		this.forcetapchange(this._getGestureEvent(event));

		// Trigger a force touch if we reach the desktop threshold
		if (event.webkitForce >= GestureInputForceTapDesktop) {
			return this.forcetapstart(event);
		} else {
			return this.forcetapend(event);
		}
	}

	forcetapchange(event) {
		return this._dispatchEvent("forcetapchange", event);
	}

	forcetapstart(event) {
		if (!this.session) { return; }
		if (this.session.started.forcetap) { return; }
		this.session.started.forcetap = event;
		this._dispatchEvent("forcetapstart", event);
		return this._dispatchEvent("forcetap", event);
	}

	forcetapend(event) {
		if (!this.session) { return; }
		if (!this.session.started.forcetap) { return; }
		this.session.started.forcetap = null;
		return this._dispatchEvent("forcetapend", event);
	}

	// Pan

	panstart(event) {
		this.session.started.pan = event;
		return this._dispatchEvent("panstart", event, this.session.started.pan.target);
	}

	pan(event) {
		this._dispatchEvent("pan", event, this.session.started.pan.target);
		let direction = this._getDirection(event.delta);
		if (direction) { return this[`pan${direction}`](event); }
	}

	panend(event) {
		this._dispatchEvent("panend", event, this.session.started.pan.target);
		return this.session.started.pan = null;
	}

	panup(event) { return this._dispatchEvent("panup", event, this.session.started.pan.target); }
	pandown(event) { return this._dispatchEvent("pandown", event, this.session.started.pan.target); }
	panleft(event) { return this._dispatchEvent("panleft", event, this.session.started.pan.target); }
	panright(event) { return this._dispatchEvent("panright", event, this.session.started.pan.target); }

	// Pinch

	pinchstart(event) {
		this.session.started.pinch = event;
		this.scalestart(event, this.session.started.pinch.target);
		this.rotatestart(event, this.session.started.pinch.target);
		return this._dispatchEvent("pinchstart", event);
	}

	pinch(event) {
		this._dispatchEvent("pinch", event);
		this.scale(event, this.session.started.pinch.target);
		return this.rotate(event, this.session.started.pinch.target);
	}

	pinchend(event) {
		this._dispatchEvent("pinchend", event);
		this.scaleend(event, this.session.started.pinch.target);
		this.rotateend(event, this.session.started.pinch.target);
		return this.session.started.pinch = null;
	}


	scalestart(event) { return this._dispatchEvent("scalestart", event); }
	scale(event) { return this._dispatchEvent("scale", event); }
	scaleend(event) { return this._dispatchEvent("scaleend", event); }

	rotatestart(event) { return this._dispatchEvent("rotatestart", event); }
	rotate(event) { return this._dispatchEvent("rotate", event); }
	rotateend(event) { return this._dispatchEvent("rotateend", event); }

	// Swipe

	swipestart(event) {
		this._dispatchEvent("swipestart", event);
		this.session.started.swipe = event;
		return this.swipedirectionstart(event);
	}

	swipe(event) {
		this._dispatchEvent("swipe", event);
		return this.swipedirection(event);
	}

	swipeend(event) {
		return this._dispatchEvent("swipeend", event);
	}

	// Direction swipe

	swipedirectionstart(event) {
		if (!event.offsetDirection) { return; }
		if (this.session.started.swipedirection) { return; }
		this.session.started.swipedirection = event;
		let direction = this.session.started.swipedirection.offsetDirection;
		this._dispatchEvent(`swipe${direction}start`, event);

		let swipeEdge = this._edgeForSwipeDirection(direction);

		if ((swipeEdge === "top") && 0 < event.start.y && event.start.y < GestureInputEdgeSwipeDistance) {
			this.edgeswipedirectionstart(event);
		}
		if ((swipeEdge === "right") && Screen.width - GestureInputEdgeSwipeDistance < event.start.x && event.start.x < Screen.width) {
			this.edgeswipedirectionstart(event);
		}
		if ((swipeEdge === "bottom") && Screen.height - GestureInputEdgeSwipeDistance < event.start.y && event.start.y < Screen.height) {
			this.edgeswipedirectionstart(event);
		}
		if ((swipeEdge === "left") && 0 < event.start.x && event.start.x < GestureInputEdgeSwipeDistance) {
			return this.edgeswipedirectionstart(event);
		}
	}

	swipedirection(event) {
		if (!this.session.started.swipedirection) { return; }
		let direction = this.session.started.swipedirection.offsetDirection;
		this._dispatchEvent(`swipe${direction}`, event);
		if (this.session.started.edgeswipedirection) { return this.edgeswipedirection(event); }
	}

	swipedirectionend(event) {
		if (!this.session.started.swipedirection) { return; }
		let direction = this.session.started.swipedirection.offsetDirection;
		return this._dispatchEvent(`swipe${direction}end`, event);
	}

	// Edge swipe

	edgeswipedirection(event) {
		let swipeEdge = this._edgeForSwipeDirection(this.session.started.edgeswipedirection.offsetDirection);
		Screen.emit("edgeswipe", this._createEvent("edgeswipe", event));
		return Screen.emit(`edgeswipe${swipeEdge}`, this._createEvent(`edgeswipe${swipeEdge}`, event));
	}

	edgeswipedirectionstart(event) {
		if (this.session.started.edgeswipedirection) { return; }
		this.session.started.edgeswipedirection = event;
		let swipeEdge = this._edgeForSwipeDirection(this.session.started.edgeswipedirection.offsetDirection);
		Screen.emit("edgeswipestart", this._createEvent("edgeswipestart", event));
		return Screen.emit(`edgeswipe${swipeEdge}start`, this._createEvent(`edgeswipe${swipeEdge}start`, event));
	}

	edgeswipedirectionend(event) {
		let swipeEdge = this._edgeForSwipeDirection(this.session.started.edgeswipedirection.offsetDirection);
		Screen.emit("edgeswipeend", this._createEvent("edgeswipeend", event));
		return Screen.emit(`edgeswipe${swipeEdge}end`, this._createEvent(`edgeswipe${swipeEdge}end`, event));
	}


	// Utilities

	_process(event) {
		if (!this.session) { return; }

		this.session.events.push(event);
		event.eventCount = this.session.eventCount++;

		// Detect pan events

		// See if there was any movement
		if ((Math.abs(event.delta.x) > 0) || (Math.abs(event.delta.y) > 0)) {
			if (!this.session.started.pan) {
				this.panstart(event);
			} else {
				this.pan(event);
			}
		}

		// Detect pinch, rotate and scale events

		// Stop panning if we go from 2 to 1 finger
		if (this.session.started.pinch && (event.fingers === 1)) {
			this.pinchend(event);
		// If we did not start yet and get two fingers, start
		} else if (!this.session.started.pinch && (event.fingers === 2)) {
			this.pinchstart(event);
		// If we did start send pinch events
		} else if (this.session.started.pinch) {
			this.pinch(event);
		}

		// Detect swipe events

		// If we did not start but moved more then the swipe threshold, start
		if (!this.session.started.swipe && (
			(Math.abs(event.offset.x) > GestureInputSwipeThreshold) ||
			(Math.abs(event.offset.y) > GestureInputSwipeThreshold))) {
				this.swipestart(event);
		// If we did start send swipe events
		} else if (this.session.started.swipe) {
			this.swipe(event);
		}

		return this.session.lastEvent = event;
	}

	_getEventPoint(event) {
		if (event.touches != null ? event.touches.length : undefined) { return this._getTouchPoint(event, 0); }
		return {x: event.pageX, y: event.pageY};
	}

	_getGestureEvent(event: TouchEvent): GestureEvent {

		// Convert the point to the current context
		let eventPoint = Utils.convertPointFromContext(
			this._getEventPoint(event), Framer.CurrentContext, true, true);

		Object.assign(event, {
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

			fingers: (event.touches != null ? event.touches.length : undefined) || 0, // Number of fingers used √
			touchCenter: eventPoint, // Center between two fingers √
			touchOffset: {x: 0, y: 0}, // Offset between two fingers √
			touchDistance: 0, // Distance between two fingers √
			scale: 1, // Scale value from two fingers √
			scaleDirection: null, // Direction for scale: up or down √
			rotation: 0
		}
		); // Rotation value from two fingers √

		// Properties relative to a start event
		if (this.session != null ? this.session.startEvent : undefined) {
			event.start = this.session.startEvent.point;
			event.offset = Utils.pointSubtract(event.point, event.start);
			event.offsetTime = event.time - this.session.startEvent.time;
			event.offsetAngle = Utils.pointAngle(this.session.startEvent.point, event.point);
			event.offsetDirection = this._getDirection(event.offset);
			event.touchCenterStart = this.session.startEvent.touchCenter;
		}

		// Properties relative to the previous event
		if (this.session != null ? this.session.lastEvent : undefined) {
			event.previous = this.session.lastEvent.point;
			event.deltaTime = event.time - this.session.lastEvent.time;
			event.delta = Utils.pointSubtract(event.point, this.session.lastEvent.point);
			event.deltaAngle = Utils.pointAngle(event.point, this.session.lastEvent.point);
			event.deltaDirection = this._getDirection(event.delta);
		}

		// Properties related to multi touch
		if (event.fingers > 1) {
			let touchPointA = this._getTouchPoint(event, 0);
			let touchPointB = this._getTouchPoint(event, 1);
			event.touchCenter = Utils.pointCenter(touchPointB, touchPointA);
			event.touchOffset = Utils.pointSubtract(touchPointB, touchPointA);
			event.touchDistance = _.max([GestureInputMinimumFingerDistance, Utils.pointDistance(touchPointA, touchPointB)]);
			event.rotation = Utils.pointAngle(touchPointA, touchPointB);
		}

		// Special cases

		// Velocity
		if (this.session != null ? this.session.events : undefined) {
			let events = _.filter(this.session.events, function(e) {
				if (e.eventCount === 0) { return false; }
				return e.time > (event.time - (GestureInputVelocityTime * 1000));
			});

			event.velocity = this._getVelocity(events);
		}

		// Scale can only be set after we started a pinch session
		if (this.session != null ? this.session.started.pinch : undefined) {
			event.scale = event.touchDistance / this.session.started.pinch.touchDistance;
			event.scaleDirection = this._getScaleDirection(event.scale - this.session.lastEvent.scale);

			// If this is a pinch end event, there was no movement so we use the last one
			if (!event.scaleDirection && (this.session != null ? this.session.lastEvent : undefined)) {
				event.scaleDirection = this.session.lastEvent.scaleDirection;
			}
		}

		// For delta we switch to center-compare if there are two fingers
		if (this.session != null ? this.session.lastEvent : undefined) {
			// If we just switched fingers, we skip the delta event entirely
			if (event.fingers !== this.session.lastEvent.fingers && this.session.lastEvent.fingers === 2) {
				event.delta = {x: 0, y: 0};
			}
			// If we are having two finger events, we use the touchCenter as base for delta
			if ((event.fingers === 2) && (this.session.lastEvent.fingers === 2)) {
				event.delta = Utils.pointSubtract(event.touchCenter, this.session.lastEvent.touchCenter);
			}
		}

		// Force touch
		if (this.session != null ? this.session.lastEvent : undefined) {
			if (this.session.force) {
				event.force = this.session.force;
			}
		}

		// Convert point style event properties to dom style:
		// event.delta -> event.deltaX, event.deltaY
		for (let pointKey of ["point", "start", "previous", "offset", "delta", "velocity", "touchCenter", "touchOffset"]) {
			event[`${pointKey}X`] = event[pointKey].x;
			event[`${pointKey}Y`] = event[pointKey].y;
		}

		return event;
	}

	_getTouchPoint(event, index) {
		let point;
		return point = {
			x: event.touches[index].pageX,
			y: event.touches[index].pageY
		};
	}

	_getDirection(offset) {
		if (Math.abs(offset.x) > Math.abs(offset.y)) {
			if (offset.x > 0) { return "right"; }
			if (offset.x < 0) { return "left"; }
		}
		if (Math.abs(offset.x) < Math.abs(offset.y)) {
			if (offset.y < 0) { return "up"; }
			if (offset.y > 0) { return "down"; }
		}
		return null;
	}

	_edgeForSwipeDirection(direction) {
		if (direction === "down") { return "top"; }
		if (direction === "left") { return "right"; }
		if (direction === "up") { return "bottom"; }
		if (direction === "right") { return "left"; }
		return null;
	}

	_getScaleDirection(offset) {
		if (offset > 0) { return "up"; }
		if (offset < 0) { return "down"; }
		return null;
	}

	_createEvent(type, event) {

		let touchEvent = document.createEvent("MouseEvent");
		touchEvent.initMouseEvent(type, true, true, window,
			event.detail, event.screenX, event.screenY,
			event.clientX, event.clientY,
			event.ctrlKey, event.shiftKey, event.altKey, event.metaKey,
			event.button, event.relatedTarget);

		touchEvent.touches = event.touches;
		touchEvent.changedTouches = event.touches;
		touchEvent.targetTouches = event.touches;

		for (let k in event) {
			let v = event[k];
			touchEvent[k] = v;
		}

		return touchEvent;
	}

	_dispatchEvent(type, event, target) {
		let touchEvent = this._createEvent(type, event);
		// By default we want to send the event to the target at the beginning
		// of this session, so we catch tap ends etc when the mouse is released
		// outside of the original target.
		if (target == null) { target = __guard__(this.session != null ? this.session.startEvent : undefined, x => x.target); }
		if (target == null) { ({ target } = event); }
		return target.dispatchEvent(touchEvent);
	}

	_getVelocity(events) {

		if (events.length < 2) { return {x: 0, y: 0}; }

		let current = events[events.length - 1];
		let first = events[0];
		let time = current.time - first.time;

		let velocity = {
			x: (current.point.x - first.point.x) / time,
			y: (current.point.y - first.point.y) / time
		};

		if (velocity.x === Infinity) { velocity.x = 0; }
		if (velocity.y === Infinity) { velocity.y = 0; }

		return velocity;
	}
};

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}