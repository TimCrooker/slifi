import { PluginFileConfig } from '@/generator/plugins'

export type App = {
	import: Array<string>
	inner: Array<string>
	wrapper: Array<string>[]
}

export type Docs = {
	import: Array<string>
	inner: Array<string>
	wrapper: Array<string>[]
}

export type TestSetup = {
	import: Array<string>
	inner: Array<string>
	wrapper: Array<string>[]
}

export type Base = {
	_app: Partial<App>
	_docs: Partial<Docs>
	testSetup: Partial<TestSetup>
}

export type PluginConfig = PluginFileConfig<Base>

export const base: Base = {
	_app: {
		import: [],
		inner: [],
		wrapper: [],
	} as App,
	_docs: {
		import: [],
		inner: [],
		wrapper: [],
	} as Docs,
	testSetup: {
		import: [],
		inner: [],
		wrapper: [],
	} as TestSetup,
}
