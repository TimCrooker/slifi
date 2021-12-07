import chalk from 'chalk'
import { Logger } from './logger'
import { CLI } from './cli'
import { GritError } from '@/error'

export const BackChoice = {
	name: 'Go Back',
	value: 'back',
}

export type Route<RuntimeEnvInstance = any> = (
	app: CLI<RuntimeEnvInstance>,
	input: {
		/** args passed from the initial command line */
		args: any[]
		/** options passed from the initial command line */
		options: { [key: string]: any }
	}
) => void | Promise<void>

type Routes<RuntimeEnvInstance = any> = {
	[k: string]: Route<RuntimeEnvInstance>
}

type Navigate = { route: string; args: any; context: CLI }

type RouteHistory = Navigate[]

export interface RouterOptions {
	logger: Logger
}

/**
 * The router is in charge of handling `yo` different screens.
 */
export class Router<RuntimeEnvInstance = any> {
	routes: Routes<RuntimeEnvInstance>

	logger: Logger

	routeHistory: RouteHistory = []

	constructor(opts: RouterOptions) {
		this.routes = {}

		this.logger = opts.logger
	}

	/**
	 * Navigate to a route
	 * @param route Route name
	 * @param args the arguments to pass to the route handler
	 */
	async navigate(route: string, args: any, context: CLI): Promise<this> {
		this.logger.debug('Navigating to route:', chalk.yellow(route))

		if (route === 'back') {
			await this.goBack()
			return this
		}

		if (typeof this.routes[route] === 'function') {
			//store the call to routeHistory
			this.saveNavigateCall({ route, args, context })
			try {
				await this.routes[route](context, args)
			} catch (error) {
				this.routeHistory.pop()
				throw new GritError(
					'Something went wrong in the route : ' + chalk.yellow(route)
				)
			}
		} else {
			this.logger.error(`No routes named:`, chalk.yellow(route))
		}
		return this
	}

	saveNavigateCall(navigationCall: Navigate): void {
		this.routeHistory.push(navigationCall)
	}

	async goBack(): Promise<void> {
		this.routeHistory.pop()
		const lastCall = this.routeHistory.pop()
		if (lastCall !== undefined) {
			const { route, args, context } = lastCall
			await this.navigate(route, args, context)
		} else {
			this.logger.error(
				'No route history to go back to. You are at the first route.'
			)
		}
	}

	/**
	 * Register a route handler
	 * @param name Name of the route
	 * @param handler Route handler
	 */
	registerRoute(name: string, handler: Route): this {
		this.routes[name] = handler
		this.logger.debug(`Registered route: ${name}`)
		return this
	}
}
