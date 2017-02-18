import {Context} from "Context"
import {AnimationLoop} from "AnimationLoop"

type DoneType = (context: Context, done: MochaDone) => void



const tester = (it: any, description: string, f: DoneType) => {
	it(description, (mochaDone) => {

		const context = new Context("test", {loop: new AnimationLoop()})

		Context.Default.renderer.element.style.left = `${window.innerWidth}px`
		context.renderer.element.style.left = `${window.innerWidth}px`
		Context.Current = context

		f(context, (err) => {
			Context.Current = Context.Default
			if (!err) { context.destroy() }
			mochaDone(err)
		})
	})
}

export const isolated = {
	test: (description: string, f: DoneType) => { tester(it, description, f) },
	only: (description: string, f: DoneType) => { tester(it.only, description, f) },
	skip: (description: string, f: DoneType) => { tester(it.skip, description, f) }
}
