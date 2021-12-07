export const evaluate = (exp: string, data: any): any => {
	/* eslint-disable no-new-func */
	const fn = new Function('data', `with (data) { return ${exp} }`)
	try {
		return fn(data)
	} catch (err) {
		console.error(err.stack)
		console.error(`Error when evaluating filter condition: ${exp}`)
	}
}

export const getGlobPatterns = (
	files: { [k: string]: any },
	context: any,
	getExcludedPatterns?: boolean
): string[] => {
	return Object.keys(files).filter((pattern) => {
		let condition = files[pattern]
		if (typeof condition === 'string') {
			condition = evaluate(condition, context)
		}
		return getExcludedPatterns ? !condition : condition
	})
}

export const escapeDots = (v: string): string => v.replace(/\./g, '\\.')
