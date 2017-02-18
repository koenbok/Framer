import * as Preact from "preact"
import * as Utils from "Utils"
import {Layer} from "Layer"
import {Context} from "Context"
import {getStyles} from "render/css"

export interface Props extends Preact.PreactHTMLAttributes {
	layer: Layer,
}




class Renderable extends Preact.Component<Props, {}> {

	// componentDidMount() {
	// 	this.props.layer._element = this.refs["node"] as HTMLElement
	// }

	// componentWillUnmount() {
	// 	this.props.layer._element = null
	// }

	// componentDidUpdate(prevProps, prevState) {
	// 	this.props.layer._element = this.refs["node"] as HTMLElement
	// }

	render() {

		const layer = this.props.layer
		const props = {
			// style: getLayerStyles(layer),
			ref: (ref: HTMLElement) => { layer._element = ref }
		}

		// FIXME: Again there might not be a layer here
		for (let eventName in layer.eventListeners()) {;
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

	if (root.firstChild) {
		previousNode = root.firstChild as Element
	}

	Preact.render(
		Preact.h("div", {},
		context.children.map(renderLayer)),
		root, previousNode)
}