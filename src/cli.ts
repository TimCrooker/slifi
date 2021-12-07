import chalk from 'chalk'
import inquirer, { Answers, QuestionCollection } from 'inquirer'
import updateNotifier, { Package } from 'update-notifier'
import { logger } from './logger'
import { commander } from './commander'
import { Route, Router, RouterOptions } from './router'
import { spinner } from './spinner'
import { SetRequired } from 'type-fest'

export interface CLIOptions<RuntimeEnvInstance = any> {
	pkg: Package
	debug?: boolean
	mock?: boolean
	env?: RuntimeEnvInstance
}

export class CLI<RuntimeEnvInstance = any> {
	opts: SetRequired<CLIOptions, 'debug' | 'mock'>

	private router: Router<RuntimeEnvInstance>
	logger = logger
	commander = commander
	inquirer = inquirer
	spinner = spinner
	chalk = chalk

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

		// Add autocomplete prompts to inquirer
		inquirer.registerPrompt(
			'autocomplete',
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			require('inquirer-autocomplete-prompt')
		)
	}

	async run(): Promise<void> {
		!this.opts.debug && console.clear()

		this.logger.debug('CLI running...')

		await this.updateCheck()

		this.commander.parse(process.argv)
	}

	/** Check for updates and inform the user if there are any */
	async updateCheck(pkg = this.opts.pkg): Promise<void> {
		const notifier = await updateNotifier({ pkg }).fetchInfo()

		if (notifier.current !== notifier.latest) {
			this.logger.log(
				'Update available: ',
				this.chalk.green.bold(notifier.latest),
				chalk.gray(' (current: ' + notifier.current + ')'),
				'Run',
				this.chalk.magenta('npm install -g ' + pkg.name),
				'to update.'
			)
		}
	}

	/** Add a CLI Route */
	addRoute(route: string, handler: Route<RuntimeEnvInstance>): this {
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

		this.logger.debug(
			chalk.yellow('Grit CLI options:'),
			options,
			chalk.cyan('Grit CLI args:'),
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
