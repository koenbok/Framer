import * as React from "react"
import * as ReactDOM from "react-dom"

import {Layer} from "../../Layer"
import {Context} from "../../Context"

import {getLayerStyles} from "../css"

interface Props {
	layer: Layer
}

class Renderable extends React.Component<Props, {}> {

	// shouldComponentUpdate(nextProps: Props, nextState) {

	// 	const update = ((this.props.layer === nextProps.layer) && this.props.layer.isDirty())

	// 	// if (update) {
	// 	// 	console.log("update", this.props.layer);
	// 	// }

	// 	return update
	// }

	componentDidMount() {
		this.props.layer._element = this.refs["node"] as HTMLElement
	}

	// componentWillUnmount() {
	// 	console.log("unmount", this.props.layer);
	// }

	// componentDidUpdate(prevProps, prevState) {
	// 	getLayerStyles(this.props.layer, this.props.layer._element.style as any)
	// }


	render() {

		const layer = this.props.layer
		const props = {
			style: getLayerStyles(layer),
			ref: "node"
		}

		return React.createElement("div", props, this.props.layer.children.map(renderLayer))
	}
}

const renderLayer = (layer) => {
	return React.createElement(Renderable, {layer: layer, key: layer.id}, layer.children.map(renderLayer))
}

export const render = (context: Context, root: HTMLElement) => {
	ReactDOM.render(React.createElement("div", {}, context.children.map(renderLayer)), root)
}