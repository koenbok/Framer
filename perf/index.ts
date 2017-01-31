import * as _ from "lodash"
import * as process from "process"
import * as BBenchmark from "benchmark"

import {EventEmitter} from "EventEmitter"

const Benchmark: BBenchmark = BBenchmark.runInContext({ _: _, process: process });

 (window as any).Benchmark = Benchmark

var suite = new Benchmark.Suite;

const log = (msg) => {
	console.log(msg)
	document.body.innerHTML += `<pre>${msg}</pre>`
}

log("Running tests...")

const addTest = (name: string, setup: Function) => {
	suite.add(name, setup())
}

addTest("emit", () => {
	const em = new EventEmitter<"test">()
	em.on("test", () => {})

	return () => em.emit("test")
})


// addTest("once", () => {
// 	const em = new EventEmitter<"test">()

// 	em.once("test", () => {})

// 	return (done) => {
// 		em.emit("test")
// 		em.once("test", () => {})
// 		done()
// 	}
// })

// const em = new EventEmitter<"test">()
// let count = 0
// const f = () => count++
// em.on("test", f)

// // add tests
// suite.add('EventEmitter#emit', function() {
// 	em.emit("test")
// })

// suite.add('String#indexOf', function() {
//   'Hello World!'.indexOf('o') > -1;
// })

// suite.add('String#match', function() {
//   !!'Hello World!'.match(/o/);
// })
// add listeners
suite.on('cycle', (event) => {
	log(String(event.target));
})



setTimeout(() => {
	suite.run({ 'async': true });
}, 100);
