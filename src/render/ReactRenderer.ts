// import * as React from "react"
// import * as ReactDOM from "react-dom"

// import {Layer} from "Layer"
// import {Context} from "Context"

// import {getLayerStyles} from "render/css"

// interface Props {
// 	layer: Layer
// }

// class Renderable extends React.Component<Props, {}> {

// 	componentDidMount() {
// 		this.props.layer._element = this.refs["node"] as HTMLElement
// 	}

// 	componentWillUnmount() {
// 		this.props.layer._element = null
// 	}

// 	componentDidUpdate(prevProps, prevState) {
// 		this.props.layer._element = this.refs["node"] as HTMLElement
// 	}


// 	render() {

// 		const layer = this.props.layer
// 		const props = {
// 			// style: getLayerStyles(layer),
// 			ref: "node"
// 		}

// 		return React.createElement("div", props, this.props.layer.children.map(renderLayer))
// 	}
// }

// const renderLayer = (layer) => {
// 	return React.createElement(Renderable, {layer: layer, key: layer.id}, layer.children.map(renderLayer))
// }

// export const render = (context: Context, root: HTMLElement) => {
// 	ReactDOM.render(React.createElement("div", {}, context.children.map(renderLayer)), root)
// }