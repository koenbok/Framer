import * as React from "react"
import * as ReactDOM from "react-dom"

import {Layer} from "../../Layer"
import {Context} from "../../Context"

import {getLayerStyles} from "../css"

interface Props {
	layer: Layer
}

class Renderable extends React.Component<Props, {}> {

	shouldComponentUpdate(nextProps: Props, nextState) {
		
		const update = ((this.props.layer === nextProps.layer) && this.props.layer.isDirty())

		// if (update) {
		// 	console.log("update", this.props.layer);
		// }

		return update
	}

	componentDidMount() {
		console.log("mount", this.props.layer);
	}

	componentWillUnmount() {
		console.log("unmount", this.props.layer);
	}

	render() {
		return React.createElement("div", {style: getLayerStyles(this.props.layer)}, this.props.layer.children.map(renderLayer))
	}
}

const renderLayer = (layer) => {
	return React.createElement(Renderable, {layer: layer, key: layer.id}, layer.children.map(renderLayer))
}

// const renderLayers = (layers) => {
// 	return React.createElement("div", )
// }

const FramerNode = document.createElement("div")

document.addEventListener("DOMContentLoaded", () => {
	document.body.appendChild(FramerNode)
})

export const render = (context: Context) => {
	ReactDOM.render(React.createElement("div", {}, context.children.map(renderLayer)), FramerNode)
}