import { Hello, object, second } from './second'

export const test = (): string => {
	return second()
}

export const test2 = (input: number): number => {
	return input
}

export const test3 = (): Hello => {
	return object
}
