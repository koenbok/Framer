let tester = (require as any).context("mocha-loader!./", false, /test.ts$/)

tester.keys().forEach((key) => {
	console.log(key);
	tester(key)
});