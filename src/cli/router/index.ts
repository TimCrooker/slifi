/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { colors, logger } from 'swaglog'
import { CLI } from '..'

export const BackChoice = {
	name: 'Go Back',
	value: 'back',
}

export type Route = (
	app: CLI,
	input: {
		/** args passed from the initial command line */
		args: any[]
		/** options passed from the initial command line */
		options: { [key: string]: any }
	}
) => void | Promise<void>

type Routes = {
	[k: string]: Route
}

type Navigate = { route: string; args: any; context: CLI }

type RouteHistory = Navigate[]

export interface RouterOptions {}

/**
 * The router is in charge of handling `yo` different screens.
 */
export class Router {
	routes: Routes

	logger = logger

	routeHistory: RouteHistory = []

	constructor(opts: RouterOptions) {
		this.routes = {}
	}

	/**
	 * Navigate to a route
	 * @param route Route name
	 * @param args the arguments to pass to the route handler
	 */
	async navigate(route: string, args: any, context: CLI): Promise<this> {
		logger.debug('Navigating to route:', colors.yellow(route))

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
				throw error
			}
		} else {
			logger.error(`No routes named:`, colors.yellow(route))
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
			logger.error(
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
