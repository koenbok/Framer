import {EventEmitter} from "EventEmitter"
import {utils} from "Framer"


const test = (f: (done: MochaDone) => void, n= 1000) => {
	return (finish: (time: number, n: number) => void) => {
		let count = 0
		let start = performance.now()
		const done = () => {
			if (count >= n) {
				finish(performance.now() - start, n)
			} else {
				count++
				f(done)
			}
		}
		f(done)
	}
}

const em = new EventEmitter<"test">()
em.on("test", () => {})
const a = test((done) => {
	em.emit("test")
	done()
})


utils.range(100).forEach(() => {
	a((time, n) => {
		console.log(`${Math.round(n / time)} ops/s`);
	})
})




