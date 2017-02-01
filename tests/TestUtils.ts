import {Context} from "Context"
import {Renderer} from "render/Renderer"
import {AnimationLoop} from "AnimationLoop"


const createDone = (done: jest.DoneCallback, f: Function): jest.DoneCallback => {

	let wrappedDone = (...args) => {
		done(...args)
		f()
	}

	(wrappedDone as any).fail = (err) => {
		done.fail(err)
		f()
	}

	return wrappedDone as any
}

export const isolated = (description: string, f: (context: Context, done: jest.DoneCallback) => void) => {
	it(description, (jestDone) => {
		const context = new Context(new AnimationLoop())
		const finish = createDone(jestDone, () => { context.destroy() })
		context.run(() => { f(context, finish) })
	})
}

export const asyncError = (done, f: Function) => {
	return () => {
		try {
			f()
			done()
		} catch(e) {
			done.fail(e)
		}
	}
}

