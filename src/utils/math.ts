export const round = (value: number, decimals = 0, increment = 1, min?: number, max?: number) => {

	let d = Math.pow(10, decimals);

	if (increment) { value = Math.round(value / increment) * increment; }
	value = Math.round(value * d) / d;

	if (min && (value < min)) { return min; }
	if (max && (value > max)) { return max; }
	return value;
};

export const roundWhole = (value: number, decimals = 1) => {
	// Return integer if whole value, else include decimals
	if (decimals == null) { decimals = 1; }
	if (parseInt(value.toString()) === value) { return parseInt(value.toString()); }
	return round(value, decimals);
};

export const clamp = (value, a, b) => {

	let min = Math.min(a, b);
	let max = Math.max(a, b);

	if (value < min) { value = min; }
	if (value > max) { value = max; }
	return value;
};

// Taken from http://jsfiddle.net/Xz464/7/
// Used by animation engine, needs to be very performant
export const mapRange = (value, fromLow, fromHigh, toLow, toHigh) => {
	return toLow + (((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow))
}

// Kind of similar as above but with a better syntax and a limiting option
export const modulate = (
	value: number,
	rangeA: [number, number],
	rangeB: [number, number],
	limit = false) => {

	let [fromLow, fromHigh] = Array.from(rangeA);
	let [toLow, toHigh] = Array.from(rangeB);

	// if rangeB consists of Colors we return a color tween
	// if Color.isColor(toLow) or _.isString(toLow) and Color.isColorString(toLow)
	// 	ratio = Utils.modulate(value, rangeA, [0, 1])
	// 	result = Color.mix(toLow, toHigh, ratio)
	// 	return result

	let result = toLow + (((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow));

	if (limit === true) {
		if (toLow < toHigh) {
			if (result < toLow) { return toLow; }
			if (result > toHigh) { return toHigh; }
		} else {
			if (result > toLow) { return toLow; }
			if (result < toHigh) { return toHigh; }
		}
	}

	return result;
};