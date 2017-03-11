import * as Utils from "Utils";
import * as Types from "Types";

import { BaseClass } from "BaseClass";
import { Context } from "Context";
import { Layer } from "Layer";

/**
 *
 * @param event Create a touch to add to a TouchEvent
 * @param index
 * @param offset
 */
const createTouch = (event: MouseEvent, index: number, offset: Types.Point = {x: 0, y: 0}) => {
	return {
		index,
		target: event.target,
		pageX: event.pageX - offset.x,
		pageY: event.pageY - offset.y,
		clientX: event.clientX - offset.x,
		clientY: event.clientY - offset.y,
		screenX: event.screenX - offset.x,
		screenY: event.screenY - offset.y
	};
};

const dispatchTouchEvent = (
	type: string,
	target: EventTarget,
	_event: MouseEvent,
	offset?: Types.Point) => {

	if (target == null) { target = _event.target }

	const touchEvent = document.createEvent("MouseEvent")

	const event: any = _event

	touchEvent.initMouseEvent(type, true, true, window,
		event.detail, event.screenX, event.screenY,
		event.clientX, event.clientY,
		event.ctrlKey, event.shiftKey, event.altKey, event.metaKey,
		event.button, event.relatedTarget);

	let touches = [];
	touches.push(createTouch(event, 1));
	if (offset) { touches.push(createTouch(event, 2, offset)); }

	// TODO: Fix the readonly stuff
	const _touchEvent = touchEvent as any
	_touchEvent.touches = _touchEvent.changedTouches = _touchEvent.targetTouches = touches;

	return target.dispatchEvent(touchEvent);
};

let cancelEvent = (event: Event) => {
	event.preventDefault();
	event.stopPropagation();
};

export class TouchEmulator extends BaseClass<null> {

	touchPointerImage = require("base64-image-loader!../extras/images/cursor@2x.png");
	touchPointerImageActive = require("base64-image-loader!../extras/images/cursor-active@2x.png");
	touchPointerImageSize = 64;
	touchPointerInitialOffset = {x: 0, y: 0};

	keyPinchCode = 18; // Alt
	keyPanCode = 91; // Command

	context = new Context("TouchEmulator");

	isMouseDown = false;
	isPinchKeyDown = false;
	isPanKeyDown = false;

	touchPointLayer: Layer

	target: EventTarget | null = null
	point: Types.Point | null = null
	startPoint: Types.Point | null = null
	centerPoint: Types.Point | null = null
	touchPoint: Types.Point | null = null
	touchPointDelta: Types.Point | null = null

	constructor() {

		super()

		// this.context._element.style.zIndex = "10000"


		// this.keydown = this.keydown.bind(this);
		// this.keyup = this.keyup.bind(this);
		// this.mousedown = this.mousedown.bind(this);
		// this.mousemove = this.mousemove.bind(this);
		// this.mouseup = this.mouseup.bind(this);
		// this.mouseout = this.mouseout.bind(this);
		// this.mousemovePosition = this.mousemovePosition.bind(this);



		document.addEventListener("mousedown", this.mousedown, true);
		document.addEventListener("mousemove", this.mousemove, true);
		document.addEventListener("mouseup", this.mouseup, true);
		document.addEventListener("keydown", this.keydown, true);
		document.addEventListener("keyup", this.keyup, true);
		document.addEventListener("mouseout", this.mouseout, true);



		let { touchPointerInitialOffset } = this;

		this.context.run(() => {
			this.touchPointLayer = new Layer({
				width: this.touchPointerImageSize,
				height: this.touchPointerImageSize,
				backgroundColor: null,
				opacity: 0
			});
			return this.touchPointLayer.style.backgroundImage = this.touchPointerImage;
		}
		);
	}

	destroy() {
		this.context.reset();
	}

	// Event handlers

	keydown = (event: KeyboardEvent) => {

		if (!this.point) {
			return
		}

		if (event.keyCode === this.keyPinchCode) {
			this.isPinchKeyDown = true;
			this.startPoint = this.centerPoint = null;
			this.showTouchCursor();
			this.touchPointLayer.midX = this.point.x;
			this.touchPointLayer.midY = this.point.y;
		}

		if (event.keyCode === this.keyPanCode) {
			this.isPanKeyDown = true;
			return cancelEvent(event);
		}
	}

	keyup = (event: KeyboardEvent) => {

		if (event.keyCode === this.keyPinchCode) {
			cancelEvent(event);
			this.isPinchKeyDown = false;
			this.hideTouchCursor();
		}

		if (event.keyCode === this.keyPanCode) {
			cancelEvent(event);
			if (this.touchPoint && this.point) {
				this.centerPoint = Utils.point.center(this.touchPoint, this.point);
				return this.isPanKeyDown = false;
			}
		}
	}


	mousedown = (event: MouseEvent) => {

		// cancelEvent(event)

		this.isMouseDown = true;
		this.target = event.target;

		if (this.isPinchKeyDown && this.touchPointDelta) {
			dispatchTouchEvent("touchstart", this.target, event, this.touchPointDelta);
		} else {
			dispatchTouchEvent("touchstart", this.target, event);
		}

		return this.touchPointLayer.style.backgroundImage = this.touchPointerImageActive;
	}

	mousemove = (event: MouseEvent) => {

		this.point = {
			x: event.pageX,
			y: event.pageY
		};

		// cancelEvent(event)

		if (this.startPoint == null) { this.startPoint = this.point; }
		if (this.centerPoint == null) { this.centerPoint = this.point; }

		if (this.isPinchKeyDown && !this.isPanKeyDown) {
			if (this.touchPointerInitialOffset && this.centerPoint) {
				this.touchPoint = Utils.point.add(this.touchPointerInitialOffset, this.pinchPoint(this.point, this.centerPoint));
				this.touchPointDelta = Utils.point.subtract(this.point, this.touchPoint);
			}
		}

		if (this.isPinchKeyDown && this.isPanKeyDown) {
			if (this.touchPoint && this.touchPointDelta) {
				this.touchPoint = this.panPoint(this.point, this.touchPointDelta);
			}
		}

		if (this.isPinchKeyDown || this.isPanKeyDown) {
			if (this.touchPoint) {
				this.touchPointLayer.visible = true;
				this.touchPointLayer.midX = this.touchPoint.x;
				this.touchPointLayer.midY = this.touchPoint.y;
			}
		}

		if (this.isMouseDown && this.target) {
			if ((this.isPinchKeyDown || this.isPanKeyDown) && this.touchPointDelta) {
				return dispatchTouchEvent("touchmove", this.target, event, this.touchPointDelta);
			} else {
				return dispatchTouchEvent("touchmove", this.target, event);
			}
		}
	}

	mouseup = (event: MouseEvent) => {

		// cancelEvent(event)

		if (!this.target) { return }

		if (this.touchPointDelta && (this.isPinchKeyDown || this.isPanKeyDown)) {
			dispatchTouchEvent("touchend", this.target, event, this.touchPointDelta);
		} else {
			dispatchTouchEvent("touchend", this.target, event);
		}

		return this.endMultiTouch();
	}

	mouseout = (event: MouseEvent) => {

		if (this.isMouseDown) { return; }

		let fromElement: Node = (event.relatedTarget || event.toElement) as any;

		if (!fromElement || (fromElement.nodeName === "HTML")) {
			return this.endMultiTouch();
		}
	}

	// Utilities

	showTouchCursor() {

		// If the mouse did not move yet, we capture the point here
		// if (!this.point) {
		// 	this.point = {
		// 		x: event.pageX,
		// 		y: event.pageY
		// 	};
		// }

		if (!this.point) {
			return
		}

		this.touchPointLayer.animateStop();
		this.touchPointLayer.midX = this.point.x;
		this.touchPointLayer.midY = this.point.y;
		// this.touchPointLayer.scale = 1.8;
		return this.touchPointLayer.animate({
			opacity: 1,
			scale: 1,
			// midX: @point.x + @touchPointerInitialOffset.x
			// midY: @point.y + @touchPointerInitialOffset.y
			// options: {
			// 	time: 0.1,
			// 	curve: "ease-out"
			// }
		});
	}

	hideTouchCursor() {
		if (this.touchPointLayer.opacity <= 0) { return; }
		this.touchPointLayer.animateStop();
		this.touchPointLayer.animate({
			opacity: 0,
			scale: 1.2,
			// options: {
			// 	time: 0.08
			// }
		});
	}

	mousemovePosition(event: MouseEvent) {
		this.point = {
			x: event.pageX,
			y: event.pageY
		};
	}

	endMultiTouch() {
		this.isMouseDown = false;
		this.touchPointLayer.style.backgroundImage = this.touchPointerImage;
		return this.hideTouchCursor();
	}

	pinchPoint(point: Types.Point, centerPoint: Types.Point) {
		return Utils.point.subtract(centerPoint, Utils.point.subtract(point, centerPoint));
	}

	panPoint(point: Types.Point, offsetPoint: Types.Point) {
		return Utils.point.subtract(point, offsetPoint);
	}
}

// let touchEmulator = null;

// export function enable() {
// 	if (Utils.isTouch()) { return; }
// 	if (touchEmulator == null) { touchEmulator = new TouchEmulator(); }
// 	return Events.enableEmulatedTouchEvents(true);
// }

// export function disable() {
// 	if (!touchEmulator) { return; }
// 	touchEmulator.destroy();
// 	touchEmulator = null;
// 	return Events.enableEmulatedTouchEvents(false);
// }

// // resets the emulator, useful if the webview can loose/regain focus without being aware
// // in such scenarios it can miss mouseup, mouseout events and such
// // it can also be fixed by checking event.buttons in mousemove, but that is not available on safari
// export function reset() {
// 	if (!touchEmulator) { return; }
// 	return touchEmulator.endMultiTouch();
// }
