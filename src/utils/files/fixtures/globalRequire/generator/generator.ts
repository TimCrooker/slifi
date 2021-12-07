import { GeneratorConfig } from '@/generator/generatorConfig'
import { Base, base } from './plugins'

const config: GeneratorConfig<Base> = {
	plugins: {
		extend: base,
	},
	prepare() {},
	prompts() {},
	data() {},
	actions() {},
	completed() {},
}

exports = config
