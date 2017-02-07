import {Context} from "Context"
import {AnimationLoop} from "AnimationLoop"

export const isolated = (description: string, f: (context: Context, done: MochaDone) => void) => {
	it(description, (mochaDone) => {

		const context = new Context("test", new AnimationLoop())

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