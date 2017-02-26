import * as Preact from "preact"
import * as Utils from "Utils"
import {Renderable} from "Renderable"
import {Context} from "Context"
import {assignStyles, assignAllStyles} from "render/css"

export interface Props extends Preact.PreactHTMLAttributes {
	renderable: Renderable<any>,
}

class RenderableComponent extends Preact.Component<Props, {}> {

	componentWillMount() {
		this.props.renderable.context.renderer.componentWillMount(this.props.renderable)
	}

	componentDidMount() {
		this.props.renderable._element = this.base
		this.props.renderable.context.renderer.componentDidMount(this.props.renderable)
	}

	componentWillUnmount() {
		this.props.renderable.context.renderer.componentWillUnmount(this.props.renderable)
	}

	componentDidUpdate(prevProps, prevState) {
		this.props.renderable._element = this.base
		this.props.renderable.context.renderer.componentDidUpdate(this.props.renderable)
	}

	render() {

		const props = {}

		// FIXME: Again there might not be a layer here

		// Add all event handlers to the dom element
		for (let eventName in this.props.renderable.eventListeners()) {;

			// See if any of the events is a valid dom event and attach it
			if (Utils.dom.validEvent("div", eventName)) {
				props[`on${eventName}`] = (event) => this.props.renderable.emit(eventName as any, event)
			}
		}

		return Preact.h("div", props, this.props.renderable.children.map(renderLayer))
	}
}

const renderLayer = (renderable: Renderable<any>) => {
	return Preact.h<Props>(RenderableComponent, {
		renderable: renderable,
		key: renderable.id.toString()},
		renderable.children.map(renderLayer))
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