/** Generate an Array with a range of n. */
export const range = n => Array.from({length: n}, (value, key) => key)


const randomColorValue = () => Math.round(Math.random() * 255)

/** Generate a random rgba color with optional alpha. */
export const randomColor = (alpha=1) => {
	return `rgba(${randomColorValue()}, ${randomColorValue()}, ${randomColorValue()}, ${alpha})`
}

export const delay = (time: 0, f: Function) => setTimeout(f, time)