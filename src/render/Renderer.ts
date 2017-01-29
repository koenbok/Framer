import {AnimationLoop} from "AnimationLoop"
import {Context} from "Context"
import {Layer} from "Layer"
import {getLayerStyles} from "render/css"
import {render} from "render/react/ReactRenderer"

export class Renderer {
    
    private _loop: AnimationLoop
    private _dirtyStructure = false
    private _dirtyStyle: Set<Layer> = new Set()

    constructor(loop: AnimationLoop) {
        this._loop = loop
    }

    updateStructure() {
        if (this._dirtyStructure) { return }
        this._loop.once("render", this.renderStructure)
        this._dirtyStructure = true
    }

    updateStyle(layer: Layer, key, value) {

        console.log("updateStyle", this._dirtyStyle.size);
        
        if (this._dirtyStyle.size == 0) {
            this._loop.once("render", this.renderStyle)
        }
        this._dirtyStyle.add(layer)
        
    }

    renderStructure = () => {
        console.log("renderStructure");
        // debugger
        // TODO: Handle multiple contexts
        render(Context.Default)
        this._dirtyStructure = false
    }

    renderStyle = () => {
        console.log("renderStyle", this._dirtyStyle.size);
        

        for (let layer of this._dirtyStyle) {
            if (layer._element) {
                getLayerStyles(layer, layer._element.style as any)
            }
        }
        
        this._dirtyStyle = new Set()
    }
}
