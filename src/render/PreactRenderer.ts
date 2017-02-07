import * as Preact from "preact"
import {Layer} from "Layer"
import {Context} from "Context"
import {getLayerStyles} from "render/css"

interface Props extends Preact.PreactHTMLAttributes {
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