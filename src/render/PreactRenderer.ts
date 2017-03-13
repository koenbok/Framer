import * as Preact from "preact"
import * as Utils from "Utils"
import {Renderable} from "Renderable"
import {Context} from "Context"
import {assignStyles, assignAllStyles} from "render/css"

export interface Props extends Preact.PreactHTMLAttributes {
	renderable: Renderable<any>,
}

class RenderableComponent extends Preact.Component<Props, {}> {

	updateElement() {
		this.props.renderable._element = this.base
	}

	componentWillMount() {
		this.props.renderable.context.renderer.componentWillMount(this.props.renderable)
	}

	componentDidMount() {
		this.updateElement()
		this.props.renderable.context.renderer.componentDidMount(this.props.renderable)
	}

	componentWillUnmount() {
		this.props.renderable.context.renderer.componentWillUnmount(this.props.renderable)
	}

	componentDidUpdate() {
		this.updateElement()
		this.props.renderable.context.renderer.componentDidUpdate(this.props.renderable)
	}

	render() {

		const renderable = this.props.renderable

		let props = {
			key: `${renderable.context.id}.${renderable.id}`
		}

		// Add all event handlers to the dom element
		for (let eventName of Utils.events.interactiveEvents(renderable.eventNames())) {
			(props as any)[`on${eventName}`] = (event: Event) => {
				renderable.emit(eventName as any, event)
			}
		}

		let children = renderable.children.map(renderLayer)

		if (renderable.text) { children.push(Preact.h("span", {}, renderable.text))}

		return Preact.h("div", props, children)
	}
}

const renderLayer = (renderable: Renderable<any>): JSX.Element => {
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