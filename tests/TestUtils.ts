import {Context} from "Context"
import {Renderer} from "render/Renderer"
import {AnimationLoop} from "AnimationLoop"


export const isolated = (description: string, f: (context: Context, done: MochaDone) => void) => {
    it(description, (mochaDone) => {
        const context = new Context(new AnimationLoop())
        const finish: MochaDone = (err) => {
            mochaDone(err)
            context.destroy()
        }
        
        context.run(() => { f(context, finish) })
        
    })
}

