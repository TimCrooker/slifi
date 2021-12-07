import { readFileSync } from 'fs'
import path from 'path'
import {
	mergeObjects,
	mergePluginJsonFiles,
	mergeJsonAndWrite,
	mergeJsonFiles,
} from '.'

describe('Merge functions', () => {
	it('should merge objects', () => {
		const base = {
			a: 1,
			c: {
				e: [1, 2, 3],
			},
		}
		const objects = [
			{
				b: 2,
			},
			{
				c: {
					d: 3,
					e: [4, 5, 6],
				},
			},
		]

		const result = mergeObjects(base, objects)
		expect(result).toEqual({
			a: 1,
			b: 2,
			c: {
				d: 3,
				e: [1, 2, 3, 4, 5, 6],
			},
		})
	})

	it('should merge json files', () => {
		const base = {
			a: 1,
			c: {
				e: [1, 2, 3],
			},
		}
		const files = [
			path.resolve(__dirname, 'fixtures', 'a.json'),
			path.resolve(__dirname, 'fixtures', 'b.json'),
			path.resolve(__dirname, 'fixtures', '.babelrc'),
		]

		const result = mergeJsonFiles(base, files)
		expect(result).toEqual({
			babel: true,
			a: 2,
			b: 2,
			c: {
				d: 3,
				e: [1, 2, 3, 4, 5, 6],
			},
		})
	})

	it('should merge json files and write the output to a new file', () => {
		const base = {
			a: 1,
			c: {
				e: [1, 2, 3],
			},
		}
		const files = [
			path.resolve(__dirname, 'fixtures', 'a.json'),
			path.resolve(__dirname, 'fixtures', 'b.json'),
			path.resolve(__dirname, 'fixtures', '.babelrc'),
		]

		const outputPath = path.resolve(__dirname, 'fixtures', 'output.json')

		mergeJsonAndWrite(base, files, outputPath)
		expect(JSON.parse(readFileSync(outputPath, 'utf8'))).toEqual({
			a: 2,
			c: {
				e: [1, 2, 3, 4, 5, 6],
				d: 3,
			},
			b: 2,
			babel: true,
		})
	})

	it('should merge plugin json files', () => {
		const base = {
			a: 1,
			c: {
				e: [1, 2, 3],
			},
		}

		const pluginsDir = path.resolve(__dirname, 'fixtures', 'plugins')
		const pluginNames = ['a', 'b']
		const fileName = 'pack.json'

		const result = mergePluginJsonFiles(base, pluginsDir, pluginNames, fileName)
		expect(result).toEqual({
			a: 2,
			b: 2,
			c: {
				d: 3,
				e: [1, 2, 3, 4, 5, 6],
			},
		})
	})
})
