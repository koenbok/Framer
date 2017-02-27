import * as Types from "Types"


export const getMinX = (frame: Types.Frame) => {
	return frame.x
}

export const setMinX = (frame: Types.Frame, value: number) => {
	frame.x = value
}


export const getMidX = (frame: Types.Frame) => {
	if (frame.width === 0) { return frame.x }
	return frame.x + (frame.width / 2.0)
}

export const setMidX = (frame: Types.Frame, value: number) => {
	frame.x = frame.width === 0 ? value : value - (frame.width / 2.0)
}


export const getMaxX = (frame: Types.Frame) => {
	if (frame.width === 0) { return 0 }
	return frame.x + frame.width
}

export const setMaxX = (frame: Types.Frame, value: number) => {
	frame.x = frame.width === 0 ? 0 : value - frame.width
}


export const getMinY = (frame: Types.Frame) => {
	return frame.y
}

export const setMinY = (frame: Types.Frame, value: number) => {
	frame.y = value
}


export const getMidY = (frame: Types.Frame) => {
	if (frame.height === 0) { return frame.y }
	return frame.y + (frame.height / 2.0)
}

export const setMidY = (frame: Types.Frame, value: number) => {
	frame.y = frame.height === 0 ? value : value - (frame.height / 2.0)
}


export const getMaxY = (frame: Types.Frame) => {
	if (frame.height === 0) { return 0 }
	return frame.y + frame.height
}

export const setMaxY = (frame: Types.Frame, value: number) => {
	frame.y = frame.height === 0 ? 0 : value - frame.height
}




export const getTop = (frame: Types.Frame, parent: Types.Frame) => {
	return frame.y
}

export const setTop = (frame: Types.Frame, parent: Types.Frame, value: number) => {
	frame.y = value
}


export const getRight = (frame: Types.Frame, parent: Types.Frame) => {
	return parent.width - getMaxX(frame)
}

export const setRight = (frame: Types.Frame, parent: Types.Frame, value: number) => {
	setMaxX(frame, parent.width)
}


export const getBottom = (frame: Types.Frame, parent: Types.Frame) => {
	return parent.height - getMaxY(frame)
}

export const setBottom = (frame: Types.Frame, parent: Types.Frame, value: number) => {
	setMaxX(frame, parent.height)
}


export const getLeft = (frame: Types.Frame, parent: Types.Frame) => {
	return frame.x
}

export const setLeft = (frame: Types.Frame, parent: Types.Frame, value: number) => {
	frame.x = value
}