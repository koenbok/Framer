WebKitCSSMatrix.prototype.skew = function(skew) {
	if (!skew) { return this; }
	let rad = (skew * Math.PI) / 180;
	let value = Math.tan(rad);
	let m = new WebKitCSSMatrix();
	m.m12 = value;
	m.m21 = value;
	return this.multiply(m);
};

WebKitCSSMatrix.prototype.point = function(point) {
	if (point == null) { point = {}; }
	let {x, y, z} = _.defaults(point, {x: 0, y: 0, z: 0});
	let w = (this.m14 * x) + (this.m24 * y) + (this.m34 * z) + this.m44;
	w = w || 1;
	return point = {
		x: ((this.m11 * x) + (this.m21 * y) + (this.m31 * z) + this.m41) / w,
		y: ((this.m12 * x) + (this.m22 * y) + (this.m32 * z) + this.m42) / w,
		z: ((this.m13 * x) + (this.m23 * y) + (this.m33 * z) + this.m43) / w
	};
};

export let Matrix = WebKitCSSMatrix;
