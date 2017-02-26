import { BaseClass } from "./BaseClass";
import { Events } from "./Events";

Events.MIDICommand = "midiCommand";

class MIDIInput extends BaseClass {
	constructor(...args) {
		this._requestResolved = this._requestResolved.bind(this);
		this._onmidimessage = this._onmidimessage.bind(this);
		super(...args);
	}

	static initClass() {
	
		this.define("enabled", {
			get() { return (this._inputs != null ? this._inputs.length : undefined) || this._request; },
			set(value) {
				if (value === this.enabled) { return; }
				if (!navigator.requestMIDIAccess) { return this._requestRejected(); }
				if (value) {
					return this._request = navigator.requestMIDIAccess().then(this._requestResolved, this._requestRejected);
				} else {
					if (this._inputs != null) {
						this._inputs.map(close);
					}
					this._request = null;
					return this._inputs = [];
				}
			}
		});
	}

	// Success handlers

	_requestResolved(access) {
		if (this._inputs == null) { this._inputs = []; }
		return access.inputs.forEach(input => {
			this._inputs.push(input);
			return input.onmidimessage = this._onmidimessage(input.id);
		}
		);
	}

	// Failure handlers

	_requestRejected(error) {
		throw Error(`Requesting MIDI access failed: ${error != null ? error : "not supported by browser"}`);
	}

	// Event handlers

	_onmidimessage(sourceID) {
		return message => this.emit(Events.MIDICommand, sourceID, message.timeStamp, message.data);
	}

	// Event shortcuts

	onCommand(cb) { return this.on(Events.MIDICommand, cb); }
}
MIDIInput.initClass();

let MIDIInput$1 = new MIDIInput;
export { MIDIInput$1 as MIDIInput };
