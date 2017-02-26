import Utils from "./Utils";

import { BaseClass } from "./BaseClass";
import { Events } from "./Events";
import { Gestures } from "./Gestures";

Events.PinchStart = "pinchstart";
Events.Pinch = "pinch";
Events.PinchEnd = "pinchend";
Events.RotateStart = "rotatestart";
Events.Rotate = "rotate";
Events.RotateEnd = "rotateend";
Events.ScaleStart = "scalestart";
Events.Scale = "scale";
Events.ScaleEnd = "scaleend";


export let LayerPinchable = class LayerPinchable extends BaseClass {
	static initClass() {
	
		this.define("enabled", this.simpleProperty("enabled", true));
		this.define("threshold", this.simpleProperty("threshold", 0));
		this.define("centerOrigin", this.simpleProperty("centerOrigin", true));
	
		this.define("scale", this.simpleProperty("scale", true));
		this.define("scaleIncrements", this.simpleProperty("scaleIncrements", 0));
		this.define("minScale", this.simpleProperty("minScale", 0));
		this.define("maxScale", this.simpleProperty("maxScale", Number.MAX_VALUE));
		this.define("scaleFactor", this.simpleProperty("scaleFactor", 1));
	
		this.define("rotate", this.simpleProperty("rotate", true));
		this.define("rotateIncrements", this.simpleProperty("rotateIncrements", 0));
		this.define("rotateMin", this.simpleProperty("rotateMin", 0));
		this.define("rotateMax", this.simpleProperty("rotateMax", 0));
		this.define("rotateFactor", this.simpleProperty("rotateFactor", 1));
	}

	constructor(layer) {
		this._centerOrigin = this._centerOrigin.bind(this);
		this._pinchStart = this._pinchStart.bind(this);
		this._pinch = this._pinch.bind(this);
		this._pinchEnd = this._pinchEnd.bind(this);
		this.layer = layer;
		super(...arguments);
		this._attach();
	}

	_attach() {
		this.layer.on(Gestures.PinchStart, this._pinchStart);
		this.layer.on(Gestures.Pinch, this._pinch);
		this.layer.on(Gestures.PinchEnd, this._pinchEnd);
		return this.layer.on(Gestures.TapStart, this._tapStart);
	}

	_reset() {
		this._scaleStart = null;
		this._rotationStart = null;
		return this._rotationOffset = null;
	}

	_tapStart(event) {}
		//@_centerOrigin(event) if @centerOrigin

	_centerOrigin(event) {

		let topInSuperBefore = Utils.convertPoint({}, this.layer, this.layer.superLayer);
		let pinchLocation = Utils.convertPointFromContext(event.touchCenter, this.layer, true, true);
		this.layer.originX = pinchLocation.x / this.layer.width;
		this.layer.originY = pinchLocation.y / this.layer.height;

		let topInSuperAfter = Utils.convertPoint({}, this.layer, this.layer.superLayer);
		let originDelta = {
			x: topInSuperAfter.x - topInSuperBefore.x,
			y: topInSuperAfter.y - topInSuperBefore.y
		};

		this.layer.x -= originDelta.x;
		return this.layer.y -= originDelta.y;
	}

	_pinchStart(event) {
		this._reset();
		if (this.centerOrigin) { this._centerOrigin(event); }
		return this.normalizeRotation = Utils.rotationNormalizer();
	}

	_pinch(event) {

		if (event.fingers !== 2) { return; }
		if (!this.enabled) { return; }

		let pointA = {
			x: event.touches[0].pageX,
			y: event.touches[0].pageY
		};

		let pointB = {
			x: event.touches[1].pageX,
			y: event.touches[1].pageY
		};

		if (Utils.pointTotal(Utils.pointAbs(Utils.pointSubtract(pointA, pointB))) <= this.threshold) { return; }

		if (this.scale) {
			if (this._scaleStart == null) { this._scaleStart = this.layer.scale; }
			let scale = (((event.scale - 1) * this.scaleFactor) + 1) * this._scaleStart;

			if (this.minScale && this.maxScale) {
				scale = Utils.clamp(scale, this.minScale, this.maxScale);
			} else if (this.minScale) {
				scale = Utils.clamp(scale, this.minScale, 1000000);
			} else if (this.maxScale) {
				scale = Utils.clamp(scale, 0.00001, this.maxScale);
			}

			if (this.scaleIncrements) { scale = Utils.nearestIncrement(scale, this.scaleIncrements); }
			this.layer.scale = scale;
			this.emit(Events.Scale, event);
		}

		if (this.rotate) {
			if (this._rotationStart == null) { this._rotationStart = this.layer.rotation; }
			if (this._rotationOffset == null) { this._rotationOffset = event.rotation; }
			let rotation = (event.rotation - this._rotationOffset) + this._rotationStart;
			rotation = rotation * this.rotateFactor;
			rotation = this.normalizeRotation(rotation);
			if (this.rotateMin && this.rotateMax) { rotation = Utils.clamp(rotation, this.rotateMin, this.rotateMax); }
			if (this.rotateIncrements) { rotation = Utils.nearestIncrement(rotation, this.rotateIncrements); }
			return this.layer.rotation = rotation;
		}
	}

	_pinchEnd(event) {
		return this._reset();
	}
};
undefined.initClass();
