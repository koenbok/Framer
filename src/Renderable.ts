import * as Types from "Types"

import {BaseClass} from "BaseClass"
import {Context} from "Context"

export abstract class Renderable<EventTypes> extends BaseClass<EventTypes> {
	id: number
	parent: Renderable<any> | null
	children: Renderable<any>[]
	context: Context
	styles: Types.CSSStyles
	text: string
	_element: HTMLElement
}