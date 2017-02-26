import { _ } from "./Underscore";

import Utils from "./Utils";

import { EventEmitter } from "./EventEmitter";

let CounterKey = "_ObjectCounter";
let DefinedPropertiesKey = "_DefinedPropertiesKey";
let DefinedPropertiesValuesKey = "_DefinedPropertiesValuesKey";
let DefinedPropertiesOrderKey = "_DefinedPropertiesOrderKey";

export let BaseClass = class BaseClass extends EventEmitter {
	static initClass() {
	
		this.define("props", {
			importable: false,
			exportable: false,
			get() {
				let keys = [];
				let propertyList = this._propertyList();
				for (let key in propertyList) {
					let descriptor = propertyList[key];
					if (descriptor.exportable) {
						keys.push(key);
					}
				}
	
				return _.pick(this, keys);
			},
	
			set(value) {
				let propertyList = this._propertyList();
				return (() => {
					let result = [];
					for (let k in value) {
					// We only apply properties that we know and are marked to be
					// importable.
						let v = value[k];
						let item;
						if (propertyList[k] != null ? propertyList[k].importable : undefined) { item = this[k] = v; }
						result.push(item);
					}
					return result;
				})();
			}
		}
		);
	
		this.define("id",
			{get() { return this._id; }});
	}

	//################################################################
	// Framer object properties

	static define(propertyName, descriptor) {

		// See if we need to add this property to the internal properties class
		if (this !== BaseClass) {
			this._addDescriptor(propertyName, descriptor);
		}

		// if not descriptor.set?
		// 	descriptor.set = (value) ->
		// 		throw Error("#{@constructor.name}.#{propertyName} is readonly")

		// Define the property on the prototype
		return Object.defineProperty(this.prototype, propertyName, descriptor);
	}

	static _addDescriptor(propertyName, descriptor) {

		// for key in ["enumerable", "exportable", "importable"]
		// 	if descriptor.hasOwnProperty(key)
		// 		throw Error("woops #{propertyName} #{descriptor[key]}") if not _.isBoolean(descriptor[key])

		descriptor.propertyName = propertyName;

		// Have the following flags set to true when undefined:
		if (descriptor.enumerable == null) { descriptor.enumerable = true; }
		if (descriptor.exportable == null) { descriptor.exportable = true; }
		if (descriptor.importable == null) { descriptor.importable = true; }

		// We assume we don't import if there is no setter, because we can't
		descriptor.importable = descriptor.importable && descriptor.set;
		// We also assume we don't export if there is no setter, because
		// it is likely a calculated property, and we can't set it.
		descriptor.exportable = descriptor.exportable && descriptor.set;

		// We assume that every property with an underscore is private
		if (_.startsWith(propertyName, "_")) { return; }

		// Only retain options that are importable, exportable or both:
		if (descriptor.exportable || descriptor.importable) {
			if (this[DefinedPropertiesKey] == null) { this[DefinedPropertiesKey] = {}; }
			this[DefinedPropertiesKey][propertyName] = descriptor;

			// Set the order, insert it's dependants before, we'll check if they exist later
			if (this[DefinedPropertiesOrderKey] == null) { this[DefinedPropertiesOrderKey] = []; }

			if (descriptor.depends) {
				for (let depend of Array.from(descriptor.depends)) {
					if (!Array.from(this[DefinedPropertiesOrderKey]).includes(depend)) {
						this[DefinedPropertiesOrderKey].push(depend);
					}
				}
			}

			return this[DefinedPropertiesOrderKey].push(propertyName);
		}
	}

	static simpleProperty(name, fallback, options) {
		if (options == null) { options = {}; }
		return _.extend(options, {
			default: fallback,
			get() { return this._getPropertyValue(name); },
			set(value) { return this._setPropertyValue(name, value); }
		}
		);
	}

	static proxyProperty(keyPath, options) {

		// Allows to easily proxy properties from an instance object
		// Object property is in the form of "object.property"

		let descriptor;
		if (options == null) { options = {}; }
		let objectKey = keyPath.split(".")[0];

		return descriptor = _.extend(options, {
			get() {
				if (!_.isObject(this[objectKey])) { return; }
				return Utils.getValueForKeyPath(this, keyPath);
			},
			set(value) {
				if (!_.isObject(this[objectKey])) { return; }
				return Utils.setValueForKeyPath(this, keyPath, value);
			},
			proxy: true
		}
		);
	}

	_setPropertyValue(k, v) {
		return this[DefinedPropertiesValuesKey][k] = v;
	}

	_getPropertyValue(k) {
		return Utils.valueOrDefault(this[DefinedPropertiesValuesKey][k],
			this._getPropertyDefaultValue(k));
	}

	_getPropertyDefaultValue(k) {
		return this._propertyList()[k]["default"];
	}

	_propertyList() {
		return this.constructor[DefinedPropertiesKey];
	}

	keys() { return _.keys(this.props); }

	toInspect() {
		return `<${this.constructor.name} id:${this.id || null}>`;
	}

	onChange(name, cb) { return this.on(`change:${name}`, cb); }


	//################################################################
	// Base constructor method

	constructor(options) {

		this._setPropertyValue = this._setPropertyValue.bind(this);
		this._getPropertyValue = this._getPropertyValue.bind(this);
		this.toInspect = this.toInspect.bind(this);
		super(...arguments);

		this._context = typeof Framer !== 'undefined' && Framer !== null ? Framer.CurrentContext : undefined;

		// Create a holder for the property values
		this[DefinedPropertiesValuesKey] = {};

		this._applyDefaults(options);

		// Count the creation for these objects and set the id
		if (this.constructor[CounterKey] == null) { this.constructor[CounterKey] = 0; }
		this.constructor[CounterKey] += 1;

		// We set this last so if we print a layer during construction
		// we don't get confused because the id changes from global to context
		this._id = this.constructor[CounterKey];
	}

	_applyDefaults(options) {

		if (!this.constructor[DefinedPropertiesOrderKey]) { return; }
		if (!options) { return; }

		return Array.from(this.constructor[DefinedPropertiesOrderKey]).map((k) =>
			this._applyDefault(k, options[k]));
	}

	_applyProxyDefaults(options) {

		if (!this.constructor[DefinedPropertiesOrderKey]) { return; }
		if (!options) { return; }

		return (() => {
			let result = [];
			for (let k of Array.from(this.constructor[DefinedPropertiesOrderKey])) {
				let descriptor = this.constructor[DefinedPropertiesKey][k];
				if (((descriptor != null ? descriptor.proxy : undefined) != null) !== true) { continue; }
				result.push(this._applyDefault(k, options[k]));
			}
			return result;
		})();
	}

	_applyDefault(key, optionValue) {

		let value;
		let descriptor = this.constructor[DefinedPropertiesKey][key];

		// If this was listed as a dependent property, but it did not get defined, we err.
		if (!descriptor) { throw Error(`Missing dependant descriptor: ${key}`); }

		// For each known property (registered with @define) that has a setter, fetch
		// the value from the options object, unless the prop is not importable.
		// When there's no user value, apply the default value:

		if (!descriptor.set) { return; }

		if (descriptor.importable) { value = optionValue; }
		value = Utils.valueOrDefault(optionValue, this._getPropertyDefaultValue(key));

		if ([null, undefined].includes(value)) { return; }

		return this[key] = value;
	}
};
undefined.initClass();
