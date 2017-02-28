
// Export Framer to the global broser context
// Make sure these match what Framer.ts exports

// declare const Framer: typeof framer.Framer

// declare var _: typeof framer._
// declare var Utils: typeof framer.Utils
// declare var print: typeof framer.print
// declare var Screen: typeof framer.Screen
// declare var Layer: typeof framer.Layer
// declare var Curve: typeof framer.Curve
// declare var Context: typeof framer.Context


declare global {
    /*~ Here, declare things that go in the global namespace, or augment
     *~ existing declarations in the global namespace
     */
    interface String {
        fancyFormat(opts: StringFormatOptions): string;
    }

	const Framer: typeof framer.Framer
}

/*~ If your module exports types or values, write them as usual */
export interface StringFormatOptions {
    fancinessLevel: number;
}

/*~ For example, declaring a method on the module (in addition to its global side effects) */
export function doSomething(): void;

/*~ If your module exports nothing, you'll need this line. Otherwise, delete it */
// export { };

// export {}