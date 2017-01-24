import * as React from "react"
import * as ReactDom from "react-dom"

import {Layer} from "../../Layer"

interface Props {
	layer: Layer
}

class Renderable extends React.Component<Props, {}> {

	shouldComponentUpdate(nextProps: Props, nextState) {
		return this.props.layer === nextProps.layer && this.props.layer.isDirty()
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	render() {
		return React.createElement("div", {}, this.props.layer.children.map(renderLayer))
	}
}

const renderLayer = (layer) => {
	return React.createElement("div", {}, layer.children.map(renderLayer))
}

// const renderLayers = (layers) => {
// 	return React.createElement("div", )
// }

export const render = (context) => {

}