
import {BaseClass} from "./BaseClass"
import {Layer} from "./Layer"

interface ContextOptions {
		parent: Layer|Context|null,
		backgroundColor: string
}

export class Context extends BaseClass {

	private _properties: ContextOptions = {
		parent: null,
		backgroundColor: "rgba(255, 0, 0, 0.5)"
	}

	constructor(options: ContextOptions|{}={}) {
		super()
	}

}


