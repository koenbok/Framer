import {Layer} from "../Layer"

const LayerStyles = {
    position: (layer: Layer) => "absolute",
    transform: (layer: Layer) => `translate(${layer.x}px, ${layer.y}px)`,
    width: (layer: Layer) => `${layer.width}px`,
    height: (layer: Layer) => `${layer.height}px`,
    backgroundColor: (layer: Layer) => layer.backgroundColor
}


export const CSS = {
    Layer: LayerStyles
}

export const getLayerStyles = (layer: Layer, styles: React.CSSProperties = {}) => {

    for (const name in LayerStyles) {
        styles[name] = LayerStyles[name](layer)
    }

    return styles
}