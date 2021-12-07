import path from 'path'
import { installPackages } from '.'

test('should ', async () => {
	const { code } = await installPackages({
		cwd: path.join(__dirname, 'fixtures'),
	})

	expect(code).toBe(0)
})
