import { _ } from "./Underscore";

import Utils from "./Utils";
import { BaseClass } from "./BaseClass";
import { Events } from "./Events";
import { Simulation } from "./Simulation";
import { Defaults } from "./Defaults";
import { EventBuffer } from "./EventBuffer";
import { Gestures } from "./Gestures";

Events.Move                  = "move";
Events.DragStart             = "dragstart";
Events.DragWillMove          = "dragwillmove";
Events.DragMove              = "dragmove";
Events.DragDidMove           = "dragmove";
Events.Drag                  = "dragmove";
Events.DragEnd               = "dragend";
Events.DragAnimationStart 	 = "draganimationstart";
Events.DragAnimationEnd   	 = "draganimationend";
Events.DirectionLockStart    = "directionlockstart";

// Special cases
Events.DragSessionStart      = "dragsessionstart";
Events.DragSessionMove       = "dragsessionmove";
Events.DragSessionEnd        = "dragsessionend";

// Add deprecated aliases
Events.DragAnimationDidStart = Events.DragAnimationStart;
Events.DragAnimationDidEnd = Events.DragAnimationEnd;
Events.DirectionLockDidStart = Events.DirectionLockStart;

`\

┌──────┐                   │
│      │
│      │  ───────────────▶ │ ◀────▶
│      │
└──────┘                   │

════════  ═════════════════ ═══════

	Drag         Momentum      Bounce
\
`;

export let LayerDraggable = class LayerDraggable extends BaseClass {
	static initClass() {
	
		this.define("speedX", this.simpleProperty("speedX", 1));
		this.define("speedY", this.simpleProperty("speedY", 1));
	
		this.define("horizontal", this.simpleProperty("horizontal", true));
		this.define("vertical", this.simpleProperty("vertical", true));
	
		this.define("momentumVelocityMultiplier", this.simpleProperty("momentumVelocityMultiplier", 800));
		this.define("directionLock", this.simpleProperty("directionLock", true));
		this.define("directionLockThreshold", this.simpleProperty("directionLockThreshold", {x: 10, y: 10}));
		this.define("propagateEvents", this.simpleProperty("propagateEvents", true));
	
		this.define("constraints", {
			get() { return this._constraints; },
			set(value) {
				if (value && _.isObject(value)) {
					value = _.pick(value, ["x", "y", "width", "height"]);
					value = _.defaults(value, {x: 0, y: 0, width: 0, height: 0});
					this._constraints = value;
				} else {
					this._constraints = {x: 0, y: 0, width: 0, height: 0};
				}
				if (this._constraints) { return this._updateSimulationConstraints(this._constraints); }
			}
		}
		);
	
	
		// The isDragging only is true when there was actual movement, so you can
		// use it to determine a click from a drag event.
		this.define("isDragging", {get() { return this._isDragging || false; }});
		this.define("isAnimating", {get() { return this._isAnimating || false; }});
		this.define("isMoving", {get() { return this._isMoving || false; }});
	
		this.define("layerStartPoint", {get() { return this._layerStartPoint || this.layer.point; }});
		this.define("cursorStartPoint", {get() { return this._cursorStartPoint || {x: 0, y: 0}; }});
		this.define("layerCursorOffset", {get() { return this._layerCursorOffset || {x: 0, y: 0}; }});
	
		this.define("offset", {
			get() {
				let offset;
				if (!this._correctedLayerStartPoint) { return {x: 0, y: 0}; }
				return offset = {
					x: this.layer.x - this._correctedLayerStartPoint.x,
					y: this.layer.y - this._correctedLayerStartPoint.y
				};
			}
		}
		);
	
	
		//#############################################################
		// Constraints
	
		this.define("constraintsOffset", {
			get() {
				if (!this.constraints) { return {x: 0, y: 0}; }
				let {minX, maxX, minY, maxY} = this._calculateConstraints(this.constraints);
				let { point } = this.layer;
				let constrainedPoint = {
					x: Utils.clamp(point.x, minX, maxX),
					y: Utils.clamp(point.y, minY, maxY)
				};
				let offset = {
					x: point.x - constrainedPoint.x,
					y: point.y - constrainedPoint.y
				};
				return offset;
			}
		}
		);
	
		this.define("isBeyondConstraints", {
			get() {
				let { constraintsOffset } = this;
				if (constraintsOffset.x !== 0) { return true; }
				if (constraintsOffset.y !== 0) { return true; }
				return false;
			}
		}
		);
	
		//#############################################################
		// Velocity
	
		this.define("velocity", {
			get() {
				if (this.isAnimating) { return this._calculateSimulationVelocity(); }
				return this._eventBuffer.velocity;
				return {x: 0, y: 0};
			}
		});
	
				// return @_eventBuffer.velocity if @isDragging
				// return @_calculateSimulationVelocity() if @isAnimating
				// return {x: 0, y: 0}
	
		this.define("angle",
			{get() { return this._eventBuffer.angle; }});
	
		this.define("direction", {
			get() {
				// return null if not @isDragging
				let { velocity } = this;
				if ((velocity.x === 0) && (velocity.y === 0)) {
					let delta = this._lastEvent != null ? this._lastEvent.delta : undefined;
					if (!delta) { return null; }
					if (Math.abs(delta.x) > Math.abs(delta.y)) {
						if (delta.x > 0) { return "right"; }
						return "left";
					} else {
						if (delta.y > 0) { return "down"; }
						return "up";
					}
				}
				if (Math.abs(velocity.x) > Math.abs(velocity.y)) {
					if (velocity.x > 0) { return "right"; }
					return "left";
				} else {
					if (velocity.y > 0) { return "down"; }
					return "up";
				}
			}
		}
		);
	}

	constructor(layer) {
		this.touchStart = this.touchStart.bind(this);
		this._updateLayerPosition = this._updateLayerPosition.bind(this);
		this._touchStart = this._touchStart.bind(this);
		this._touchMove = this._touchMove.bind(this);
		this._touchEnd = this._touchEnd.bind(this);
		this._onSimulationStep = this._onSimulationStep.bind(this);
		this._onSimulationStop = this._onSimulationStop.bind(this);
		this._stopSimulation = this._stopSimulation.bind(this);
		this.layer = layer;
		let options = Defaults.getDefaults("LayerDraggable", {});

		super(options);

		_.extend(this, options);

		this.enabled = true;

		// TODO: will have to change panRecognizer's horizontal/vertical etc
		// when they are changed on the LayerDraggable
		// @_panRecognizer = new PanRecognizer @eventBuffer

		this._eventBuffer = new EventBuffer;
		this._constraints = null;
		this._ignoreUpdateLayerPosition = true;

		this.attach();
	}

	attach() {
		this.layer.on(Gestures.TapStart, this.touchStart);
		// @layer.on(Gestures.Pan, @_touchMove)
		// @layer.on(Gestures.TapEnd, @_touchEnd)



		this.layer.on("change:x", this._updateLayerPosition);
		return this.layer.on("change:y", this._updateLayerPosition);
	}

	remove() {
		this.layer.off(Gestures.TapStart, this.touchStart);
		this.layer.off(Gestures.Pan, this._touchMove);
		return this.layer.off(Gestures.PanEnd, this._touchEnd);
	}

	updatePosition(point) {
		// Override this to add your own behaviour to the update position
		return point;
	}

	touchStart(event) {
		// We expose this publicly so you can start the dragging from an external event
		// this is for example needed with the slider.
		return this._touchStart(event);
	}

	_updateLayerPosition() {
		// This updates the layer position if it's extrenally changed while
		// a drag is going on at the same time.
		if (this._ignoreUpdateLayerPosition === true) { return; }
		return this._point = this.layer.point;
	}

	_touchStart(event) {

		Events.wrap(document).addEventListener(Gestures.Pan, this._touchMove);
		Events.wrap(document).addEventListener(Gestures.TapEnd, this._touchEnd);

		// Only reset isMoving if this was not animating when we were clicking
		// so we can use it to detect a click versus a drag.
		this._isMoving = this._isAnimating;

		// Stop any animations influencing the position, but no others.
		for (let animation of Array.from(this.layer.animations())) {
			let { properties } = animation;
			if (properties.hasOwnProperty("x") || properties.hasOwnProperty("y")) {
				animation.stop();
			}
		}

		this._stopSimulation();
		this._resetdirectionLock();

		event.preventDefault();
		if (this.propagateEvents === false) { event.stopPropagation(); }

		// Extract the event (mobile may have multiple)
		let touchEvent = Events.touchEvent(event);

		// TODO: we should use the event velocity
		this._eventBuffer.push({
			x: touchEvent.clientX,
			y: touchEvent.clientY,
			t: Date.now()
		});

		// Store original layer position
		this._layerStartPoint = this.layer.point;
		this._correctedLayerStartPoint = this.layer.point;

		// If we are beyond bounds, we need to correct for the scaled clamping from the last drag,
		// hence the 1 / overdragScale
		if (this.constraints && this.bounce) {
			this._correctedLayerStartPoint = this._constrainPosition(
				this._correctedLayerStartPoint, this.constraints, 1 / this.overdragScale);
		}

		// Store start cursor position
		this._cursorStartPoint = {
			x: touchEvent.clientX,
			y: touchEvent.clientY
		};

		// Store cursor/layer offset
		this._layerCursorOffset = {
			x: touchEvent.clientX - this._correctedLayerStartPoint.x,
			y: touchEvent.clientY - this._correctedLayerStartPoint.y
		};

		this._point = this._correctedLayerStartPoint;
		this._ignoreUpdateLayerPosition = false;

		return this.emit(Events.DragSessionStart, event);
	}

	_touchMove(event) {

		if (!this.enabled) { return; }

		// If we started dragging from another event we need to capture some initial values
		if (!this._point) { this.touchStart(event); }

		event.preventDefault();
		if (this.propagateEvents === false) { event.stopPropagation(); }

		let touchEvent = Events.touchEvent(event);
		this._lastEvent = touchEvent;

		this._eventBuffer.push({
			x: touchEvent.clientX,
			y: touchEvent.clientY,
			t: Date.now()
		}); // We don't use timeStamp because it's different on Chrome/Safari

		let point = _.clone(this._point);
		if (this.horizontal) { point.x = this._point.x + (event.delta.x * this.speedX * (1 / this.layer.screenScaleX(false))); }
		if (this.vertical) { point.y = this._point.y + (event.delta.y * this.speedY * (1 / this.layer.screenScaleY(false))); }

		// Save the point for the next update so we have the unrounded, unconstrained value
		this._point = _.clone(point);

		// Constraints and overdrag
		if (this._constraints) { point = this._constrainPosition(point, this._constraints, this.overdragScale); }

		// Direction lock
		if (this.directionLock) {
			if (!this._directionLockEnabledX && !this._directionLockEnabledY) {

				let { offset } = event;
				offset.x = offset.x * this.speedX * (1 / this.layer.canvasScaleX()) * this.layer.scaleX * this.layer.scale;
				offset.y = offset.y * this.speedY * (1 / this.layer.canvasScaleY()) * this.layer.scaleY * this.layer.scale;

				this._updatedirectionLock(offset);
				return;
			} else {
				if (this._directionLockEnabledX) { point.x = this._layerStartPoint.x; }
				if (this._directionLockEnabledY) { point.y = this._layerStartPoint.y; }
			}
		}

		// Update the dragging status
		if ((point.x !== this._layerStartPoint.x) || (point.y !== this._layerStartPoint.y)) {
			if (!this._isDragging) {
				this._isDragging = true;
				this._isMoving = true;
				this.emit(Events.DragStart, event);
			}
		}

		// Move literally means move. If there is no movement, we do not emit.
		if (this.isDragging) {
			this.emit(Events.DragWillMove, event);
		}

		// Align every drag to pixels
		if (this.pixelAlign) {
			if (this.horizontal) { point.x = parseInt(point.x); }
			if (this.vertical) { point.y = parseInt(point.y); }
		}

		// While we update the layer position ourselves, we don't want
		// to trigger the updater for external changes.
		this._ignoreUpdateLayerPosition = true;
		this.layer.point = this.updatePosition(point);
		this._ignoreUpdateLayerPosition = false;

		if (this.isDragging) {
			this.emit(Events.Move, this.layer.point);
			this.emit(Events.DragDidMove, event);
		}

		return this.emit(Events.DragSessionMove, event);
	}

	_touchEnd(event) {

		Events.wrap(document).removeEventListener(Gestures.Pan, this._touchMove);
		Events.wrap(document).removeEventListener(Gestures.TapEnd, this._touchEnd);

		if (this.propagateEvents === false) { event.stopPropagation(); }

		// Start the simulation prior to emitting the DragEnd event.
		// This way, if the user calls layer.animate on DragEnd, the simulation will
		// be canceled by the user's animation (if the user animates x and/or y).
		this._startSimulation();

		this.emit(Events.DragSessionEnd, event);
		if (this._isDragging) { this.emit(Events.DragEnd, event); }

		// Set _isDragging after DragEnd is fired, so that calls to calculateVelocity()
		// still returns dragging velocity - both in case the user calls calculateVelocity(),
		// (which would return a stale value before the simulation had finished one tick)
		// and because @_start currently calls calculateVelocity().
		this._isDragging = false;

		// reset isMoving if not animating, otherwise animation start/stop will reset it
		this._isMoving = this._isAnimating;
		this._ignoreUpdateLayerPosition = true;
		this._lastEvent = null;
		return this._eventBuffer.reset();
	}

	_clampAndScale(value, min, max, scale) {
		// TODO: Move to utils? Combine with clamp?
		if (value < min) { value = min + ((value - min) * scale); }
		if (value > max) { value = max + ((value - max) * scale); }
		return value;
	}

	_calculateConstraints(bounds) {

		let constraints;
		if (!bounds) {
			return constraints = {
				minX: Infinity,
				maxX: Infinity,
				minY: Infinity,
				maxY: Infinity
			};
		}

		// Correct the constraints if the layer size exceeds the constraints
		if (bounds.width < this.layer.width) { bounds.width = this.layer.width; }
		if (bounds.height < this.layer.height) { bounds.height = this.layer.height; }

		//bounds.width = _.max([bounds.width, @layer.width])

		constraints = {
			minX: Utils.frameGetMinX(bounds),
			maxX: Utils.frameGetMaxX(bounds),
			minY: Utils.frameGetMinY(bounds),
			maxY: Utils.frameGetMaxY(bounds)
		};

		// It makes sense to take the dimensions of the object into account
		constraints.maxX -= this.layer.width;
		constraints.maxY -= this.layer.height;

		return constraints;
	}

	_constrainPosition(proposedPoint, bounds, scale) {

		let point;
		let {minX, maxX, minY, maxY} = this._calculateConstraints(this._constraints);

		if (this.overdrag) {
			point = {
				x: this._clampAndScale(proposedPoint.x, minX, maxX, scale),
				y: this._clampAndScale(proposedPoint.y, minY, maxY, scale)
			};
		} else {
			point = {
				x: Utils.clamp(proposedPoint.x, minX, maxX),
				y: Utils.clamp(proposedPoint.y, minY, maxY)
			};
		}

		if ((this.speedX === 0) || (this.horizontal === false)) { point.x = proposedPoint.x; }
		if ((this.speedY === 0) || (this.vertical   === false)) { point.y = proposedPoint.y; }

		return point;
	}

	calculateVelocity() {
		// Compatibility method
		return this.velocity;
	}

	_calculateSimulationVelocity() {

		let xFinished = this._simulation.x.finished();
		let yFinished = this._simulation.y.finished();

		let velocity = {x: 0, y: 0};
		if (!xFinished) { velocity.x = (this._simulation.x.simulator.state.v / this.momentumVelocityMultiplier); }
		if (!yFinished) { velocity.y = (this._simulation.y.simulator.state.v / this.momentumVelocityMultiplier); }

		return velocity;
	}

	//#############################################################
	// Event Handling

	emit(eventName, event) {

		// TODO: Add new event properties like position corrected for device

		// Pass this to the layer above
		this.layer.emit(eventName, event);

		return super.emit(eventName, event);
	}

	//#############################################################
	// Lock Direction

	_updatedirectionLock(correctedDelta) {

		this._directionLockEnabledX = Math.abs(correctedDelta.y) > this.directionLockThreshold.y;
		this._directionLockEnabledY = Math.abs(correctedDelta.x) > this.directionLockThreshold.x;

		// TODO: This wasn't working as advertised. We shouls have a way to scroll diagonally
		// if we were sort of moving into both directions equally.

		// xSlightlyPreferred = Math.abs(correctedDelta.y) > @directionLockThreshold.y / 2
		// ySlightlyPreferred = Math.abs(correctedDelta.x) > @directionLockThreshold.x / 2

		// # Allow locking in both directions at the same time
		// @_directionLockEnabledX = @_directionLockEnabledY = true if (xSlightlyPreferred and ySlightlyPreferred)

		if (this._directionLockEnabledX || this._directionLockEnabledY) {
			return this.emit(Events.DirectionLockStart, {
				x: this._directionLockEnabledX,
				y: this._directionLockEnabledY
			}
			);
		}
	}

	_resetdirectionLock() {
		this._directionLockEnabledX = false;
		return this._directionLockEnabledY = false;
	}

	//#############################################################
	// Inertial scroll simulation

	_setupSimulation() {
		if (this._simulation) { return; }

		this._simulation = {
			x: this._setupSimulationForAxis("x"),
			y: this._setupSimulationForAxis("y")
		};

		return this._updateSimulationConstraints(this.constraints);
	}

	_setupSimulationForAxis(axis) {

		let properties = {};
		properties[axis] = true;

		let simulation = new Simulation({
			layer: this.layer,
			properties,
			model: "inertial-scroll",
			modelOptions: {
				momentum: this.momentumOptions,
				bounce: this.bounceOptions
			}
		});

		simulation.on(Events.SimulationStep, state => this._onSimulationStep(axis, state));
		simulation.on(Events.SimulationStop, state => this._onSimulationStop(axis, state));
		return simulation;
	}

	_updateSimulationConstraints(constraints) {
		// This is where we let the simulator know about our constraints
		if (!this._simulation) { return; }
		if (constraints) {
			let {minX, maxX, minY, maxY} = this._calculateConstraints(this._constraints);
			this._simulation.x.simulator.options = {min: minX, max: maxX};
			return this._simulation.y.simulator.options = {min: minY, max: maxY};
		} else {
			this._simulation.x.simulator.options = {min: -Infinity, max: +Infinity};
			return this._simulation.y.simulator.options = {min: -Infinity, max: +Infinity};
		}
	}

	_onSimulationStep(axis, state) {

		let delta;
		if ((axis === "x") && (this.horizontal === false)) { return; }
		if ((axis === "y") && (this.vertical === false)) { return; }

		// The simulation state has x as value, it can look confusing here
		// as we're working with x and y.

		if (this.constraints) {
			if (this.bounce) {
				delta = state.x - this.layer[axis];
			} else {
				let {minX, maxX, minY, maxY} = this._calculateConstraints(this._constraints);
				if (axis === "x") { delta = Utils.clamp(state.x, minX, maxX) - this.layer[axis]; }
				if (axis === "y") { delta = Utils.clamp(state.x, minY, maxY) - this.layer[axis]; }
			}
		} else {
			delta = state.x - this.layer[axis];
		}

		let updatePoint = this.layer.point;
		if (axis === "x") { updatePoint[axis] = updatePoint[axis] + delta; }
		if (axis === "y") { updatePoint[axis] = updatePoint[axis] + delta; }
		this.updatePosition(updatePoint);

		this.layer[axis] = this.updatePosition(updatePoint)[axis];
		return this.emit(Events.Move, this.layer.point);
	}

	_onSimulationStop(axis, state) {

		if ((axis === "x") && (this.horizontal === false)) { return; }
		if ((axis === "y") && (this.vertical === false)) { return; }
		if (!this._simulation) { return; }

		// Round the end position to whole pixels
		if (this.pixelAlign) { this.layer[axis] = parseInt(this.layer[axis]); }

		// See if both simulators are stopped
		if (this._simulation.x.finished() && this._simulation.y.finished()) {
			return this._stopSimulation();
		}
	}

	_startSimulation() {

		// The types of simulation that we can have are:
		// 1) Momentum inside constraints
		// 2) Momentum inside constraints to outside constraints bounce
		// 3) Release outside constraints bounce
		// 4) Momentum without constraints

		if (!this.momentum && !this.bounce) { return; }
		if ((this.isBeyondConstraints === false) && (this.momentum === false)) { return; }
		if ((this.isBeyondConstraints === false) && (this.isDragging === false)) { return; }

		// If overdrag is disabled, we need to not have a bounce animation
		// when the cursor is outside of the dragging bounds for an axis.
		let {minX, maxX, minY, maxY} = this._calculateConstraints(this._constraints);

		let startSimulationX = (this.overdrag === true) || ((this.layer.x > minX) && (this.layer.x < maxX));
		let startSimulationY = (this.overdrag === true) || ((this.layer.y > minY) && (this.layer.y < maxY));

		if (startSimulationX === startSimulationY && startSimulationY === false) {
			return;
		}

		let { velocity } = this;

		let velocityX = velocity.x * this.momentumVelocityMultiplier * this.speedX * (1 / this.layer.canvasScaleX()) * this.layer.scaleX * this.layer.scale;
		let velocityY = velocity.y * this.momentumVelocityMultiplier * this.speedY * (1 / this.layer.canvasScaleY()) * this.layer.scaleY * this.layer.scale;

		this._setupSimulation();
		this._isAnimating = true;
		this._isMoving = true;

		this._simulation.x.simulator.setState({
			x: this.layer.x,
			v: velocityX
		});
		if (startSimulationX) { this._simulation.x.start(); }

		this._simulation.y.simulator.setState({
			x: this.layer.y,
			v: velocityY
		});
		if (startSimulationY) { this._simulation.y.start(); }

		return this.emit(Events.DragAnimationStart);
	}

	_stopSimulation() {
		if (this._isMoving) { this.emit(Events.Move, this.layer.point); }
		this._isAnimating = false;
		this._isMoving = false;

		if (!this._simulation) { return; }
		if (this._simulation != null) {
			this._simulation.x.stop();
		}
		if (this._simulation != null) {
			this._simulation.y.stop();
		}
		this._simulation = null;
		return this.emit(Events.DragAnimationEnd);
	}

	animateStop() {
		return this._stopSimulation();
	}

	//#############################################################
	//# EVENT HELPERS

	onMove(cb) { return this.on(Events.Move, cb); }
	onDragStart(cb) { return this.on(Events.DragStart, cb); }
	onDragWillMove(cb) { return this.on(Events.DragWillMove, cb); }
	onDragMove(cb) { return this.on(Events.DragMove, cb); }
	onDragDidMove(cb) { return this.on(Events.DragDidMove, cb); }
	onDrag(cb) { return this.on(Events.Drag, cb); }
	onDragEnd(cb) { return this.on(Events.DragEnd, cb); }
	onDragAnimationStart(cb) { return this.on(Events.DragAnimationStart, cb); }
	onDragAnimationEnd(cb) { return this.on(Events.DragAnimationEnd, cb); }
	onDirectionLockStart(cb) { return this.on(Events.DirectionLockStart, cb); }
};
undefined.initClass();
