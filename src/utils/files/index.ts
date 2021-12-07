/* eslint-disable @typescript-eslint/no-use-before-define */
import fs from 'fs'
import { ensureDir, outputFile, remove } from 'majo'
import move from 'move-file'
import cpFile from 'cp-file'
import path from 'path'
import { transpileModule } from 'typescript'
import { promisify } from 'util'

/**
 * Files
 */

/** check if a path represents a file asynchronously */
export const isFile = async (cwd: string): Promise<boolean> => {
	try {
		return (await promisify(fs.lstat)(cwd)).isFile()
	} catch (e) {
		return false
	}
}

/** check if a path represents a file syncronously */
export const isFileSync = (cwd: string): boolean => {
	try {
		return fs.lstatSync(cwd).isFile()
	} catch (e) {
		return false
	}
}

/** remove a file at given path asynchronously */
export const removeFile = async (cwd: string): Promise<void> => {
	if (!(await isFile(cwd))) {
		if (await isDirectory(cwd)) {
			throw new Error(
				`Given path is a directory, use 'removeDirectory' on this path to delete the directory: ${cwd}`
			)
		}
		throw new Error(`Given path does not exist: ${cwd}`)
	}
	try {
		await promisify(fs.unlink)(cwd)
	} catch (e) {
		throw new Error(
			`Failed to remove file, ${path.basename(cwd)}, at path:  ${cwd}`
		)
	}
}

/** remove a file at given path synchronously */
export const removeFileSync = (cwd: string): void => {
	if (!isFileSync(cwd)) {
		if (isDirectorySync(cwd)) {
			throw new Error(
				`Given path is a directory, use 'removeDirectory' on this path to delete the directory: ${cwd}`
			)
		}
		throw new Error(`Given path does not exist: ${cwd}`)
	}
	try {
		fs.unlinkSync(cwd)
	} catch (e) {
		throw new Error(
			`Failed to remove file, ${path.basename(cwd)}, at path:  ${cwd}`
		)
	}
}

// TODO impliment read file sync and async functions

export { outputFile }

/**
 * Paths
 */

/** Check if a path is valid and exists asynchronously */
export const pathExists = async (cwd: string): Promise<boolean> => {
	try {
		await promisify(fs.access)(cwd)
		return true
	} catch (e) {
		return false
	}
}

/** Check if a path is valid and exists asynchronously */
export const pathExistsSync = (cwd: string): boolean => {
	try {
		return fs.existsSync(cwd)
	} catch (e) {
		return false
	}
}

/** strip the extension from a file name. Works on both paths and fileNames */
export const removeFileExtension = (cwd: string): string => {
	const basePath = path.basename(cwd)
	return basePath.replace(/\.[^/.]+$/, '')
}

/** return the extension from a file name. Works on both paths to files and fileNames */
export const getFileExtension = (cwd: string): string => {
	return path.extname(cwd)
}

/**
 * Directories
 */

/** Get the names of all items in a directory asynchronously */
export const readDir = async (
	cwd: string,
	onlyFiles?: boolean,
	onlyDirectories?: boolean
): Promise<string[]> => {
	try {
		const contents = await promisify(fs.readdir)(cwd)

		if (onlyFiles) {
			return contents.filter(async (name) => await isFile(`${cwd}/${name}`))
		} else if (onlyDirectories) {
			return contents.filter(
				async (name) => await isDirectory(`${cwd}/${name}`)
			)
		}
		return contents
	} catch (e) {
		return []
	}
}

/** Get the names of all items in a directory asynchronously */
export const readDirSync = (
	cwd: string,
	onlyFiles?: boolean,
	onlyDirectories?: boolean
): string[] => {
	try {
		const contents = fs.readdirSync(cwd)

		if (onlyFiles) {
			return contents.filter((name) => isFileSync(`${cwd}/${name}`))
		} else if (onlyDirectories) {
			return contents.filter(async (name) => isDirectorySync(`${cwd}/${name}`))
		}
		return contents
	} catch (e) {
		return []
	}
}

/** Get the names of all items in a directory and all of its sub-directories asynchronously*/
// export const readDirRecursive = async (
// 	cwd: string,
// 	filterFunction?: (name: string) => boolean
// ): Promise<(string | string[])[]> => {
// 	try {
// 		const files = []
// 		const directories = await readDir(cwd, true, false)
// 		for (const directory of directories) {
// 			const subFiles = await readDirRecursive(
// 				`${cwd}/${directory}`,
// 				filterFunction
// 			)
// 			files.push(
// 				...subFiles.filter((file) => {
// 					!Array.isArray(file) && filterFunction ? filterFunction(file) : true
// 				})
// 			)
// 		}
// 		return files
// 	} catch (e) {
// 		return []
// 	}
// }

/** Get the names of all items in a directory and all of its sub-directories synchronously*/
// export const readDirRecursiveSync = (
// 	cwd: string,
// 	filterFunction?: (name: string) => boolean
// ): (string | string[])[] => {
// 	try {
// 		const files = []
// 		const directories = readDirSync(cwd, true, false)
// 		for (const directory of directories) {
// 			const subFiles = readDirRecursiveSync(
// 				`${cwd}/${directory}`,
// 				filterFunction
// 			)
// 			files.push(
// 				...subFiles.filter((file) => {
// 					!Array.isArray(file) && filterFunction ? filterFunction(file) : true
// 				})
// 			)
// 		}
// 		return files
// 	} catch (e) {
// 		return []
// 	}
// }

/** check if a path represents a directory asyncronously */
export const isDirectory = async (cwd: string): Promise<boolean> => {
	try {
		return (await promisify(fs.lstat)(cwd)).isDirectory()
	} catch (e) {
		return false
	}
}

/** check if a path represents a directory syncronously */
export const isDirectorySync = (cwd: string): boolean => {
	try {
		return fs.lstatSync(cwd).isDirectory()
	} catch (e) {
		return false
	}
}

/** remove a directory and its contents at given path asynchronously */
export const removeDir = async (cwd: string): Promise<void> => {
	if (!(await isFile(cwd))) {
		if (await isDirectory(cwd)) {
			throw new Error(
				`Given path is a directory, use 'removeFile' on this path to delete the file: ${cwd}`
			)
		}
		throw new Error(`Given path does not exist: ${cwd}`)
	}
	try {
		await promisify(fs.rmdir)(cwd, { recursive: true })
	} catch (e) {
		throw new Error(
			`Failed to remove file, ${path.basename(cwd)}, at path:  ${cwd}`
		)
	}
}

/** remove a directory and its contents at given path synchronously */
export const removeDirSync = (cwd: string): void => {
	if (!isDirectorySync(cwd)) {
		if (isFileSync(cwd)) {
			throw new Error(
				`Given path is a file, use 'removeFile' on this path to delete the file: ${cwd}`
			)
		}
		throw new Error(`Given path does not exist: ${cwd}`)
	}
	try {
		fs.rmdirSync(cwd, { recursive: true })
	} catch (e) {
		throw new Error(
			`Failed to remove directory, ${path.basename(cwd)}, at path: ${cwd}`
		)
	}
}

export { ensureDir }

/**
 *  MISC
 */

/** Delete an item at the given path */
export const deleteItem = async (cwd: string): Promise<void> => {
	try {
		if (await isDirectory(cwd)) {
			await removeDir(cwd)
		} else if (await isFile(cwd)) {
			await removeFile(cwd)
		}
	} catch (e) {
		throw new Error(`Failed to delete item at path: ${cwd}`)
	}
}

/** Delete an item at the given path syncronously */
export const deleteItemSync = (cwd: string): void => {
	try {
		if (isDirectorySync(cwd)) {
			removeDirSync(cwd)
		} else if (isFileSync(cwd)) {
			removeFileSync(cwd)
		}
	} catch (e) {
		throw new Error(`Failed to delete item at path: ${cwd}`)
	}
}

/** a require statement that will reload contents if they are changed during execution */
export const requireUncached = (module: any): any => {
	delete require.cache[require.resolve(module)]
	return require(module)
}

/** require statement will work properly with both javascript files and typescript files and returns a javascript module */
export const globalRequire = async (cwd: string): Promise<any> => {
	if (!(await isFile(cwd))) {
		throw new Error(`Require failed, item at path is not a file: ${cwd}`)
	}
	if (cwd && getFileExtension(cwd) === '.ts') {
		return await tsRequire(cwd)
	}
	const module = await import(cwd)
	return module
}

/** Import a typscript module as transpiled javascript asynchronously */
export const tsRequire = async (tsCodePath: string): Promise<any> => {
	if (!path.resolve(tsCodePath))
		throw new Error(`Couldn't find tsFile at path: ${tsCodePath}`)

	// get the ts code
	const tsCode = await readFile(tsCodePath, 'utf8')

	// transpile the ts code into a js string
	const { outputText: jsText } = await transpileModule(tsCode, {
		compilerOptions: {
			target: 5,
			module: 1,
			resolveJsonModule: true,
			strict: true,
			esModuleInterop: true,
			skipLibCheck: true,
			forceConsistentCasingInFileNames: true,
			moduleResolution: 2,
			noImplicitAny: false,
		},
	})

	// set js file path to the same as ts file path but as temp.js
	const jsCodePath = path.join(tsCodePath, '../temp.js')

	// write the js code to the temp file
	fs.writeFileSync(jsCodePath, jsText)

	// turn the file path into a module with import
	const jsModule = await import(jsCodePath)

	// remove the temp file
	await removeFile(jsCodePath)

	return jsModule
}

const readFile = fs.promises.readFile

const readFileSync = fs.readFileSync

export { move, readFile, remove, cpFile as copy, readFileSync }
