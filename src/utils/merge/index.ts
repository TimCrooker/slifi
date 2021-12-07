/* eslint-disable @typescript-eslint/no-use-before-define */

import { Ignore, PluginData } from '@/generator/plugins'
import { Answers } from '@/index'
import { writeFileSync } from 'fs'
import _ from 'lodash'
import path from 'path'
import { readFileSync, requireUncached } from '../files'

/**
 * Merge a list of objects into the base object
 *
 * @param base the base object that will be merged into
 * @param objects a list of objects to merge into the base
 */
export const mergeObjects = (
	base = {},
	objects: Array<Record<string, any>>,
	mergeArrays = true
): Record<string, any> => {
	function customizer(objValue, srcValue): unknown {
		if (_.isArray(objValue)) {
			return objValue.concat(srcValue)
		}
	}

	return objects.reduce((acc, obj) => {
		return _.mergeWith(acc, obj, mergeArrays && customizer)
	}, base)
}

/**
 * Merge a base object with a list of json files privided via string paths
 *
 * @param base the base object to be merged into
 * @param filePaths a list of paths to json files to merge into the base
 */
export const mergeJsonFiles = (
	base = {},
	filePaths: string[],
	mergeArrays?: boolean
): Record<string, any> => {
	// const files
	return mergeObjects(
		base,
		filePaths.map((file) => {
			try {
				return JSON.parse(readFileSync(file, 'utf8'))
			} catch (e) {
				return {}
			}
		}),
		mergeArrays
	)
}

/**
 * Merge a base object with a list of json files privided via string paths
 *
 * @param base the base object to be merged into
 * @param filePaths a list of paths to json files to merge into the base
 * @param outFile the path to the file the object should be written to (must end in .json)
 */
export const mergeJsonAndWrite = (
	base = {},
	filePaths: string[],
	outFile: string,
	mergeArrays?: boolean
): void => {
	if (path.extname(outFile) !== '.json')
		throw new Error('Expected `.json` extension for the outFile')

	const merged = mergeJsonFiles(base, filePaths, mergeArrays)

	writeFileSync(outFile, JSON.stringify(merged))
}

/**
 *
 * @param pluginPath path to the plugin pack directory
 * @param pluginName name of the plugin to target
 * @param fileName name of the file inside of a plugin to target
 * @returns the file being targeted in the specified plugin
 */
const getPluginFile = (
	pluginPath: string,
	fileName: string
): any | undefined => {
	try {
		const rawData = requireUncached(path.join(pluginPath, fileName))
		// const pluginFile = JSON.parse(rawData)
		return rawData
	} catch (e) {
		return undefined
	}
}

/**
 * Merge the JSON files of a particular name housed in each specified plugin directory.
 *
 * @param base object to merge json files into
 * @param pluginsDir the directory containing the plugin directories
 * @param pluginNames a list of plugins that will be included in the merged object
 * @param fileName the name of the file in each plugin to merge
 */
export const mergePluginJsonFiles = (
	base = {},
	pluginsDir: string,
	pluginNames: string[],
	fileName: string
): Record<string, any> => {
	const filePaths: string[] = []
	for (const pluginName of pluginNames) {
		const filePath = path.resolve(pluginsDir, pluginName, fileName)
		if (filePath) filePaths.push(filePath)
	}
	return mergeJsonFiles(base, filePaths)
}

/**
 * merge package.json and package.js files together into the final package.json
 *
 * @param base all of the data provided by the saoFile data function
 * @param pluginsPath path to the directory containing the plugins
 * @param plugins array of all selected plugins
 * @param answers user provided answers from prompts
 */
export const mergePackages = (
	base = {},
	plugins: PluginData[],
	answers: Record<string, any>
): Record<string, any> => {
	const basePkg = { ...base }
	const pluginPkgs = plugins.map((plugin) => {
		const pluginPkg = getPluginFile(plugin.dirPath, 'package.json')
		const pluginPkgFn = plugin.pluginFileData?.apply || undefined

		if (pluginPkgFn && pluginPkg) {
			const fnPkg = pluginPkgFn(pluginPkg, answers)
			return fnPkg
		} else if (pluginPkg) {
			return pluginPkg
		}
		return {}
	})

	const result = mergeObjects(basePkg, pluginPkgs) as Record<string, unknown>

	return result
}

/**
 *
 * @param ignores the array of ignore objects from the plugin packs prompt.js
 * @param answers answers provided by the user to all prompt questions
 * @param plugin name of the current plugin to target
 * @returns
 */
export const handleIgnore = (
	ignores: Ignore[],
	answers: Answers,
	plugin: string
): Record<string, false> => {
	const filters: Record<string, false> = {}

	ignores.forEach((ignore) => {
		if (ignore.plugin && ignore.plugin.includes(plugin)) {
			const condition = ignore.when?.(answers)
			if (condition) {
				ignore.pattern.forEach((pattern) => {
					filters[pattern] = false
				})
			}
		}
	})

	return filters
}
