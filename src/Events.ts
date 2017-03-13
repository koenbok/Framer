export const DOMEvents = {
	Click: "click",
	DoubleClick: "dblclick",
	MouseDoubleClick: "dblclick", // Alias for consistent naming
	MouseUp: "mouseup",
	MouseDown: "mousedown",
	MouseOver: "mouseover",
	MouseOut: "mouseout",
	MouseMove: "mousemove",
	MouseWheel: "mousewheel"
}

export const GestureEvents = {
	Tap: "tap",
	TapStart: "tapstart",
	TapEnd: "tapend",
	DoubleTap: "doubletap"
}

export const Events: {[index: string]: string} = Object.assign({},
	DOMEvents,
	GestureEvents)
