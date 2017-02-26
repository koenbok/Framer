import * as Preact from "preact"
import * as Utils from "Utils"
import {Layer} from "Layer"
import {Context} from "Context"
import {assignStyles, assignAllStyles} from "render/css"

export interface Props extends Preact.PreactHTMLAttributes {
	layer: Layer,
}




class Renderable extends Preact.Component<Props, {}> {

	componentWillMount() {
		this.props.layer.context.renderer.componentWillMount(this.props.layer)
	}

	componentDidMount() {
		this.props.layer._element = this.base
		this.props.layer.context.renderer.componentDidMount(this.props.layer)
	}

	componentWillUnmount() {
		this.props.layer.context.renderer.componentWillUnmount(this.props.layer)
	}

	// componentDidUpdate(prevProps, prevState) {
	// 	this.props.layer._element = this.refs["node"] as HTMLElement
	// }

	render() {

		const layer = this.props.layer
		const props = {}

		// FIXME: Again there might not be a layer here

		// Add all event handlers to the dom element
		for (let eventName in layer.eventListeners()) {;

			// See if any of the events is a valid dom event and attach it
			if (Utils.dom.validEvent("div", eventName)) {
				props[`on${eventName}`] = (event) => layer.emit(eventName as any, event)
			}
		}

		return Preact.h("div", props, this.props.layer.children.map(renderLayer))
	}
}

const renderLayer = (layer) => {
	return Preact.h<Props>(Renderable, {layer: layer, key: layer.id}, layer.children.map(renderLayer))
}

export const render = (context: Context, root: HTMLElement) => {

	let previousNode: Element | undefined = undefined


	// TODO: Dom lookup in each render call
	if (root.firstChild) {
		previousNode = root.firstChild as Element
	}

	Preact.render(
		Preact.h("div", {},
		context.children.map(renderLayer)),
		root, previousNode)
}