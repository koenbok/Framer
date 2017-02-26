import { _ } from "./Underscore";
import Utils from "./Utils";

let ChromeAlert = `\
Importing layers is currently only supported on Safari. If you really want it to work with Chrome quit it, open a terminal and run:
open -a Google\ Chrome -–allow-file-access-from-files\
`;

let resizeFrame = function(scale, frame) {

	if (scale === 1) { return frame; }

	let result = {};

	for (let key of ["x", "y", "width", "height"]) {
		if (frame.hasOwnProperty(key)) {
			result[key] = frame[key] * scale;
		}
	}

	return result;
};

let getScaleFromName = function(str) {

	let re = /@([\d]+|[\d]+.[\d]+)x/;
	let m = undefined;
	if ((m = re.exec(str)) !== null) {
		if (m[1]) { return parseFloat(m[1]); }
	}

	return null;
};

let startsWithNumber = str => (new RegExp("^[0-9]")).test(str);

let sanitizeLayerName = function(name) {
	for (let suffix of ["*", "-", ".png", ".jpg", ".pdf"]) {
		if (_.endsWith(name.toLowerCase(), suffix)) {
			name = name.slice(0, name.length-suffix.length-1 + 1 || undefined);
		}
	}
	return name;
};

export let Importer = class Importer {

	constructor(path, scale, extraLayerProperties) {

		this.path = path;
		if (scale == null) { scale = 1; }
		this.scale = scale;
		if (extraLayerProperties == null) { extraLayerProperties = {}; }
		this.extraLayerProperties = extraLayerProperties;
		this.paths = {
			layerInfo: Utils.pathJoin(this.path, "layers.json"),
			images: Utils.pathJoin(this.path, "images"),
			documentName: this.path.split("/").pop()
		};

		this._createdLayers = [];
		this._createdLayersByName = {};
	}

	load() {

		let layersByName = {};
		let layerInfo = this._loadlayerInfo();

		if (layerInfo.length === 0) {
			throw new Error("Importer: no layers. Do you have at least one layer group?");
		}

		// Pass one. Create all layers build the hierarchy
		layerInfo.map(layerItemInfo => {
			return this._createLayer(layerItemInfo);
		}
		);

		// Pass three, correct artboard positions, and reset top left
		// to the minimum x, y of all artboards
		// @_correctArtboards(@_createdLayers)

		// Pass two. Adjust position on screen for all layers
		// based on the hierarchy.
		for (var layer of Array.from(this._createdLayers)) {
			this._correctLayer(layer);
		}

		this._correctArtboards(this._createdLayers);


		// Pass three, insert the layers into the dom
		// (they were not inserted yet because of the shadow keyword)
		for (layer of Array.from(this._createdLayers)) {
			if (!layer.parent) {
				layer.parent = null;
			}
		}

		return this._createdLayersByName;
	}

	_loadlayerInfo() {

		// Chrome is a pain in the ass and won't allow local file access
		// therefore I add a .js file which adds the data to
		// window.__imported__["<path>"]

		let importedKey = `${this.paths.documentName}/layers.json.js`;

		if (window.__imported__ != null ? window.__imported__.hasOwnProperty(importedKey) : undefined) {
			return _.cloneDeep(window.__imported__[importedKey]);
		}

		return Framer.Utils.domLoadJSONSync(this.paths.layerInfo);
	}

	_createLayer(info, parent) {

		// Resize the layer frames
		if (info.layerFrame) { info.layerFrame = resizeFrame(this.scale, info.layerFrame); }
		if (info.maskFrame) { info.maskFrame = resizeFrame(this.scale, info.maskFrame); }
		if ((info.image != null ? info.image.frame : undefined) != null) { info.image.frame = resizeFrame(this.scale, info.image.frame); }

		// Flattened layers don't get children
		if (!info.children) {
			info.children = [];
		}

		let LayerClass = Layer;

		let layerInfo = {
			shadow: true,
			name: sanitizeLayerName(info.name),
			frame: info.layerFrame,
			clip: false,
			backgroundColor: null,
			visible: info.visible != null ? info.visible : true
		};

		_.extend(layerInfo, this.extraLayerProperties);

		// Most layers will have an image, add that here
		if (info.image) {
			layerInfo.frame = info.image.frame;
			layerInfo.image = Utils.pathJoin(this.path, info.image.path);
		}

		// If there is a mask on this layer we clip the layer
		if (info.maskFrame) {
			layerInfo.clip = true;
		}

		if (info.kind === "artboard") {
			layerInfo.backgroundColor = info.backgroundColor;
		}

		// Figure out what the super layer should be. If this layer has a contentLayer
		// (like a scroll view) we attach it to that instead.
		if (parent != null ? parent.contentLayer : undefined) {
			layerInfo.parent = parent.contentLayer;
		} else if (parent) {
			layerInfo.parent = parent;
		}

		// Layer names cannot start with a number
		if (startsWithNumber(layerInfo.name)) {
			throw new Error(`Layer or Artboard names can not start with a number: '${layerInfo.name}'`);
		}

		// We can create the layer here
		let layer = new LayerClass(layerInfo);
		layer.name = layerInfo.name;

		// Record the imported path for layers (for the inferencer)
		layer.__framerImportedFromPath = this.path;

		// Set scroll to true if scroll is in the layer name
		if (layerInfo.name.toLowerCase().indexOf("scroll") !== -1) {
			layer.scroll = true;
		}

		// Set draggable enabled if draggable is in the name
		if (layerInfo.name.toLowerCase().indexOf("draggable") !== -1) {
			layer.draggable.enabled = true;
		}

		// A layer without an image, mask or children should be zero
		if (!layer.image && !info.children.length && !info.maskFrame) {
			layer.frame = Utils.frameZero();
		}

		_.clone(info.children).reverse().map(info => {
			return this._createLayer(info, layer);
		}
		);

		// If this is an artboard we retain the size, but set the coordinates to zero
		// because all coordinates within artboards are 0, 0 based.
		if (info.kind === "artboard") {
			layer.point = {x: 0, y: 0};

		// If this is not an artboard, and does not have an image or mask, we clip the
		// layer to its content size.
		} else if (!layer.image && !info.maskFrame) {
			layer.frame = layer.contentFrame();
		}

		layer._info = info;

		this._createdLayers.push(layer);
		return this._createdLayersByName[layer.name] = layer;
	}

	_correctArtboards(layers) {

		let leftMostLayer = null;

		for (var layer of Array.from(layers)) {
			if (layer._info.kind === "artboard") {
				layer.point = layer._info.layerFrame;
				layer.visible = true;

				if ((leftMostLayer === null) || (layer.x < leftMostLayer.x)) {
					leftMostLayer = layer;
				}
			}
		}

		if (!leftMostLayer) { return; }

		// Calculate the artboard positions to always be 0, 0.
		let pointOffset = leftMostLayer.point;

		// Correct the artboard positions to 0, 0.
		return (() => {
			let result = [];
			for (layer of Array.from(layers)) {
				let item;
				if (layer._info.kind === "artboard") {
					layer.x -= pointOffset.x;
					item = layer.y -= pointOffset.y;
				}
				result.push(item);
			}
			return result;
		})();
	}

	_correctLayer(layer) {

		var traverse = function(layer) {

			if (layer.parent) {
				layer.frame = Utils.convertPoint(layer.frame, null, layer.parent);
			}

			return Array.from(layer.children).map((child) =>
				traverse(child));
		};

		if (!layer.parent) {
			return traverse(layer);
		}
	}
};

exports.Importer.load = function(path, scale) {

	if (scale == null) { scale = getScaleFromName(path); }
	if (scale == null) { scale = 1; }

	let importer = new exports.Importer(path, scale);
	return importer.load();
};
