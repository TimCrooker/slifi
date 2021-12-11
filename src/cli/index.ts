import inquirer, { Answers, QuestionCollection } from 'inquirer'
import updateNotifier, { Package } from 'update-notifier'
import { commander } from '../utils/commander'
import { Route, Router, RouterOptions } from './router'
import { spinner } from '../utils/spinner'
import { SetRequired } from 'type-fest'
import { colors, logger } from 'swaglog'

export interface CLIOptions<RuntimeEnvInstance = any> {
	pkg: Package
	debug?: boolean
	mock?: boolean
	env?: RuntimeEnvInstance
}

export class CLI {
	pkg: Package
	opts: SetRequired<CLIOptions, 'debug' | 'mock'>
	logger = logger
	colors = colors
	commander = commander
	inquirer = inquirer
	spinner = spinner

	private router: Router

	constructor(opts: CLIOptions) {
		this.opts = {
			...opts,
			debug: opts.debug || false,
			mock: opts.mock || false,
		}

		// Configure logger
		logger.options = {
			logLevel: this.opts.debug ? 4 : 1,
			mock: this.opts.mock,
		}

		// Configure CLI router
		const routerOpts = { logger: this.logger } as RouterOptions
		this.router = new Router(routerOpts)

		this.pkg = opts.pkg
		this.commander.name(this.pkg.name).version(this.pkg.version)
	}

	async run(): Promise<void> {
		!this.opts.debug && console.clear()

		logger.debug('CLI running...')

		await this.updateCheck()

		this.commander.parse(process.argv)
	}

	/** Check for updates and inform the user if there are any */
	async updateCheck(pkg = this.opts.pkg): Promise<void> {
		const notifier = await updateNotifier({ pkg }).fetchInfo()

		if (notifier.current !== notifier.latest) {
			this.logger.log(
				'Update available: ',
				colors.green.bold(notifier.latest),
				colors.gray(' (current: ' + notifier.current + ')'),
				'Run',
				colors.magenta('npm install -g ' + pkg.name),
				'to update.'
			)
		}
	}

	/** Add a CLI Route */
	addRoute(route: string, handler: Route): this {
		this.router.registerRoute(route, handler)
		return this
	}

	// Navigate to a route
	async navigate(routeName: string): Promise<void> {
		!this.opts.debug && console.clear()

		// get options from commander
		const options = this.commander.opts()

		// get arguments from commander and strip off the command
		const args = this.commander.args

		logger.debug(
			colors.yellow('Grit CLI options:'),
			options,
			colors.cyan('Grit CLI args:'),
			args
		)

		await this.router.navigate(routeName, { args, options }, this)
	}

	async goBack(): Promise<void> {
		this.router.goBack()
	}

	async prompt(
		questions: QuestionCollection,
		initialAnswers?: Partial<Answers>
	): Promise<Answers> {
		return await this.inquirer.prompt(questions, initialAnswers)
	}
}
