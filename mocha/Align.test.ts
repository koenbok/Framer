import {expect, assert} from "chai"
import {Layer, Align} from "Framer"

describe("Align", function() {

	let createAlignedLayers = function(property: string, value: any, properties?: {borderWidth?: number, width?: number, height?:number}) {
		if (!properties) { properties = {}; }
		if (!properties.width) { properties.width = 500; }
		if (!properties.height) { properties.height = 300; }
		let parent = new Layer(properties);
		let child = createSublayer(parent, property, value);
		return {parent, child};
	};

	var createSublayer = function(layer: any, property: string, value: any) {
		layer = new Layer({
			width: 100,
			height: 200,
			parent: layer
		});
		layer[property] = value;
		return layer;
	};

	describe("center", function() {

		it("should center the layer", function() {
			let {child} = createAlignedLayers("x", Align.center);
			expect(child.x).to.equal(200);
			({child} = createAlignedLayers("y", Align.center));
			expect(child.y).to.equal(50);
		});

		it("should work when the layer has no parent", function() {
			let layer = new Layer({
				width: 100,
				height: 150,
				x: Align.center,
				y: Align.center
			});
			console.log(layer.context)
			expect(layer.x).to.equal(150);
			expect(layer.y).to.equal(75);
		});

		return it("should take borderWidth into account", function() {
			let {child} = createAlignedLayers("x", Align.center, {borderWidth: 30});
			expect(child.x).to.equal(170);
			({child} = createAlignedLayers("y", Align.center, {borderWidth: 30}));
			expect(child.y).to.equal(20);
		});
	});


	describe("left", function() {

		it("should left align the layer", function() {
			let {child} = createAlignedLayers("x", Align.left);
			expect(child.x).to.equal(0);
		});

		it("should work when the layer has no parent", function() {
			let layer = new Layer({
				width: 100,
				x: Align.left
			});
			expect(layer.x).to.equal(0);
		});

		return it("should take borderWidth into account", function() {
			let {child} = createAlignedLayers("x", Align.left, {borderWidth: 30});
			expect(child.x).to.equal(0);
		});
	});

	describe("right", function() {

		it("should right align the layer", function() {
			let {child} = createAlignedLayers("x", Align.right);
			expect(child.x).to.equal(400);
		});

		it("should work when the layer has no parent", function() {
			let layer = new Layer({
				width: 100,
				x: Align.right
			});
			expect(layer.x).to.equal(300);
		});

		return it("should take borderWidth into account", function() {
			let {child} = createAlignedLayers("x", Align.right, {borderWidth: 30});
			expect(child.x).to.equal(340);
		});
	});

	describe("top", function() {

		it("should top align the layer", function() {
			let {child} = createAlignedLayers("y", Align.top);
			expect(child.y).to.equal(0);
		});

		it("should work when the layer has no parent", function() {
			let layer = new Layer({
				height: 100,
				y: Align.top
			});
			expect(layer.y).to.equal(0);
		});

		return it("should take borderWidth into account", function() {
			let {child} = createAlignedLayers("y", Align.top, {borderWidth: 30});
			expect(child.y).to.equal(0);
		});
	});

	describe("bottom", function() {

		it("should bottom align the layer", function() {
			let {child} = createAlignedLayers("y", Align.bottom);
			expect(child.y).to.equal(100);
		});

		it("should work when the layer has no parent", function() {
			let layer = new Layer({
				height: 100,
				y: Align.bottom
			});
			expect(layer.y).to.equal(200);
		});

		return it("should take borderWidth into account", function() {
			let {child} = createAlignedLayers("y", Align.bottom, {borderWidth: 30});
			expect(child.y).to.equal(40);
		});
	});

	return describe("constructors", function() {

		// it("should work with size", function() {
		// 	let test = new Layer({
		// 		parent: new Layer({size: 200}),
		// 		x: Align.center,
		// 		y: Align.center,
		// 		size: 100
		// 	});

		// 	test.x.should.equal(50);
		// 	return test.y.should.equal(50);
		// });

		// it("should work with point and size", function() {
		// 	let test = new Layer({
		// 		parent: new Layer({size: 200}),
		// 		size: 100,
		// 		point: Align.center
		// 	});

		// 	test.x.should.equal(50);
		// 	return test.y.should.equal(50);
		// });

		// it("should work with point", function() {
		// 	let test = new Layer({
		// 		parent: new Layer({size: 200}),
		// 		width: 100,
		// 		height: 100,
		// 		point: Align.center
		// 	});

		// 	test.x.should.equal(50);
		// 	return test.y.should.equal(50);
		// });

		// return it("should work with both size and width height", function() {
		// 	let test = new Layer({
		// 		parent: new Layer({size: 200}),
		// 		width: 100,
		// 		height: 100,
		// 		point: Align.center,
		// 		size: 200
		// 	});

		// 	test.x.should.equal(50);
		// 	return test.y.should.equal(50);
		// });
	});
});

