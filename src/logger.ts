import colors, { Color } from 'chalk'

export type ColorType = typeof Color

export interface LoggerOptions {
	logLevel?: number
	mock?: boolean
}

export class Logger {
	options: Required<LoggerOptions>
	lines: string[]

	constructor(options?: LoggerOptions) {
		this.options = {
			...options,
			logLevel: 3,
			mock: false,
		}
		this.lines = []
	}

	setOptions(options: LoggerOptions): void {
		Object.assign(this.options, options)
	}

	log(...args: any[]): void {
		if (this.options.mock) {
			this.lines.push(args.join(' '))
		} else {
			console.log(...args)
		}
	}

	// level: 4
	debug(...args: any[]): void {
		if (this.options.logLevel < 4) {
			return
		}

		this.status('magenta', 'debug', ...args)
	}

	// level: 2
	warn(...args: any[]): void {
		if (this.options.logLevel < 2) {
			return
		}
		this.log(colors.yellow('warning'), ...args)
	}

	// level: 1
	error(...args: any[]): void {
		if (this.options.logLevel < 1) {
			return
		}
		process.exitCode = process.exitCode || 1
		this.log(colors.red('error'), ...args)
	}

	// level: 3
	success(...args: any[]): void {
		this.status('green', 'success', ...args)
	}

	// level: 3
	tip(...args: any[]): void {
		this.status('blue', 'tip', ...args)
	}

	info(...args: any[]): void {
		this.status('cyan', 'info', ...args)
	}

	status(color: ColorType, label: string, ...args: any[]): void {
		if (this.options.logLevel < 3) {
			return
		}
		this.log(colors[color](label), ...args)
	}
}

export { colors }

export const logger = new Logger()
